<template>
	<el-dialog v-model="dialogVisible" title="选择学校" width="1000" :show-close="false" append-to-body>
		<div class="page define-page">
			<div class="content-box">
				<el-form :inline="true" id="form" :model="formData" size="large" label-width="60px" @submit.prevent>
					<el-form-item label="学校">
						<el-input class="search-input" clearable placeholder="请输入学校" v-model="formData.school">
						</el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="onSubmit">查询</el-button>
					</el-form-item>
					<el-form-item>
						<el-button 
							:type="onlyShowSelected ? 'success' : 'primary'" 
							@click="toggleOnlyShowSelected"
						>
							{{ onlyShowSelected ? '显示全部' : '只看已选' }}
						</el-button>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="onReset">重置</el-button>
					</el-form-item>
				</el-form>
				<el-table :data="displayDataList" class="table-info" v-loading="loading" header-cell-class-name="header_row_class"
					style="width: 100%;height: 300px;" stripe element-loading-text="拼命加载中，主人请稍后..." ref="multipleTable" @select="selectionChange"
					@select-all="selectionChange">
					<el-table-column type="selection" width="55">
					</el-table-column>
					<el-table-column prop="name" label="学校名称" min-width />
					<el-table-column prop="province" label="省份" min-width />
					<el-table-column prop="city" label="市" min-width />
					<el-table-column prop="county" label="区县" min-width />

				</el-table>
			</div>
		</div>

		<template #footer>
			<div class="dialog-footer">
				<el-button @click="cancelDialog">取消</el-button>
				<el-button type="primary" :disabled="!multipleSelection.length" @click="saveDialog">
					保存
				</el-button>
			</div>
		</template>
	</el-dialog>
</template>
<script setup>
import { ref, onMounted, defineEmits, defineProps, nextTick, computed } from 'vue';
import MemberService from '@/service/MemberService';
import dealerService from '@/service/DealerService';
import { useVocabularyStore } from '@/store/vocabulary';
// import { ElMessage } from 'element-plus';
const props = defineProps({
	selectInfo: {
		type: Object,
		default: () => { }
	},
	schoolList: {
		type: Array,
		default: () => []
	},
	type: {
		type: String,
		default: ''
	}
})
console.log('33333333', props.selectInfo, props.schoolList)

let vocabularyStore = useVocabularyStore();
let loading = ref(false) // 加载标记
// let screenHeight = ref(0)
let pageIndex = ref(1)
let formData = ref({
	province_id: '', // 省份
	city_id: '', // 城市
	county_id: '', // 区域
	school: '', // 状态
	user_code: '', // 状态
}) // 表单内容
let provinceData = ref([]) // 省份
let dataList = ref([]) // 资源列表
let dialogVisible = ref(true) // 弹框显隐
let multipleSelection = ref([])
let multipleTable = ref(null)
let onlyShowSelected = ref(false) // 控制"只看已选"的状态标记
let emit = defineEmits([
	'cancelDialog',
	'saveDialog',
])
// 计算属性：根据"只看已选"状态筛选显示列表
const displayDataList = computed(() => {
	if (!onlyShowSelected.value) {
		return dataList.value; // 显示全部
	}
	// 只显示已选中的学校（匹配schoolList中的ID）
	return dataList.value.filter(row => 
		props.schoolList.some(id => String(id) === String(row.id))
	);
})
onMounted(async () => {
	await getProvinceList() // 获取省份
	await initschoolList() // 获取资源列表
})
// 切换"只看已选/显示全部"状态
function toggleOnlyShowSelected() {
	onlyShowSelected.value = !onlyShowSelected.value;
	// 切换后重新处理选中状态（避免筛选后选中状态异常）
	nextTick(() => {
		dataList.value.forEach(row => {
			const isSelected = props.schoolList.some(id => String(id) === String(row.id));
			multipleTable.value.toggleRowSelection(row, isSelected);
		});
	});
}
async function onSubmit() {
	pageIndex.value = 1 // 重置页码
	await initschoolList()
} // 点击搜索按钮获取资源列表
async function onReset() {
	// 重置所有筛选条件
	formData.value = {
		province_id: '', // 省份
		city_id: '', // 城市
		county_id: '', // 区域
		school: '', // 状态
		user_code: '', // 状态
	}
	pageIndex.value = 1 // 重置页码
	await initschoolList()
} // 点击重置按钮获取资源列表

const initschoolList = async () => {
	loading.value = true
	const params = {
		area_ids: props.selectInfo.area_ids,
		parent_id: props.selectInfo.parent_id,
		session: props.selectInfo.session,
		user_name: props.selectInfo.user_name,
		school_name: ''
	}
	try {
		const res = await dealerService.getExcludeSchoolList(params)
		if (res.result_code === 200) {
			dataList.value = res.list
			dataList.value.forEach(row => {
				// 判断当前行ID是否在已选集合中（注意：ID可能是数字/字符串，统一转字符串比较）
				const isSelected = props.schoolList.some(id => id === row.id);
				if (isSelected) {
					nextTick(() => {
						multipleTable.value.toggleRowSelection(row, true); // 选中行
					})
				}
			})
		} else {
			dataList.value = []
		}
	} catch (error) {
		console.log(error)
	} finally {
		loading.value = false
	}
}
function getProvinceList() {
	let params = {
		user_name: vocabularyStore.user_name,
		session: vocabularyStore.session
	}
	return MemberService.getProvincesList(params)
		.then((res) => {
			if (res.result_code === 200) {
				provinceData.value = res.list
			}
		}).catch((error) => {
			console.log(error)
		})
} // 获取省份列表
function cancelDialog() {
	emit('cancelDialog')
} // 点击取消
function saveDialog() {
	let userCodeList = multipleSelection.value.map(item => item.id)
	emit('saveDialog', userCodeList)
} // 点击保存
function selectionChange(val) {
	multipleSelection.value = val
	console.log('22222', multipleSelection.value)
}
</script>
<style scoped>
.content-box {
	padding: 20px;
	box-sizing: border-box;
}

#form .el-select {
	--el-select-width: 150px;
}
</style>
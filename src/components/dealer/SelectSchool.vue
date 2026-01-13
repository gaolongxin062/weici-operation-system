<template>
	<el-dialog v-model="dialogVisible" title="选择学校" width="1000" :show-close="false" append-to-body>
		<div class="page define-page">
			<div class="content-box">
				<el-form :inline="true" id="form" :model="formData" size="large" label-width="60px" @submit.prevent>
					<el-form-item label="学校">
						<el-input class="search-input" clearable placeholder="请输入学校" v-model="formData.school"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="onSubmit">查询</el-button>
					</el-form-item>
					<el-form-item>
						<el-button :type="onlyShowSelected ? 'success' : 'primary'" @click="toggleOnlyShowSelected">
							{{ onlyShowSelected ? '显示全部' : '只看已选' }}
						</el-button>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="onReset">重置</el-button>
					</el-form-item>
				</el-form>
				<el-table 
					:data="displayDataList" 
					class="table-info" 
					v-loading="loading"
					header-cell-class-name="header_row_class" 
					style="width: 100%;height: 300px;" 
					stripe
					element-loading-text="拼命加载中，主人请稍后..." 
					ref="multipleTable" 
					@select="selectionChange"
					@select-all="selectionChange"
				>
					<el-table-column type="selection" width="55"></el-table-column>
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
				<el-button type="primary" @click="saveDialog">保存</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script setup>
import { ref, onMounted, defineEmits, defineProps, nextTick, computed } from 'vue';
import dealerService from '@/service/DealerService';

// 接收父组件传参
const props = defineProps({
	selectInfo: {
		type: Object,
		default: () => ({})
	},
	schoolList: {
		type: Array,
		default: () => []
	},
	type: {
		type: String,
		default: ''
	},
	roleLevel: {
		type: Number,
		default: null
	},
})

// 派发事件
const emit = defineEmits(['cancelDialog','saveDialog'])

// 加载状态
const loading = ref(false)
// 当前页码
const pageIndex = ref(1)
// 查询表单数据
const formData = ref({
	province_id: '',
	city_id: '',
	county_id: '',
	school: '',
	user_code: ''
})
// 学校列表数据
const dataList = ref([])
// 弹窗显示状态
const dialogVisible = ref(true)
// 表格勾选的数据集合
const multipleSelection = ref([])
// 表格实例
const multipleTable = ref(null)
// 是否只看已选数据
const onlyShowSelected = ref(false)

// 已勾选的学校id集合
const selectedIds = computed(() => {
	return multipleSelection.value.map(item => item.id).filter(id => id)
})

// 表格展示的数据集，根据勾选状态筛选
const displayDataList = computed(() => {
	if (!onlyShowSelected.value) return dataList.value;
	return dataList.value.filter(row => selectedIds.value.includes(row.id))
})

// 页面初始化加载学校列表+回显勾选数据
onMounted(async () => {
	await getSchoolList()
	// 编辑状态下，回显已选的学校数据
	if (props.schoolList.length > 0) {
		multipleSelection.value = dataList.value.filter(row => props.schoolList.includes(row.id))
	}
})

// 切换 只看已选/显示全部
const toggleOnlyShowSelected = () => {
	onlyShowSelected.value = !onlyShowSelected.value;
	nextTick(() => {
		if (!multipleTable.value || !dataList.value.length) return;
		dataList.value.forEach(row => {
			const isChecked = selectedIds.value.includes(row.id);
			multipleTable.value.toggleRowSelection(row, isChecked);
		});
	});
}

// 点击查询按钮
const onSubmit = async () => {
	pageIndex.value = 1;
	await getSchoolList();
}

// 重置查询条件
const onReset = async () => {
	formData.value = {
		province_id: '',
		city_id: '',
		county_id: '',
		school: '',
		user_code: ''
	}
	pageIndex.value = 1;
	await getSchoolList();
}

// 获取学校列表数据
const getSchoolList = async () => {
	loading.value = true;
	const params = {
		area_ids: props.selectInfo.area_ids,
		parent_id: props.selectInfo.parent_id,
		session: props.selectInfo.session,
		user_name: props.selectInfo.user_name,
		school_name: formData.value.school,
		role_level: props.roleLevel,
	}
	try {
		const res = await dealerService.getExcludeSchoolList(params);
		if (res.result_code === 200) {
			dataList.value = res.list || [];
			nextTick(() => {
				if (!multipleTable.value) return;
				dataList.value.forEach(row => {
					const isChecked = selectedIds.value.includes(row.id);
					multipleTable.value.toggleRowSelection(row, isChecked);
				})
			})
		} else {
			dataList.value = [];
		}
	} catch (err) {
		console.log(err);
	} finally {
		loading.value = false;
	}
}

// 表格勾选事件
const selectionChange = (val) => {
	multipleSelection.value = val;
}

// 关闭弹窗
const cancelDialog = () => {
	emit('cancelDialog');
}

// 保存勾选的学校数据
const saveDialog = () => {
	const userCodeList = multipleSelection.value.map(item => item.id).filter(id => id);
	emit('saveDialog', userCodeList);
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
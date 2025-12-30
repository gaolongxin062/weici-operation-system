<template>
	<el-dialog v-model="dialogVisible" :title="dealTitle" width="1000" @close="closeDialog" append-to-body top="7vh">
		<el-form ref="formRef" id="form" :disabled="isCheck" :model="formData" size="large" label-width="100px" :rules="rules">
			<el-form-item label="选择账号" label-width="130px" prop="teacher_codes">
				<el-input 
					class="search-input" 
					clearable 
					placeholder="请输入账号（只能输入数字，多账号用英文逗号分隔）" 
					:disabled="userCodeDisabled"
					v-model="formData.teacher_codes" 
					:rows="4" 
					type="textarea" 
					@input="handleInput"
				>
				</el-input>
				<el-button 
					type="primary" 
					:disabled="selectBtnDisabled" 
					class="select-btn"
					@click="showSelectAccountNumber"
				>选择账号</el-button>
			</el-form-item>

			<div style="display: flex;" class="area">
				<el-form-item label="省" label-width="130px" prop="province_id">
					<el-select 
						v-model="formData.province_id" 
						placeholder="请选择省份" 
						filterable 
						@change="changeProvince"
					>
						<el-option v-for="item in provinceList" :key="item.id" :label="item.province" :value="item.id"></el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="市" label-width="130px" prop="city_id">
					<el-select 
						v-model="formData.city_id" 
						placeholder="请选择市" 
						filterable 
						@change="changeCity"
					>
						<el-option v-for="item in cityList" :key="item.id" :label="item.city" :value="item.id"></el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="区/县" label-width="130px" prop="county_id">
					<el-select 
						v-model="formData.county_id" 
						placeholder="请选择区/县" 
						filterable 
						@change="changeCounty"
					>
						<el-option v-for="item in countyList" :key="item.id" :label="item.county" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
			</div>

			<el-form-item label="学校名称" label-width="130px" prop="school_id">
				<el-select 
					v-model="formData.school_id" 
					filterable 
					placeholder="请选择/搜索所在学校名称" 
					clearable
				>
					<el-option v-for="item in schoolList" :key="item.id" :label="item.name" :value="item.id" />
				</el-select>
			</el-form-item>

			<div style="display: flex;" class="area">
				<el-form-item label="用户来源" prop="user_source" label-width="130px">
					<el-select 
						v-model="formData.user_source" 
						filterable 
						placeholder="请选择用户来源" 
						@change="changeUseSource"
						clearable
					>
						<el-option v-for="item in userSourceList" :key="item.id" :label="item.name" :value="item.id" />
					</el-select>
				</el-form-item>
			</div>

			<el-form-item label="操作权限" prop="rights" label-width="80px">
				<el-tree 
					ref="treeRef" 
					style="max-width: 600px" 
					:data="treeList" 
					node-key="menu_index" 
					:props="defaultProps"
					:default-expand-all="true" 
					@check-change="getCheckedData" 
					show-checkbox 
				/>
			</el-form-item>
		</el-form>

		<template #footer>
			<div class="dialog-footer">
				<el-button @click="cancelDialog">取消</el-button>
				<el-button type="primary" @click="saveDialog" v-if="!isCheck">保存</el-button>
			</div>
		</template>
		
		<SelectAccountNumber 
			v-if="isShowSelectAccountNumber" 
			@cancelDialog="cancelSelectAccountNumber"
			@saveDialog="confirmSelectAccountNumber"
		></SelectAccountNumber>
	</el-dialog>
</template>

<script setup>
import { ref, onMounted, defineProps, defineEmits, computed } from 'vue';
import { useVocabularyStore } from '@/store/vocabulary';
import { ElMessage } from 'element-plus';
import aiAgentService from '@/service/AiAgentService.js';
import AiTeacherPower from '@/service/AiTeacherPower.js';
import SelectAccountNumber from '@/components/member/SelectAccountNumber.vue';
import format from '@/utils/DateUtil.js';

// 全局状态
const vocabularyStore = useVocabularyStore();

// 表单引用
const formRef = ref(null);
// 弹窗显隐控制
const dialogVisible = ref(true);
// 权限树引用
const treeRef = ref(null);
// 权限树数据
const treeList = ref([]);
// 选中的节点数组
const selectedNodeArr = ref([]);

// 表单数据
const formData = ref({
	teacher_codes: '', // 账号名称
	province_id: '', // 省份ID
	city_id: '', // 城市ID
	county_id: '', // 区县ID
	school_id: '', // 学校ID
	user_source: 0, // 用户来源
	rights: ref([]), // 权限JSON（含父节点）
	right_end: ref([]), // 权限末级节点
});

// 树结构配置
const defaultProps = ref({
	children: 'children',
	label: 'menu_name',
	disabled: ''
});

// 用户来源下拉列表
const userSourceList = ref([
	{ id: 0, name: '正常用户' },
	{ id: 1, name: '维学' },
	{ id: 2, name: '维克多发行' },
	{ id: 3, name: '经销商' },
	{ id: 4, name: '维克多编辑' }
]);

// 省/市/区县/学校列表
const provinceList = ref([]);
const cityList = ref([]);
const countyList = ref([]);
const schoolList = ref([]);

// 选择账号弹窗显隐
const isShowSelectAccountNumber = ref(false);

// 表单校验规则
const rules = ref({
	teacher_codes: [
		{ required: true, message: '请输入账号（只能输入数字，多账号用英文逗号分隔）', trigger: 'blur' }
	],
	trial_start_time: [
		{ required: true, message: '请输入体验开始时间！', trigger: 'blur' }
	],
	trial_end_time: [
		{ required: true, message: '请输入体验结束时间！', trigger: 'blur' }
	],
	province_id: [
		{ required: true, message: '请选择省份！', trigger: 'change' }
	],
	city_id: [
		{ required: true, message: '请选择市！', trigger: 'change' }
	],
	county_id: [
		{ required: true, message: '请选择区/县！', trigger: 'change' }
	],
	school_id: [
		{ required: true, message: '请选择学校名称！', trigger: 'change' }
	],
	user_type: [
		{ required: true, message: '请选择用户类型！', trigger: 'change' }
	],
	user_source: [
		{ required: true, message: '请选择用户来源！', trigger: 'change' }
	],
	trial_date: [
		{ required: true, message: '请输入体验天数', trigger: 'change' }
	],
	use_points: [{}]
});

// 组件接收参数
const props = defineProps({
	isEdit: { type: Boolean, default: false }, // 是否编辑
	isCheck: { type: Boolean, default: false }, // 是否仅查看
	row: { type: Object, default: () => null } // 选中行数据
});

// 弹窗标题计算属性
const dealTitle = computed(() => {
	return props.isEdit ? '修改' : props.isCheck ? '详情' : '新增';
});

// 账号输入框禁用状态
const userCodeDisabled = computed(() => {
	if (props.isCheck || props.isEdit) return true;
	return false;
});

// 选择账号按钮禁用状态
const selectBtnDisabled = computed(() => {
	if (props.isEdit) return true;
	return false;
});

// 自定义事件
const emit = defineEmits(['cancelDialog', 'saveDialog']);

// 初始化执行
onMounted(async() => {
	
	await getProvinceList(); // 获取省份列表
	await getRightTree(); // 获取权限树数据
	setDefaultConfig(); // 初始化表单默认值
});

// 切换省份 - 重置市/区县/学校，获取对应市列表
const changeProvince = () => {
	getCityList();
	formData.value.city_id = '';
	formData.value.county_id = '';
	formData.value.school_id = '';
};

// 切换城市 - 重置区县/学校，获取对应区县列表
const changeCity = () => {
	getAreaList();
	formData.value.county_id = '';
	formData.value.school_id = '';
};

// 切换区县 - 重置学校，获取对应学校列表
const changeCounty = () => {
	formData.value.school_id = '';
	initGetSchool();
};

// 获取省份列表
const getProvinceList = () => {
	const params = {
		user_name: vocabularyStore.user_name,
		session: vocabularyStore.session
	};
	return aiAgentService.getProvincesList(params)
		.then((res) => {
			if (res.result_code === 200) {
				provinceList.value = res.list;
				if (props.isEdit || props.isCheck) getCityList();
			}
		})
		.catch((error) => {
			console.log('获取省份失败：', error);
		});
};

// 获取城市列表
const getCityList = () => {
	const params = {
		user_name: vocabularyStore.user_name,
		session: vocabularyStore.session,
		province_id: formData.value.province_id
	};
	return aiAgentService.getAiCityList(params)
		.then((res) => {
			if (res.result_code === 200) {
				cityList.value = res.list;
				if (props.isEdit || props.isCheck) getAreaList();
			}
		})
		.catch((error) => {
			console.log('获取城市失败：', error);
		});
};

// 获取区县列表
const getAreaList = () => {
	const params = {
		user_name: vocabularyStore.user_name,
		session: vocabularyStore.session,
		city_id: formData.value.city_id
	};
	return aiAgentService.getAiCountyList(params)
		.then((res) => {
			if (res.result_code === 200) {
				countyList.value = res.list;
				if (props.isEdit || props.isCheck) initGetSchool();
			}
		})
		.catch((error) => {
			console.log('获取区县失败：', error);
		});
};

// 获取学校列表
const initGetSchool = () => {
	const params = {
		user_name: vocabularyStore.user_name,
		session: vocabularyStore.session,
		county_id: formData.value.county_id
	};
	aiAgentService.getAiSchoolList(params)
		.then((res) => {
			if (res.result_code === 200) {
				schoolList.value = res.list;
			}
		})
		.catch((error) => {
			console.log('获取学校失败：', error);
		});
};

// 初始化表单默认值（编辑/续期/新增场景）
const setDefaultConfig = async () => {
	// 编辑场景
	if (props.isEdit || props.isCheck) {
		formData.value.trial_start_time = props.row.trial_start_time;
		formData.value.teacher_codes = props.row.user_code;
		formData.value.trial_end_time = props.row.trial_end_time;
		formData.value.stop_flag = props.row.stop_flag === 0 ? false : true;
		formData.value.user_source = props.row.user_source;
		formData.value.user_type = props.row.user_type || '';
		formData.value.province_id = props.row.new_province_id || '';
		formData.value.city_id = props.row.new_city_id || '';
		formData.value.county_id = props.row.new_county_id || '';
		formData.value.school_id = props.row.new_school_id || '';
		getCompositionDetail(); // 获取用户权限详情并回显
	} 
	// 新增场景
	else {
		const now = new Date();
		formData.value.trial_start_time = format.formatDateDay(now.getTime());
	}
};

// 获取权限树数据
const getRightTree = async () => {
	const params = {
		user_name: vocabularyStore.user_name,
		session: vocabularyStore.session
	};
	try {
		const res = await AiTeacherPower.ApiAiUserRightTree(params);
		treeList.value = res.rights && res.rights.length ? res.rights : [];
	} catch (error) {
		console.log('获取权限树失败：', error);
	}
};

// 获取用户详情（编辑场景）- 含权限回显
const getCompositionDetail = () => {
	const params = {
		user_name: vocabularyStore.user_name,
		session: vocabularyStore.session,
		id: props.row.id
	};
	return AiTeacherPower.ApiAiUserDetail(params)
		.then((res) => {
			if (res.result_code === 200) {
				const { rights, province_id, city_id, county_id, school_id, user_source, teacher_code } = res.data[0];
				// 基础信息赋值
				formData.value.rights = JSON.parse(rights);
				formData.value.province_id = province_id;
				formData.value.city_id = city_id;
				formData.value.county_id = county_id;
				formData.value.school_id = school_id;
				formData.value.user_source = user_source;
				formData.value.teacher_codes = teacher_code;

				// 权限回显核心逻辑
				const rightsArr = JSON.parse(rights || '[]');
				formData.value.rights = rightsArr;
				
				// 等待树渲染完成后回显勾选
				if (treeRef.value && rightsArr.length) {
					treeRef.value.setCheckedKeys(rightsArr);
					getCheckedData();
				}
			}
		})
		.catch((error) => {
			console.log('获取用户详情失败：', error);
		});
};

// 弹窗自带关闭按钮回调
const closeDialog = () => {
	emit('cancelDialog');
};

// 取消按钮回调
const cancelDialog = () => {
	emit('cancelDialog');
};

// 保存按钮回调
const saveDialog = () => {
	formRef.value.validate((valid) => {
		if (valid) {
			const config = getConfig();
			// 校验账号是否为空
			if (config.teacher_codes.length === 0) {
				ElMessage({ type: 'error', message: '账号名称不能全部为空白字符' });
				return;
			}
			// 校验账号是否为11位数字
			const isNoMeetLength = config.teacher_codes.split(',').some(str => str.length !== 11);
			if (isNoMeetLength) {
				ElMessage({ type: 'error', message: '账号名称必须是11位的数字，请修改' });
				return;
			}
			emit('saveDialog', config);
		} else {
			return false;
		}
	});
};

// 组装保存参数
const getConfig = () => {
	const params = {
		teacher_codes: dealAccountNumber(formData.value.teacher_codes),
		province_id: formData.value.province_id,
		city_id: formData.value.city_id,
		county_id: formData.value.county_id,
		school_id: formData.value.school_id,
		user_source: formData.value.user_source,
		rights: JSON.stringify(formData.value.rights.value),
		right_end: JSON.stringify(formData.value.right_end.value),
	};
	// 编辑场景追加ID
	if (props.isEdit) {
		params.id = props.row.id;
	}
	return params;
};

// 处理账号字符串（去重/去空/去空格）
const dealAccountNumber = (str) => {
	const result = [...new Set(
		str.split(',')
			.map(item => item.trim())
			.filter(item => item !== '')
	)];
	return result.join(',');
};

// 打开选择账号弹窗
const showSelectAccountNumber = () => {
	isShowSelectAccountNumber.value = true;
};

// 取消选择账号弹窗
const cancelSelectAccountNumber = () => {
	isShowSelectAccountNumber.value = false;
};

// 确认选择账号
const confirmSelectAccountNumber = (val) => {
	const list = formData.value.teacher_codes.length ? formData.value.teacher_codes.split(',').concat(val) : val;
	formData.value.teacher_codes = [...new Set(list)].join(',');
	isShowSelectAccountNumber.value = false;
};

// 账号输入框输入限制（仅数字和英文逗号）
const handleInput = (value) => {
	const filteredValue = value.replace(/[^0-9,]/g, "");
	formData.value.teacher_codes = filteredValue;
};

// 用户来源切换回调（预留）
const changeUseSource = () => {};

// 权限树勾选事件 - 收集选中节点（含父节点）和末级节点
const getCheckedData = () => {
	if (!treeRef.value) return;
	// 获取所有勾选的末级节点
	const nodeList = treeRef.value.getCheckedNodes(true, false);
	const allCheckedAndParentNodes = [];
	
	// 遍历勾选节点，收集自身+所有父节点
	nodeList.forEach(node => {
		if (!Array.isArray(node)) {
			allCheckedAndParentNodes.push(node);
		}
		const parentNodes = getParentNodeData(node, []);
		allCheckedAndParentNodes.push(...parentNodes);
	});
	
	// 去重
	selectedNodeArr.value = [...new Set(allCheckedAndParentNodes)];
	
	// 组装权限数据（含父节点）
	formData.value.rights.value = selectedNodeArr.value.map(item => ({
		menu_index: item.menu_index
	}));
	
	// 组装末级权限数据
	formData.value.right_end.value = treeRef.value.getCheckedNodes(true, false).map(item => item.menu_index);
};

// 递归获取节点所有父节点数据
const getParentNodeData = (node, parentNodes = []) => {
	const parentNode = treeRef.value.getNode(node).parent;
	if (parentNode) {
		if (!Array.isArray(parentNode.data)) {
			parentNodes.push(parentNode.data);
		}
		getParentNodeData(parentNode, parentNodes);
	}
	return parentNodes;
};
</script>

<style scoped>
#form .el-select {
	--el-select-width: 350px;
}

#form .area .el-select {
	--el-select-width: 180px;
}

#form .el-input {
	--el-input-width: 350px;
}

.select-btn {
	margin-top: 15px;
}

.user_info_box {
	margin-top: 30px;
	width: 100%;
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 20px;
}

.user_info {
	width: 100%;
	display: grid;
	align-items: center;
	justify-content: space-between;
	grid-template-columns: 130px 1fr;
}
</style>
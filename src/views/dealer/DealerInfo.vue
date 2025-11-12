<template>
  <div class="page">
    <div class="page-title" id="page-title">
      <h4>经销商管理</h4>
    </div>
    <el-form id="forms" :inline="true" :model="searchForm" size="large" label-width="60px">
      <div style="display: flex;align-items: center;">
        <div>
          <el-form-item label="姓名">
            <el-input style="width: 240px" class="search-input" clearable placeholder="请输入" v-model="searchForm.name">
            </el-input>
          </el-form-item>
          <el-form-item label="手机">
            <el-input style="width: 240px" class="search-input" clearable placeholder="请输入" v-model="searchForm.phone">
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="btnSearch">查询</el-button>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="btnReset">重置</el-button>
          </el-form-item>

          <el-form-item>
            <el-button type="success" v-if="addPower" @click="btnAdded">新增</el-button>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <el-table row-key="user_id" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" :data="dealerList"
      class="table-info" header-cell-class-name="header_row_class" :max-height="screenHeight" v-loading="loading" ref="multipleTable" stripe
      element-loading-text="拼命加载中，主人请稍后...">
      <el-table-column label="姓名" width="200">
        <template #default="scope">
          <div>{{ scope.row.user_name || '-' }}</div>
        </template>
      </el-table-column>

      <el-table-column label="手机">
        <template #default="scope">
          <div>{{ scope.row.phone || '-' }}</div>
        </template>
      </el-table-column>

      <el-table-column label="职务">
        <template #default="scope">
          <div>{{ scope.row.role_name || '-' }}</div>
        </template>
      </el-table-column>

      <el-table-column label="状态">
        <template #default="scope">
          <div>{{ scope.row.stop_flag === 0 ? '启用' : '禁用' }}</div>
        </template>
      </el-table-column>

      <el-table-column label="负责范围描述">
        <template #default="scope">
          <div>{{ scope.row.remark || '-' }}</div>
        </template>
      </el-table-column>

      <el-table-column label="创建时间">
        <template #default="scope">
          <div>{{ scope.row.make_date || '-' }}</div>
        </template>
      </el-table-column>

      <el-table-column label="操作" fixed="right" width="180">
        <template #default="scope">
          <el-button v-if="passwordPower" class="button-style" link type="primary" @click="resetPwd(scope.row)">
            重置密码
          </el-button>
          <el-button v-if="statusPower && scope.row.stop_flag === 0" class="button-style" link type="primary"
            @click="editStatus(scope.row, scope.row.stop_flag === 0 ? 0 : 2)">
            禁用
          </el-button>
          <el-button v-if="statusPower && scope.row.stop_flag === 1" class="button-style" link type="primary"
            @click="editStatusEnable(scope.row)">
            启用
          </el-button>
          <el-dropdown placement="bottom-start">
            <el-button class="button-style" link type="primary">
              更多
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="detail(scope.row)">详情</el-dropdown-item>
                <el-dropdown-item v-if="editPower" @click="edit(scope.row)">修改</el-dropdown-item>
                <el-dropdown-item v-if="selectPower" @click="changePower(scope.row)">变更权限</el-dropdown-item>
                <el-dropdown-item v-if="deletePower" style="color:#f56c6c" type="danger" :disabled="scope.row.stop_flag === 0"
                  @click="editStatus(scope.row, 1)">删除</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增/编辑弹窗 -->
    <div class="add-dialog">
      <el-dialog v-model="dialogAdd" top="5vh" :title="dialogTitle" width="800" :show-close="false"
        @close="closeDialogAdd">
        <el-form :inline="true" ref="formref" id="form" :model="dialogForm" size="large" label-width="100px"
          :rules="rules" :disabled="dialogFormDisabled" style="display: flex; flex-direction: column;">
          <div v-if="dialogType === 'power'" class="power-info"> {{  detailData.user_name }}-{{  detailData.phone }} </div>
          <el-form-item label="姓名" prop="name" v-if="dialogType !== 'power'">
            <el-input class="search-input" clearable placeholder="请输入" show-word-limit :maxlength="20"
              v-model="dialogForm.name">
            </el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="phone" v-if="dialogType !== 'power'">
            <el-input class="search-input" clearable placeholder="请输入" show-word-limit :maxlength="11"
              v-model="dialogForm.phone" @input="handlePhoneInput">
            </el-input>
          </el-form-item>
          <el-form-item v-if="dialogType !== 'edit'" label="所属上级">
            <el-cascader style="width:250px" :disabled="dialogType === 'power'" v-model="dialogForm.parent_id" clearable :options="processedDealerList" :props="cascaderProps"
              :show-all-levels="false" @change="changeDealer"/>
          </el-form-item>
          <el-form-item v-if="dialogType !== 'edit'" label="职务" prop="role_id">
            <el-select :disabled="dialogFormDisabled" v-model="dialogForm.role_id" placeholder="请选择内容"
              style="width: 250px" @change="changeRole" clearable filterable>
              <el-option v-for="item in roleList" :key="item.id" :label="item.role_name" :value="item.role_id" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="dialogType !== 'edit'" label="负责范围" prop="area_ids">
            <el-cascader style="width:250px" v-if='role_level!==4' v-model="dialogForm.area_ids" clearable :options="areaTreeList" :props="cascaderAreaProps"
              :show-all-levels="false" @change="changeArea" collapse-tags />
              <el-button v-else type="primary" @click="addRoleSchool">{{ dialogForm.area_ids.length ? `已选择
              ${dialogForm.area_ids.length} 所学校` : '选择学校' }}</el-button>
          </el-form-item>
          <el-form-item v-if="dialogType !== 'edit' && role_level!==4" label="特例学校" prop="role_level">
            <el-button type="primary" @click="addSpecialSchool">{{ dialogForm.school_ids.length ? `已选择
              ${dialogForm.school_ids.length} 所学校` : '特例学校' }}</el-button>
          </el-form-item>
          <el-form-item v-if="dialogType !== 'edit' && role_level!==4" label="下放职务" prop="sub_role_ids">
            <el-button type="primary" @click="selectRoleBtn">{{ selectDevolveRoleList.length ? `已选择
              ${selectDevolveRoleList.length} 职务` : '选择职务' }}</el-button>

          </el-form-item>
          <el-form-item v-if="dialogType !== 'power'" label="账号" prop="account">
            <el-input class="search-input" clearable placeholder="请输入" show-word-limit :maxlength="30"
              v-model="dialogForm.account">
            </el-input>
          </el-form-item>
          <el-form-item v-if="dialogType === 'add'" label="密码" prop="password">
            <el-input class="search-input" clearable placeholder="默认手机后六位，可改" show-word-limit :maxlength="18"
              v-model="dialogForm.password">
            </el-input>
          </el-form-item>
          <el-form-item v-if="dialogType !== 'edit'" label="负责范围描述">
            <el-input class="search-input" clearable placeholder="请输入" type="textarea" show-word-limit :maxlength="30"
              v-model="dialogForm.remark" :autosize="{ minRows: 2, maxRows: 4 }">
            </el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="closeDialogAdd">取消</el-button>
            <el-button type="primary" @click="makeSureBtn">
              保存
            </el-button>
          </div>
        </template>
      </el-dialog>
    </div>
    <!-- 选择下方职务弹窗 -->
    <div class="add-dialog">
      <el-dialog v-model="dialogRole" top="5vh" title="选择下放职务" width="800" :show-close="false" :destroy-on-close="true"
        @close="closeDialogselect">
        <div class="role-card">
          <div class="role-card-item" v-for="(item, index) in devolveRoleList" :key="index" @click="selectRole(item)">
            <div class="label"> {{ getRoleLabel(item.role_level) }} </div>
            <div class="title"> {{ item.role_name }} </div>
            <div class="desc"> {{ item.role_desc }} </div>
            <div class="select_icon">
              <img class="select" v-show="selectDevolveRoleList.some(selectItem => selectItem === item.role_id)"
                src="@/assets/images/select.png" />
            </div>
          </div>
        </div>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="closeDialogselect">取消</el-button>
            <el-button type="primary" @click="selectSureBtn">
              保存
            </el-button>
          </div>
        </template>
      </el-dialog>
    </div>
    <!-- 查看详情弹窗 -->
    <div class="detail-dialog">
      <el-dialog v-model="dialogDetail" title="详情" width="800" :show-close="true" :destroy-on-close="true">
        <div class="detail-box">
          <div class="detail-item">
            <h6>用户信息</h6>
            <div class="detail-mes">
              <p>姓名：{{ detailData.user_name }}</p>
              <p>手机：{{ detailData.phone }}</p>
              <p>状态：{{ detailData.stop_flag === 0 ? '启用中' : '禁用中' }}</p>
              <p>职务：{{ detailData.role_name }}</p>
              <p>创建时间：{{ detailData.make_date }}</p>
            </div>
          </div>
          <div class="detail-item">
            <h6>负责情况</h6>
            <p class=""> 负责描述：{{ detailData.remark }} </p>
          </div>
          <div class="detail-item">
            <h6>负责范围</h6>
            <el-table :data="detailData.children" class="table-info" :max-height="screenHeight" v-loading="loading"
              ref="multipleTable" stripe element-loading-text="拼命加载中，主人请稍后...">
              <el-table-column label="省份" width="120" show-overflow-tooltip>
                <template #default="scope">
                  <div>{{ scope.row.province || '-' }}</div>
                </template>
              </el-table-column>

              <el-table-column label="城市" show-overflow-tooltip>
                <template #default="scope">
                  <div>{{ scope.row.citys || '-' }}</div>
                </template>
              </el-table-column>
              <el-table-column label="区县" show-overflow-tooltip>
                <template #default="scope">
                  <div>{{ scope.row.countys || '-' }}</div>
                </template>
              </el-table-column>
              <el-table-column label="学校" show-overflow-tooltip>
                <template #default="scope">
                  <div>{{ scope.row.name || '-' }}</div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
  <!-- 普通人员选择学校弹窗 -->
  <select-school v-if="roleSelectSchoolShow" type="roleSelece" :selectInfo="selectInfo" @saveDialog="roleSaveDialog" @cancelDialog="roleCancelDialog" :schoolList="dialogForm.area_ids"></select-school>
  <!-- 选择特例学校弹窗 -->
  <select-school v-if="selectSchoolShow" type="caseSelect" :selectInfo="selectInfo" @saveDialog="saveDialog" @cancelDialog="cancelDialog" :schoolList="dialogForm.school_ids"></select-school>
</template>

<script setup>
import { ref, onMounted, reactive, computed, nextTick} from 'vue';
import { useScreenHeight } from '@/hooks/useScreenHeight.js';
const { screenHeight } = useScreenHeight();
import basicService from '@/service/BasicService.js';
import dealerService from '@/service/DealerService';
import SelectSchool from '@/components/dealer/SelectSchool.vue'
import { useVocabularyStore } from '@/store/vocabulary';
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
let vocabularyStore = useVocabularyStore();
let formref = ref()
const dialogTitle = ref('新增')
const addPower = ref(false) // 新增按钮权限
const editPower = ref(false) // 修改按钮权限
const deletePower = ref(false) // 删除按钮权限
const passwordPower = ref(false) // 修改密码权限
const statusPower = ref(false) // 启用/禁用权限
const selectPower = ref(false) // 变更权限按钮权限
const treeList = ref([])
const dialogFormDisabled = ref(false)
const dialogType = ref('add')
let dialogAdd = ref(false)
let loading = ref(false)
let dealerList = ref([]) // 表格数据 经销商列表
const roleList = ref([]) // 职务列表-新增/编辑时根据选择的经销商获取
const devolveRoleList = ref([]) // 下放职务列表-新增/编辑时根据选择的经销商跟职务获取
const selectDevolveRoleList = ref([]) // 所选择的下放职务
const areaTreeList = ref([])  // 区域树
const role_level = ref(0) // 职务等级
const isPwdAutoGenerated = ref(false) // 密码是否自动生成
const dialogRole = ref(false) // 选择下方职务弹窗
const detailData = ref({}) // 详情数据
const selectSchoolShow = ref(false)  // 选择学校弹窗显示隐藏
const selectInfo = ref({})  // 选择学校弹窗入参
const dialogDetail = ref(false)
const roleSelectSchoolShow = ref(false) // 普通人员选择学校弹窗显示隐藏
const powerStatus = ref(true)
const roleEnum = reactive(
  [
    {
      value: 1,
      label: '省级(包括直辖市)'
    },
    {
      value: 2,
      label: '市级'
    },
    {
      value: 3,
      label: '区级'
    },
    {
      value: 4,
      label: '普通人员'
    },
  ]
)
let searchForm = reactive({
  name: '', // 姓名
  phone: '' // 手机
})
const cascaderProps = {
  value: 'user_id',
  label: 'user_name',
  emitPath: false,
  checkStrictly: true
}
const cascaderAreaProps = {
  value: 'id',
  label: 'name',
  emitPath: false,
  multiple: true
}
let dialogForm = reactive({
  name: '', // 姓名
  phone: '', // 手机
  parent_id: '', // id
  role_id: '', // 职务id
  area_ids: '', // 负责范围(区域id/学校id)
  is_special: 0, // 是否特例
  sub_role_ids: '', // 下放职务id
  account: '', // 账号
  remark: '',
  password: '',
  school_ids: ''
})
let rules = ref({
  name: [
    {
      trigger: 'blur',
      validator: (rule, value, callback) => {
        const reg = /^[a-zA-Z\u4e00-\u9fa5\u00C0-\u017F\s]{1,20}$/;
        if (!value) {
          callback(new Error('请输入'));
        } else if (!reg.test(value)) {
          callback(new Error('只能输入汉字、拼音，长度 1-20 字符'));
        } else {
          callback(); // 校验通过
        }
      }
    },
    { required: true, message: '请输入', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入', trigger: 'blur' },
    {
      trigger: 'blur',
      validator: (rule, value, callback) => {
        const reg = /^1\d{10}$/;
        if (!value) {
          callback(new Error('请输入手机号'));
        } else if (!reg.test(value)) {
          callback(new Error('手机号格式不正确'));
        } else {
          callback(); // 校验通过
        }
      }
    }
  ],
  role_id: [
    { required: true, message: '请选择', trigger: 'change' }
  ],
  account: [
    { required: true, message: '请输入', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        const reg = /^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{}|;:,.?~`@.-]+$/;
        if (!reg.test(value)) {
          callback(new Error('账号仅支持拼音、数字、符号'));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ],
  password: [
    { required: true, message: '请输入', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        const reg = /^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{}|;:,.?~`@.-]+$/;
        if (value.length < 6) {
          callback(new Error('密码长度6-18位'));
        } else if (value.length > 18) {
          callback(new Error('密码长度6-18位'));
        } else {
          callback()
        }
        if (!reg.test(value)) {
          callback(new Error('密码仅支持数字、英文、符号'));
        } else {
          callback()
        }
      }
    }
  ],
  sub_role_ids:[
    { required: true, message: '请选择', trigger: 'change' }
  ],
  area_ids:[
    { required: true, message: '请选择', trigger: 'change' }
  ]
});

onMounted(() => {
  getUserPower()
  getDealerList()
})
  // 递归处理节点：给第四级添加 disabled: true 用于上级选择第四级禁用
const processedDealerList = computed(() => {
  const disableFourthLevel = (options, level = 0) => {
    if (!Array.isArray(options)) return [];
    return options.map(option => {
      const newOption = { ...option };
      // 第四级（level=4）禁用
      if (option.role_level === 4) {
        newOption.disabled = true;
      }
      if (newOption.children && newOption.children.length > 0) {
        newOption.children = disableFourthLevel(newOption.children, level + 1);
      }
      return newOption;
    });
  };
  return disableFourthLevel(JSON.parse(JSON.stringify(dealerList.value)));
});
// 获取用户权限
const getUserPower = () => {
  return basicService.getPower(
    vocabularyStore.user_name,
    vocabularyStore.session,
  )
    .then((res) => {
      if (res.data.findIndex(item => item.menu_index == 'dealer_list_add') !== -1) addPower.value = true
      if (res.data.findIndex(item => item.menu_index == 'dealer_list_edit') !== -1) editPower.value = true
      if (res.data.findIndex(item => item.menu_index == 'dealer_list_del') !== -1) deletePower.value = true
      if (res.data.findIndex(item => item.menu_index == 'dealer_list_paw') !== -1) passwordPower.value = true
      if (res.data.findIndex(item => item.menu_index == 'dealer_list_status') !== -1) statusPower.value = true
      if (res.data.findIndex(item => item.menu_index == 'dealer_list_power') !== -1) selectPower.value = true
    })
    .catch((error) => {
      console.log(error)
    })
    .finally(() => {
      loading.value = false
    })
}
const getRoleLabel = (value) => {
  if (!value) return '';
  const matchItem = roleEnum.find(item => item.value === Number(value));
  return matchItem ? matchItem.label : '-';
};

// 获取经销商列表
const getDealerList = async () => {
  const params = {
    session: vocabularyStore.session,
    user_name: vocabularyStore.user_name,
    name: searchForm.name,
    phone: searchForm.phone,
  }
  try {
    const res = await dealerService.getDistributorList(params)
    if (res.result_code === 200) {
      if (res.areas && res.areas.length) {
        dealerList.value = res.areas
      } else {
        dealerList.value = []
      }
    } else {
      ElMessage({
        message: res.description,
        type: 'error',
      })
    }
  } catch (error) {
    console.log(error)
  }
}

// 获取经销商权限树
const getRoleTree = async () => {
  const params = {
    session: vocabularyStore.session,
    user_name: vocabularyStore.user_name,
  }
  try {
    const res = await dealerService.getDistributorRightTree(params)
    if (res.result_code === 200) {
      if (res.rights && res.rights.length) {
        treeList.value = res.rights
      } else {
        treeList.value = []
      }
    } else {
      ElMessage({
        message: res.description,
        type: 'error',
      })
    }

  } catch (error) {
    console.error('获取经销商权限树失败', error)
  }
}

// 获取职务及下放职务列表
const getRoleList = async (id, level) => {
  const params = {
    session: vocabularyStore.session,
    user_name: vocabularyStore.user_name,
    user_id: id || 1,
    role_level: level || 0
  }
  try {
    const res = await dealerService.getChoosableRoleList(params)
    if (res.result_code === 200) {
      if (res.list && res.list) {
        if (level) {
          devolveRoleList.value = res.list
        } else {
          roleList.value = res.list
        }
      } else {
        if (level) {
          devolveRoleList.value = []
        } else {
          roleList.value = []
        }
      }
    } else {
      ElMessage({
        message: res.description,
        type: 'error',
      })
    }

  } catch (error) {
    console.error('获取经销商权限树失败', error)
  }
}

// 获取区域范围树
const getAreaTree = async (val) => {
  const params = {
    session: vocabularyStore.session,
    user_name: vocabularyStore.user_name,
    user_id: val || 1
  }
  try {
    const res = await dealerService.distributorAreaTree(params)
    if (res.result_code === 200) {
      if (res.areas && res.areas) {
        areaTreeList.value = res.areas
      } else {
        areaTreeList.value = []
      }
    } else {
      ElMessage({
        message: res.description,
        type: 'error',
      })
    }
  } catch (error) {
    console.error('获取经销商权限树失败', error)
  }
}

// 触发经销商联级选择框改变时
const changeDealer = (val) => {
  getRoleList(val)
  getAreaTree(val)
  dialogForm.role_id = ''
  dialogForm.area_ids = ''
  dialogForm.school_ids = ''
  dialogForm.sub_role_ids = ''
  role_level.value = 1
  selectDevolveRoleList.value = []
}

// 触发职务改变时

const changeRole = (val) => {
  console.log('触发职务', val, dialogForm)
  roleList.value.map((item) => {
    if (item.role_id === val) {
      role_level.value = item.role_level
    }
  })
  getRoleList(dialogForm.parent_id, role_level.value)
  dialogForm.area_ids = ''
  dialogForm.school_ids = ''
  dialogForm.sub_role_ids = ''
  selectDevolveRoleList.value = []
}

// 触发负责范围改变时
const changeArea = (val) => {
  console.log('11111111111', val)
  dialogForm.school_ids = ''
  // getRoleList(val)
}

// 处理手机号输入变化：首次输入完成后自动赋值密码为后六位
const handlePhoneInput = () => {
  if (dialogForm.phone.length === 11 && !dialogForm.password && !isPwdAutoGenerated.value) {
    // 取手机号后六位赋值给密码
    dialogForm.password = dialogForm.phone.slice(-6);
    // 标记为已自动生成，后续修改手机号不再触发
    isPwdAutoGenerated.value = true;
  }
}

// 触发按钮选择下放职务
const selectRoleBtn = () => {
  if (dialogForm.role_id){
    dialogRole.value = true
  } else {
    ElMessage.warning('请选择职务')
  }
}

// 选择某一个职务
const selectRole = (val) => {
  const targetRoleId = val.role_id;
  const roleList = selectDevolveRoleList.value;
  const index = roleList.findIndex(id => id === targetRoleId);
  if (index > -1) {
    roleList.splice(index, 1);
  } else {
    roleList.push(targetRoleId);
  }
  console.log('选择后的职务', selectDevolveRoleList.value)
}

const addSpecialSchool = () => {
  // 拼一下子组件接口需要的参数 此参数不会变化，变化的在子组件中定义
  selectInfo.value = {
    session: vocabularyStore.session,
    user_name: vocabularyStore.user_name,
    parent_id: dialogForm.parent_id || 1,
    area_ids: dialogForm.area_ids.length ? dialogForm.area_ids.join(',') : dialogForm.area_ids || '',
  }
  selectSchoolShow.value = true
}

const addRoleSchool = () => {
    // 拼一下子组件接口需要的参数 此参数不会变化，变化的在子组件中定义
  selectInfo.value = {
    session: vocabularyStore.session,
    user_name: vocabularyStore.user_name,
    parent_id: dialogForm.parent_id || 1,
  }
  roleSelectSchoolShow.value = true
}

// 取消新增
const closeDialogAdd = async() => {
  dialogAdd.value = false
  await nextTick(()=> {
    dialogForm.id = ''
    dialogForm.name = ''
    dialogForm.phone = ''
    dialogForm.password = ''
    dialogForm.role_id = ''
    dialogForm.area_ids = ''
    dialogForm.account = ''
    dialogForm.remark = ''
    dialogForm.school_ids = ''
    dialogForm.sub_role_ids = ''
    dialogForm.parent_id = ''
    selectDevolveRoleList.value = []
    dialogFormDisabled.value = false
    isPwdAutoGenerated.value = false
    role_level.value = 0
    formref.value.resetFields()
  })

}
// 确定新增/编辑
const makeSureBtn = () => {
  formref.value.validate(async (valid) => {
    if (valid) {
      const loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })

      // 如果是新增走一下逻辑
      if (dialogType.value === 'add') {
        let params = {
          session: vocabularyStore.session,
          user_name: vocabularyStore.user_name,
          account: dialogForm.account,
          phone: dialogForm.phone,
          area_ids: dialogForm.area_ids.length ? dialogForm.area_ids.join(',') : dialogForm.area_ids || '',
          parent_id: dialogForm.parent_id || 1,
          is_special: dialogForm.is_special,
          name: dialogForm.name,
          password: dialogForm.password,
          role_id: dialogForm.role_id,
          remark: dialogForm.remark,
          school_ids: dialogForm.school_ids.length ? dialogForm.school_ids.join(',') : '',
          sub_role_ids: selectDevolveRoleList.value.join(','),
        }

        try {
          const res = await dealerService.addDistributor(params)
          if (res.result_code === 200) {
            ElMessage({
              message: '操作成功',
              type: 'success',
            })
            getDealerList()
            closeDialogAdd()
          } else if (res.result_code === 913) {
            ElMessage({
              message: '手机号重复，经销商已存在',
              type: 'error',
            })
          } else {
            ElMessage({
              message: res.description,
              type: 'error',
            })
          }
          loading.close()
        } catch (error) {
          console.log(error)
          loading.close()
        }
      } else if (dialogType.value === 'edit') {
        // 编辑逻辑
        let params = {
          session: vocabularyStore.session,
          user_name: vocabularyStore.user_name,
          account: dialogForm.account,
          phone: dialogForm.phone,
          distributor_id: dialogForm.id,
          distributor_name: dialogForm.name
        }
        try {
          const res = await dealerService.updateDistributorInfo(params)
          if (res.result_code === 200) {
            ElMessage({
              message: '修改成功',
              type: 'success',
            })
            getDealerList()
            closeDialogAdd()
          } else if (res.result_code === 913) {
            ElMessage({
              message: '经销商已存在',
              type: 'error',
            })
          } else {
            ElMessage({
              message: res.description,
              type: 'error',
            })
          }
          loading.close()
        } catch (error) {
          console.log(error)
          loading.close()
        } finally {
          loading.close()
          dialogType.value = 'add'
        }
      } else if (dialogType.value === 'power'){
        // 更改权限逻辑
        let params = {
          session: vocabularyStore.session,
          user_id: dialogForm.id,
          user_name: vocabularyStore.user_name,
          area_ids: dialogForm.area_ids.length ? dialogForm.area_ids.join(',') : dialogForm.area_ids || '',
          role_id: dialogForm.role_id,
          remark: dialogForm.remark,
          school_ids: dialogForm.school_ids.length ? dialogForm.school_ids.join(',') : '',
          sub_role_ids: selectDevolveRoleList.value.length ? selectDevolveRoleList.value.join(',') : '',
          role_level: role_level.value
        }
        try {
          const res = await dealerService.updateDistributorAuth(params)
          if (res.result_code === 200) {
            ElMessage({
              message: '变更成功',
              type: 'success',
            })
            getDealerList()
            closeDialogAdd()
          } else if (res.result_code === 913) {
            ElMessage({
              message: '经销商已存在',
              type: 'error',
            })
          } else {
            ElMessage({
              message: res.description,
              type: 'error',
            })
          }
          loading.close()
        } catch (error) {
          console.log(error)
          loading.close()
        } finally {
          loading.close()
          dialogType.value = 'add'
        }
      }

    } else {
      console.log('valid3', valid)
      return false
    }
  })
}

// 保存所选的下放职务
const selectSureBtn = () => {
  dialogRole.value = false
  dialogForm.sub_role_ids = selectDevolveRoleList.value.join(',')
}

// 取消选择下放职务
const closeDialogselect = () => {
  dialogRole.value = false
  // selectDevolveRoleList.value = []
}

// 获取经销商详情
const getDealerDetail = async (id) => {
  const params = {
    session: vocabularyStore.session,
    user_name: vocabularyStore.user_name,
    user_id: id,
  }
  try {
    const res = await dealerService.getDistributorDetail(params)
    if (res.result_code === 200) {
      if (res.distributor) {
        detailData.value = res.distributor
      }
    }
  } catch (error) {
    console.log(error)
  }
}
// 切换下一页---暂时注释
// const handleCurrentChange = (page) => {
//   pageIndex.value = page
//   getDealerList() // 表格数据
// }
// 查询
const btnSearch = () => {
  getDealerList()
}
// 重置
const btnReset = () => {
  searchForm.name = ''
  searchForm.phone = ''
  getDealerList()
}
// 新增
const btnAdded = () => {
  dialogTitle.value = '新增'
  dialogAdd.value = true
  dialogType.value = 'add'
  getRoleTree()
  getRoleList()
  getAreaTree()
}
// 编辑
const edit = async (row) => {
  await getDealerDetail(row.user_id)
  dialogForm.name = detailData.value.user_name
  dialogForm.phone = detailData.value.phone
  dialogForm.account = detailData.value.account_name
  dialogForm.id = row.user_id
  dialogType.value = 'edit'
  dialogTitle.value = '编辑'
  dialogAdd.value = true
}

// 触发更改权限操作
const changePower = async (row) => {
  await getDealerDetail(row.user_id)
  dialogForm.id = row.user_id
  role_level.value = detailData.value.role_level
  // 获取职务列表
  await getRoleList(row.parent_id)
  dialogForm.parent_id = row.parent_id || 1
  dialogForm.role_id = detailData.value.role_id || ''
  // 获取负责范围
  await getAreaTree()
  dialogForm.area_ids = detailData.value.area_ids ? detailData.value.area_ids.split(',').map(item => Number(item.trim())): ''
  dialogForm.school_ids = detailData.value.school_ids ? detailData.value.school_ids.split(',').map(item => Number(item.trim())) : ''
  console.log(' dialogForm.school_ids', dialogForm.school_ids, detailData.value.school_ids)
  
  // 获取下放职务
  getRoleList(row.parent_id, detailData.value.role_level)
  selectDevolveRoleList.value = detailData.value.role_ids ? detailData.value.role_ids.split(',').map(item => Number(item.trim())) : ''
  dialogForm.sub_role_ids = detailData.value.role_ids ? detailData.value.role_ids.split(',').map(item => Number(item.trim())) : ''
  dialogForm.account = detailData.value.account_name
  dialogForm.remark = detailData.value.remark
  dialogType.value = 'power'
  dialogTitle.value = '变更权限'
  dialogAdd.value = true
}
// 查看
const detail = (row) => {
  getDealerDetail(row.user_id)
  dialogDetail.value = true
}

// 重置经销商密码
const resetPwd = (row) => {
  ElMessageBox.confirm(
    '是否确认重置密码，初始化密码   手机号后六位',
    {
      confirmButtonText: '确定',
      confirmButtonClass: 'button-confirm',
      cancelButtonText: '取消',
      center: true,
    }
  ).then(async () => {
    let params = {
      user_name: vocabularyStore.user_name,
      session: vocabularyStore.session,
      user_id: row.user_id
    }
    try {
      const res = await dealerService.resetDistributorPwd(params)
      if (res.result_code === 200) {
        ElMessage({
          message: '重置成功',
          type: 'success',
          duration: 1000
        })
      } else {
        ElMessage({
          message: res.description,
          type: 'info',
          duration: 3000
        })
      }
    } catch (error) {
      console.log(error)
    }
  }).catch(() => { })
}

// 更改经销商状态 启用、禁用、删除

const editStatus = async (row, type) => {
  let title = row.stop_flag === 0 ? '禁用' : '启用'
  let label = ''
  let mesTitle = ''
  if (type === 1) {
    label = '是否确认删除'
    title = '确定后，将同时删除其下级账号数据'
    mesTitle = '删除成功'
  } else if (type === 0) {
    label = '是否确认禁用'
    title = '禁用后将对其账号以及其创建的下级账号全部进行禁用'
    mesTitle = '禁用成功'
  }
  ElMessageBox.confirm(
    title,
    label,
    {
      confirmButtonText: '确定',
      confirmButtonClass: 'button-confirm',
      cancelButtonText: '取消',
      center: true,
    }
  ).then(() => {
    let params = {
      user_name: vocabularyStore.user_name,
      session: vocabularyStore.session,
      distributor_id: row.user_id,
      type: type
    }
    dealerService.disableDistributor(params).then((res) => {
      if (res.result_code === 200) {
        getDealerList()
        ElMessage({
          message: `${mesTitle}成功`,
          type: 'success',
          duration: 1000
        })
      } else if (res.result_code === 919) {
        ElMessage({
          message: '正在被引用,禁止删除',
          type: 'error',
          duration: 3000
        })
      } else {
        ElMessage({
          message: res.description,
          type: 'info',
          duration: 3000
        })
      }
    }).catch((error) => {
      console.log(error)
    })
  }).catch(() => {
  })
}
const editStatusDisable = async (row) => {
  const params = {
    user_name: vocabularyStore.user_name,
    session: vocabularyStore.session,
    distributor_id: row.user_id,
  }
  try{
    const res = await dealerService.checkDistributorAuth(params)
      if (res.result_code === 920) {
        powerStatus.value = true
        ElMessageBox.confirm(
          '请先完善负责范围信息',
          {
            confirmButtonText: '确定',
            confirmButtonClass: 'button-confirm',
            cancelButtonText: '取消',
            center: true,
          }
        ).then(() => {
          changePower(row)
          return false
        }).catch(() => {
        })
      } else if (res.result_code === 921) {
        powerStatus.value = true
        ElMessageBox.confirm(
          '请先完善职务信息',
          {
            confirmButtonText: '确定',
            confirmButtonClass: 'button-confirm',
            cancelButtonText: '取消',
            center: true,
          }
        ).then(() => {
          changePower(row)
          return false
        }).catch(() => {
        })
      } else if (res.result_code === 200) {
        powerStatus.value = false

      }
  } catch (error) {
    console.log(error)
  }
}
// 启用
const editStatusEnable = async (row) => {
  await editStatusDisable (row)
  // 启用前先判断一下权限状态是否丢失
  if (powerStatus.value) {
    return
  }
  ElMessageBox.confirm(
    '启用后，其账号可正常登录，但其下级需要自行启用',
    '是否确认启用',
    {
      confirmButtonText: '确定',
      confirmButtonClass: 'button-confirm',
      cancelButtonText: '取消',
      center: true,
    }
  ).then(() => {
    let params = {
      user_name: vocabularyStore.user_name,
      session: vocabularyStore.session,
      distributor_id: row.user_id,
    }
    dealerService.enableDistributor(params).then((res) => {
      if (res.result_code === 200) {
        getDealerList()
        ElMessage({
          message: `启用成功`,
          type: 'success',
          duration: 1000
        })
      } else {
        ElMessage({
          message: res.description,
          type: 'info',
          duration: 3000
        })
      }
    }).catch((error) => {
      console.log(error)
    })
  }).catch(() => {
  })
}

// 特例学校保存逻辑
const saveDialog = async (schooleList) => {
  console.log('schooleListIDa', schooleList)
  selectSchoolShow.value = false
  dialogForm.school_ids = schooleList
}

// 普通职务选择学校保存逻辑
const roleSaveDialog = async (schooleList) => { 
  console.log('schooleListIDa111', schooleList)
  roleSelectSchoolShow.value = false
  dialogForm.area_ids = schooleList
}

// 特例学校取消逻辑
const cancelDialog = () => { 
  selectSchoolShow.value = false
}

// 特例学校取消逻辑
const roleCancelDialog = () => { 
  roleSelectSchoolShow.value = false
}

</script>

<style scoped>
.table-info {
  width: 96% !important;
  margin-left: 20px;
  border: 1px solid var(--el-border-color-lighter);
  border-right: 1px solid var(--el-border-color-lighter) !important;
}

.line {
  margin: 30px 0;
  border: 1px dotted #eee;
}

#form .el-select {
  --el-select-width: 250px;
}

#form .el-input {
  --el-input-width: 250px;
}

#form .el-textarea {
  width: 350px;
}

.over-hidden {
  width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

#cityForms {
  padding: 0 20px;
}

#cityForms :deep(.el-form-item) {
  margin-right: 10px !important;
}

.year-box {
  display: flex;
  margin-top: 20px;
}

.year-item {
  margin-right: -1px;
  padding: 0px 14px;
  border: 1px solid #eee;
  cursor: pointer;
}

.active-years {
  background: rgba(64, 158, 255, 1);
  color: #fff;
}

:deep(.el-table__cell .cell) {
  display: flex;
  align-items: center;
}

.role-card {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  height: 631px;
  overflow: auto;
  justify-content: start;
  align-content: baseline;
}

.role-card-item {
  background: #F3F5F8;
  border-radius: 20px;
  padding: 11px 22px;
  height: 150px;
  width: 310px;
  cursor: pointer;
}

.role-card-item .label {
  display: flex;
  justify-content: end;
}

.role-card-item .title {
  font-size: 22px;
  color: #000000;
  font-weight: bold;
}

.role-card-item .desc {
  width: 306px;
  margin: 10px 0;
  height: 50px;
  font-size: 16px;
  color: #000000;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
}

.role-card-item .select {
  width: 20px;
  height: 20px;
}

.role-card-item .select_icon {
  width: 20px;
  height: 20px;
  display: flex;
  float: right;
}

.detail-box {
  display: flex;
  flex-direction: column;
}

.detail-box .detail-item {
  display: flex;
  flex-direction: column;
}

.detail-box .detail-item .detail-mes {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
}

.detail-box .detail-item h6 {
  font-size: 18px;
  margin: 0;
  margin-bottom: 10px;
}
.power-info{
  margin-left: 100px;
  margin-bottom: 20px;
  font-size: 16px;
}
</style>
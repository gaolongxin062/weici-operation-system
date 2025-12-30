<template>
  <div class="page define-page">
    <div class="page-title" id="page-title">
      <h4>教师菜单权限开通管理</h4>
    </div>
    <div class="content-box">
      <el-form :inline="true" id="form" :model="formData" size="large" label-width="60px" @submit.prevent>
        <el-form-item label="省份">
          <el-select
            v-model="formData.province_id"
            placeholder="请选择"
            filterable
            @change="changeProvince"
            clearable
          >
            <el-option
              v-for="item in provinceData"
              :key="item.id"
              :label="item.province"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="市">
          <el-select
            v-model="formData.city_id"
            filterable
            placeholder="请选择"
            @change="changeCity"
            clearable
          >
            <el-option
              v-for="item in cityData"
              :key="item.id"
              :label="item.city"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="区县">
          <el-select
            v-model="formData.county_id"
            filterable
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in areaData"
              :key="item.id"
              :label="item.county"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="学校">
          <el-input class="search-input" clearable placeholder="请输入搜索学校" v-model="formData.school">
          </el-input>
        </el-form-item>
        <el-form-item label="账号">
          <el-input class="search-input" clearable placeholder="请输入搜索账号" v-model="formData.teacher_code">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onReset">重置</el-button>
        </el-form-item>
        <el-form-item v-if="addPower">
          <el-button type="success" @click="newlyAdded">新增</el-button>
        </el-form-item>
      </el-form>

      <!-- 新增/编辑/详情弹窗 -->
      <TeacherPowerSet v-if="addDialog" @cancelDialog="closeAddDialog" @saveDialog="addMember"></TeacherPowerSet>
      <TeacherPowerSet v-if="editDialog" :isEdit="true" :row="rowInfo" @cancelDialog="closeEditDialog"
        @saveDialog="editMemberInfo"></TeacherPowerSet>
      <TeacherPowerSet v-if="checkDialog" :isCheck="true" :row="rowInfo" @cancelDialog="closeRenewalDialog"></TeacherPowerSet>

      <!-- 教师权限列表 -->
      <el-table 
        :data="dataList" 
        class="table-info" 
        v-loading="loading" 
        header-cell-class-name="header_row_class" 
        style="width: 100%" 
        stripe
        element-loading-text="拼命加载中，主人请稍后..." 
        :max-height="screenHeight"
        ref="multipleTable"
        @select="selectionChange"
        @select-all="selectionChange"
      >
        <el-table-column prop="teacher_code" label="账号" min-width="120px" />
        <el-table-column width="100" align="center" label="状态">
          <template #default="scope">
            <div>{{ dealStateTitle(scope.row.stop_flag) }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="province" label="省"  min-width="130px" />
        <el-table-column prop="city" label="市"  min-width="130px"  />
        <el-table-column prop="county" label="区县"  min-width="230px" />
        <el-table-column prop="school_name" label="学校" min-width="330px" />
        <el-table-column label="来源"  min-width="130px">
          <template #default="scope">
            <div>{{ dealUserSourceTitle(scope.row.user_source) }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="maker_name" label="创建人" min-width="160px" />
        <el-table-column prop="make_date" label="创建日期" min-width="160px" />
        <el-table-column label="操作" fixed="right"  min-width="160px">
          <template #default="scope">
            <el-button class="button-style" link type="primary" @click="detail(scope.row)">
              详情
            </el-button>
            <el-button class="button-style" link type="primary" @click="editUser(scope.row)" v-if="editPower">
              编辑
            </el-button>
            <el-button class="button-style" link type="danger" @click="editStatus(scope.row)" v-if="scope.row.stop_flag === 1 && statusPower">
              启用
            </el-button>
            <el-button class="button-style" link type="primary" v-if="scope.row.stop_flag === 0 && statusPower" @click="editStatus(scope.row)">
              停用
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页组件 -->
      <el-pagination 
        style="color: #666666;margin: 20px 0 0 20px;" 
        v-show="total > 0"
        @current-change="handleCurrentChange" 
        :current-page="pageIndex" 
        :page-size="pageSize"
        layout="total, prev, pager, next" 
        prev-text="上一页" 
        next-text="下一页" 
        :total="total"
      >
      </el-pagination>
    </div>

    <!-- 操作结果提示弹窗 -->
    <el-dialog 
      v-model="dialogVisible" 
      title="提示" 
      width="800" 
      :show-close="false" 
      :close-on-click-modal="false" 
      append-to-body
    >
      <div class="no-success-list">
        <div style="margin-bottom: 20px;">结果信息：{{ noSuccessInfo.description }}</div>
        <div>未开通账号:</div>
        <div style="margin-bottom: 5px;margin-left: 85px;" v-for="(item, index) in noSuccessInfo.filteredUserCodes" :key="index">
          {{ item }}
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="dialogVisible = false">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 教师认证弹窗 -->
    <CertificationSet 
      v-if="dialogCertification" 
      @cancelTeaching="cancelTeaching" 
      @saveTeaching="saveTeaching" 
      :userCode="userCode"
    ></CertificationSet>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import basicService from '@/service/BasicService.js';
import AiAgentService from '@/service/AiAgentService';
import AiTeacherPower from '@/service/AiTeacherPower.js';
import TeacherPowerSet from '@/components/aiagent/TeacherPowerSet';
import CertificationSet from '@/components/CertificationSet';
import { useVocabularyStore } from '@/store/vocabulary';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useScreenHeight } from '@/hooks/useScreenHeight.js';

// 页面高度适配
const { screenHeight } = useScreenHeight();
// 全局状态存储
const vocabularyStore = useVocabularyStore();

// 页面基础状态
const loading = ref(false);       // 表格加载状态
const total = ref(0);             // 列表总条数
const pageIndex = ref(1);         // 当前页码
const pageSize = ref(10);         // 每页条数

// 查询表单数据
const formData = ref({
  province_id: '',  // 省份ID
  city_id: '',      // 城市ID
  county_id: '',    // 区县ID
  sate: '',         // 状态（备用）
  school: '',       // 学校名称
  teacher_code: ''  // 教师账号
});

// 缓存查询条件（防止重置/翻页时丢失）
const unChangeFormData = ref({
  province_id: '',
  city_id: '',
  county_id: '',
  sate: '',
  school: '',
  teacher_code: ''
});

// 下拉列表数据
const provinceData = ref([]);  // 省份列表
const cityData = ref([]);      // 城市列表
const areaData = ref([]);      // 区县列表
const dataList = ref([]);      // 教师权限列表数据

// 弹窗控制
const addDialog = ref(false);        // 新增弹窗
const editDialog = ref(false);       // 编辑弹窗
const checkDialog = ref(false);      // 详情/续期弹窗
const dialogVisible = ref(false);    // 操作结果弹窗
const dialogCertification = ref(false); // 教师认证弹窗

// 业务数据
const rowInfo = ref(null);       // 当前操作行数据
const setConfig = ref(null);     // 新增/编辑的表单数据
const noSuccessInfo = ref(null); // 操作失败/部分成功的提示信息
const userCode = ref('');        // 认证弹窗用的账号

// 权限控制
const addPower = ref(false);     // 新增权限
const editPower = ref(false);    // 编辑权限
const statusPower = ref(false);  // 状态修改权限
const isSaveError = ref(false);  // 保存失败标记（防止重复操作）

// 表格选中相关（批量操作备用）
const multipleSelection = ref([]); // 当前页选中行
const selectUsers = ref([]);       // 记忆选中的所有行
const dataIdKey = ref('id');       // 行数据唯一标识
const multipleTable = ref(null);   // 表格实例

// 页面初始化
onMounted(() => {
  // 初始化页面数据
  getUserPower();       // 获取用户操作权限
  getProvinceList();    // 加载省份列表
  initMemberList();     // 加载教师权限列表
  
  // 监听窗口大小变化，动态调整表格高度
  window.addEventListener('resize', updateScreenHeight);
  updateScreenHeight();
});

// 点击查询按钮 - 重置页码，重新加载列表
const onSubmit = async () => {
  pageIndex.value = 1;
  unChangeFormData.value = JSON.parse(JSON.stringify(formData.value));
  await initMemberList();
  // 恢复表格选中状态
  nextTick(() => {
    setSelectRow();
  });
};

// 重置查询条件
const onReset = async () => {
  formData.value = {
    province_id: '',
    city_id: '',
    county_id: '',
    sate: '',
    school: '',
    teacher_code: ''
  };
  unChangeFormData.value = JSON.parse(JSON.stringify(formData.value));
  pageIndex.value = 1;
  await initMemberList();
  // 恢复表格选中状态
  nextTick(() => {
    setSelectRow();
  });
};

// 分页切换
const handleCurrentChange = async (page) => {
  pageIndex.value = page;
  await initMemberList();
  // 恢复表格选中状态
  nextTick(() => {
    setSelectRow();
  });
};

// 获取当前用户操作权限（新增/编辑/状态修改）
const getUserPower = () => {
  return basicService.getPower(
    vocabularyStore.user_name,
    vocabularyStore.session
  ).then((res) => {
    // 判断是否有新增权限
    if (res.data.findIndex(item => item.menu_index == 'ai_agent_teacher_add') !== -1) {
      addPower.value = true;
    }
    // 判断是否有编辑权限
    if (res.data.findIndex(item => item.menu_index == 'ai_agent_teacher_edit') !== -1) {
      editPower.value = true;
    }
    // 判断是否有状态修改权限
    if (res.data.findIndex(item => item.menu_index == 'ai_agent_teacher_status') !== -1) {
      statusPower.value = true;
    }
  }).catch((error) => {
    console.log('获取权限失败：', error);
  }).finally(() => {
    loading.value = false;
  });
};

// 加载教师权限列表
const initMemberList = () => {
  loading.value = true;
  const params = dealSearchParams();
  return AiTeacherPower.ApiGetAiUserList(params).then((res) => {
    dataList.value = res.data;
    total.value = res.total;
  }).catch((error) => {
    console.log('加载列表失败：', error);
  }).finally(() => {
    loading.value = false;
  });
};

// 处理查询参数（只传有值的参数）
const dealSearchParams = () => {
  let params = {
    user_name: vocabularyStore.user_name,
    session: vocabularyStore.session,
    page_index: pageIndex.value,
    page_size: pageSize.value
  };

  // 合并省份参数
  params = mergeObjects(params, unChangeFormData.value.province_id, 'province_id');
  // 合并城市参数
  params = mergeObjects(params, unChangeFormData.value.city_id, 'city_id');
  // 合并区县参数
  params = mergeObjects(params, unChangeFormData.value.county_id, 'county_id');
  // 合并学校参数
  params = mergeObjects(params, unChangeFormData.value.school, 'school');
  // 合并账号参数
  params = mergeObjects(params, unChangeFormData.value.teacher_code, 'teacher_code');

  return params;
};

// 合并参数工具方法：有值才添加到参数对象中
const mergeObjects = (baseObj, conditionObj, key) => {
  return {
    ...baseObj,
    ...(conditionObj && { [key]: conditionObj })
  };
};

// 获取省份列表
const getProvinceList = () => {
  const params = {
    user_name: vocabularyStore.user_name,
    session: vocabularyStore.session
  };
  return AiAgentService.getProvincesList(params).then((res) => {
    if (res.result_code === 200) {
      provinceData.value = res.list;
    }
  }).catch((error) => {
    console.log('获取省份列表失败：', error);
  });
};

// 获取城市列表
const getCityList = () => {
  const params = {
    user_name: vocabularyStore.user_name,
    session: vocabularyStore.session,
    province_id: formData.value.province_id
  };
  return AiAgentService.getAiCityList(params).then((res) => {
    if (res.result_code === 200) {
      cityData.value = res.list;
    }
  }).catch((error) => {
    console.log('获取城市列表失败：', error);
  });
};

// 切换省份处理逻辑
const changeProvince = (val) => {
  // 清空市和区县的选中值
  formData.value.city_id = '';
  formData.value.county_id = '';
  
  // 清空选择时重置下拉列表
  if (val === undefined) {
    cityData.value = [];
    areaData.value = [];
  } else {
    // 选择省份后加载对应城市列表
    getCityList();
  }
};

// 切换城市处理逻辑
const changeCity = (val) => {
  // 清空区县选中值
  formData.value.county_id = '';
  
  // 清空选择时重置下拉列表
  if (val === undefined) {
    areaData.value = [];
  } else {
    // 选择城市后加载对应区县列表
    getAreaList();
  }
};

// 获取区县列表
const getAreaList = () => {
  const params = {
    user_name: vocabularyStore.user_name,
    session: vocabularyStore.session,
    city_id: formData.value.city_id
  };
  return AiAgentService.getAiCountyList(params).then((res) => {
    if (res.result_code === 200) {
      areaData.value = res.list;
    }
  }).catch((error) => {
    console.log('获取区县列表失败：', error);
  });
};

// 动态调整表格高度
const updateScreenHeight = () => {
  const element = document.getElementById('form');
  let formHeight = 0;
  if (element) {
    const rect = element.getBoundingClientRect();
    formHeight = rect.height; // 获取查询表单高度
  }
  
  const pageHeight = 80;    // 分页组件高度
  const menuHeight = 64;    // 顶部导航栏高度
  // 计算表格可用高度
  screenHeight.value = window.innerHeight - formHeight - pageHeight - menuHeight - 100;
};

// 打开新增弹窗
const newlyAdded = () => {
  addDialog.value = true;
};

// 关闭新增弹窗
const closeAddDialog = () => {
  addDialog.value = false;
};

// 新增教师权限提交
const addMember = async (content) => {
  setConfig.value = content; // 保存新增表单数据
  await saveMember();        // 调用保存接口
  pageIndex.value = 1;       // 重置页码
  initMemberList();          // 重新加载列表
};

// 保存新增教师权限
const saveMember = () => {
  const params = dealSaveOrUpdateParams(); // 处理保存参数
  return AiTeacherPower.apiAddAiUser(params).then((res) => {
    // 所有账号都在有效期内，无法开通
    if (res.result_code === 1004) {
      addDialog.value = false;
      isSaveError.value = true;
      noSuccessInfo.value = res;
      dialogVisible.value = true;
    } else if (res.result_code === 1005) { // 部分开通成功
      addDialog.value = false;
      noSuccessInfo.value = res;
      dialogVisible.value = true;
    } else if (res.result_code === 1007) { // 全部开通成功
      addDialog.value = false;
      ElMessage({
        message: res.description,
        type: 'success',
        duration: 1000
      });
    } else if (res.result_code === 940) { // 需要教师认证
      dialogCertification.value = true;
    } else { // 开通失败
      addDialog.value = false;
      isSaveError.value = true;
      ElMessage({
        message: '新建失败，请重试',
        type: 'error',
        duration: 1000
      });
    }
  }).catch((error) => {
    console.log('保存新增数据失败：', error);
  });
};

// 取消教师认证弹窗
const cancelTeaching = () => {
  dialogCertification.value = false;
};

// 保存教师认证结果
const saveTeaching = () => {
  initMemberList();  // 重新加载列表
  cancelTeaching();  // 关闭认证弹窗
};

// 处理新增/编辑的提交参数
const dealSaveOrUpdateParams = (isEdit = false) => {
  const params = {
    user_name: vocabularyStore.user_name,
    session: vocabularyStore.session,
    teacher_codes: setConfig.value.teacher_codes, // 账号
    province_id: setConfig.value.province_id,
    city_id: setConfig.value.city_id,
    county_id: setConfig.value.county_id,
    school_id: setConfig.value.school_id,
    user_source: setConfig.value.user_source, // 用户来源
    rights: setConfig.value.rights,
    right_end: setConfig.value.right_end,
  };

  // 编辑时添加ID参数
  if (isEdit) {
    params.id = setConfig.value.id;
  }
  return params;
};

// 打开编辑弹窗
const editUser = (row) => {
  editDialog.value = true;
  rowInfo.value = row; // 保存当前编辑行数据
};

// 打开详情弹窗
const detail = (row) => {
  checkDialog.value = true;
  rowInfo.value = row; // 保存当前详情行数据
};

// 关闭编辑弹窗
const closeEditDialog = () => {
  editDialog.value = false;
};

// 编辑教师权限提交
const editMemberInfo = async (content) => {
  setConfig.value = content; // 保存编辑表单数据
  editDialog.value = false;  // 关闭编辑弹窗
  await updateMember();      // 调用编辑接口
  
  // 保存失败时阻止后续操作
  if (isSaveError.value) {
    isSaveError.value = false;
    return;
  }

  // 列表为空且页码大于1时，页码回退
  if (dataList.value.length === 0 && pageIndex.value > 1) {
    pageIndex.value -= 1;
  }
  initMemberList(); // 重新加载列表
};

// 编辑教师权限保存
const updateMember = () => {
  const params = dealSaveOrUpdateParams(true); // 处理编辑参数（带ID）
  return AiTeacherPower.apiAddAiUser(params).then((res) => {
    // 编辑成功
    if (res.result_code === 200) {
      ElMessage({
        message: '编辑成功',
        type: 'success',
        duration: 1000
      });
    } else { // 编辑失败
      isSaveError.value = true;
    }
  }).catch((error) => {
    console.log('保存编辑数据失败：', error);
  });
};

// 修改账号状态（启用/停用）
const editStatus = (row) => {
  let mesTitle = '';
  let mesContent = '';
  
  // 根据当前状态设置提示文案
  if (row.stop_flag === 1) {
    mesTitle = '是否确认启用';
    mesContent = '启用后，该账号可正常登录';
  } else {
    mesTitle = '是否确认停用';
    mesContent = '停用后其账号将被T下线，且无法登录，请谨慎操作';
  }

  // 确认弹窗
  ElMessageBox.confirm(mesContent, mesTitle, {
    confirmButtonText: '确定',
    confirmButtonClass: 'button-confirm',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const params = {
      id: row.id,
      status: row.stop_flag === 1 ? 0 : 1,
      user_name: vocabularyStore.user_name,
      session: vocabularyStore.session,
    };
    try {
      const res = await AiTeacherPower.apiStopAiUser(params);
      if (res.result_code === 200) {
        ElMessage({
          message: '操作成功',
          type: 'success',
          duration: 1000
        });
        initMemberList(); // 重新加载列表
      } else {
        ElMessage({
          message: res.description,
          type: 'error',
          duration: 1000
        });
      }
    } catch (error) {
      console.log('修改状态失败：', error);
    }
  }).catch(() => {
    // 取消操作不处理
  });
};

// 格式化状态显示文案
const dealStateTitle = (state) => {
  switch (+state) {
    case 0:
      return '正常';
    case 1:
      return '停用';
    default:
      return '';
  }
};

// 格式化用户来源显示文案
const dealUserSourceTitle = (user_source) => {
  switch (+user_source) {
    case 0:
      return '正常用户';
    case 1:
      return '维学';
    case 2:
      return '维克多发行';
    case 3:
      return '经销商';
    case 4:
      return '维克多编辑';
    default:
      return '';
  }
};

// 表格选中事件处理
const selectionChange = (val) => {
  multipleSelection.value = val;
  memorySelect(); // 记忆选中状态
};

// 恢复表格选中状态（翻页后）
const setSelectRow = () => {
  const idKey = dataIdKey.value;
  // 无选中数据时直接返回
  if (!selectUsers.value.length) {
    return;
  }

  // 获取所有选中行的ID
  const selectAllUserIds = selectUsers.value.map(item => item[idKey]);
  // 清空当前选中状态
  multipleTable.value.clearSelection();
  
  // 重新勾选对应行
  dataList.value.forEach(item => {
    if (selectAllUserIds.includes(item[idKey])) {
      multipleTable.value.toggleRowSelection(item, true);
    }
  });
};

// 记忆表格选中状态（跨页）
const memorySelect = () => {
  const idKey = dataIdKey.value;
  // 无历史选中数据时直接赋值
  if (selectUsers.value.length <= 0) {
    selectUsers.value = multipleSelection.value;
    return;
  }

  // 获取历史选中ID集合
  const selectAllIds = selectUsers.value.map(row => row[idKey]);
  // 获取当前页选中ID集合
  const selectIds = multipleSelection.value.map(row => row[idKey]);
  // 获取当前页未选中ID集合
  const noSelectIds = dataList.value.filter(row => !selectIds.includes(row[idKey])).map(row => row[idKey]);

  // 新增当前页选中且历史未选中的行
  multipleSelection.value.forEach(row => {
    if (!selectAllIds.includes(row[idKey])) {
      selectUsers.value.push(row);
    }
  });

  // 移除当前页未选中且历史选中的行
  noSelectIds.forEach(id => {
    const index = selectUsers.value.findIndex(item => item[idKey] === id);
    if (index >= 0) {
      selectUsers.value.splice(index, 1);
    }
  });
};

// 关闭续期/详情弹窗
const closeRenewalDialog = () => {
  checkDialog.value = false;
};
</script>

<style scoped>
.content-box {
  padding: 20px;
  box-sizing: border-box;
}
#form .el-select {
  --el-select-width: 150px;
}

.no-success-list {
  max-height: 50vh;
  overflow: auto;
}
</style>
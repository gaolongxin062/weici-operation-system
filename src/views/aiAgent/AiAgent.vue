<template>
  <div class="page define-page">
    <div class="page-title" id="page-title">
      <h4>作文批改权限开通管理</h4>
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
      <el-form-item label="状态">
        <el-select
          v-model="formData.state"
          placeholder="请选择"
          clearable
        >
        <el-option
          v-for="item in stateList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
        </el-select>
      </el-form-item>
      <el-form-item label="学校">
        <el-input class="search-input" clearable placeholder="请输入搜索学校" v-model="formData.school">
        </el-input>
      </el-form-item>
      <el-form-item label="账号">
        <el-input class="search-input" clearable placeholder="请输入搜索账号" v-model="formData.user_code">
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
      <!-- <el-form-item v-if="delayPower">
        <el-button type="success" @click="batchRenewal">批量续期</el-button>
      </el-form-item> -->
    </el-form>

    <MemberSet v-if="addDialog" @cancelDialog="closeAddDialog" @saveDialog="addMember" pageFrom="Ai"></MemberSet>
    <MemberSet v-if="editDialog" :isEdit="true" :row="rowInfo" pageFrom="Ai" @cancelDialog="closeEditDialog"
      @saveDialog="editMemberInfo"></MemberSet>
    <MemberSet v-if="renewalDialog" :isRenewal="true" pageFrom="Ai" :row="selectUsers" @cancelDialog="closeRenewalDialog"
      @saveDialog="editRenewalInfo"></MemberSet>

    <el-table :data="dataList" class="table-info" v-loading="loading" header-cell-class-name="header_row_class" style="width: 100%" stripe
      element-loading-text="拼命加载中，主人请稍后..." :max-height="screenHeight"
      ref="multipleTable"
      @select="selectionChange"
      @select-all="selectionChange"
      >
      <!-- <el-table-column
              type="selection"
              width="55">
            </el-table-column> -->
      <el-table-column width="80" align="center" label="序号">
        <template #default="scope">
          <div>{{ showIndex(scope.$index) }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="user_code" label="账号" min-width="120px" />
      <!-- <el-table-column width="80" align="center" label="体验天数">
        <template #default="scope">
          <div>{{ scope.row.trial_date }}天</div>
        </template>
      </el-table-column> -->
      <el-table-column width="100" align="center" label="状态">
        <template #default="scope">
          <div>{{ dealStateTitle(scope.row.state) }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="trial_start_time" label="开始时间" min-width="100px" />
      <el-table-column prop="trial_end_time" label="结束时间" min-width="100px" />
      <el-table-column prop="name" label="姓名" min-width />
      <el-table-column prop="new_province" label="省"  min-width="130px" />
      <el-table-column prop="new_city" label="市"  min-width="130px"  />
      <el-table-column prop="new_county" label="区县"  min-width="230px" />
      <el-table-column prop="new_school" label="学校" min-width="330px" />
      <el-table-column prop="province" label="认证省"  min-width="130px" />
      <el-table-column prop="city" label="认证市"  min-width="130px"  />
      <el-table-column prop="county" label="认证区县"  min-width="230px"  />
      <el-table-column prop="school" label="认证学校"  min-width="330px"  />
      <el-table-column label="停用标记" min-width="100px" >
        <template #default="scope">
          <div>{{ (scope.row.stop_flag === 1 ? '停用' : '正常') }}</div>
        </template>
      </el-table-column>
      <el-table-column label="用户类型" min-width="100px" >
        <template #default="scope">
          <div>{{ (scope.row.user_type === 1 ? '体验用户' : '付费用户') }}</div>
        </template>
      </el-table-column>
      <el-table-column label="用户归属" min-width="100px" >
        <template #default="scope">
          <div>{{ dealUserSourceTitle(scope.row.user_source) }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="maker_name" label="创建人" min-width="160px" />
      <el-table-column prop="make_date" label="创建日期" min-width="160px" />
      <el-table-column prop="modifier_name" label="修改人" min-width="160px" />
      <el-table-column prop="modify_date" label="修改日期" min-width="160px" />


      <el-table-column label="操作" fixed="right"  min-width="160px" v-if="deletePower || editPower">
        <template #default="scope">
          <!-- 只有体验中的才显示 -->
          <el-button class="button-style" link type="primary" @click="editUser(scope.row)" v-if="editPower && scope.row.state === 1">
            编辑
          </el-button>
           <el-button class="button-style" link type="primary" v-else style="color: transparent;">
            编辑
          </el-button>
          <!-- 只有体验用户才显示 -->
          <el-button class="button-style" link type="danger" @click="delCurrentMember(scope.row)" v-if="deletePower && scope.row.user_type === 1">
            删除
          </el-button>
          <el-button class="button-style" link type="primary" v-if="scope.row.is_power === 0" @click="certification(scope.row)">
            认证
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination style="color: #666666;margin: 20px 0 0 20px;" v-show="total > 0"
      @current-change="handleCurrentChange" :current-page="pageIndex" :page-size="pageSize"
      layout="total, prev, pager, next" prev-text="上一页" next-text="下一页" :total="total">
    </el-pagination>
    </div>
  <el-dialog v-model="dialogVisible" title="提示" width="800" :show-close="false" :close-on-click-modal="false" append-to-body>
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

  <!-- 认证弹窗 -->
  <CertificationSet v-if="dialogCertification" @cancelTeaching="cancelTeaching" @saveTeaching="saveTeaching" :userCode="userCode"></CertificationSet>
  </div>
</template>
<script setup>
import { ref, onMounted, nextTick } from 'vue';
import aiAgentService from '@/service/AiAgentService.js';
import basicService from '@/service/BasicService.js';
import AiAgentService from '@/service/AiAgentService';
import MemberSet from '@/components/aiagent/MemberSet';
import CertificationSet from '@/components/CertificationSet';
import { useVocabularyStore } from '@/store/vocabulary';
import { ElMessage, ElMessageBox } from 'element-plus'
import { useScreenHeight } from '@/hooks/useScreenHeight.js';
const { screenHeight } = useScreenHeight();
let vocabularyStore = useVocabularyStore();
let loading = ref(false) // 加载标记
let total = ref(0)
let pageIndex = ref(1)
let pageSize = ref(10)
let stateList = ref([
  {
    id: 1,
    name: '体验中'
  },
  {
    id: 2,
    name: '已过期'
  },
  // {
  //   id: 3,
  //   name: '待启用'
  // }
]) // 状态列表
let formData = ref({
  province_id: '', // 省份
  city_id: '', // 城市
  county_id: '', // 区域
  sate: '', // 状态
  school: '', // 学校
  user_code: '', // 账户
}) // 表单内容
let unChangeFormData = ref({
  province_id: '', // 省份
  city_id: '', // 城市
  county_id: '', // 区域
  sate: '', // 状态
  school: '', // 学校
  user_code: '', // 账户
}) // 不变的表单内容
let provinceData = ref([]) // 省份
let cityData = ref([]) // 城市
let areaData = ref([]) // 区域
let dataList = ref([]) // 会员体验列表

let addDialog = ref(false) // 新增会员体验弹框
let editDialog = ref(false) // 编辑会员体验弹框
let rowInfo = ref(null) // 当前点击的内容的详情
let setConfig = ref(null) // 用户新增或修改的详情
let addPower = ref(false) // 用户是否有增加操作权限
let editPower = ref(false) // 用户是否有编辑操作权限
let deletePower = ref(false) // 用户是否有删除操作权限
let isSaveError = ref(false) // 数据库当前是否正在发布数据，如果正在发布数据，则不能保存成功，则后续逻辑不执行
let dialogVisible = ref(false) // 未开通账户弹框
let noSuccessInfo = ref(null) // 为开通成功的信息
let delayPower = ref(false) // 是否有批量续期权利
let renewalDialog = ref(false) // 批量续期弹框
// 表格选中逻辑
let multipleSelection = ref([])
let selectUsers = ref([])
let dataIdKey = ref('id')
let multipleTable = ref(null)
let dialogCertification = ref(false) // 认证弹窗
let userCode = ref('') // 用户输入得账号
onMounted(() => {
  getUserPower() // 获取用户权限列表
  getProvinceList() // 获取省份
  initMemberList() // 获取会员体验列表
  // 设置页面展示高度
  window.addEventListener('resize', updateScreenHeight)
  updateScreenHeight()
})
async function onSubmit() {
  pageIndex.value = 1 // 重置页码
  unChangeFormData.value = JSON.parse(JSON.stringify(formData.value)) // 保存当前的查询条件
  await initMemberList()
  nextTick(() => {
    setSelectRow()
  })
} // 点击搜索按钮获取会员体验列表
async function onReset() {
  // 重置所有筛选条件
  formData.value = {
    province_id: '', // 省份
    city_id: '', // 城市
    county_id: '', // 区域
    sate: '', // 状态
    school: '', // 状态
    user_code: '', // 账户
  }
  unChangeFormData.value = JSON.parse(JSON.stringify(formData.value)) // 保存当前的查询条件
  pageIndex.value = 1 // 重置页码
  await initMemberList()
  nextTick(() => {
    setSelectRow()
  })
} // 点击重置按钮获取会员体验列表
async function handleCurrentChange(page) { // 切换下一页
  pageIndex.value = page
  await initMemberList()
  nextTick(() => {
    setSelectRow()
  })
} // 点击分页获取会员体验
function getUserPower() {
  return basicService.getPower(
    vocabularyStore.user_name,
    vocabularyStore.session,
  )
    .then((res) => {
      // console.log(res)
      if (res.data.findIndex(item => item.menu_index == 'ai_agent_manage_add') !== -1) addPower.value = true
      if (res.data.findIndex(item => item.menu_index == 'ai_agent_manage_edit') !== -1) editPower.value = true
      if (res.data.findIndex(item => item.menu_index == 'ai_agent_manage_delete') !== -1) deletePower.value = true
      if (res.data.findIndex(item => item.menu_index == 'ai_agent_manage_dealy_time') !== -1) delayPower.value = true
    })
    .catch((error) => {
      console.log(error)
    })
    .finally(() => {
      loading.value = false
    })
} // 获取用户权限
function initMemberList() {
  loading.value = true
  let params = dealSearchParams()
  return AiAgentService.getCompositionList(params)
    .then((res) => {
      console.log(res)
      dataList.value = res.data
      total.value = res.total
    })
    .catch((error) => {
      console.log(error)
    })
    .finally(() => {
      loading.value = false
    })
}  // 获取教师体验开通列表
function dealSearchParams() {
  let params = {
    user_name: vocabularyStore.user_name,
    session: vocabularyStore.session,
    page_index: pageIndex.value,
    page_size: pageSize.value
  }
  // 如果输入了省
  params = mergeObjects(params, unChangeFormData.value.province_id, 'province_id')
  // 如果输入了市
  params = mergeObjects(params, unChangeFormData.value.city_id, 'city_id')
  // 如果输入了县
  params = mergeObjects(params, unChangeFormData.value.county_id, 'county_id')
  // 如果输入了状态
  params = mergeObjects(params, unChangeFormData.value.state, 'state')
  // 如果输入了学校
  params = mergeObjects(params, unChangeFormData.value.school, 'school')
  // 如果输入了账号
  params = mergeObjects(params, unChangeFormData.value.user_code, 'user_code')

  return params
} // 处理搜索接口参数
function mergeObjects(baseObj, conditionObj, key) {
  // baseObj总的对象
  // conditionObj判断当前内容是否存在
  // key，接口传参时使用的字段
  return {
    ...baseObj,
    ...(conditionObj && { [key]: conditionObj })
  };
} // 如果当前条件有，则添加到总的对象中
function getProvinceList () {
  let params = {
    user_name: vocabularyStore.user_name,
    session: vocabularyStore.session
  }
  return aiAgentService.getProvincesList(params)
    .then((res) => {
      if (res.result_code === 200) {
        provinceData.value = res.list
      }
  }).catch((error) => {
    console.log(error)
  })
} // 获取省份列表
function getCityList () {
  let params = {
    user_name: vocabularyStore.user_name,
    session: vocabularyStore.session,
    province_id: formData.value.province_id
  }
  return aiAgentService.getAiCityList(params)
    .then((res) => {
      if (res.result_code === 200) {
        cityData.value = res.list
      }
  }).catch((error) => {
    console.log(error)
  })
} // 获取市列表
function changeProvince(val) {
  // console.log(val)
  formData.value.city_id = '' // 清空市的id
  formData.value.county_id = '' // 清空县的id
  // 如果清空了选择的省份，则清空原来的市和县的数据列表
  if (val === undefined) { 
    cityData.value = []
    areaData.value = []
  } else { // 如果选择了某个具体的省，则获取该省下面的市数据
    getCityList()
  }
} // 切换省份
function changeCity (val) {
  console.log(val)
  formData.value.county_id = '' // 清空县的id
  if (val === undefined) { 
    areaData.value = []
  } else { // 如果选择了某个具体的市，则获取该市下面的县区数据
    getAreaList()
  }
}  // 切换城市
function getAreaList () {
  let params = {
    user_name: vocabularyStore.user_name,
    session: vocabularyStore.session,
    city_id: formData.value.city_id
  }
  return aiAgentService.getAiCountyList(params)
    .then((res) => {
      if (res.result_code === 200) {
        areaData.value = res.list
      }
  }).catch((error) => {
    console.log(error)
  })
} // 获取区县
function updateScreenHeight () {
  var element = document.getElementById('form');
  if (element) {
    var rect = element.getBoundingClientRect();
    var formHeight = rect.height // form表单的高
  }
    
   var pageHeight = 80 // 分页高度
   var menuHeight = 64 // 导航栏高度
   screenHeight.value = window.innerHeight - formHeight - pageHeight - menuHeight - 100
} // 动态设置表格高度
function newlyAdded() {
  addDialog.value = true
} // 打开新增弹框
function closeAddDialog() {
  addDialog.value = false
} // 取消新增
async function addMember(content) {
  console.log(content)
  setConfig.value = content // 保存设置
  userCode.value = content.user_codes // 用户输入得账号
  await saveMember() // 保存设置
  // 如果当前正在发布，则未保存成功，需要阻止后续操作
  if (isSaveError.value) {
    isSaveError.value = false // 重置标记
    return
  }
  pageIndex.value = 1 // 重置页码
  initMemberList() // 会员体验列表
} // 新增会员体验
function saveMember() {
  let params = dealSaveOrUpdateParams() // 获取接口参数
  console.log(params)
  return AiAgentService.saveComposition(params)
    .then((res) => {
      // 所有账号都在有效期内，无法开通
      if (res.result_code === 1004) {
        addDialog.value = false // 关闭弹框
        isSaveError.value = true
        noSuccessInfo.value = res
        dialogVisible.value = true
      } else if (res.result_code === 1005) { // 部分开通成功或者全部成功 1007全部 1005部分
        addDialog.value = false // 关闭弹框
        noSuccessInfo.value = res
        dialogVisible.value = true
      } else if (res.result_code === 1007) {
        // 部分开通成功或者全部成功 1007全部 1005部分
        addDialog.value = false // 关闭弹框
        ElMessage({
          message: res.description,
          type: 'success',
          duration: 1000
        })
      } else if (res.result_code === 940) { // 未认证
        dialogCertification.value = true // 教师认证弹窗
      } else {
        addDialog.value = false // 关闭弹框
        isSaveError.value = true
        ElMessage({
          message: '新建失败，请重试',
          type: 'error',
          duration: 1000
        })
      }
    })
    .catch((error) => {
      console.log(error)
    })
} // 新增会员体验信息
function cancelTeaching () { // 取消教师认证
  dialogCertification.value = false // 教师认证弹窗
}
function saveTeaching () { // 保存教师认证
  initMemberList() // 会员体验列表
  cancelTeaching()
}
function dealSaveOrUpdateParams(isEdit = false) {
  console.log(setConfig.value)
  let params = {
    user_name: vocabularyStore.user_name,
    session: vocabularyStore.session,
    trial_end_time: setConfig.value.trial_end_time, // 体验结束时间
    // trial_date: setConfig.value.trial_date, // 体验时间
    user_codes: setConfig.value.user_codes, // 老师账号
    stop_flag: setConfig.value.stop_flag, // 停用标记
    user_source: setConfig.value.user_source, // 用户来源
    user_type: setConfig.value.user_type, // 用户类型
    use_info: JSON.stringify(setConfig.value.use_info), // 使用次数
    province_id: setConfig.value.province_id,
    city_id: setConfig.value.city_id,
    county_id: setConfig.value.county_id,
    school_id: setConfig.value.school_id,
  }

  // 如果是编辑的话，需要添加id
  console.log(params)
  if (isEdit) {
    params = {
      ...params,
      id: setConfig.value.id
    }
  }
  return params
} // 处理添加标签接口参数
function editUser(row) {
  editDialog.value = true
  rowInfo.value = row
} // 编辑会员体验
function closeEditDialog() {
  editDialog.value = false
} // 取消修改
async function editMemberInfo(content) {
  console.log(content)
  setConfig.value = content // 保存设置
  editDialog.value = false // 关闭弹框
  await updateMember() // 保存设置
  // 如果当前正在发布，则未保存成功，需要阻止后续操作
  if (isSaveError.value) {
    isSaveError.value = false // 重置标记
    return
  }
  // 检查是否需要调整页码
  if (dataList.value.length === 0 && pageIndex.value > 1) {
    pageIndex.value -= 1
  }
  initMemberList() // 会员体验列表
} // 修改会员体验
function updateMember() {
  let params = dealSaveOrUpdateParams(true) // 获取接口参数
  console.log(params)
  return AiAgentService.saveComposition(params)
    .then((res) => {
      // 如果当前正在发布数据，则更改标记，防止后续操作
      if (res.result_code === 200) {
         ElMessage({
          message: '编辑成功',
          type: 'success',
          duration: 1000
        })
      } else {
        isSaveError.value = true
      }
    })
    .catch((error) => {
      console.log(error)
    })
} // 修改会员体验信息
function certification (row) { // 认证
  dialogCertification.value = true // 教师认证弹窗
  userCode.value = row.user_code // 用户输入得账号
}
function delCurrentMember(row) {
  // 判断当前会员体验是否被引用到书籍
  rowInfo.value = row // 保存当前点击内容
  ElMessageBox.confirm('确定删除该内容吗？', '提示信息', {
    confirmButtonText: '确定',
    confirmButtonClass: 'button-confirm',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // console.log()
    deleteMember() // 调用删除的逻辑
  }).catch(() => {
  })
} // 删除会员体验
async function deleteMember() {
  await deleteMemberApi() // 调用删除接口
  // 检查是否需要调整页码
  if (dataList.value.length === 0 && pageIndex.value > 1) {
    pageIndex.value -= 1
  }
  initMemberList() // 会员体验列表
} // 修改会员体验
function deleteMemberApi() {
  let params = {
    user_name: vocabularyStore.user_name,
    session: vocabularyStore.session,
    id: rowInfo.value.id
  }
  return AiAgentService.removeComposition(params)
    .then((res) => {
      if (res.result_code === 200) {
        ElMessage({
          message: '删除成功',
          type: 'success',
          duration: 1000
        })
      }
    }).catch((error) => {
      console.log(error)
    })
} // 删除会员体验的接口
function showIndex(index) {
  return index + 1 + (pageIndex.value - 1) * pageSize.value
} // 序号
// 状态文案
function dealStateTitle (state) {
  switch (+state) {
    case 1:
      return '体验中'
    case 2:
      return '已过期'
    case 3:
      return '待启用'
  }
}
// 用户归属
function dealUserSourceTitle (user_source) {
  switch (+user_source) {
    case 0:
      return '正常用户'
    case 1:
      return '维学'
    case 2:
      return '维克多发行'
    case 3:
      return '经销商'
    case 4:
      return '维克多编辑'
  }
}
// 表格选中逻辑
function selectionChange (val) {
  multipleSelection.value = val
  memorySelect()
}
function setSelectRow () {
  let idKey = dataIdKey.value
  if (!selectUsers.value.length || selectUsers.value.length <= 0) {
    return
  }
  const selectAllUserIds = selectUsers.value.map(item => item[idKey])
  multipleTable.value.clearSelection()
  dataList.value.forEach(item => {
    const isSelect = selectAllUserIds.includes(item[idKey])
    if (isSelect) {
      multipleTable.value.toggleRowSelection(item, true)
    }
  })
} // 设置选中方法
function memorySelect () {
  // 标识当前行的唯一键的名称
  let idKey = dataIdKey.value
  // let self = this
  // 如果总记忆中还没有选择的数据，那么就直接取当前页选中的数据，不需要后面一系列计算
  if (selectUsers.value.length <= 0) {
    selectUsers.value = multipleSelection.value
    return
  }
  // 总选择里面的key集合
  let selectAllIds = []
  selectUsers.value.forEach(row => selectAllIds.push(row[idKey]))
  let selectIds = []
  // 获取当前页选中id
  multipleSelection.value.forEach(row => {
    selectIds.push(row[idKey])
    // 如果总选择里面不包含当前页选中的数据，那么就假如到总选择里面
    if (selectAllIds.indexOf(row[idKey]) < 0) selectUsers.value.push(row)
  })
  let noSelectIds = []
  // 得到当前页没有选中的id
  dataList.value.forEach(row => {
    if (selectIds.indexOf(row[idKey]) < 0) noSelectIds.push(row[idKey])
  })
  noSelectIds.forEach(id => {
    if (selectAllIds.indexOf(id) >= 0) {
      for (let i = 0; i < selectUsers.value.length; i++) {
        if (selectUsers.value[i][idKey] === id) {
          // 如果总选择中有未被选中的，那么删除这条
          selectUsers.value.splice(i, 1)
          break
        }
      }
    }
  })
} // 记住选中方法
// 批量续期
// function batchRenewal() {
//   console.log(selectUsers.value)
//   // 如果没有选中续期的内容
//   if (selectUsers.value.length === 0) {
//     ElMessage({
//       type: 'error',
//       message: '请先选择需要续期内容'
//     })
//     return
//   }
//   // 展开弹框
//   renewalDialog.value = true
// }
function closeRenewalDialog() {
  renewalDialog.value = false
} // 取消批量续期
async function editRenewalInfo(content) {
  console.log(content)
  setConfig.value = content // 保存设置
  renewalDialog.value = false // 关闭弹框
  await batchComposition() // 保存批量续期
  // 如果当前正在发布，则未保存成功，需要阻止后续操作
  if (isSaveError.value) {
    isSaveError.value = false // 重置标记
    return
  }
  // 检查是否需要调整页码
  if (dataList.value.length === 0 && pageIndex.value > 1) {
    pageIndex.value -= 1
  }
  initMemberList() // 会员体验列表
} // 确认批量续期
function batchComposition() {
  let params = {
    user_name: vocabularyStore.user_name,
    session: vocabularyStore.session,
    trial_date: setConfig.value.trial_date, // 体验时间
    teacher_codes: setConfig.value.user_codes, // 老师账号
  }
  console.log(params)
  return AiAgentService.batchComposition(params)
    .then((res) => {
      // 如果当前正在发布数据，则更改标记，防止后续操作
      if (res.result_code === 200) {
         ElMessage({
          message: '批量续期成功',
          type: 'success',
          duration: 1000
         })
        selectUsers.value = [] // 清空选中
      } else {
        isSaveError.value = true
      }
    })
    .catch((error) => {
      console.log(error)
    })
} // 批量续期接口
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

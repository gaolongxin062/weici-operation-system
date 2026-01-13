<template>
  <el-dialog v-model="dialogVisible" title="选择账号" width="1000" @close="cancelDialog" :show-close="false" append-to-body>
  <div class="page define-page">
    <div class="content-box">
      <el-form :inline="true" id="form" :model="formData" size="large" label-width="60px" @submit.prevent>
      <el-form-item label="省份">
        <el-select
          filterable
          v-model="formData.province_id"
          placeholder="请选择"
          @change="changeProvince"
          clearable
        >
        <el-option
          v-for="item in provinceData"
          :key="item.id"
          :label="item.name || item.province"
          :value="item.id"
        />
        </el-select>
      </el-form-item>
      <el-form-item label="市">
        <el-select
          filterable
          v-model="formData.city_id"
          placeholder="请选择"
          @change="changeCity"
          clearable
        >
        <el-option
          v-for="item in cityData"
          :key="item.id"
          :label="item.name || item.city"
          :value="item.id"
        />
        </el-select>
      </el-form-item>
      <el-form-item label="区县">
        <el-select
          filterable
          v-model="formData.county_id"
          placeholder="请选择"
          @change="changeArea"
          clearable
        >
        <el-option
          v-for="item in areaData"
          :key="item.id"
          :label="item.name || item.county"
          :value="item.id"
        />
        </el-select>
      </el-form-item>
      <el-form-item label="学校" v-if="pageFrom !== 'Ai'">
        <el-input class="search-input" clearable placeholder="请输入学校" v-model="formData.school">
        </el-input>
      </el-form-item>

      <el-form-item label="学校" v-else>
        <el-select
          v-model="formData.school"
          filterable
          placeholder="请选择/搜索所在学校名称"
          clearable
          @change="changeSchool"
        >
          <el-option
            v-for="item in schooleList"
            :key="item.school_id"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="账号">
        <el-input class="search-input" clearable placeholder="请输入账号" v-model="formData.user_code">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>


    <el-table 
      :data="dataList" 
      class="table-info" 
      v-loading="loading" 
      header-cell-class-name="header_row_class" 
      style="width: 100%" stripe
      element-loading-text="拼命加载中，主人请稍后..." 
      ref="multipleTable"
      @select="selectionChange"
      @select-all="selectionChange"
      :empty-text="pageFrom === 'Ai' ? '请选择学校筛查教师列表' : '暂无数据'"
      >
      <el-table-column
              type="selection"
              width="55">
            </el-table-column>
      <!-- <el-table-column width="80" align="center" label="序号">
        <template #default="scope">
          <div>{{ showIndex(scope.$index) }}</div>
        </template>
      </el-table-column> -->
      <el-table-column prop="province" label="省" min-width />
      <el-table-column prop="city" label="市" min-width />
      <el-table-column prop="county" label="区县" min-width />
      <el-table-column prop="school" label="学校" min-width />
      <el-table-column prop="phone" label="账号" min-width />
      <el-table-column prop="name" label="姓名" min-width />

    </el-table>
    <el-pagination style="color: #666666;margin: 20px 0 0 20px;" v-show="total > 0"
      @current-change="handleCurrentChange" :current-page="pageIndex" :page-size="pageSize"
      layout="total, prev, pager, next" prev-text="上一页" next-text="下一页" :total="total">
    </el-pagination>

    </div>
  </div>

  <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancelDialog">取消</el-button>
        <el-button type="primary" :disabled="!selectStudent.length" @click="saveDialog">
          保存
        </el-button>
      </div>
    </template>
</el-dialog>
</template>
<script setup>
import { ref, onMounted, defineEmits, nextTick, defineProps } from 'vue';
import MemberService from '@/service/MemberService';
import { useVocabularyStore } from '@/store/vocabulary';
// import { ElMessage } from 'element-plus';
let vocabularyStore = useVocabularyStore();
let loading = ref(false) // 加载标记
// let screenHeight = ref(0)
let total = ref(0)
let pageIndex = ref(1)
let pageSize = ref(10)
let formData = ref({
  province_id: '', // 省份
  city_id: '', // 城市
  county_id: '', // 区域
  school: '', // 状态
  user_code: '', // 状态
}) // 表单内容
let provinceData = ref([]) // 省份
let cityData = ref([]) // 城市
let areaData = ref([]) // 区域
let dataList = ref([]) // 资源列表
let dialogVisible = ref(true) // 弹框显隐
let multipleSelection = ref([])
let selectStudent = ref([])
let dataIdKey = ref('id')
let multipleTable = ref(null)
const schooleList = ref([])
let emit = defineEmits([
    'cancelDialog',
    'saveDialog',
  ])
let props = defineProps({
  pageFrom: {
    type: String,
    default: ''  // Ai-作文批改权限开通页面
  }
})
onMounted(async () => {
  await getProvinceList() // 获取省份
  nextTick(() => {
    setSelectRow()
  })

  if(props.pageFrom === 'Ai') {
    getSchoole()
  } else {
    await initMemberList() // 获取资源列表
  }
})
async function onSubmit() {
  pageIndex.value = 1 // 重置页码
  await initMemberList()
  nextTick(() => {
    setSelectRow()
  })
} // 点击搜索按钮获取资源列表
const changeSchool = () => { 
  if (formData.value.school){
    initMemberList()
  } else {
    dataList.value = []
    total.value = 0
  }
}
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
  await initMemberList()
  nextTick(() => {
    setSelectRow()
  })
} // 点击重置按钮获取资源列表
async function handleCurrentChange(page) { // 切换下一页
  pageIndex.value = page
  await initMemberList()
  nextTick(() => {
    setSelectRow()
  })
} // 点击分页获取资源

function initMemberList() {
  loading.value = true
  let params = dealSearchParams()
  return (props.pageFrom === 'Ai' ? MemberService.aiGetTeacherList(params) : MemberService.getTeacherList(params))
    .then((res) => {
      console.log(res.data)
      dataList.value = res.list
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
  params = mergeObjects(params, formData.value.province_id, 'province_id')
  // 如果输入了市
  params = mergeObjects(params, formData.value.city_id, 'city_id')
  // 如果输入了县
  params = mergeObjects(params, formData.value.county_id, 'county_id')
  // 如果输入了学校
  params = mergeObjects(params, formData.value.school, 'school')
  // 如果输入了账号
  params = mergeObjects(params, formData.value.user_code, 'user_code')

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
  return (props.pageFrom === 'Ai' ? MemberService.aiGetProvincesList(params) : MemberService.getProvincesList(params))
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
    id: formData.value.province_id
  }
  return (props.pageFrom === 'Ai' ? MemberService.aiGetCityList(params) : MemberService.getCityList(params))
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
    if(props.pageFrom === 'Ai'){
      formData.value.school = ''
      getSchoole()
      changeSchool()
    }
  } else { // 如果选择了某个具体的省，则获取该省下面的市数据
    getCityList()
    if(props.pageFrom === 'Ai'){
      getSchoole()
    }
  }


} // 切换省份
function changeCity (val) {
  console.log(val)
  formData.value.county_id = '' // 清空县的id
  if (val === undefined) { 
    areaData.value = []
    if(props.pageFrom === 'Ai'){
      formData.value.school = ''
      getSchoole()
      changeSchool()
    }
  } else { // 如果选择了某个具体的市，则获取该市下面的县区数据
    getAreaList()
    if(props.pageFrom === 'Ai'){
      getSchoole()
    }
  }
}  // 切换城市

function changeArea (val) {
  if (val === undefined) { 
    if(props.pageFrom === 'Ai'){
      formData.value.school = ''
      getSchoole()
      changeSchool()
    }
  } else { // 如果选择了某个具体的市，则获取该市下面的县区数据
    if(props.pageFrom === 'Ai'){
      getSchoole()
    }
  }
} 


function getAreaList () {
  let params = {
    user_name: vocabularyStore.user_name,
    session: vocabularyStore.session,
    id: formData.value.city_id
  }
  return (props.pageFrom === 'Ai' ? MemberService.aiGetCountyList(params) : MemberService.getCountyList(params))
    .then((res) => {
      if (res.result_code === 200) {
        areaData.value = res.list
      }
  }).catch((error) => {
    console.log(error)
  })
} // 获取区县
// function showIndex(index) {
//   return index + 1 + (pageIndex.value - 1) * pageSize.value
// } // 序号

// 获取学校列表---只有作文批改调用此组件才调用此接口  pageFrom==='Ai'
const getSchoole = async () => {
  const params = {
    user_name: vocabularyStore.user_name,
    session: vocabularyStore.session,
    province_id: formData.value.province_id,
    city_id: formData.value.city_id,
    county_id: formData.value.county_id,
  }

  const res = await MemberService.apiAiUserSchool(params)
  console.log('xxxxxxxxxxxxxxxx',res);
  if(res.result_code === 200){
    schooleList.value = res.data
  } else {
    schooleList.value = []
  }
}
function cancelDialog () {
  emit('cancelDialog')
} // 点击取消
function saveDialog () {
  let userCodeList = selectStudent.value.map(item => item.phone)
  emit('saveDialog', userCodeList)
  // formRef.value.validate((valid) => {
  //   console.log(valid)
  //   if (valid) {
  //     let config = getConfig() // 获取当前的设置
  //     // 查看内容是否全部为空白字符
  //     if (config.accountNumber.length === 0) {
  //       ElMessage({
  //         type: 'error',
  //         message: '账号名称不能全部为空白字符'
  //       })
  //       return
  //     }
  //     emit('saveDialog', config)
  //   } else {
  //     return false
  //   }
  // })
} // 点击保存
function selectionChange (val) {
  multipleSelection.value = val
  memorySelect()
}
function setSelectRow () {
  let idKey = dataIdKey.value
  if (!selectStudent.value.length || selectStudent.value.length <= 0) {
    return
  }
  const selectAllStudentIds = selectStudent.value.map(item => item[idKey])
  multipleTable.value.clearSelection()
  dataList.value.forEach(item => {
    const isSelect = selectAllStudentIds.includes(item[idKey])
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
  if (selectStudent.value.length <= 0) {
    selectStudent.value = multipleSelection.value
    return
  }
  // 总选择里面的key集合
  let selectAllIds = []
  selectStudent.value.forEach(row => selectAllIds.push(row[idKey]))
  let selectIds = []
  // 获取当前页选中id
  multipleSelection.value.forEach(row => {
    selectIds.push(row[idKey])
    // 如果总选择里面不包含当前页选中的数据，那么就假如到总选择里面
    if (selectAllIds.indexOf(row[idKey]) < 0) selectStudent.value.push(row)
  })
  let noSelectIds = []
  // 得到当前页没有选中的id
  dataList.value.forEach(row => {
    if (selectIds.indexOf(row[idKey]) < 0) noSelectIds.push(row[idKey])
  })
  noSelectIds.forEach(id => {
    if (selectAllIds.indexOf(id) >= 0) {
      for (let i = 0; i < selectStudent.value.length; i++) {
        if (selectStudent.value[i][idKey] === id) {
          // 如果总选择中有未被选中的，那么删除这条
          selectStudent.value.splice(i, 1)
          break
        }
      }
    }
  })
} // 记住选中方法
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

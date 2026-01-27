<template>
  <div class="page" :class="isMobileDevice ? 'mobile-page' : 'computer-page'">
    <div class="page-title" id="page-title">
      <h4>教师认证</h4>
    </div>
    <el-form id="forms" :inline="true" :model="teacherForm" size="large" label-width="80px">
      <div style="display: flex;align-items: center;justify-content: flex-end;">
        <div style="margin-right: 20px;">
          <el-form-item label="手机号">
            <el-input style="width: 220px" 
              class="search-input"
              clearable
              placeholder="请输入内容"
              v-model="teacherForm.phone"
              >
            </el-input>
          </el-form-item>

          <el-form-item label="姓名">
            <el-input style="width: 220px" 
              class="search-input"
              clearable
              placeholder="请输入内容"
              v-model="teacherForm.user_name"
              >
            </el-input>
          </el-form-item>
        
        </div>
        <div>
          <el-form-item>
            <el-button @click="btnSearch">查询</el-button>
          </el-form-item>

          
          <el-form-item>
            <el-button type="primary" @click="btnReset">重置</el-button>
          </el-form-item>
          
          <el-form-item>
            <el-button type="success" @click="btnAdded" v-if="addPower">新增</el-button>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <el-table :data="teacherList" class="table-info" :max-height="screenHeight"
      v-loading="loading" header-cell-class-name="header_row_class" ref="multipleTable"  stripe
      element-loading-text="拼命加载中，主人请稍后...">

      <el-table-column label="产品组">
        <template #default="scope">
          <div class="over-hidden" :title="scope.row.app_group">{{scope.row.app_group}}</div>
        </template>
      </el-table-column>

      <el-table-column label="产品" width="180">
        <template #default="scope">
          <div>{{scope.row.app_name}}</div>
        </template>
      </el-table-column>

      <el-table-column label="手机号" width="120">
        <template #default="scope">
          <div>{{scope.row.phone}}</div>
        </template>
      </el-table-column>

      <el-table-column label="姓名" width="120">
        <template #default="scope">
          <div>{{scope.row.name}}</div>
        </template>
      </el-table-column>

      <el-table-column label="省" width="120">
        <template #default="scope">
          <div>{{scope.row.province}}</div>
        </template>
      </el-table-column>

      <el-table-column label="市" width="120">
        <template #default="scope">
          <div>{{scope.row.city}}</div>
        </template>
      </el-table-column>

      <el-table-column label="区县" width="120">
        <template #default="scope">
          <div>{{scope.row.county}}</div>
        </template>
      </el-table-column>

      <el-table-column label="学校" width="220">
        <template #default="scope">
          <div>{{scope.row.school}}</div>
        </template>
      </el-table-column>

      
      <el-table-column label="学校类型">
        <template #default="scope">
          <div>{{scope.row.school_type}}</div>
        </template>
      </el-table-column>
      
      <el-table-column label="认证状态">
        <template #default="scope">
          <div v-if="scope.row.status === 0">{{'未认证'}}</div>
          <div style="color: #00b400;" v-else>{{'已认证'}}</div>
        </template>
      </el-table-column>
      

      <el-table-column label="认证日期" width="200">
        <template #default="scope">
          <div class="over-hidden" :title="scope.row.make_date">{{scope.row.make_date ? scope.row.make_date : '-'}}</div>
        </template>
      </el-table-column>

      <el-table-column  label="操作"  fixed="right" width="240">
        <template #default="scope">
            <el-button class="button-style" link type="primary" @click="edit(scope.row)" v-if="editPower">
              编辑
            </el-button>
            <el-button class="button-style" link type="danger"  @click="del(scope.row)" v-if="deletePower">
              删除
            </el-button>
            <el-button class="button-style" link type="primary"  @click="see(scope.row)">
              查看
            </el-button>
            <el-button class="button-style" link type="primary"  @click="certification(scope.row)" v-if="certificationPower">
              {{scope.row.status === 0 ? '认证' : '取消认证'}}
            </el-button>
        </template>
      </el-table-column>

    </el-table>
    <el-pagination style="color: #666666;margin: 20px 0 0 20px;" v-show="total > 0" @current-change="handleCurrentChange" :current-page="pageIndex" :page-size="pageSize" layout="total, prev, pager, next" prev-text="上一页" next-text="下一页" :total="total">
    </el-pagination>


    <div class="auth-dialog">
      <el-dialog
        title="教师认证信息"
        @close="cancelTeaching"
        v-model="dialogTeacher"
        width='500'
        top="1vh">

          <el-form id="form" ref="formref" :inline="true" :model="form" size="large" :rules="rulesTeaching" class="form-box" label-width="100px" >

            <div>
              <el-form-item label="产品：" prop="product" label-width="130px" >
                <el-select v-model="form.product" placeholder="请选择产品" :disabled="btnTypes === 'see'">
                  <el-option
                      v-for="item in productList"
                      :key="item.id"
                      :label="item.app_name"
                      :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>

            <div>
              <el-form-item label="手机号:"  prop="userCode" label-width="130px">
                <el-input
                  :disabled="btnTypes === 'see'"
                  class="search-input"
                  clearable
                  maxlength="11"  
                  placeholder="请输入您的11位手机号"
                  v-model="form.userCode">
                </el-input>
              </el-form-item>
            </div>

            <div>
              <el-form-item label="姓名:"  prop="userName" label-width="130px">
                <el-input
                  :disabled="btnTypes === 'see'"
                  class="search-input"
                  clearable
                  @blur="handleBlur" 
                  maxlength="8"  
                  placeholder="请输入您的真实姓名"
                  v-model="form.userName">
                </el-input>
              </el-form-item>
            </div>

            <div>
              <el-form-item label="省:"   prop="province" label-width="130px">
                <el-select v-model="form.province" placeholder="请选择学校所在省份"  @change="changeProvince" :disabled="btnTypes === 'see'">
                  <el-option
                      v-for="item in provinceList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>

            <div>
              <el-form-item label="市:"  prop="city" label-width="130px">
                <el-select v-model="form.city" placeholder="请选择学校所在市"  @change="changeCity" :disabled="btnTypes === 'see'">
                  <el-option
                      v-for="item in cityList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>

            <div>
              <el-form-item label="区/县:"  prop="county" label-width="130px">
                <el-select v-model="form.county" placeholder="请选择学校所在区/县" @change="changeCounty" :disabled="btnTypes === 'see'">
                  <el-option
                      v-for="item in countyList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
          
            <div  style="position:relative;" >
              <el-form-item label="学校名称:" prop="school" label-width="130px">
                <el-select
                  :disabled="btnTypes === 'see'"
                  v-model="form.school"
                  filterable
                  placeholder="请选择/搜索所在学校名称"
                  clearable
                >
                  <el-option
                    v-for="item in schoolList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </div>

            <div>
              <el-form-item label="学校类型:"  prop="school_type" label-width="130px">
                <el-select v-model="form.school_type" placeholder="请选择学校类型" :disabled="btnTypes === 'see'">
                  <el-option
                      v-for="item in schoolTypeList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>

            <el-form-item label="认证：" label-width="130px">
              <el-checkbox v-model="form.status" :disabled="btnTypes === 'see'"/>
            </el-form-item>

            <el-form-item label="允许多设备登录" label-width="130px">
              <el-checkbox v-model="form.login_multi" :disabled="btnTypes === 'see'"/>
            </el-form-item>

            <div style="text-align: center; margin: 0 auto;">
              <el-form-item>
                <span>
                  <el-button @click="cancelTeaching">取消</el-button>
                  <el-button type="primary" @click="makeSureForm">保存</el-button>
                </span>
              </el-form-item>
            </div>
          </el-form>
      </el-dialog>
    </div>


  </div>
</template>

<script setup>
  import { ref, onMounted, reactive, nextTick} from 'vue';
  import memberApi from '@/service/MemberService.js';
  import ReviewService from '@/service/ReviewService.js';
  import basicService from '@/service/BasicService.js';
  import { useVocabularyStore } from '@/store/vocabulary';
  import { useScreenHeight } from '@/hooks/useScreenHeight.js';
  const { screenHeight, isMobileDevice } = useScreenHeight();
  import { ElMessage, ElMessageBox, ElLoading} from 'element-plus'
  let vocabularyStore = useVocabularyStore();
  let teacherForm = reactive({
    phone: '', // 手机号
    user_name: '' // 姓名
  })
  // 弹窗里面得form
  let form = reactive({
    product: '', // 产品
    userCode: '', // 账号
    userName: '', // 姓名
    province: '', // 省
    city: '', // 市
    county: '', // 区县
    school:'', // 学校
    school_type: '', // 学校类型
    status: true, // 认证
    login_multi: true // 允许多设备登录
  })
  let productList = ref([
  ]) // 产品
  let schoolTypeList = ref([
    {
      id: 1,
      name: '寄宿'
    },
    {
      id: 2,
      name: '走读'
    },
    {
      id: 3,
      name: '混合'
    }
  ])
  let pageIndex = ref(1)
  let pageSize = ref(10) 
  let total = ref(0)
  let teacherList = ref([
  ]) // 表格数据
  let loading = ref(false)
  let teacherIds = ref(0)
  let formref = ref()
  let dialogTeacher = ref(false) // 新增弹窗
  var validatePhone = (rule, value, callback) => {  
    var reg = /^1\d{10}$/;  
    if (!reg.test(value)) {  
      callback(new Error('手机号格式不正确, 请输入11位手机号'));  
    } else {  
      callback();  
    }  
  }
  let rulesTeaching = ref({
    userCode: [
      { required: true, message: '请输入您的11位手机号！', trigger: 'blur' },
      { validator: validatePhone, trigger: 'blur'}
    ],
    product: [
      { required: true, message: '请选择产品！', trigger: 'blur' }
    ],
    userName: [
      { required: true, message: '请输入您的真实姓名！', trigger: 'blur' }
    ],
    province: [
      { required: true, message: '请选择学校所在省份！', trigger: 'blur' }
    ],
    city: [
      { required: true, message: '请选择学校所在市！', trigger: 'blur' }
    ],
    county: [
      { required: true, message: '请选择学校所在区/县！', trigger: 'blur' }
    ],
    school: [
      { required: true, message: '请选择所在学校名称！', trigger: 'blur' }
    ],
    school_type: [
      { required: true, message: '请选择学校类型！', trigger: 'blur' }
    ],
  });
  let provinceList = ref([
  ]) // 省
  let cityList = ref([
  ]) // 市
  let countyList = ref([
  ]) // 区县
  let schoolList = ref([
  ]) // 学校
  let btnTypes = ref('add') // see查看  edit编辑  add新增
  let addPower = ref(false) // 用户是否有增加操作权限
  let editPower = ref(false) // 用户是否有编辑操作权限
  let deletePower = ref(false) // 用户是否有删除操作权限
  let certificationPower = ref(false) // 用户是否有认证/取消认证操作权限
  onMounted(() =>{
    getUserPower() // 获取用户权限列表
    getListData() // 表格数据
    getAppList() // 产品列表
  })
  function getUserPower() {
    return basicService.getPower(
      vocabularyStore.user_name,
      vocabularyStore.session,
    )
      .then((res) => {
        // console.log(res)
        if (res.data.findIndex(item => item.menu_index == 'teacher_add') !== -1) addPower.value = true
        if (res.data.findIndex(item => item.menu_index == 'teacher_edit') !== -1) editPower.value = true
        if (res.data.findIndex(item => item.menu_index == 'teacher_dele') !== -1) deletePower.value = true
        if (res.data.findIndex(item => item.menu_index == 'is_certification') !== -1) certificationPower.value = true
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        loading.value = false
      })
  } // 获取用户权限
  function handleCurrentChange (page) { // 切换下一页
    pageIndex.value = page
    getListData() // 表格数据
  }
  function handleBlur () { // 姓名-禁止首尾空格
    form.userName = form.userName.trim()
  }
  function getListData () { // 表格数据
    let params = {
      user_name: vocabularyStore.user_name,
      session: vocabularyStore.session,
      name: teacherForm.user_name,
      phone: teacherForm.phone,
      page_index: pageIndex.value,
      page_size: pageSize.value,
    }
    ReviewService.getTeacherCheckList(params).then((res) => {
      if (res.result_code === 200) {
        teacherList.value = res.list
        total.value = res.total
        if (res.list.length === 0 && pageIndex.value > 1) {
          pageIndex.value = pageIndex.value - 1
          getListData()
        }
      }
    }).catch((error) => {
      console.log(error)
    })
  }
  function getAppList () { // 产品数据
    let params = {
      user_name: vocabularyStore.user_name,
      session: vocabularyStore.session
    }
    ReviewService.getAppList(params).then((res) => {
      if (res.result_code === 200) {
        productList.value = res.list
      }
    }).catch((error) => {
      console.log(error)
    })
  }
  function cancelTeaching () { // 取消输入教师注册信息
    dialogTeacher.value = false
    initFormDefault()
  }
  function initFormDefault () {
    form.product = ''
    form.userCode = ''
    form.userName = ''
    form.province = ''
    form.city = ''
    form.county = ''
    form.school = ''
    form.school_type = ''
    form.status = true
    form.login_multi = true
    cityList.value = []
    provinceList.value = []
    countyList.value = []
    schoolList.value = []
    dialogTeacher.value = false
    formref.value.resetFields()
  }
  function changeProvince () { // 省
    getCityList() // 获取市
    form.city = ''
    form.county = ''
    form.school = ''
  }
  function changeCity () { // 市
    getAreaList() // 获取区县
    form.county = ''
    form.school = ''
  }
  function changeCounty () { // 区县
    form.school = ''
    initGetSchool() // 获取学校
  }
  function getProvinceList () { // 省份
    let params = {
      user_name: vocabularyStore.user_name,
      session: vocabularyStore.session
    }
    memberApi.getProvincesList(params).then((res) => {
      if (res.result_code === 200) {
        provinceList.value = res.list
        if (btnTypes.value === 'add') return
        getCityList()
      }
    }).catch((error) => {
      console.log(error)
    })
  }
  function getCityList () { // 城市
    let params = {
      id: form.province,
      user_name: vocabularyStore.user_name,
      session: vocabularyStore.session
    }
    memberApi.getCityList(params).then((res) => {
      if (res.result_code === 200) {
        cityList.value = res.list
        if (btnTypes.value === 'add' || form.city === '') return
        getAreaList()
      }
    }).catch((error) => {
      console.log(error)
    })
  }
  function getAreaList () { // 区域
    let params = {
      id: form.city,
      user_name: vocabularyStore.user_name,
      session: vocabularyStore.session
    }
    memberApi.getCountyList(params).then((res) => {
      if (res.result_code === 200) {
        countyList.value = res.list
        if (btnTypes.value === 'add' || form.county === '') return
        initGetSchool()
      }
    }).catch((error) => {
      console.log(error)
    })
  }
  function initGetSchool () { // 学校
    let params = {
      user_name: vocabularyStore.user_name,
      session: vocabularyStore.session,
      county_id: form.county
    }
    ReviewService.getSchoolList(params).then((res) => {
      if (res.result_code === 200) {
        // console.log(res)
        schoolList.value = res.list
      }
    }).catch((error) => {
      console.log(error)
    })
  }
  function getCityName () { // 获取认证的城市名字
    return cityList.value.find(item => {
      return item.id === form.city
    }).name
  }
  function getProvinceName () { // 获取认证的省份名字
    return provinceList.value.find(item => {
      return item.id === form.province
    }).name
  }
  function getCountyName () { // 获取认证的区域名字
    return countyList.value.find(item => {
      return item.id === form.county
    }).name
  }
  function getSchoolName () { // 获取认证的学校名字
    return schoolList.value.find(item => {
      return item.id === form.school
    }).name
  }
  function teachingSave () {
    let params = {
      user_name: vocabularyStore.user_name,
      session: vocabularyStore.session,
      product_id: form.product,
      city_id: form.city,
      city_name: getCityName(),
      county_id: form.county,
      county_name: getCountyName(),
      login_multi: form.login_multi === true ? 1 : 0,
      name: form.userName,
      phone: form.userCode,
      province_id: form.province,
      province_name: getProvinceName(),
      school_id: form.school,
      school_name: getSchoolName(),
      school_type: form.school_type === 1 ? '寄宿' : form.school_type === 2 ? '走读' : 3,
      status: form.status === true ? 1 : 0,
      id: teacherIds.value
    }
    return params
  }
  function initTeachingSave () { // 保存教师注册信息
    const loading = ElLoading.service({
      lock: true,
      text: 'Loading',
      background: 'rgba(0, 0, 0, 0.7)',
    })
    ReviewService.saveTeacherCheck(teachingSave()).then((res) => {
      if (res.result_code === 200) {
        ElMessage({
          message: '教师认证成功',
          type: 'success',
        })
        getListData() // 表格数据-区域
        initFormDefault()
      } else {
        ElMessage({
          message: res.description,
          type: 'error',
        })
      }
    }).catch((error) => {
      loading.close()
      console.log(error)
      ElMessage({
        message: '接口或网络异常，请重试！',
        type: 'error'
      })
    }).finally(() => {
      loading.close()
    })
  }
  function makeSureForm () { // 提交输入教师注册信息
    formref.value.validate((valid) => {
      if (valid) {
        initTeachingSave() // 保存教师注册信息
      } else {
        return false
      }
    })
  }
  function btnSearch () { // 查询
    pageIndex.value = 1 // 重置页码
    getListData()
  }
  function btnReset () { // 重置
    teacherForm.phone = ''
    teacherForm.user_name = ''
    pageIndex.value = 1
    getListData()
  }
  function btnAdded () { // 新增
    teacherIds.value = 0
    dialogTeacher.value = true
    btnTypes.value = 'add'
    getProvinceList() // 获取省份
  }
  function see (row) { // 查看
    initcommon(row)
    btnTypes.value = 'see'
  }
  function initcommon (row) {
    dialogTeacher.value = true
    form.product = row.app_id
    form.userName = row.name
    form.userCode = row.phone
    form.province = row.province_id
    form.city = row.city_id
    form.county = row.county_id
    form.school = row.school_id
    form.school_type = row.school_type === '寄宿' ? 1 : row.school_type === '走读' ? 2 : 3
    form.status = row.status === 0 ? false : true
    form.login_multi = row.login_multi === 0 ? false : true
    teacherIds.value = row.id
    nextTick(() => {
      // setTimeout(() => {
        getProvinceList() // 获取省份
      // }, 2000)
    })
  }
  function edit (row) { // 编辑
    initcommon(row)
    btnTypes.value = 'edit'
  }
  function del (row) { // 删除
    ElMessageBox.confirm(
      '是否确定删除？',
      {
        confirmButtonText: '确定',
        confirmButtonClass: 'button-confirm',
        cancelButtonText: '取消',
        // type: 'warning',
        center: true,
      }
    ).then(() => {
      let params = {
        user_name: vocabularyStore.user_name,
        session: vocabularyStore.session,
        ids: String(row.id)
      }
      ReviewService.deleteTeacherCheck(params).then((res) => {
        if (res.result_code === 200) {
          getListData() // 表格数据-区域
          ElMessage({
            message: '删除成功',
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
  function certification (row) { // 认证0/取消认证1

    ElMessageBox.confirm(
      `是否确定${row.status === 0 ? '认证' : '取消认证'}？`,
      {
        confirmButtonText: '确定',
        confirmButtonClass: 'button-confirm',
        cancelButtonText: '取消',
        // type: 'warning',
        center: true,
      }
    ).then(() => {
      let params = {
        user_name: vocabularyStore.user_name,
        session: vocabularyStore.session,
        ids: String(row.id),
        status: row.status === 0 ? 1 : 0
      }
      ReviewService.changeTeacherCheck(params).then((res) => {
        if (res.result_code === 200) {
          getListData() // 表格数据-区域
          ElMessage({
            message: `${row.status === 0 ? '认证成功' : '取消认证成功'}`,
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
</script>

<style scoped>
#form .el-select {
  --el-select-width: 250px;
}

#form .el-input {
  --el-input-width: 250px;
}
</style>
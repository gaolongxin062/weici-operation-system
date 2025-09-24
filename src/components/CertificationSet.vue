<template>
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
              <el-select v-model="form.product" placeholder="请选择产品">
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
                class="search-input"
                clearable
                maxlength="8"  
                placeholder="请输入您的真实姓名"
                v-model="form.userName">
              </el-input>
            </el-form-item>
          </div>

          <div>
            <el-form-item label="省:"   prop="province" label-width="130px">
              <el-select v-model="form.province" placeholder="请选择学校所在省份"  @change="changeProvince">
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
              <el-select v-model="form.city" placeholder="请选择学校所在市"  @change="changeCity">
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
              <el-select v-model="form.county" placeholder="请选择学校所在区/县" @change="changeCounty">
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
              <el-select v-model="form.school_type" placeholder="请选择学校类型">
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
            <el-checkbox v-model="form.status"/>
          </el-form-item>

          <el-form-item label="允许多设备登录" label-width="130px">
            <el-checkbox v-model="form.login_multi"/>
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
</template>

<script setup>
  import { ref, onMounted, reactive, defineEmits, defineProps} from 'vue';
  import memberApi from '@/service/MemberService.js';
  import ReviewService from '@/service/ReviewService.js';
  import { useVocabularyStore } from '@/store/vocabulary';
  import { ElMessage, ElLoading} from 'element-plus'
  let props = defineProps({
    userCode: {
      type: [Number, String],
      default: 0
    }
  })
  let vocabularyStore = useVocabularyStore();
  let dialogTeacher = ref(true)
  let formref = ref()
  let form = reactive({
    product: 9, // 产品 （默认高中维词教学系统）
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
  ]) // 学校类型
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
  onMounted(() => {
    getProvinceList() // 获取省份
    getAppList() // 产品列表
    form.userCode = props.userCode
  })
  let emit = defineEmits([
    'cancelTeaching',
    'saveTeaching'
  ])
  function cancelTeaching () { // 取消输入教师注册信息
    dialogTeacher.value = false
    emit('cancelTeaching')
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
  function getProvinceList () { // 省份
    let params = {
      user_name: vocabularyStore.user_name,
      session: vocabularyStore.session
    }
    memberApi.getProvincesList(params).then((res) => {
      if (res.result_code === 200) {
        provinceList.value = res.list
        // getCityList()
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
        // if (form.city === '') return
        // getAreaList()
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
        // if (form.county === '') return
        // initGetSchool()
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
      status: form.status === true ? 1 : 0
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
        emit('saveTeaching')
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
</script>

<style scoped>
#form .el-select {
  --el-select-width: 250px;
}

#form .el-input {
  --el-input-width: 250px;
}
</style>
<template>
  <el-dialog v-model="dialogVisible" :title="dealTitle" width="1000" @close="closeDialog" append-to-body top="7vh">
    <el-form ref="formRef" id="form" :model="formData" size="large" label-width="100px" :rules="rules">

      <el-form-item label="选择账号" label-width="130px" prop="user_codes">
        <el-input class="search-input" clearable placeholder="请输入账号（只能输入数字，多账号用英文逗号分隔）" :disabled="userCodeDisabled"
          v-model="formData.user_codes" @input="handleInput">
        </el-input>
        <el-button type="primary" :disabled="selectBtnDisabled" class="select-btn" @click="showSelectAccountNumber">选择账号</el-button>
      </el-form-item>
      <!-- <el-form-item label="体验天数" label-width="130px" prop="trial_date">
         <el-input-number
           v-model="formData.trial_date"
           :min="1"
           :max="10000"
           controls-position="right"
           size="large"
           @change="experienceDaysChange"
         />
      </el-form-item> -->
      <div style="display: flex;">
        <el-form-item label="开始时间" label-width="130px" prop="trial_start_time">
          <el-date-picker v-model="formData.trial_start_time" value-format="YYYY-MM-DD" type="date" :disabled="true" placeholder="请选择开始时间" clearable />
        </el-form-item>
        <el-form-item label="结束时间" label-width="130px" prop="trial_end_time">
          <el-date-picker v-model="formData.trial_end_time" value-format="YYYY-MM-DD" type="date" placeholder="请选择结束时间" clearable />
        </el-form-item>
      </div>


      <div style="display: flex;" class="area">
        <el-form-item label="省" label-width="130px" prop="province">
          <el-select v-model="formData.province" placeholder="请选择省份" filterable @change="changeProvince">
            <el-option
              v-for="item in provinceList"
              :key="item.id"
              :label="item.province"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="市" label-width="130px" prop="city">
          <el-select v-model="formData.city" placeholder="请选择市" filterable @change="changeCity">
            <el-option
                v-for="item in cityList"
                :key="item.id"
                :label="item.city"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="区/县" label-width="130px" prop="county">
          <el-select v-model="formData.county" placeholder="请选择区/县" filterable @change="changeCounty">
            <el-option
                v-for="item in countyList"
                :key="item.id"
                :label="item.county"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </div>
    
      <el-form-item label="学校名称" label-width="130px" prop="school">
        <el-select
          v-model="formData.school"
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

      <div  style="display: flex;" class="area">
        <el-form-item label="用户类型" prop="user_type" label-width="130px">
          <el-select
            v-model="formData.user_type"
            filterable
            placeholder="请选择用户类型"
            @change="changeUseType"
          >
            <el-option
              v-for="item in userTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="用户来源" prop="user_source" label-width="130px">
          <el-select
            v-model="formData.user_source"
            filterable
            placeholder="请选择用户来源"
            clearable
          >
            <el-option
              v-for="item in userSourceList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="停用标记" label-width="130px">
          <el-checkbox v-model="formData.stop_flag"/>
        </el-form-item>
      </div>

      <el-form-item label="限制使用次数" label-width="130px" prop="use_points" v-if="formData.use_info.length">
        <div class="user_info_box">
          <div v-for="(item, index) in formData.use_info" :key="index" class="user_info">
            <div>{{ item.type_name }}</div>
            <!-- <div>{{ item.config_value }}</div> -->
            <el-input-number
              v-model="item.config_value"
              :min="1"
              :max="10000"
              controls-position="right"
              size="large"
              @blur="handleBlur(index)"
            />
          </div>
        </div>
      </el-form-item>

    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancelDialog">取消</el-button>
        <el-button type="primary" @click="saveDialog" v-if="!isCheck">
          保存
        </el-button>
      </div>
    </template>
    <SelectAccountNumber v-if="isShowSelectAccountNumber" @cancelDialog="cancelSelectAccountNumber" @saveDialog="confirmSelectAccountNumber"></SelectAccountNumber>
  </el-dialog>
</template>

<script setup>
  import { ref, onMounted, defineProps, defineEmits} from 'vue';
  import { useVocabularyStore } from '@/store/vocabulary';
  // import userSourceJsonData from '@/data/userSource.json'; // 用户来源
  // import userTypeJsonData from '@/data/userType.json'; // 用户类型
  import { computed } from '@vue/reactivity';
  import { ElMessage } from 'element-plus';
  import aiAgentService from '@/service/AiAgentService.js';
  import SelectAccountNumber from '@/components/member/SelectAccountNumber.vue';
  import format from '@/utils/DateUtil.js'
  import AiAgentService from '@/service/AiAgentService';
  let vocabularyStore = useVocabularyStore();
  // let expand = ref(false)
  let formRef = ref(null) // 表单元素
  let dialogVisible = ref(true) // 弹框显隐控制标记
  let formData = ref({
    user_codes: '', // 账号名称
    trial_date: 15, // 体验天数
    trial_start_time: '', // 开始时间
    trial_end_time: '', // 结束时间
    province: '', // 省
    city: '', // 市
    county: '', // 区县
    school:'', // 学校
    user_type: 1, // 用户类型
    user_source: 0, // 用户来源
    stop_flag: false, // 停用标记 0正常 停用
    use_info: [] // 使用次数
  })
  let userTypeList = ref([
    {
      id: 1,
      name: '体验用户'
    },
    {
      id: 2,
      name: '付费用户'
    }
  ]) // 用户类型
  let userSourceList = ref([
    {
      id: 0,
      name: '正常用户'
    },
    {
      id: 1,
      name: '维学'
    },
    {
      id: 2,
      name: '维克多发行'
    },
    {
      id: 3,
      name: '经销商'
    },
    {
      id: 4,
      name: '维克多编辑'
    }
  ]) // 用户来源
  let provinceList = ref([
  ]) // 省
  let cityList = ref([
  ]) // 市
  let countyList = ref([
  ]) // 区县
  let schoolList = ref([
  ]) // 学校
  let isShowSelectAccountNumber = ref(false) // 是否显示选择账号弹框

  let rules = ref({
    user_codes: [
      { required: true, message: '请输入账号（只能输入数字，多账号用英文逗号分隔）', trigger: 'blur' }
    ],
    trial_start_time: [
      { required: true, message: '请输入体验开始时间！', trigger: 'blur' }
    ],
    trial_end_time: [
      { required: true, message: '请输入体验结束时间！', trigger: 'blur' }
    ],
    province: [
      { required: true, message: '请选择省份！', trigger: 'change' }
    ],
    city: [
      { required: true, message: '请选择市！', trigger: 'change' }
    ],
    county: [
      { required: true, message: '请选择区/县！', trigger: 'change' }
    ],
    school: [
      { required: true, message: '请选择学校名称！', trigger: 'change' }
    ],
    user_type: [
      { required: true, message: '请选择用户类型！', trigger: 'change' }
    ],
    user_source: [
      { required: true, message: '请选择用户来源！', trigger: 'change' }
    ],
    trial_date: [
      {
        required: true,
        message: '请输入体验天数',
        trigger: 'change',
      },
    ],
    use_points: [
      {
        // required: true,
        // message: '请输入体验天数',
        // trigger: 'change',
      },
    ],
  });

  let props = defineProps({
    isRenewal: {
      type: Boolean,
      default: false
    }, // 是否为批量续期
    isEdit: {
      type: Boolean,
      default: false
    }, // 是否为修改内容
    isCheck: {
      type: Boolean,
      default: false
    }, // 是否为查看内容
    row: {
      type: Object,
      default () {
        return null
      }
    }, // 用户点击当前行的内容
  })

  let dealTitle = computed(() => {
    // if (props.isCheck) return '查看资源'
    return props.isEdit ? '修改' : props.isRenewal ? '批量续期' : '新增'
  })
  let userCodeDisabled = computed(() => {
    if (props.isRenewal) return true // 批量续期
    if (props.isCheck) return true // 查看
    if (props.isEdit) return true // 编辑
    return false
  }) // 用户输入框是否禁用
  let selectBtnDisabled = computed(() => {
    if (props.isRenewal) return true // 批量续期
    if (props.isEdit) return true // 编辑
    return false
  }) // 选择用户按钮是否禁用

  let emit = defineEmits([
    'cancelDialog',
    'saveDialog',
  ])
  onMounted (() => {
    // userSourceList.value = userSourceJsonData // 用户来源
    // userTypeList.value = userTypeJsonData // 用户类型
    setDefaultConfig() // 设置默认设置
    getProvinceList() // 获取省份
  })
  function changeProvince () { // 省
    getCityList() // 获取市
    formData.value.city = ''
    formData.value.county = ''
    formData.value.school = ''
  }
  function changeCity () { // 市
    getAreaList() // 获取区县
    formData.value.county = ''
    formData.value.school = ''
  }
  function changeCounty () { // 区县
    formData.value.school = ''
    initGetSchool() // 获取学校
  }
  function getProvinceList () {
    let params = {
      user_name: vocabularyStore.user_name,
      session: vocabularyStore.session
    }
    return aiAgentService.getProvincesList(params)
      .then((res) => {
        if (res.result_code === 200) {
          provinceList.value = res.list
          if (!props.isEdit) return
            getCityList()
          }
    }).catch((error) => {
      console.log(error)
    })
  } // 获取省份列表
  function getCityList () {
    let params = {
      user_name: vocabularyStore.user_name,
      session: vocabularyStore.session,
      province_id: formData.value.province
    }
    return aiAgentService.getAiCityList(params)
      .then((res) => {
        if (res.result_code === 200) {
          cityList.value = res.list
          if (!props.isEdit || formData.value.city === '') return
            getAreaList()
          }
    }).catch((error) => {
      console.log(error)
    })
  } // 获取市列表
  function getAreaList () {
    let params = {
      user_name: vocabularyStore.user_name,
      session: vocabularyStore.session,
      city_id: formData.value.city
    }
    return aiAgentService.getAiCountyList(params)
      .then((res) => {
        if (res.result_code === 200) {
          countyList.value = res.list
          if (!props.isEdit || formData.value.county === '') return
            initGetSchool()
          }
    }).catch((error) => {
      console.log(error)
    })
  } // 获取区县
  function initGetSchool () { // 学校
    let params = {
      user_name: vocabularyStore.user_name,
      session: vocabularyStore.session,
      county_id: formData.value.county
    }
    aiAgentService.getAiSchoolList(params).then((res) => {
      if (res.result_code === 200) {
        // console.log(res)
        schoolList.value = res.list
      }
    }).catch((error) => {
      console.log(error)
    })
  } // 获取学校
  async function setDefaultConfig() {
    // 如果当前是编辑
    if (props.isEdit) {
      formData.value.trial_start_time = props.row.trial_start_time // 开始时间
      formData.value.user_codes = props.row.user_code // 账号
      // formData.value.trial_date = props.row.trial_date // 体验天数
      formData.value.trial_end_time = props.row.trial_end_time // 结束时间
      formData.value.stop_flag = props.row.stop_flag === 0 ? false : true // 停用标记
      formData.value.user_source = props.row.user_source // 用户来源
      formData.value.user_type = props.row.user_type || '' // 用户类型
      formData.value.province = props.row.new_province_id || '' // 省
      formData.value.city = props.row.new_city_id || '' // 市
      formData.value.county = props.row.new_county_id || '' // 区县
      formData.value.school = props.row.new_school_id || '' // 学校
      getCompositionDetail() // 获取用户权限详情
    } else if (props.isRenewal) { // 如果当前是批量续期
      // 初始化开始时间
      const now = new Date();
      formData.value.trial_start_time = format.formatDateDay(now.getTime())
      // 初始化用户账号
      formData.value.user_codes = props.row.map(item=> item.user_code).join(',')
    } else { // 如果当前是新建
      // 初始化开始时间
      const now = new Date();
      formData.value.trial_start_time = format.formatDateDay(now.getTime())
      // 初始化使用次数
      getUseInfo()
    }
  } // 设置默认设置
  function getUseInfo () {
    let params = {
      user_name: vocabularyStore.user_name,
      session: vocabularyStore.session,
      type: formData.value.user_type
    }
    return AiAgentService.getUse(params)
      .then((res) => {
        console.log(res)
        if (res.result_code === 200) {
          // provinceData.value = res.list
          formData.value.use_info = res.data
        }
    }).catch((error) => {
      console.log(error)
    })
  } // 获取默认次数数据
  function getCompositionDetail () {
    let params = {
      user_name: vocabularyStore.user_name,
      session: vocabularyStore.session,
      id: props.row.id
    }
    return AiAgentService.getCompositionDetail(params)
      .then((res) => {
        console.log(res)
        if (res.result_code === 200) {
          // provinceData.value = res.list
          formData.value.use_info = res.data.use_info
        }
    }).catch((error) => {
      console.log(error)
    })
  } // 获取用户权限详情
  function closeDialog () {
    emit('cancelDialog')
  } // 点击自带关闭按钮
  function cancelDialog () {
    emit('cancelDialog')
  } // 点击取消
  function saveDialog () {
    console.log(formData.value)
    formRef.value.validate((valid) => {
      // console.log(valid)
      if (valid) {
        let config = getConfig() // 获取当前的设置
        // 查看内容是否全部为空白字符
        if (config.user_codes.length === 0) {
          ElMessage({
            type: 'error',
            message: '账号名称不能全部为空白字符'
          })
          return
        }
        // 查看内容列表中是否有长度不满足11位数字的账号
        // console.log(config.user_codes)
        let isNoMeetLength = config.user_codes.split(',').some(str => str.length !== 11)
        if (isNoMeetLength) {
          ElMessage({
            type: 'error',
            message: '账号名称必须是11位的数字，请修改'
          })
          return
        }
        console.log(config)
        emit('saveDialog', config)
      } else {
        return false
      }
    })
  } // 点击保存
  function getConfig () {
    console.log(formData.value)
    let params = { 
      trial_date: formData.value.trial_date, // 体验天数
      trial_start_time: formData.value.trial_start_time, // 开始时间
      user_codes: dealAccountNumber(formData.value.user_codes), // 账号
      use_info: formData.value.use_info, // 使用次数设置
      stop_flag: formData.value.stop_flag === false ? 0 : 1, // 停用标记
      user_source: formData.value.user_source, // 用户来源
      user_type: formData.value.user_type, // 用户类型
      trial_end_time: formData.value.trial_end_time, // 体验结束时间
      province_id: formData.value.province,
      city_id: formData.value.city,
      county_id: formData.value.county,
      school_id: formData.value.school,
    }
    // 如果是编辑，添加id
    if (props.isEdit) {
      params = {
        ...params,
        id: props.row.id
      }
    }
    return params
  } // 点击保存传递的参数
  
  function dealAccountNumber (str) {
    console.log(str)
  // 1. 按逗号分割字符串
  // 2. 使用map去除每个元素两端的空白字符
  // 3. 使用filter去除空字符串
  // 4. 使用Set去重
  // 5. 转换回数组
  const result = [...new Set(
    str.split(',')
      .map(item => item.trim())
      .filter(item => item !== '')
  )]
  // 返回具体内容字符串
  return result.join(',')
  } // 处理账号字符串
  function showSelectAccountNumber () {
    isShowSelectAccountNumber.value = true
  } // 展开选择账号弹框
  function cancelSelectAccountNumber () {
    isShowSelectAccountNumber.value = false
  } // 取消展开选择账号弹框
  function confirmSelectAccountNumber (val) {
    console.log(val)
    let list = formData.value.user_codes.length ? formData.value.user_codes.split(',').concat(val) : val // 将输入框中的内容和用户选择的内容拼接
    console.log(list)
    formData.value.user_codes = [...new Set(list)].join(',') // 将内容转为字符串
    isShowSelectAccountNumber.value = false
  } // 确认展开选择账号弹框
  function handleInput (value) {
    // 只允许输入数字或英文逗号
    const filteredValue = value.replace(/[^0-9,]/g, "")
    formData.value.user_codes = filteredValue
} // 账号输入
  // 使用次数输入框失去焦点
  function handleBlur (index) {
    // 如果用户是在清空的状态下，点击了别的地方，让它默认重置为1
    if (formData.value.use_info[index].config_value === null) {
      formData.value.use_info[index].config_value = 999
    }
  }
  // 切换用户类型
  function changeUseType (e) {
    console.log(e)
    getUseInfo() // 重新获取用户次数
  }
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
  margin-left: 15px;
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
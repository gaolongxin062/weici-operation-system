<template>
  <el-dialog v-model="dialogVisible" :title="dealTitle" width="1000" @close="closeDialog" append-to-body>
    <el-form ref="formRef" id="form" :model="formData" size="large" label-width="100px" :rules="rules">

      <el-form-item label="选择账号" label-width="130px" prop="user_codes">
        <el-input class="search-input" clearable placeholder="请输入账号（只能输入数字，多账号用英文逗号分隔）" :disabled="userCodeDisabled"
          v-model="formData.user_codes" @input="handleInput">
        </el-input>
        <el-button type="primary" :disabled="selectBtnDisabled" class="select-btn" @click="showSelectAccountNumber">选择账号</el-button>
      </el-form-item>
      <el-form-item label="体验天数" label-width="130px" prop="trial_date">
         <el-input-number
           v-model="formData.trial_date"
           :min="1"
           :max="10000"
           controls-position="right"
           size="large"
           @change="experienceDaysChange"
         />
      </el-form-item>
      <el-form-item label="开始时间" label-width="130px" prop="trial_start_time">
        <el-date-picker v-model="formData.trial_start_time" value-format="YYYY-MM-DD" type="date" :disabled="true" placeholder="请选择开始时间" clearable />
      </el-form-item>
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
  import { computed } from '@vue/reactivity';
  import { ElMessage } from 'element-plus';
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
    use_info: [] // 使用次数
  })

  let isShowSelectAccountNumber = ref(false) // 是否显示选择账号弹框

  let rules = ref({
    user_codes: [
      { required: true, message: '请输入账号（只能输入数字，多账号用英文逗号分隔）', trigger: 'blur' }
    ],
    trial_start_time: [
      { required: true, message: '请输入体验开始时间！', trigger: 'blur' }
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
    setDefaultConfig() // 设置默认设置
  })
  async function setDefaultConfig() {
    // 如果当前是编辑
    if (props.isEdit) {
      formData.value.trial_start_time = props.row.trial_start_time // 开始时间
      formData.value.user_codes = props.row.user_code // 体验时长
      formData.value.trial_date = props.row.trial_date // 开始时长
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
      session: vocabularyStore.session
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
</script>

<style scoped>
#form .el-select {
  --el-select-width: 350px;
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
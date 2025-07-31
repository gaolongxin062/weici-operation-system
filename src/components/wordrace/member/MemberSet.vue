<template>
  <el-dialog v-model="dialogVisible" :title="dealTitle" width="1000" @close="closeDialog" append-to-body>
    <el-form ref="formRef" id="form" :model="formData" size="large" label-width="100px" :rules="rules">

      <el-form-item label="选择账号" label-width="130px" prop="user_codes">
        <el-input class="search-input" clearable placeholder="请输入账号（只能输入数字，多账号用英文逗号分隔）" :disabled="isCheck"
          v-model="formData.user_codes" @input="handleInput">
        </el-input>
        <el-button type="primary" :disabled="isEdit" class="select-btn" @click="showSelectAccountNumber">选择账号</el-button>
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
        <el-date-picker v-model="formData.trial_start_time" value-format="YYYY-MM-DD" type="date" placeholder="请选择开始时间" clearable />
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
  // import { useVocabularyStore } from '@/store/vocabulary';
  import { computed } from '@vue/reactivity';
  import { ElMessage } from 'element-plus';
  import SelectAccountNumber from '@/components/wordrace/member/SelectAccountNumber.vue';
  import format from '@/utils/DateUtil.js'
  // let vocabularyStore = useVocabularyStore();
  // let expand = ref(false)
  let formRef = ref(null) // 表单元素
  let dialogVisible = ref(true) // 弹框显隐控制标记
  let formData = ref({
    user_codes: '', // 账号名称
    trial_date: 15, // 体验天数
    trial_start_time: '', // 开始时间
  })

  let isShowSelectAccountNumber = ref(false) // 是否显示选择账号弹框
  // let selectAccountNumberList = ref([]) // 选择账号列表，因为账号是不唯一，所以这里需要新建一个列表，用于保存用户已选择的内容

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
  });

  let props = defineProps({
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
    return props.isEdit ? '修改' : '新增'
  })

  let emit = defineEmits([
    'cancelDialog',
    'saveDialog',
  ])
  onMounted (() => {
    setDefaultConfig() // 设置默认设置
  })
  function setDefaultConfig() {
    // 如果当前是编辑
    if (props.isEdit) {
      formData.value.trial_start_time = props.row.trial_start_time // 开始时间
      formData.value.user_codes = props.row.user_code // 体验时长
      formData.value.trial_date = props.row.trial_date // 开始时长
    } else { // 如果当前是新建
      // 初始化开始时间
      const now = new Date();
      formData.value.trial_start_time = format.formatDateDay(now.getTime())
    }
  } // 设置默认设置
  function closeDialog () {
    emit('cancelDialog')
  } // 点击自带关闭按钮
  function cancelDialog () {
    emit('cancelDialog')
  } // 点击取消
  function saveDialog () {
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
    let params = { 
      trial_date: formData.value.trial_date, // 体验天数
      trial_start_time: formData.value.trial_start_time, // 开始时间
      user_codes: dealAccountNumber(formData.value.user_codes), // 开始时间
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
</style>
<template>
    <el-dialog v-model="dialogVisible" :title="dealTitle" width="600" @close="closeDialog">
      <el-form ref="formRef" id="form" :model="questionForm" size="large" label-width="100px" :rules="rules">

        <el-form-item label="题型分类" label-width="130px" prop="questionType">
          <el-select v-model="questionForm.questionType" placeholder="请选择分类" :disabled="isCheck">
            <el-option v-for="item in questionTypeList" :key="item.key" :label="item.label" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="题型名称" label-width="130px" prop="questionName">
          <el-input class="search-input" clearable placeholder="" :disabled="isCheck" v-model="questionForm.questionName">
          </el-input>
        </el-form-item>

        <el-form-item label="是否为PK题型" label-width="130px" prop="isPk">
          <el-select v-model="questionForm.isPk" placeholder="请选择分类" :disabled="isCheck">
            <el-option v-for="item in pkList" :key="item.key" :label="item.label" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="创建人" label-width="130px" v-if="isEdit || isCheck">
          <el-input class="search-input" :disabled="true" clearable placeholder="" v-model="questionForm.maker">
          </el-input>
        </el-form-item>
        <el-form-item label="创建时间" label-width="130px" v-if="isEdit || isCheck">
          <el-input class="search-input" :disabled="true" clearable placeholder="" v-model="questionForm.make_date">
          </el-input>
        </el-form-item>
        <el-form-item label="修改人" label-width="130px" v-if="isEdit || isCheck">
          <el-input class="search-input" :disabled="true" clearable placeholder="" v-model="questionForm.modifier">
          </el-input>
        </el-form-item>
        <el-form-item label="修改时间" label-width="130px" v-if="isEdit || isCheck">
          <el-input class="search-input" :disabled="true" clearable placeholder="" v-model="questionForm.modify_date">
          </el-input>
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

    </el-dialog>
</template>

<script setup>
  import { ref, onMounted, defineProps, defineEmits} from 'vue';
  // import { useVocabularyStore } from '@/store/vocabulary';
  import { computed } from '@vue/reactivity';
  // let vocabularyStore = useVocabularyStore();
  // let expand = ref(false)
  let formRef = ref(null) // 表单元素
  let dialogVisible = ref(true) // 弹框显隐控制标记
  let questionForm = ref({
    questionType: '', // 题型分类
    questionName: '', // 题型名称
    isPk: 1 // 是否为pk题型
  })
  let rules = ref({
    questionType: [
      {
        required: true,
        message: '请选择题型分类',
        trigger: 'change',
      },
    ],
    questionName: [
      { required: true, message: '请输入题型名称！', trigger: 'blur' }
    ],
    isPk: [
      {
        required: true,
        message: '请选择PK类型',
        trigger: 'change',
      },
    ],
  });
  let questionTypeList = ref([
    {
      label: '选择题',
      key: 1
    },
    {
      label: '非选择题',
      key: 2
    }
  ]) // 题型分类列表
  let pkList = ref([
    {
      label: '是',
      key: 1
    },
    {
      label: '否',
      key: 0
    }
  ]) // 题型分类列表
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
    if (props.isCheck) return '查看题型名称'
    return props.isEdit ? '修改题型名称' : '新增题型名称'
  })

  let emit = defineEmits([
    'cancelDialog',
    'saveDialog',
  ])
  onMounted (() => {
    // expand.value = vocabularyStore.expandMenu
    setDefaultConfig() // 设置默认设置
  })
  function setDefaultConfig () {
    // 如果是修改
    if (props.isEdit || props.isCheck) {
      questionForm.value.questionType = props.row.question_type
      questionForm.value.questionName = props.row.question_name
      questionForm.value.isPk = props.row.is_pk
      questionForm.value.maker = props.row.maker
      questionForm.value.make_date = props.row.make_date
      questionForm.value.modifier = props.row.modifier
      questionForm.value.modify_date = props.row.modify_date
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
      console.log(valid)
      if (valid) {
        emit('saveDialog', getConfig())
      } else {
        return false
      }
    })
  } // 点击保存
  function getConfig () {
    let params = questionForm.value
    if (props.isEdit) {
      params = {
        ...params,
        questionId: props.row.id
      }
    }
    return params
  } // 点击保存传递的参数
</script>

<style scoped>
#form .el-select {
  --el-select-width: 350px;
}

#form .el-input {
  --el-input-width: 350px;
}
</style>
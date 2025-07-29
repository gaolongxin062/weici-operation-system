<template>
    <el-dialog v-model="dialogVisible" :title="dealTitle" width="600" @close="closeDialog">
      <el-form ref="formRef" id="form" :model="difficultyForm" size="large" label-width="100px" :rules="rules">

        <el-form-item label="难度等级" label-width="130px" prop="difficultyName">
          <el-input class="search-input" clearable placeholder="" v-model="difficultyForm.difficultyName" :disabled="isCheck">
          </el-input>
        </el-form-item>

        <el-form-item label="创建人" label-width="130px" v-if="isEdit || isCheck">
          <el-input class="search-input" :disabled="true" clearable placeholder="" v-model="difficultyForm.maker">
          </el-input>
        </el-form-item>
        <el-form-item label="创建时间" label-width="130px" v-if="isEdit || isCheck">
          <el-input class="search-input" :disabled="true" clearable placeholder="" v-model="difficultyForm.make_date">
          </el-input>
        </el-form-item>
        <el-form-item label="修改人" label-width="130px" v-if="isEdit || isCheck">
          <el-input class="search-input" :disabled="true" clearable placeholder="" v-model="difficultyForm.modifier">
          </el-input>
        </el-form-item>
        <el-form-item label="修改时间" label-width="130px" v-if="isEdit || isCheck">
          <el-input class="search-input" :disabled="true" clearable placeholder="" v-model="difficultyForm.modify_date">
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
  let difficultyForm = ref({
    difficultyName: '', // 难度名称
  })
  let rules = ref({
    difficultyName: [
      { required: true, message: '请输入难度等级！', trigger: 'blur' }
    ]
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
    if (props.isCheck) return '查看难度名称'
    return props.isEdit ? '修改难度名称' : '新增难度名称'
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
      difficultyForm.value.difficultyName = props.row.difficulty_name
      difficultyForm.value.maker = props.row.maker
      difficultyForm.value.make_date = props.row.make_date
      difficultyForm.value.modifier = props.row.modifier
      difficultyForm.value.modify_date = props.row.modify_date
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
    let params = difficultyForm.value
    if (props.isEdit) {
      params = {
        ...params,
        difficultyId: props.row.id
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
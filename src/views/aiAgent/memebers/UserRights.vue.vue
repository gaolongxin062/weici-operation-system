<template>
  <div class="page define-page" :class="isMobileDevice ? 'mobile-page' : 'computer-page'">
    <div class="page-title" id="page-title">
      <h4>作文批改用户权益</h4>
    </div>
    <div class="content-box">
      <el-form :inline="true" id="forms" :model="formData" size="large" label-width="90px" @submit.prevent>
        <el-form-item label="产品类型：" label-width="130px">
          <el-select
            style="width: 200px;"
            placeholder="请选择"
            clearable
            v-model="formData.distributor"
          >
            <el-option v-for="item in productType" :key="item.id" :label="item.title" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建人：" label-width="130px">
          <el-input class="search-input" clearable placeholder="请输入姓名" v-model="formData.user"></el-input>
        </el-form-item>
        <el-form-item label="创建时间：" label-width="130px">
            <el-date-picker
              v-model="formData.date"
              type="daterange"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
        </el-form-item>
         <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onReset">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="add">新增</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="list" class="table-info" v-loading="loading" header-cell-class-name="header_row_class" style="width: 100%" stripe element-loading-text="拼命加载中，主人请稍后..." :max-height="screenHeight" ref="tableRef" >
        <el-table-column width="80" align="center" label="序号">
          <template #default="scope">
            <div>{{ showIndex(scope.$index) }}</div>
          </template>
        </el-table-column>
        <el-table-column label="产品类型" min-width="100px" >
          <template #default="scope">
            <div>{{ getProductTypeTitle(scope.row.type) }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="权益名称" min-width="180px" />
        <el-table-column prop="info" label="权益简介" min-width="250px" />
        <el-table-column prop="maker_name" label="创建人" min-width="120" />
        <el-table-column prop="make_date" label="创建时间"  min-width="140px" />
        <el-table-column label="操作" fixed="right"  min-width="160px">
          <template #default="scope">
            <el-button class="button-style" link type="primary" @click="update(scope.row)">
              修改
            </el-button>
            <el-button class="button-style" link type="primary" @click="deleteRight(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination style="color: #666666;margin: 20px 0 0 20px;" v-show="total > 0"
      @current-change="handleCurrentChange" :current-page="pageIndex" :page-size="pageSize"
      layout="total, prev, pager, next" prev-text="上一页" next-text="下一页" :total="total">
    </el-pagination>
    </div>
  </div>
  <el-dialog v-model="dialogVisible" :title="type === 0 ? '新增' : '修改' " width="800" :close-on-click-modal="false" append-to-body :destroy-on-close="true">
    <el-form ref="formRef" id="form" :model="dislogFormData" size="large" label-width="150px" :rules="rules">
        <el-form-item label="产品类型：" label-width="120px" style="font-weight: bold;" prop="type">
          <el-select style="width: 200px;" v-model="dislogFormData.type" clearable filterable placeholder="请输入产品类型" :disabled="true">
            <el-option v-for="item in productType" :key="item.id" :label="item.title" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
          <div class="first-item">
            <el-form-item  label="产品权益名称:" label-width="120px" style="font-weight: bold;" prop="title">
              <el-input style="width: 200px;" v-model="dislogFormData.title" maxlength="10" placeholder="请输入权益名称"/>
            </el-form-item>
            <el-form-item  label="产品权益简介:" label-width="120px" style="font-weight: bold;" prop="info">
              <el-input style="width: 300px;" v-model="dislogFormData.info" maxlength="20" placeholder="请输入权益简介"/>
            </el-form-item>
        </div>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save" :loading="saveLoading">保存</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useScreenHeight } from '@/hooks/useScreenHeight.js';
import AiAgentMemebers from '@/service/AiAgentMemebers.js';
import { useVocabularyStore } from '@/store/vocabulary';
const { screenHeight, isMobileDevice } = useScreenHeight();
const vocabularyStore = useVocabularyStore();
import { ElMessage, ElMessageBox } from 'element-plus';

let formData = reactive({
  distributor: '', // 产品类型
  user: '', // 创建人
  date: '' // 创建时间
}) // 表单内容
let tableRef = ref(null)
let list = ref([

]) // 表格数据
let loading = ref(false) // 加载标记
let total = ref(0)
let pageIndex = ref(1)
let pageSize = ref(10)
let dialogVisible = ref(false) // 弹窗显隐
let formRef = ref(null)
let dislogFormData = reactive({
  type: '',
  id: '',
  title: '',
  info: '',
}) // 弹窗表单
let rules = ref({
  type: [
    { required: true, message: '请输入产品类型', trigger: 'blur' }
  ],
  title: [
    { required: true, message: '请输入权益名称', trigger: 'blur' }
  ],
  info: [
    { required: true, message: '请输入权益简介', trigger: 'blur' }
  ]
});
let type = ref(0) // 0新增 1修改
let saveLoading = ref(false) // 保存按钮加载状态
let productType = ref([ // 产品类型
  {
    id: 1,
    title: '作文批改'
  }
])


onMounted(() => {
   // 设置页面展示高度
  // window.addEventListener('resize', updateScreenHeight)
  // updateScreenHeight()
  // 查询列表
  getList()
})

// 动态设置表格高度
// const updateScreenHeight = () => {
//   var element = document.getElementById('form');
//   if (element) {
//     var rect = element.getBoundingClientRect();
//     var formHeight = rect.height // form表单的高
//   }
    
//    var pageHeight = 80 // 分页高度
//    var menuHeight = 64 // 导航栏高度
//    screenHeight.value = window.innerHeight - formHeight - pageHeight - menuHeight - 100
// } 

// 序号
const showIndex = (index) => {
  return index + 1 + (pageIndex.value - 1) * pageSize.value
} 

// 查询
const onSubmit = () => {
  getList()
} 

// 重置
const onReset = () => {
  formData.distributor = '', // 产品类型
  formData.user = '', // 创建人
  formData.date = '' // 创建时间
  getList()
} 

// 新增
const add = () => {
  type.value = 0
  dislogFormData.type = productType.value[0].id
  dislogFormData.id = ''
  dislogFormData.title = ''
  dislogFormData.info = ''
  dialogVisible.value = true
}

// 获取表格数据
const getList = () => {
  loading.value = true
  let params = {
    user_name: vocabularyStore.user_name,
    session: vocabularyStore.session,
    name: formData.user, // 创建人
    end_time: formData.date.length > 0 ? formData.date[1] : '', // 创建结束时间
    type: formData.distributor, // 产品类型
    page_index: pageIndex.value, // 当前页
    page_size: pageSize.value, // 分页大小
    start_time: formData.date.length > 0 ? formData.date[0] : '', // 创建开始日期
  }
  return AiAgentMemebers.getRightsList(params)
    .then((res) => {
      if (res.result_code === 200) {
        list.value = res.data
        total.value = res.total
      } else {
        ElMessage({
          message: '获取学生权益列表失败',
          type: 'error',
          duration: 3000
        })
      }
    })
    .catch((error) => {
      console.log(error)
    })
    .finally(() => {
      loading.value = false
    })
}

// 根据id获取产品类型标题
const getProductTypeTitle = (id) => {
  const type = productType.value && id ? productType.value.find(item => item.id === id) : ''
  return type ? type.title : id
}

// 点击分页
const handleCurrentChange = async (page) => { // 切换下一页
  pageIndex.value = page
  await getList()
} 

// 新增弹窗保存
const save = async () => { 
  if (!formRef.value || saveLoading.value) return; // 防止重复点击
     try {
      saveLoading.value = true // 开始加载
      const valid = await formRef.value.validate()
       if (valid) {
        let params = {
          user_name: vocabularyStore.user_name,
          session: vocabularyStore.session,
          type: dislogFormData.type,
          id: dislogFormData.id,
          title: dislogFormData.title,
          info: dislogFormData.info
        }
        AiAgentMemebers.saveRightsEdit(params)
          .then((res) => {
            if (res.result_code === 200) {
              ElMessage({
                message: type.value === 1 ? '修改权益成功':'新增权益成功',
                type: 'success',
                duration: 1000
              })
              dialogVisible.value = false
              getList()
            } else {
              ElMessage({
                message: type.value === 1 ? '修改权益失败':'新增权益失败',
                type: 'error',
                duration: 1000
              })
            }
          })
          .catch((error) => {
            console.log(error)
          })
          .finally(() => {
            saveLoading.value = false // 结束加载
          })
          }
     } catch (error) {
      saveLoading.value = false // 结束加载
     }
}

// 修改事件
const update = (option) => {
  type.value = 1
  dislogFormData.type = option.type
  dislogFormData.id = option.id
  dislogFormData.title = option.title
  dislogFormData.info = option.info
  dialogVisible.value = true
} 


// 删除权益组
const deleteRight = (item) => {
  let params = {
    user_name: vocabularyStore.user_name,
    session: vocabularyStore.session,
    id: item.id // 产品类型
  }
  ElMessageBox.confirm('确定将该条数据删除吗？', '提示信息', {
    confirmButtonText: '确定',
    confirmButtonClass: 'button-confirm',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    return AiAgentMemebers.delRights(params)
    .then((res) => {
      if (res.result_code === 200) {
        ElMessage({
          message: '删除成功',
          type: 'success',
          duration: 3000
        })
        getList()
      } else {
        ElMessage({
          message: '删除产品配置失败',
          type: 'error',
          duration: 3000
        })
      }
    })
    .catch((error) => {
      console.log(error)
    })
    .finally(() => {
      loading.value = false
    })
  }).catch(() => {
  })
} 
</script>
<style scoped>
.marginBottom {
  margin-bottom: 20px;
}
.teacher {
  padding-left: 70px;
}
.del {
  display: inline-block;
  text-align: center;
  vertical-align: middle;
  margin-left: 10px;
  color: red;
  cursor: pointer;
}
.add {
  margin: 0 auto;
  width: 500px;
  height: 30px;
  cursor: pointer;
  text-align: center;
  line-height: 30px;
  color: #0271E3;
  border: 1px solid #ccc;
}
.first-item { margin-left: 20px; }
.other-item { margin-left: 160px; }
</style>
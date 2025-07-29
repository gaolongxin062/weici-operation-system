<template>
 <div class="page">
    <div class="page-title" id="page-title">
      <h4>角色设置</h4>
      <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">主页</el-breadcrumb-item>
        <el-breadcrumb-item>角色设置</el-breadcrumb-item>
      </el-breadcrumb> -->
    </div>
   <el-container style="height: calc(100% - 62px)">
     <el-header style="padding: 0;">
       <el-form id="form" :inline="true" :model="form" size="large" label-width="100px" @submit.prevent>
         <el-form-item label="角色名">
           <el-input
               class="search-input"
               clearable
               placeholder="角色名"
               v-model="form.role_name"
           >
           </el-input>
         </el-form-item>
         <el-form-item>
           <el-button type="primary" @click="onSubmit">搜索</el-button>
         </el-form-item>
         <el-form-item>
           <el-button type="success" @click="newlyAdded">新增</el-button>
         </el-form-item>
       </el-form>
     </el-header>
     <el-main style="padding: 0;">
       <el-table :data="roleList"  class="table-info" :max-height="screenHeight"  header-cell-class-name="header_row_class"  stripe
                 v-loading="loading"
                 element-loading-text="拼命加载中，主人请稍后...">
         <el-table-column prop="role_name" label="角色名称" min-width/>
         <el-table-column prop="role_desc" label="描述" min-width/>

         <el-table-column  label="操作" min-width>
           <template #default="scope">
             <el-button class="button-style" link type="primary"  @click="editUser(scope.row)">
               编辑
             </el-button>
             <el-button class="button-style" link type="danger"  @click="delUser(scope.row)">
               删除
             </el-button>
           </template>
         </el-table-column>
       </el-table>
     </el-main>
     <el-footer style="padding: 0;">
       <el-pagination style="color: #666666;margin: 20px 0 0 20px;" v-show="total > 0" @current-change="handleCurrentChange" :current-page="pageIndex" :page-size="pageSize" layout="total, prev, pager, next" prev-text="上一页" next-text="下一页" :total="total">
       </el-pagination>
     </el-footer>
   </el-container>

    <el-dialog
      v-model="dialogVisible"
      title="角色信息"
      width="500"
      @close="closeDialog"
      >
      <el-form ref="formref" :inline="true" :model="formDialog" size="large" label-width="100px" :rules="rules">
       
        <el-form-item label="角色名称" prop="role_name">
          <el-input
              class="search-input"
              clearable
              placeholder=""
              v-model="formDialog.role_name"
              >
          </el-input>
        </el-form-item>

        <el-form-item label="描述">
           <el-input
              class="search-input"
              clearable
              placeholder=""
              v-model="formDialog.role_desc"
              >
          </el-input>
        </el-form-item>
        
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancelDialog">取消</el-button>
          <el-button type="primary" @click="saveDialog()">
           保存
          </el-button>
        </div>
      </template>

    </el-dialog>
  </div>
</template>
<script setup>
  import { ref, onMounted, reactive } from 'vue';
  import IndexService from '@/service/IndexService';
  import { useVocabularyStore } from '@/store/vocabulary';
  import { ElMessage, ElMessageBox} from 'element-plus'
  let vocabularyStore = useVocabularyStore();
  let roleList = ref([])
  let loading = ref(false)
  let screenHeight = ref(0)
  let total = ref(0)
  let pageIndex = ref(1)
  let pageSize = ref(10)
  let form = reactive({
    role_name: '',
  })
  let roleId = ref(0)
  let formDialog = reactive({
    role_name: '',
    role_desc: ''
  })
  let rules = ref({
    role_name: [
      { required: true, message: '请输入角色名称！', trigger: 'blur' }
    ]
  });
  let formref = ref()
  let dialogVisible = ref(false)
  onMounted(() => {
    initAccountRolelist() // 角色列表
    window.addEventListener('resize', updateScreenHeight);
    updateScreenHeight();
  })
  function updateScreenHeight () {
    var element = document.getElementById('form');
    if (element) {
      var rect = element.getBoundingClientRect();
      var formHeight = rect.height // form表单的高
    }
    var titleElement = document.getElementById('page-title');
    if (titleElement) {
      var rectTitle = titleElement.getBoundingClientRect();
      var titleHeight = rectTitle.height // 标题-页头高度
      
      var pageHeight = 100 // 分页高度

      var menuHeight = 64 // 导航栏高度

      // console.log(height)
      screenHeight.value = window.innerHeight - formHeight - titleHeight - pageHeight - menuHeight
    }
  }
  function editUser (row) { // 编辑角色
    // console.log(row)
    dialogVisible.value = true
    formDialog.role_name = row.role_name
    formDialog.role_desc = row.role_desc
    roleId.value = row.role_id
  }
  
  function delUser (row) { // 删除角色
    ElMessageBox.confirm('确定删除该记录吗？', '提示信息', {
      confirmButtonText: '确定',
      confirmButtonClass: 'button-confirm',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      IndexService.accountRemoverole(vocabularyStore.user_name, vocabularyStore.session, row.role_id).then((res) => {
        if  (res.error_message !== '') { // 有权限不可删除
          ElMessage({
            message: res.error_message,
            type: 'error'
          })
          return
        }
        if (res.result_code === 200) {
          // console.log(res)
          form.role_name = ''
          initAccountRolelist()
          ElMessage({
            message: '删除成功',
            type: 'success',
            duration: 1000
          })
        }
      }).catch((error) => {
        console.log(error)
      })
      }).catch(() => {
    })
  }
  function handleCurrentChange (page) { // 切换下一页
    pageIndex.value = page
    initAccountRolelist()
  }
  function initAccountRolelist () { // 角色列表
    loading.value = true
    IndexService.accountRolelist(vocabularyStore.user_name, vocabularyStore.session, 'role_name', 'ascending',pageIndex.value, pageSize.value, form.role_name).then((res) => {
      if (res.result_code === 200) {
        roleList.value = res.list
        total.value = res.total
        loading.value = false
      }
      // console.log(res)
    }).catch((error) => {
      console.log(error)
    })
  }
  function newlyAdded () {
    dialogVisible.value = true
    roleId.value = 0
  }
  function cancelDialog () {
    closeDialog()
  }
  function closeDialog () {
    dialogVisible.value = false
    formref.value.resetFields()
    formDialog.role_name = ''
    formDialog.role_desc = ''
  }
  function saveDialog () { // 保存新增信息
    formref.value.validate((valid) => {
      if (valid) {
        loading.value = true
        // console.log(formDialog)
        IndexService.accountEditrole(vocabularyStore.user_name, vocabularyStore.session, formDialog.role_desc, formDialog.role_name, roleId.value).then((res) => {
          if (res.result_code === 200) {
            loading.value = false
            form.role_name = ''
            closeDialog()
            initAccountRolelist() // 角色列表
          } else {
            ElMessage({
              message: res.description,
              type: 'info',
              duration: 1000
            })
          }
        }).catch((error) => {
          console.log(error)
        })
      } else {
        return false
      }
    })
  }
  function onSubmit () {
    initAccountRolelist()
  }
</script>
<style>
</style>



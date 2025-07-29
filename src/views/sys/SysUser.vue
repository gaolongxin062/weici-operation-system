<template>
 <div class="page">
    <div class="page-title" id="page-title">
      <h4>用户设置</h4>
      <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">主页</el-breadcrumb-item>
        <el-breadcrumb-item>用户设置</el-breadcrumb-item>
      </el-breadcrumb> -->
    </div>
    <el-form id="form" :inline="true" :model="form" size="large" label-width="100px" @submit.prevent>
      <el-form-item label="用户名">
        <el-input
            class="search-input"
            clearable
            placeholder="用户名"
            v-model="form.user_name"
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

    <el-dialog
      v-model="dialogVisible"
      title="用户信息"
      width="500"
      @close="closeDialog"
      >
      <el-form ref="formref" :inline="true" :model="formDialog" size="large" label-width="100px" :rules="rules">
        <el-form-item label="用户名" prop="user_name">
          <el-input
              class="search-input"
              clearable
              placeholder=""
              v-model="formDialog.user_name"
              >
          </el-input>
        </el-form-item>

        <!-- <el-form-item label="昵称">
          <el-input
              class="search-input"
              clearable
              placeholder=""
              v-model="formDialog.nickname"
              >
          </el-input>
        </el-form-item> -->

        <el-form-item label="密码" prop="password">
          <el-input
              class="search-input"
              clearable
              type="password" 
              placeholder=""
              v-model="formDialog.password"
              >
          </el-input>
        </el-form-item>

        <el-form-item label="管理员">
          <el-checkbox v-model="formDialog.manager"/>
        </el-form-item>

        <el-form-item label="是否停用">
          <el-checkbox v-model="formDialog.stop_flag"/>
        </el-form-item>
        
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancelDialog">取消</el-button>
          <el-button type="primary" @click="saveDialog(formDialog)">
           保存
          </el-button>
        </div>
      </template>

    </el-dialog>

    <el-table :data="userList"  class="table-info" :max-height="screenHeight" header-cell-class-name="header_row_class"  stripe
      v-loading="loading" 
      element-loading-text="拼命加载中，主人请稍后...">
      <el-table-column prop="user_name" label="用户名" min-width/>
      <!-- <el-table-column prop="nickname" label="昵称" min-width/> -->
      <el-table-column prop="manager" label="管理员" min-width>
        <template #default="scope">
          <div>{{scope.row.manager === 1 ? '是' : '否'}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="stop_flag" label="是否停用" min-width>
        <template #default="scope">
          <div>{{scope.row.stop_flag === 1 ? '是' : '否'}}</div>
        </template>
      </el-table-column>
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
    <el-pagination style="color: #666666;margin: 20px 0 0 20px;" v-show="total > 0" @current-change="handleCurrentChange" :current-page="pageIndex" :page-size="pageSize" layout="total, prev, pager, next" prev-text="上一页" next-text="下一页" :total="total">
    </el-pagination>



  </div>
</template>
<script setup>
  import { ref, onMounted, reactive } from 'vue';
  import IndexService from '@/service/IndexService';
  import { useVocabularyStore } from '@/store/vocabulary';
  import { ElMessage, ElMessageBox} from 'element-plus'
  import md5 from 'js-md5';
  let vocabularyStore = useVocabularyStore();
  let userList = ref([])
  let loading = ref(false)
  let screenHeight = ref(0)
  let total = ref(0)
  let pageIndex = ref(1)
  let pageSize = ref(10)
  let form = reactive({
    user_name: '',
  })
  let userId = ref(0)
  let formDialog = reactive({
    user_name: '',
    // nickname: '',
    password: '',
    manager: false,
    stop_flag: false
  })
  let passwordCopy = ref('')
  let rules = ref({
    user_name: [
      { required: true, message: '请输入用户名！', trigger: 'blur' }
    ],
    password: [
      { required: true, message: '密码不能为空！', trigger: 'blur' }
    ]
  });
  let formref = ref()
  let dialogVisible = ref(false)
  onMounted(() => {
    initAccountUserlist() // 用户列表
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
  function editUser (row) { // 编辑用户
    // console.log(row)
    dialogVisible.value = true
    formDialog.user_name = row.user_name
    // formDialog.nickname = row.nickname
    passwordCopy.value = row.password
    formDialog.password = row.password
    formDialog.manager = row.manager === 1 ? true : false
    formDialog.stop_flag = row.stop_flag === 1 ? true : false
    userId.value = row.user_id
  }
  
  function delUser (row) { // 删除用户
    ElMessageBox.confirm('确定删除该记录吗？', '提示信息', {
      confirmButtonText: '确定',
      confirmButtonClass: 'button-confirm',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      IndexService.accountRemoveuser(vocabularyStore.user_name, vocabularyStore.session, row.user_id).then((res) => {
        if  (res.error_message !== '') { // 有权限不可删除
          ElMessage({
            message: res.error_message,
            type: 'error'
          })
          return
        }
        if (res.result_code === 200) {
          // console.log(res)
          form.user_name = ''
          initAccountUserlist()
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
    initAccountUserlist()
  }
  function initAccountUserlist () { // 用户列表
    loading.value = true
    IndexService.accountUserlist(vocabularyStore.user_name, vocabularyStore.session, 'user_name', 'ascending',pageIndex.value, pageSize.value, form.user_name).then((res) => {
      if (res.result_code === 200) {
        userList.value = res.list
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
    userId.value = 0
  }
  function cancelDialog () {
    closeDialog()
  }
  function closeDialog () {
    dialogVisible.value = false
    formref.value.resetFields()
    formDialog.user_name = ''
    // formDialog.nickname = ''
    formDialog.password = ''
    formDialog.manager = ''
    formDialog.stop_flag = ''
  }
  function saveDialog () { // 保存新增信息
    formref.value.validate((valid) => {
      if (valid) {
        // loading.value = true
        // console.log(formDialog)
        // console.log(formDialog.password)
        // console.log(passwordCopy.value)
        IndexService.accountEdituser(vocabularyStore.user_name, vocabularyStore.session, formDialog.password === passwordCopy.value ? formDialog.password : md5(formDialog.password), formDialog.user_name, formDialog.manager === 0 || formDialog.manager === false  ? false : true, '', formDialog.stop_flag === 0  || formDialog.stop_flag === false ? false : true, userId.value).then((res) => {
          if (res.result_code === 200) {
            form.user_name = ''
            closeDialog()
            initAccountUserlist() // 用户列表
          } else {
            ElMessage({
              message: res.description,
              type: 'error',
              duration: 1000
            })
          }
          // loading.value = false
        }).catch((error) => {
          console.log(error)
        })
      } else {
        return false
      }
    })
  }
  function onSubmit () {
    initAccountUserlist()
  }
</script>
<style>
</style>



<template>
 <div class="page">
    <div class="page-title" id="page-title">
      <h4>用户角色</h4>
      <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">主页</el-breadcrumb-item>
        <el-breadcrumb-item>用户角色</el-breadcrumb-item>
      </el-breadcrumb> -->
    </div>

    <div class="role-tree" :style="{height: screenHeight + 'px'}">
      <!-- 用户 -->
      <div class="tree-box" :style="{maxHeight: screenHeight + 'px'}">
        <el-tree
          style="max-width: 600px"
          :data="usertreeList"
          :props="defaultProps"
          :highlight-current="true"
          :default-expand-all="true"
          @node-click="handleNodeClick"
        />
      </div>
      <!-- 角色 -->
      <div style="display:flex;flex-direction: column;width: 50%;" >
        <div class="tree-box" :style="{width:'87%', maxHeight: (screenHeight) + 'px'}">
          <el-tree
            ref="treeRef"  
            style="max-width: 600px"
            :data="rolesTreeList"
            node-key="role_id"
            :props="defaultPropsRoles"
            :default-expand-all="true"
            @check-change="getCheckedData"
            show-checkbox
          />
        </div>
        <el-button type="primary" style='width:100px;margin-top:20px;' @click="saveUserRoles">保存</el-button>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { ref, onMounted } from 'vue';
  import IndexService from '@/service/IndexService';
  import { useVocabularyStore } from '@/store/vocabulary';
  import { ElMessage} from 'element-plus'
  let usertreeList = ref([]) // 用户
  let rolesTreeList = ref([]) // 角色
  let vocabularyStore = useVocabularyStore();
  let screenHeight = ref(0)
  let userId = ref(0)
  let rolesJson = ref('') // 保存的角色json串
  const treeRef = ref(null)
  // let defaultRolesList = ref([]) // 默认选中用户的角色
  let defaultProps = ref({
    children: 'children',
    label: 'user_name'
  })
  let defaultPropsRoles = ref({
    children: 'children',
    label: 'role_name'
  })
  onMounted(() => {
    initAccountUsertree() // 用户树
    initAccountRoletree() // 角色树
    window.addEventListener('resize', updateScreenHeight);
    updateScreenHeight();
  })
  function handleNodeClick (data) { // 点击切换左侧用户树
    // console.log(data)
    userId.value = data.user_id
    getUserrole() // 获取用户角色
  }
  function getUserrole () { // 获取用户角色
    IndexService.accountUserrole(vocabularyStore.user_name, vocabularyStore.session, userId.value).then((res) => {
      if (res.result_code === 200) {
        treeRef.value.setCheckedKeys(res.roles, false)
        // console.log(res.roles)
      }
    }).catch((error) => {
      console.log(error)
    })
  }
  function getCheckedData () { // 获取选中的角色数据
    if (treeRef.value) {  
      const checkedNodes = treeRef.value.getCheckedNodes().filter(item => item.children.length === 0) 
      // console.log(checkedNodes); // 打印选中的节点数据数组  
      rolesJson.value = checkedNodes.map(item => ({  
        role_id: item.role_id,  
        role_name: item.role_name  
      }))
      // console.log(rolesJson.value)
    }  
  }
  function saveUserRoles () { // 保存用户角色
    if (userId.value === 0) {
      ElMessage({
        message: '请选择用户',
        type: 'error',
        duration: 1000
      })
      return
    }
    IndexService.accountSaveuserrole(vocabularyStore.user_name, vocabularyStore.session, userId.value, JSON.stringify(rolesJson.value)).then((res) => {
      if (res.result_code === 200) {
        // console.log(res)
        ElMessage({
          message: '保存成功',
          type: 'success',
          duration: 1000
        })
      }
    }).catch((error) => {
      console.log(error)
    })
  }
  function initAccountUsertree () { // 用户树
    IndexService.accountUsertree(vocabularyStore.user_name, vocabularyStore.session).then((res) => {
      if (res.result_code === 200) {
        usertreeList.value = res.users
        
        // console.log(res)
      }
    }).catch((error) => {
      console.log(error)
    })
  }
  function initAccountRoletree () { // 角色树
    IndexService.accountRoletree(vocabularyStore.user_name, vocabularyStore.session).then((res) => {
      if (res.result_code === 200) {
        rolesTreeList.value = res.roles
        
        // console.log(res)
      }
    }).catch((error) => {
      console.log(error)
    })
  }
  function updateScreenHeight () {
    // var element = document.getElementById('form');
    // var rect = element.getBoundingClientRect();
    // var formHeight = rect.height // form表单的高

    var titleElement = document.getElementById('page-title');
    if (titleElement) {
      var rectTitle = titleElement.getBoundingClientRect();
      var titleHeight = rectTitle.height // 标题-页头高度
      
      var pageHeight = 50 // 分页高度

      var menuHeight = 64 // 导航栏高度

      // console.log(height)
      screenHeight.value = window.innerHeight - titleHeight - pageHeight - menuHeight
      // console.log(screenHeight.value)
    }
  }
</script>
<style scoped>
  .role-tree{
    display: flex;
  }
  .tree-box{
    padding: 20px;
    margin-right:20px;
    border: 1px solid #eaeefb;
    width:50%;
    overflow-y: auto;
    height:100%;
    box-sizing: border-box;
  }
</style>



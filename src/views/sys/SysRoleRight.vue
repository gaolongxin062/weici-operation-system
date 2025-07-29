<template>
 <div class="page">
    <div class="page-title" id="page-title">
      <h4>角色权限</h4>
      <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">主页</el-breadcrumb-item>
        <el-breadcrumb-item>角色权限</el-breadcrumb-item>
      </el-breadcrumb> -->
    </div>

    <div class="role-tree" :style="{height: screenHeight + 'px'}">
     
      <!-- 角色 -->
      <div class="tree-box" :style="{maxHeight: screenHeight + 'px'}">
        <el-tree
          style="max-width: 600px"
          :data="rolesTreeList"
          :props="defaultPropsRoles"
          :highlight-current="true"
          :default-expand-all="true"
          @node-click="handleNodeClick"
        />
      </div>

       <!-- 权限 -->
      <div style="display:flex;flex-direction: column;width: 50%;" >
        <div class="tree-box" :style="{width:'87%', maxHeight: (screenHeight - 50) + 'px'}">
          <el-tree
            ref="treeRef"  
            style="max-width: 600px"
            :data="treeList"
            node-key="menu_index"
            :props="defaultProps"
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
  let treeList = ref([]) // 权限树
  let rolesTreeList = ref([]) // 角色
  let vocabularyStore = useVocabularyStore();
  let screenHeight = ref(0)
  let roleId = ref(0)
  let selectedNodeArr = ref([]) // 当前选中的节点数据 包含父节点
  let rights = ref('') // 保存的权限json串
  let rightEnd = ref('') // 末级权限json串
  const treeRef = ref(null)
  // let defaultRolesList = ref([]) // 默认选中用户的角色
  let defaultProps = ref({
    children: 'children',
    label: 'menu_name'
  })
  let defaultPropsRoles = ref({
    children: 'children',
    label: 'role_name'
  })
  onMounted(() => {
    initTree() // 权限树
    initAccountRoletree() // 角色树
    window.addEventListener('resize', updateScreenHeight);
    updateScreenHeight();
  })
  function handleNodeClick (data) { // 点击切换左侧角色树
    // console.log(data)
    roleId.value = data.role_id
    getRoleright() // 获取角色权限
  }
  function getRoleright () { // 获取角色权限
    IndexService.accountRoleright(vocabularyStore.user_name, vocabularyStore.session, roleId.value).then((res) => {
      if (res.result_code === 200) {
        treeRef.value.setCheckedKeys(JSON.parse(res.rights), true)
        // console.log(JSON.parse(res.rights))
        // console.log(typeof res.rights)
      }
    }).catch((error) => {
      console.log(error)
    })
  }
  // 用于获取节点的父节点数据  
  function getParentNodeData(node, parentNodes = []) {  
    const parentNode = treeRef.value.getNode(node).parent;  
    if (parentNode) {  
      // 将父节点数据添加到数组中  
      if (!Array.isArray(parentNode.data)) {  
        parentNodes.push(parentNode.data);  
      }  
      // 递归地获取父节点的父节点数据  
      getParentNodeData(parentNode, parentNodes);  
    }  
    return parentNodes; 
  }
  function getCheckedData () { // 获取选中的权限数据
    if (treeRef.value) {  
      let nodeList = treeRef.value.getCheckedNodes(true, false);  
        
      // 创建一个数组来存储所有选中的节点及其父节点的数据  
      const allCheckedAndParentNodes = [];  
        
      // 遍历所有选中的节点  
      nodeList.forEach(node => {  
        // 将当前选中的节点数据添加到数组中 
        if (!Array.isArray(node)) {  
          allCheckedAndParentNodes.push(node);  
        }  
          
        // 获取当前节点的所有父节点数据  
        const parentNodes = getParentNodeData(node, []);  
        // // 将父节点数据添加到数组中  
        allCheckedAndParentNodes.push(...parentNodes);  
      });  
        
      // 去除数组中的重复项
      selectedNodeArr.value = [...new Set(allCheckedAndParentNodes)];  
    } 
    // console.log(selectedNodeArr.value)
    rights.value = selectedNodeArr.value.map(item => ({  
      menu_index: item.menu_index
    }))

    rightEnd.value = treeRef.value.getCheckedNodes(true, false).map(item => item.menu_index)
    // console.log(rights.value)
    // console.log(rightEnd.value) 
  }
  function saveUserRoles () { // 保存角色权限
    if (roleId.value === 0) {
      ElMessage({
        message: '请选择角色',
        type: 'error',
        duration: 1000
      })
      return
    }
    IndexService.accountSaveroleright(vocabularyStore.user_name, vocabularyStore.session, roleId.value, JSON.stringify(rights.value), JSON.stringify(rightEnd.value)).then((res) => {
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
  function initTree () { // 权限树
    IndexService.accountRighttree(vocabularyStore.user_name, vocabularyStore.session).then((res) => {
      if (res.result_code === 200) {
        treeList.value = res.rights
      }
      // console.log(res)
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



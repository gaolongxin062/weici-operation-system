<template>
 <div class="page">
    <div class="page-title" id="page-title">
      <h4>添加功能</h4>
    </div>

    <div class="role-tree" :style="{height: screenHeight + 'px'}">
     
      <!-- 功能菜单 -->
      <div class="tree-box" :style="{maxHeight: screenHeight + 'px'}">
        <el-tree
          :data="sysmenuTreeList"
          ref="menuTree"
          node-key="menu_id"
          :default-expanded-keys="defaultExanded"
          :props="defaultProps"
          :current-node-key="currentKey"
          highlight-current
          @node-click="handleNodeClick"
          @node-expand="nodeExpand"
          @node-collapse="nodeCollapse" 
        />
      </div>

       <!-- 列表 -->
      <div style="display:flex;flex-direction: column;width: 80%;" >
        <el-button type="primary" style='width:80px;margin-bottom:20px;margin-left:20px;' @click="newAddmenu">新增</el-button>
        <el-table  :max-height="screenHeight" :data="sysMenuDataList" class="table-info" header-cell-class-name="header_row_class"  stripe
        v-loading="loading"
        element-loading-text="拼命加载中，主人请稍后...">
        <el-table-column  width="100" align="center" label="序号">
          <template #default="scope">
            <div class="title-resource">{{(pageIndex-1)*pageSize+(scope.$index)+1}}&nbsp;&nbsp;</div>
          </template>
        </el-table-column>
        <el-table-column prop="menu_code" label="菜单编码" sortable width="120"/>
        <el-table-column prop="menu_index" label="菜单索引" width="170" sortable />
        <el-table-column prop="menu_name" label="菜单名称" width="170" sortable />
        <el-table-column prop="icon" label="图标"/>
        <el-table-column prop="path" label="路径" width="170" />
        <el-table-column prop="right_flag" label="权限标记">
          <template #default="scope">
            <el-button class="button-style" link :type="scope.row.right_flag === 0 ? 'danger' : 'success'">
              {{scope.row.right_flag === 0 ? '否' : '是'}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="stop_flag" label="状态">
          <template #default="scope">
            <el-button class="button-style" link :type="scope.row.stop_flag === 0 ? 'success' : 'danger'">
              {{scope.row.stop_flag === 0 ? '启用' : '停用'}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column  label="操作" width="120" fixed="right" >
          <template #default="scope">
           
            <el-button class="button-style" link type="primary"  @click="editTest(scope.row)">
                修改
            </el-button>
            <el-button class="button-style" link type="danger"  @click="delTest(scope.row)">
                删除
            </el-button>
           
          </template>
        </el-table-column>
      </el-table>
      
      <el-pagination style="color: #666666;margin: 20px 0 0 20px;" v-show="total > 0" @current-change="handleCurrentChange" :current-page="pageIndex" :page-size="pageSize" layout="total, prev, pager, next" prev-text="上一页" next-text="下一页" :total="total">
      </el-pagination>

      </div>

    </div>
    <el-dialog
      v-model="dialogVisible"
      title="编辑"
      width="500"
      @close="closeDialog"
      >
      <el-form ref="formref" :inline="true" :model="formDialog" size="large" label-width="100px" :rules="rules">
        <el-form-item label="父级编码" >
          <el-input
              class="search-input"
              clearable
              disabled
              placeholder=""
              v-model="formDialog.parent_code"
              >
          </el-input>
        </el-form-item>


        <el-form-item label="父级名称" >
          <el-input
              class="search-input"
              clearable
              placeholder=""
              disabled
              v-model="formDialog.parent_name"
              >
          </el-input>
        </el-form-item>

        <el-form-item label="菜单编码" prop="menu_code">
          <el-input
              class="search-input"
              clearable
              placeholder=""
              v-model="formDialog.menu_code"
              >
          </el-input>
        </el-form-item>

        <el-form-item label="菜单索引" prop="menu_index">
          <el-input
              class="search-input"
              clearable
              placeholder=""
              v-model="formDialog.menu_index"
              >
          </el-input>
        </el-form-item>

        <el-form-item label="菜单名称" prop="menu_name">
          <el-input
              class="search-input"
              clearable
              placeholder=""
              v-model="formDialog.menu_name"
              >
          </el-input>
        </el-form-item>

        <el-form-item label="图标">
          <el-input
              class="search-input"
              clearable
              placeholder=""
              v-model="formDialog.icon"
              >
          </el-input>
        </el-form-item>

        <el-form-item label="路径">
          <el-input
              class="search-input"
              clearable
              placeholder=""
              v-model="formDialog.path"
              >
          </el-input>
        </el-form-item>

        <el-form-item label="权限标记">
          <el-checkbox v-model="formDialog.right_flag"/>
        </el-form-item>

        <el-form-item label="停用">
          <el-checkbox v-model="formDialog.stop_flag"/>
        </el-form-item>
        
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeDialog">取消</el-button>
          <el-button type="primary" @click="saveAddmenu()">
           提交
          </el-button>
        </div>
      </template>

    </el-dialog>
  </div>
</template>
<script setup>
  import { ref, onMounted, reactive, nextTick } from 'vue';
  import IndexService from '@/service/IndexService';
  import { useVocabularyStore } from '@/store/vocabulary';
  import { ElMessage, ElMessageBox} from 'element-plus'
  let vocabularyStore = useVocabularyStore();
  let screenHeight = ref(0)
  let sysmenuTreeList = ref([])
  let menuId = ref(0)
  let dialogVisible = ref(false)
  let defaultProps = ref({
    children: 'children',
    label: 'menu_text'
  })
  let loading = ref(false)
  let defaultExanded = ref([0]) // 默认选中项
  const expandedKeys = ref([]); // 用于存储当前展开的节点的 key 数组  
  let currentKey = ref(0); 
  let menuTree = ref(null)
  let formDialog = reactive({
    parent_code: '',
    parent_name: '主功能',
    menu_code: '',
    menu_index: '',
    menu_name: '',
    icon: '',
    path: '',
    right_flag: false,
    stop_flag: false
  })
  let sysMenuDataList = ref([])
  let pageIndex = ref(1)
  let pageSize = ref(10)
  let total = ref(0)
  let formref = ref(null)
  let rules = ref({
    menu_code: [
      { required: true, message: '请输入菜单编码！', trigger: 'blur' }
    ],
    menu_index: [
      { required: true, message: '请输入索引！', trigger: 'blur' }
    ],
    menu_name: [
      { required: true, message: '请输入菜单名！', trigger: 'blur' }
    ]
  });
  let nodeClick = ref('')
  onMounted(() => {
    initAccountSysmenu() // 功能菜单
    window.addEventListener('resize', updateScreenHeight);
    updateScreenHeight();
  })
  function editTest (row) {
    dialogVisible.value = true
    // console.log(row)
    if (nodeClick.value) {
      formDialog.parent_code = nodeClick.value.menu_code
      formDialog.parent_name = nodeClick.value.menu_name
    }
    formDialog.menu_code = row.menu_code
    formDialog.menu_index = row.menu_index
    formDialog.menu_name = row.menu_name
    formDialog.icon = row.icon
    formDialog.path = row.path
    menuId.value = row.menu_id
    formDialog.right_flag = row.right_flag === 0 ? false : true
    formDialog.stop_flag = row.stop_flag === 0 ? false : true
  }
  function delTest (row) {
    ElMessageBox.confirm('确定删除该记录吗？', '提示信息', {
      confirmButtonText: '确定',
      confirmButtonClass: 'button-confirm',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      IndexService.accountRemovemenu(vocabularyStore.user_name, vocabularyStore.session, row.menu_id).then((res) => {
        if (res.result_code === 200) {
          // console.log(res)
          initAccountSysmenu()
          ElMessage({
            message: '删除成功',
            type: 'success',
            duration: 1000
          })
          initTree()
        }
      }).catch((error) => {
        console.log(error)
      })
      }).catch(() => {
    })
  }
  function nodeExpand (keys) {
    expandedKeys.value.push(keys.menu_id);  
    // console.log(expandedKeys.value)
  }
  function nodeCollapse (keys) {
    expandedKeys.value = expandedKeys.value.filter(k => keys.menu_id !== (k)); 
    // console.log(expandedKeys.value)
  }
  function initAccountSysmenu () { // 功能菜单
    IndexService.accountSysmenu(vocabularyStore.user_name, vocabularyStore.session).then((res) => {
      if (res.result_code === 200) {
        sysmenuTreeList.value = res.menu
        initSysmenuList() // 功能列表
        nextTick(() => {
          if (nodeClick.value !== '') {
            // console.log(890)
            nextTick(() => {
              menuTree.value.setCurrentKey(nodeClick.value.menu_id)
              defaultExanded.value = expandedKeys.value
            })
          } else {
            menuTree.value.setCurrentKey(res.menu[0].menu_id)
            defaultExanded.value = [res.menu[0].menu_id]
          }
          // console.log(defaultExanded.value)
        })
      }
    }).catch((error) => {
      console.log(error)
    })
  }
  function handleCurrentChange (page) {
    pageIndex.value = page
    initSysmenuList()
  }
  function initSysmenuList () { // 功能列表
    IndexService.accountMenulist(vocabularyStore.user_name, vocabularyStore.session, formDialog.parent_code, 'menu_code', 'ascending', pageIndex.value, pageSize.value).then((res) => {
      if (res.result_code === 200) {
        sysMenuDataList.value = res.list
        total.value = res.total
        // console.log(res)
      }
    }).catch((error) => {
      console.log(error)
    })
  }
  function newAddmenu () {
    dialogVisible.value = true
    menuId.value = 0
  }
  function closeDialog () {
    dialogVisible.value = false
    formref.value.resetFields()
    // formDialog.parent_code = ''
    // formDialog.parent_name = ''
    formDialog.menu_code = ''
    formDialog.menu_index = ''
    formDialog.menu_name = ''
    formDialog.icon = ''
    formDialog.path = ''
    formDialog.right_flag = false
    formDialog.stop_flag = false
  }
  function handleNodeClick (data) { // 点击切换左侧功能菜单
    formDialog.parent_code = data.menu_code
    formDialog.parent_name = data.menu_name
    nodeClick.value = data
    initSysmenuList() // 功能列表
    // console.log(data)
  }
  function saveAddmenu () { // 保存新增信息
    formref.value.validate((valid) => {
      if (valid) {
        // console.log(formDialog)
        IndexService.accountEditmenu(vocabularyStore.user_name, vocabularyStore.session, formDialog.stop_flag, formDialog.right_flag, formDialog.path, formDialog.parent_code, formDialog.menu_name, formDialog.menu_index, menuId.value, formDialog.menu_code, formDialog.icon,).then((res) => {
          if (res.result_code === 200) {
            ElMessage({
              message: '添加成功',
              type: 'success',
              duration: 1000
            })
            initTree() // 左侧导航tree数据更新
            closeDialog()
            initAccountSysmenu()
          }
        }).catch((error) => {
          console.log(error)
        })
      } else {
        return false
      }
    })
  }
  function initTree () {
    IndexService.accountMenu(vocabularyStore.user_name, vocabularyStore.session).then((res) => {
      if (res.result_code === 200) {
        vocabularyStore.setAccountMenuLefTree(res.menu)
        // console.log(res.menu)
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
    /* padding: 20px; */
    margin-right:20px;
    border: 1px solid #eaeefb;
    width:250px;
    overflow: auto;
    height:100%;
    box-sizing: border-box;
  }
</style>



<template>
  <div class="page">
    <div class="page-title" id="page-title">
      <h4>职务管理</h4>
    </div>

    <el-form id="forms" :inline="true" :model="searchForm" size="large" label-width="90px">
      <div style="display: flex;align-items: center;">
        <div style="margin-right: 20px;">
          <el-form-item label="职务名称">
            <el-input style="width: 240px" class="search-input" clearable placeholder="请输入"
              v-model="searchForm.role_name">
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="btnSearch">查询</el-button>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="btnReset">重置</el-button>
          </el-form-item>

          <el-form-item>
            <el-button type="success" v-if="addPower" @click="btnAdded">新增职务</el-button>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <el-table :data="provinceList" class="table-info" :max-height="screenHeight" v-loading="loading"
      header-cell-class-name="header_row_class" ref="multipleTable" stripe element-loading-text="拼命加载中，主人请稍后...">
      <el-table-column label="职务名称">
        <template #default="scope">
          <div>{{ scope.row.role_name || '-' }}</div>
        </template>
      </el-table-column>

      <el-table-column label="级别">
        <template #default="scope">
          <div>{{ getRoleLabel(scope.row.role_level) || '-' }}</div>
        </template>
      </el-table-column>

      <el-table-column label="创建时间">
        <template #default="scope">
          <div>{{ scope.row.make_date || '-' }}</div>
        </template>
      </el-table-column>

      <el-table-column label="描述" min-width="200px">
        <template #default="scope">
          <div>{{ scope.row.role_desc || '-' }}</div>
        </template>
      </el-table-column>

      <el-table-column label="操作" fixed="right" v-if="deletePower || editPower">
        <template #default="scope">
          <el-button class="button-style" link type="primary" @click="detail(scope.row)">
            详情
          </el-button>
          <el-button v-if="editPower" class="button-style" link type="primary" @click="edit(scope.row)">
            编辑
          </el-button>
          <el-button v-if="deletePower" class="button-style" link type="danger" @click="del(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 此页面不需要分页，分页功能先注释避免日后需求更改 -->
    <el-pagination style="color: #666666;margin: 20px 0 0 20px;" v-show="total > 0"
      @current-change="handleCurrentChange" :current-page="pageIndex" :page-size="pageSize"
      layout="total, prev, pager, next" prev-text="上一页" next-text="下一页" :total="total">
    </el-pagination>

    <!-- 新增/编辑弹窗 -->
    <div class="add-dialog">
      <el-dialog v-model="dialogAdd" title="新增职务" width="500" :show-close="false" :destroy-on-close="true"
        @close="closeDialogAdd">
        <el-form :inline="true" ref="formref" id="form" :model="dialogForm" size="large" label-width="100px"
          :rules="rules" :disabled="dialogFormDisabled">
          <el-form-item label="职务级别" prop="role_level" label-width="80px">
            <el-select :disabled="dialogFormDisabled" v-model="dialogForm.role_level" placeholder="请选择内容"
              style="width: 240px" clearable filterable>
              <el-option v-for="item in roleEnum" :key="item.id" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="职务描述" prop="role_desc" label-width="80px">
            <el-input class="search-input" clearable placeholder="请输入" type="textarea" show-word-limit :maxlength="300"
              v-model="dialogForm.role_desc" :autosize="{ minRows: 4, maxRows: 6 }">
            </el-input>
          </el-form-item>
          <el-form-item label="职务名称" prop="role_name" label-width="80px">
            <el-input class="search-input" clearable placeholder="" show-word-limit :maxlength="20"
              v-model="dialogForm.role_name">
            </el-input>
          </el-form-item>
          <el-form-item label="操作权限" prop="rights" label-width="150px">
            <el-tree ref="treeRef" style="max-width: 600px" :data="treeList" node-key="menu_index" :props="defaultProps"
              :default-expand-all="true" @check-change="getCheckedData" show-checkbox />
          </el-form-item>
        </el-form>

        <template #footer>
          <div class="dialog-footer">
            <el-button @click="closeDialogAdd">取消</el-button>
            <el-button type="primary" @click="makeSureBtn">
              保存
            </el-button>
          </div>
        </template>
      </el-dialog>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, reactive, nextTick } from 'vue';
import { useScreenHeight } from '@/hooks/useScreenHeight.js';
const { screenHeight } = useScreenHeight();
import basicService from '@/service/BasicService.js';
import dealerService from '@/service/DealerService';
import { useVocabularyStore } from '@/store/vocabulary';
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
let vocabularyStore = useVocabularyStore();
let searchForm = reactive({
  role_name: '' // 职务名
})
const roleEnum = reactive(
  [
    {
      value: 1,
      label: '省级(包括直辖市)'
    },
    {
      value: 2,
      label: '市级'
    },
    {
      value: 3,
      label: '区级'
    },
    {
      value: 4,
      label: '普通人员'
    },
  ]
)

const treeList = ref([])
const dialogFormDisabled = ref(false)
const defaultProps = ref({
  children: 'children',
  label: 'menu_name',
  disabled: ''
})
let pageIndex = ref(1)
let pageSize = ref(10)
let total = ref(0)
let dialogAdd = ref(false)
let loading = ref(false)
let provinceList = ref([]) // 表格数据
let dialogForm = reactive({
  role_level: '', // 职务级别
  role_id: '', // 职务id
  role_desc: '', // 职务描述
  rights: ref([]), // 权限json
  right_end: ref([]), // 权限末级
  role_name: '' // 职务名称
})
let rules = ref({
  role_level: [
    { required: true, message: '请选择', trigger: 'change' },
  ],
  role_desc: [
    { required: true, message: '请输入', trigger: 'blur' },
  ],
  role_name: [
    { required: true, message: '请输入', trigger: 'blur' },
  ],
  rights: [
    {
      required: true,
      message: '请选择操作权限',
      trigger: 'change', // 触发时机：树形组件勾选变化时
      // 自定义校验器：手动访问 ref 数组的 .value
      validator: (rule, value, callback) => {
        const rightsArr = value?.value || [];
        if (rightsArr.length > 0) {
          callback(); // 校验通过
        } else {
          callback(new Error('请选择操作权限')); // 校验失败
        }
      }
    },
  ]
});
let formref = ref()
const treeRef = ref()
const selectedNodeArr = ref([])
const dialogTitle = ref('新增')
const addPower = ref(false)
const editPower = ref(false)
const deletePower = ref(false)
onMounted(() => {
  getUserPower()
  getRoleList()
})
// 获取用户权限
const getUserPower = () => {
  return basicService.getPower(
    vocabularyStore.user_name,
    vocabularyStore.session,
  )
    .then((res) => {
      if (res.data.findIndex(item => item.menu_index == 'dealer_job_add') !== -1) addPower.value = true
      if (res.data.findIndex(item => item.menu_index == 'dealer_job_edit') !== -1) editPower.value = true
      if (res.data.findIndex(item => item.menu_index == 'dealer_job_del') !== -1) deletePower.value = true
    })
    .catch((error) => {
      console.log(error)
    })
    .finally(() => {
      loading.value = false
    })
}
// 获取职务列表
const getRoleList = async () => {
  const params = {
    session: vocabularyStore.session,
    user_name: vocabularyStore.user_name,
    role_name: searchForm.role_name,
    page_index: pageIndex.value,
    page_size: pageSize.value
  }
  try {
    const res = await dealerService.getDistributorRoleList(params)
    if (res.result_code === 200) {
      if (res.list && res.list.length) {
        provinceList.value = res.list
        total.value = res.total
      } else {
        provinceList.value = []
        total.value = 0
      }
    } else {
      ElMessage({
        message: res.description,
        type: 'error',
      })
    }

  } catch (error) {
    console.error('获取省份列表失败', error)
  }
}

// 获取经销商权限树
const getRoleTree = async () => {
  const params = {
    session: vocabularyStore.session,
    user_name: vocabularyStore.user_name,
  }
  try {
    const res = await dealerService.getDistributorRightTree(params)
    if (res.result_code === 200) {
      if (res.rights && res.rights.length) {
        treeList.value = res.rights
      } else {
        treeList.value = []
      }
    } else {
      ElMessage({
        message: res.description,
        type: 'error',
      })
    }

  } catch (error) {
    console.error('获取经销商权限树失败', error)
  }
}

// 选择经销商权限
const getCheckedData = () => {
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
  dialogForm.rights.value = selectedNodeArr.value.map(item => ({
    menu_index: item.menu_index
  }))

  dialogForm.right_end.value = treeRef.value.getCheckedNodes(true, false).map(item => item.menu_index)

}
// 用于获取节点的父节点数据  
const getParentNodeData = (node, parentNodes = []) => {
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
const getRoleLabel = (value) => {
  if (!value) return '';
  const matchItem = roleEnum.find(item => item.value === Number(value));
  return matchItem ? matchItem.label : '-';
};
// 取消新增
const closeDialogAdd = () => {
  dialogAdd.value = false
  formref.value.resetFields()
  dialogForm.id = ''
  dialogFormDisabled.value = false
}
// 确定新增/编辑
const makeSureBtn = () => {
  formref.value.validate(async (valid) => {
    if (valid) {
      const loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })
      let params = {
        right_end: JSON.stringify(dialogForm.right_end.value),
        rights: JSON.stringify(dialogForm.rights.value),
        role_desc: dialogForm.role_desc,
        role_id: dialogForm.role_id ? dialogForm.role_id : 0,
        role_level: dialogForm.role_level,
        role_name: dialogForm.role_name,
        session: vocabularyStore.session,
        user_name: vocabularyStore.user_name,
      }

      try {
        const res = await dealerService.editDistributorRole(params)
        if (res.result_code === 200) {
          getRoleList()
          closeDialogAdd()
        } else if (res.result_code === 913) {
          ElMessage({
            message: '职务已存在',
            type: 'error',
          })
        } else {
          ElMessage({
            message: res.description,
            type: 'error',
          })
        }
        loading.close()
      } catch (error) {
        console.log(error)
        loading.close()
      }
    } else {
      return false
    }
  })
}

// 获取职位详情
const getRoleDetail = async (role_id) => {
  const params = {
    session: vocabularyStore.session,
    user_name: vocabularyStore.user_name,
    role_id: role_id,
  }
  try {
    const res = await dealerService.getDistributorRole(params)
    if (res.result_code === 200) {
      if (res.role) {
        dialogForm.role_name = res.role.role_name
        dialogForm.role_desc = res.role.role_desc
        dialogForm.role_id = res.role.role_id
        dialogForm.role_level = res.role.role_level
      }
      treeRef.value.setCheckedKeys(JSON.parse(res.rights), true)
    } else {
      ElMessage({
        message: res.description,
        type: 'error',
      })
    }
  } catch (error) {
    console.log(error)
  }
}
// 切换下一页-
const handleCurrentChange = (page) => {
  pageIndex.value = page
  getRoleList() // 表格数据
}
// 查询
const btnSearch = () => {
  getRoleList()
}
// 重置
const btnReset = () => {
  searchForm.role_name = ''
  pageIndex.value = 1
  getRoleList()
}
// 新增
const btnAdded = () => {
  dialogTitle.value = '新增'
  dialogAdd.value = true
  getRoleTree()
}
// 编辑
const edit = (row) => {
  getRoleDetail(row.role_id)
  getRoleTree()
  dialogTitle.value = '编辑'
  dialogAdd.value = true
}
// 查看
const detail = (row) => {
  getRoleDetail(row.role_id)
  getRoleTree()
  dialogAdd.value = true
  dialogFormDisabled.value = true
  nextTick(() => {
    defaultProps.value.disabled = 'disabled'
  })
}
// 删除
const del = (row) => {
  ElMessageBox.confirm(
    '是否确认删除',
    {
      confirmButtonText: '确定',
      confirmButtonClass: 'button-confirm',
      cancelButtonText: '取消',
      center: true,
    }
  ).then(() => {
    let params = {
      user_name: vocabularyStore.user_name,
      session: vocabularyStore.session,
      role_id: row.role_id
    }
    dealerService.removeDistributorRole(params).then((res) => {
      if (res.result_code === 200) {
        getRoleList()
        ElMessage({
          message: '删除成功',
          type: 'success',
          duration: 1000
        })
      } else if (res.result_code === 919) {
        ElMessage({
          message: '正在被引用,禁止删除',
          type: 'error',
          duration: 3000
        })
      } else {
        ElMessage({
          message: res.description,
          type: 'info',
          duration: 3000
        })
      }
    }).catch((error) => {
      console.log(error)
    })
  }).catch(() => {
  })
}
</script>

<style scoped>
.table-info {
  width: 96% !important;
  margin-left: 20px;
  border: 1px solid var(--el-border-color-lighter);
  border-right: 1px solid var(--el-border-color-lighter) !important;
}

.line {
  margin: 30px 0;
  border: 1px dotted #eee;
}

#form .el-select {
  --el-select-width: 250px;
}

#form .el-input {
  --el-input-width: 250px;
}

#form .el-textarea {
  width: 350px;
}

.over-hidden {
  width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

#cityForms {
  padding: 0 20px;
}

#cityForms :deep(.el-form-item) {
  margin-right: 10px !important;
}

.year-box {
  display: flex;
  margin-top: 20px;
}

.year-item {
  margin-right: -1px;
  padding: 0px 14px;
  border: 1px solid #eee;
  cursor: pointer;
}

.active-years {
  background: rgba(64, 158, 255, 1);
  color: #fff;
}
</style>
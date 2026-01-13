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

    <el-table 
      :data="provinceList" 
      class="table-info" 
      :max-height="screenHeight" 
      v-loading="loading"
      header-cell-class-name="header_row_class" 
      ref="multipleTable" 
      stripe 
      element-loading-text="拼命加载中，主人请稍后..."
    >
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
      <el-table-column label="描述" min-width="180px" show-overflow-tooltip>
        <template #default="scope">
          <div class="ellipsis-text">{{ scope.row.role_desc || '-' }}</div>
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

    <!-- 分页组件 -->
    <el-pagination 
      style="color: #666666;margin: 20px 0 0 20px;" 
      v-show="total > 0"
      @current-change="handleCurrentChange" 
      :current-page="pageIndex" 
      :page-size="pageSize"
      layout="total, prev, pager, next" 
      prev-text="上一页" 
      next-text="下一页" 
      :total="total"
    >
    </el-pagination>

    <!-- 新增/编辑/详情弹窗 -->
    <div class="add-dialog">
      <el-dialog 
        v-model="dialogAdd" 
        :title="dialogTitle" 
        width="500" 
        :show-close="false" 
        :destroy-on-close="true"
        @close="closeDialogAdd"
        top="5vh"
      >
        <el-form 
          :inline="true" 
          ref="formref" 
          id="form" 
          :model="dialogForm" 
          size="large" 
          label-width="100px"
          :rules="rules" 
          :disabled="dialogFormDisabled"
        >
          <el-form-item v-if="!dialogForm.role_id || dialogFormDisabled" label="职务级别" prop="role_level" label-width="80px">
            <el-select 
              :disabled="dialogFormDisabled" 
              v-model="dialogForm.role_level" 
              placeholder="请选择内容"
              style="width: 240px" 
              clearable
            >
              <el-option v-for="item in roleEnum" :key="item.id" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="职务描述" prop="role_desc" label-width="80px">
            <el-input 
              class="search-input" 
              clearable 
              placeholder="请输入" 
              type="textarea" 
              show-word-limit 
              :maxlength="300"
              v-model="dialogForm.role_desc" 
              :autosize="{ minRows: 4, maxRows: 6 }"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="职务名称" prop="role_name" label-width="80px">
            <el-input 
              class="search-input" 
              clearable 
              placeholder="" 
              show-word-limit 
              :maxlength="20"
              v-model="dialogForm.role_name"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="操作权限" prop="rights" label-width="80px">
            <el-tree 
              ref="treeRef" 
              style="max-width: 600px" 
              :data="treeList" 
              node-key="menu_index" 
              :props="defaultProps"
              :default-expand-all="true" 
              @check-change="getCheckedData" 
              show-checkbox
              :disabled="dialogFormDisabled"
              :expand-on-click-node="!dialogFormDisabled"
              :class="{ 'tree-complete-disabled': dialogFormDisabled }"
            />
          </el-form-item>
        </el-form>

        <template #footer>
          <div class="dialog-footer">
            <el-button @click="closeDialogAdd">取消</el-button>
            <el-button type="primary" @click="makeSureBtn" v-if="!dialogFormDisabled">
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
import basicService from '@/service/BasicService.js';
import dealerService from '@/service/DealerService';
import { useVocabularyStore } from '@/store/vocabulary';
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus';

// 页面高度适配
const { screenHeight } = useScreenHeight();
// 全局状态存储
const vocabularyStore = useVocabularyStore();

// 查询表单数据
const searchForm = reactive({
  role_name: '' // 职务名称
});

// 职务级别枚举
const roleEnum = reactive([
  { value: 1, label: '省级(包括直辖市)' },
  { value: 2, label: '市级' },
  { value: 3, label: '区级' },
  { value: 4, label: '普通人员' }
]);

// 权限树相关
const treeList = ref([]); // 权限树数据
const treeRef = ref(null); // 权限树实例
const defaultProps = ref({
  children: 'children',
  label: 'menu_name',
  disabled: ''
});
const selectedNodeArr = ref([]); // 选中的权限节点（含父节点）

// 分页相关（预留）
const pageIndex = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 弹窗相关
const dialogAdd = ref(false); // 弹窗显隐
const dialogFormDisabled = ref(false); // 弹窗表单禁用（详情场景）
const dialogTitle = ref('新增'); // 弹窗标题
const loading = ref(false); // 表格加载状态

// 表格数据
const provinceList = ref([]);

// 弹窗表单数据
const dialogForm = reactive({
  role_level: '', // 职务级别
  role_id: '', // 职务ID
  role_desc: '', // 职务描述
  rights: ref([]), // 权限（含父节点）
  right_end: ref([]), // 权限末级节点
  role_name: '' // 职务名称
});

// 表单校验规则
const rules = ref({
  role_level: [
    { required: true, message: '请选择', trigger: 'change' }
  ],
  role_desc: [
    { required: true, message: '请输入', trigger: 'blur' }
  ],
  role_name: [
    { required: true, message: '请输入', trigger: 'blur' }
  ],
  rights: [
    {
      required: true,
      message: '请选择操作权限',
      trigger: 'change',
      validator: (rule, value, callback) => {
        const rightsArr = value?.value || [];
        rightsArr.length > 0 ? callback() : callback(new Error('请选择操作权限'));
      }
    }
  ]
});

// 表单实例
const formref = ref();

// 权限控制
const addPower = ref(false); // 新增权限
const editPower = ref(false); // 编辑权限
const deletePower = ref(false); // 删除权限

// 页面初始化
onMounted(() => {
  getUserPower(); // 获取用户操作权限
  getRoleList(); // 加载职务列表
});

// 获取用户操作权限（新增/编辑/删除）
const getUserPower = () => {
  return basicService.getPower(
    vocabularyStore.user_name,
    vocabularyStore.session
  ).then((res) => {
    // 判断新增权限
    if (res.data.findIndex(item => item.menu_index == 'dealer_job_add') !== -1) {
      addPower.value = true;
    }
    // 判断编辑权限
    if (res.data.findIndex(item => item.menu_index == 'dealer_job_edit') !== -1) {
      editPower.value = true;
    }
    // 判断删除权限
    if (res.data.findIndex(item => item.menu_index == 'dealer_job_del') !== -1) {
      deletePower.value = true;
    }
  }).catch((error) => {
    console.log('获取权限失败：', error);
  }).finally(() => {
    loading.value = false;
  });
};

// 获取职务列表
const getRoleList = async () => {
  const params = {
    session: vocabularyStore.session,
    user_name: vocabularyStore.user_name,
    role_name: searchForm.role_name,
    page_index: pageIndex.value,
    page_size: pageSize.value
  };

  try {
    const res = await dealerService.getDistributorRoleList(params);
    if (res.result_code === 200) {
      provinceList.value = res.list && res.list.length ? res.list : [];
      total.value = res.total || 0;
    } else {
      ElMessage({
        message: res.description,
        type: 'error'
      });
    }
  } catch (error) {
    console.error('获取职务列表失败：', error);
  }
};

// 获取经销商权限树
const getRoleTree = async () => {
  const params = {
    session: vocabularyStore.session,
    user_name: vocabularyStore.user_name
  };

  try {
    const res = await dealerService.getDistributorRightTree(params);
    if (res.result_code === 200) {
      treeList.value = res.rights && res.rights.length ? res.rights : [];
    } else {
      ElMessage({
        message: res.description,
        type: 'error'
      });
    }
  } catch (error) {
    console.error('获取权限树失败：', error);
  }
};
// 权限树勾选事件 - 收集选中节点（含父节点）和末级节点
const getCheckedData = () => {
  
  if (!treeRef.value || dialogFormDisabled.value) return;
  console.log('treeRef:', treeRef.value);
  

  // 获取所有勾选的节点
  const nodeList = treeRef.value.getCheckedNodes(true, false);
  const allCheckedAndParentNodes = [];

  // 遍历勾选节点，收集自身+所有父节点
  nodeList.forEach(node => {
    if (!Array.isArray(node)) {
      allCheckedAndParentNodes.push(node);
    }
    // 递归获取父节点
    const parentNodes = getParentNodeData(node, []);
    allCheckedAndParentNodes.push(...parentNodes);
  });

  // 去重
  selectedNodeArr.value = [...new Set(allCheckedAndParentNodes)];

  // 组装权限数据（含父节点）
  dialogForm.rights.value = selectedNodeArr.value.map(item => ({
    menu_index: item.menu_index
  }));

  // 组装末级权限节点
  dialogForm.right_end.value = treeRef.value.getCheckedNodes(true, false).map(item => item.menu_index);
};

// 递归获取节点所有父节点数据
const getParentNodeData = (node, parentNodes = []) => {
  const parentNode = treeRef.value.getNode(node).parent;
  if (parentNode) {
    if (!Array.isArray(parentNode.data)) {
      parentNodes.push(parentNode.data);
    }
    getParentNodeData(parentNode, parentNodes);
  }
  return parentNodes;
};

// 格式化职务级别显示文本
const getRoleLabel = (value) => {
  if (!value) return '';
  const matchItem = roleEnum.find(item => item.value === Number(value));
  return matchItem ? matchItem.label : '-';
};

// 关闭新增/编辑弹窗
const closeDialogAdd = () => {
  dialogAdd.value = false;
  formref.value?.resetFields();
  dialogForm.role_id = '';
  dialogForm.role_level = '';
  dialogFormDisabled.value = false;
};

// 保存新增/编辑的职务信息
const makeSureBtn = () => {
  formref.value.validate(async (valid) => {
    if (!valid) return false;

    // 加载遮罩
    const loading = ElLoading.service({
      lock: true,
      text: 'Loading',
      background: 'rgba(0, 0, 0, 0.7)'
    });

    // 组装提交参数
    const params = {
      right_end: JSON.stringify(dialogForm.right_end.value),
      rights: JSON.stringify(dialogForm.rights.value),
      role_desc: dialogForm.role_desc,
      role_id: dialogForm.role_id ? dialogForm.role_id : 0,
      role_level: dialogForm.role_level,
      role_name: dialogForm.role_name,
      session: vocabularyStore.session,
      user_name: vocabularyStore.user_name
    };

    try {
      const res = await dealerService.editDistributorRole(params);
      if (res.result_code === 200) {
        getRoleList(); // 刷新列表
        closeDialogAdd(); // 关闭弹窗
      } else if (res.result_code === 913) {
        ElMessage({
          message: '职务已存在',
          type: 'error'
        });
      } else {
        ElMessage({
          message: res.description,
          type: 'error'
        });
      }
    } catch (error) {
      console.log('保存职务失败：', error);
    } finally {
      loading.close(); // 关闭遮罩
    }
  });
};

// 获取职务详情（编辑/详情场景）
const getRoleDetail = async (role_id) => {
  const params = {
    session: vocabularyStore.session,
    user_name: vocabularyStore.user_name,
    role_id: role_id
  };

  try {
    const res = await dealerService.getDistributorRole(params);
    if (res.result_code === 200) {
      // 赋值基础信息
      if (res.role) {
        dialogForm.role_name = res.role.role_name;
        dialogForm.role_desc = res.role.role_desc;
        dialogForm.role_id = res.role.role_id;
        dialogForm.role_level = res.role.role_level;
      }
      // 回显权限树勾选状态
      treeRef.value?.setCheckedKeys(JSON.parse(res.rights), true);
    } else {
      ElMessage({
        message: res.description,
        type: 'error'
      });
    }
  } catch (error) {
    console.log('获取职务详情失败：', error);
  }
};

// 分页切换
const handleCurrentChange = (page) => {
  pageIndex.value = page;
  getRoleList();
}

// 点击查询按钮
const btnSearch = () => {
  getRoleList();
};

// 重置查询条件
const btnReset = () => {
  searchForm.role_name = '';
  pageIndex.value = 1;
  getRoleList();
};

// 打开新增职务弹窗
const btnAdded = () => {
  dialogTitle.value = '新增职务';
  dialogAdd.value = true;
  getRoleTree(); // 加载权限树
};

// 打开编辑职务弹窗
const edit = (row) => {
  getRoleDetail(row.role_id); // 获取职务详情
  getRoleTree(); // 加载权限树
  dialogTitle.value = '编辑职务';
  dialogAdd.value = true;
};

// 打开职务详情弹窗
const detail = (row) => {
  getRoleDetail(row.role_id); // 获取职务详情
  getRoleTree(); // 加载权限树
  dialogAdd.value = true;
  dialogTitle.value = '详情';
  dialogFormDisabled.value = true; // 禁用表单
  // 禁用权限树勾选
  nextTick(() => {
    defaultProps.value.disabled = 'disabled';
  });
};

// 删除职务
const del = (row) => {
  ElMessageBox.confirm(
    '是否确认删除',
    {
      confirmButtonText: '确定',
      confirmButtonClass: 'button-confirm',
      cancelButtonText: '取消',
      center: true
    }
  ).then(() => {
    const params = {
      user_name: vocabularyStore.user_name,
      session: vocabularyStore.session,
      role_id: row.role_id
    };

    dealerService.removeDistributorRole(params).then((res) => {
      if (res.result_code === 200) {
        getRoleList(); // 刷新列表
        ElMessage({
          message: '删除成功',
          type: 'success',
          duration: 1000
        });
      } else if (res.result_code === 919) {
        ElMessage({
          message: '当前职务已被引用  禁止删除',
          type: 'error',
          duration: 3000
        });
      } else {
        ElMessage({
          message: res.description,
          type: 'info',
          duration: 3000
        });
      }
    }).catch((error) => {
      console.log('删除职务失败：', error);
    });
  }).catch(() => {
    // 取消删除不处理
  });
};
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
.ellipsis-text {
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
:deep(.tree-complete-disabled) {
  pointer-events: none;
}
</style>
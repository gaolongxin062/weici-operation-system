<template>
  <div class="page">
    <div class="page-title" id="page-title">
      <h4>公告管理</h4>
    </div>
    <el-form id="forms" :inline="true" :model="searchForm" size="large" label-width="90px">
      <div style="display: flex;align-items: center;">
        <div>
          <el-form-item label="公告名称">
            <el-input style="width: 200px" class="search-input" clearable placeholder="请输入" v-model="searchForm.title">
            </el-input>
          </el-form-item>
          <el-form-item label="状态" label-width="40px">
            <el-select v-model="searchForm.is_release" placeholder="请选择" style="width: 200px" clearable filterable>
              <el-option v-for="item in releaseStatus" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="btnSearch">查询</el-button>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="btnReset">重置</el-button>
          </el-form-item>

          <el-form-item>
            <el-button type="success" v-if="addPower" @click="btnAdded">新增公告</el-button>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <el-table :data="noticesList" class="table-info" header-cell-class-name="header_row_class" :max-height="screenHeight" v-loading="loading" ref="multipleTable"
      stripe element-loading-text="拼命加载中，主人请稍后...">
      <el-table-column label="公告名称" width="200px">
        <template #default="scope">
          <div>{{ scope.row.title || '-' }}</div>
        </template>
      </el-table-column>

      <el-table-column label="状态">
        <template #default="scope">
          <div>{{ scope.row.is_release === 0 ? '待发布' : '已发布' }}</div>
        </template>
      </el-table-column>

      <el-table-column label="接受范围">
        <template #default="scope">
          <div>{{ scope.row.receive_range ? '部分区域' : '全部' }}</div>
        </template>
      </el-table-column>

      <el-table-column label="涉及区域" width="200px" show-overflow-tooltip>
        <template #default="scope">
          <div>{{ scope.row.receive_range ? scope.row.receive_range : '全部' }}</div>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" width="180px">
        <template #default="scope">
          <div>{{ scope.row.make_date || '-' }}</div>
        </template>
      </el-table-column>

      <el-table-column label="发布时间" width="180px">
        <template #default="scope">
          <div>{{ scope.row.release_date || '-' }}</div>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="200" fixed="right" v-if="deletePower || editPower">
        <template #default="scope">
          <el-button class="button-style" link type="primary" @click="detail(scope.row)">
            详情
          </el-button>
          <el-button v-if="editPower" class="button-style" link type="primary"
            @click="editStatus(scope.row)">
            发布
          </el-button>
          <el-button v-if="editPower" class="button-style" link type="primary"
            @click="edit(scope.row)">
            编辑
          </el-button>
          <el-button v-if="editPower" class="button-style" link type="primary"
            @click="del(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination style="color: #666666;margin: 20px 0 0 20px;" v-show="total > 0"
      @current-change="handleCurrentChange" :current-page="pageIndex" :page-size="pageSize"
      layout="total, prev, pager, next" prev-text="上一页" next-text="下一页" :total="total">
    </el-pagination>
    <!-- 新增/编辑弹窗 -->
    <div class="add-dialog">
      
      <el-dialog v-model="dialogAdd" top="5vh" :title="dialogTitle" width="800" :show-close="false"
        :destroy-on-close="true" @close="closeDialogAdd">
        <el-form :inline="true" ref="formref" id="form" :model="dialogForm" size="large" label-width="100px"
          :rules="rules" :disabled="dialogFormDisabled" style="display: flex; flex-direction: column;">
          <el-form-item label="公告名称" prop="title">
            <el-input class="search-input" clearable placeholder="请输入" type="textarea" show-word-limit :maxlength="100"
              v-model="dialogForm.title" :autosize="{ minRows: 4, maxRows: 6 }">
            </el-input>
          </el-form-item>
          <el-form-item label="接受范围" prop="area_ids">
            <el-cascader style="width:250px" v-model="dialogForm.receive_range" clearable :options="areaTreeList"
              :props="cascaderAreaProps" :show-all-levels="false" @change="changeArea" collapse-tags />
          </el-form-item>
          <el-form-item label="公告内容">
            <!-- <el-input class="search-input" clearable placeholder="请输入" type="textarea" show-word-limit :maxlength="30"
              v-model="dialogForm.remark" :autosize="{ minRows: 2, maxRows: 4 }">
            </el-input> -->
            <rich-text-editor ref="basicEditor" />
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
import { ref, onMounted, reactive } from 'vue';
import { useScreenHeight } from '@/hooks/useScreenHeight.js';
const { screenHeight } = useScreenHeight();
import basicService from '@/service/BasicService.js';
import dealerService from '@/service/DealerService';
import { useVocabularyStore } from '@/store/vocabulary';
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
import RichTextEditor from '@/components/RichTextEditor.vue'
let vocabularyStore = useVocabularyStore();
let formref = ref()
const dialogTitle = ref('新增')
const addPower = ref(false)
const editPower = ref(false)
const deletePower = ref(false)
const treeList = ref([])
const dialogFormDisabled = ref(false)
const dialogType = ref('add')
let dialogAdd = ref(false)
let loading = ref(false)
let noticesList = ref([]) // 表格数据 经销商列表
const roleList = ref([]) // 职务列表-新增/编辑时根据选择的经销商获取
const devolveRoleList = ref([]) // 下放职务列表-新增/编辑时根据选择的经销商跟职务获取
const areaTreeList = ref([])  // 区域树
const detailData = ref({}) // 详情数据
const dialogDetail = ref(false)
const basicEditor = ref(null)
const total = ref(0)
const releaseStatus = [
  {
    value: 0,
    label: '待发布'
  },
  {
    value: 1,
    label: '已发布'
  }
]
let searchForm = reactive({
  title: '', // 姓名
  is_release: '' // 发布状态 0未发布 1发布
})
const cascaderAreaProps = {
  value: 'id',
  label: 'name',
  emitPath: false,
  multiple: true
}
let dialogForm = reactive({
  title: '', // 公告名称
  receive_range: '', // 接受范围
  content: '', // 内容
})
let rules = ref({
  title: [
    {
      trigger: 'blur',
      validator: (rule, value, callback) => {
        const trimValue = value.trim();
        if (trimValue !== value) {
          callback(new Error('首尾不能包含空格'));
        } else {
          callback()
        }
      }
    },
    { required: true, message: '请输入', trigger: 'blur' }
  ]
});

onMounted(() => {
  getUserPower()
  getNoticesList()
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
// 获取经销商列表
const getNoticesList = async () => {
  const params = {
    session: vocabularyStore.session,
    user_name: vocabularyStore.user_name,
    is_release: searchForm.is_release,
    page_index: 1,
    page_size: 10,
    title: searchForm.title
  }
  try {
    const res = await dealerService.getDistributorNotices(params)
    if (res.result_code === 200) {
      if (res.notices && res.notices.length) {
        noticesList.value = res.notices
        total.value = res.total
      } else {
        noticesList.value = []
        total.value = 0
      }
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

// 获取职务及下放职务列表
const getRoleList = async (id, level) => {
  const params = {
    session: vocabularyStore.session,
    user_name: vocabularyStore.user_name,
    user_id: id || 0,
    role_level: level || 0
  }
  try {
    const res = await dealerService.getChoosableRoleList(params)
    if (res.result_code === 200) {
      if (res.list && res.list) {
        if (level) {
          devolveRoleList.value = res.list
        } else {
          roleList.value = res.list
        }
      } else {
        if (level) {
          devolveRoleList.value = []
        } else {
          roleList.value = []
        }
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

// 获取区域范围树
const getAreaTree = async () => {
  const params = {
    session: vocabularyStore.session,
    user_name: vocabularyStore.user_name,
    user_id: 1
  }
  try {
    const res = await dealerService.distributorAreaTree(params)
    if (res.result_code === 200) {
      if (res.areas && res.areas) {
        areaTreeList.value = res.areas
        filterAreaTree()
      } else {
        areaTreeList.value = []
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
const filterAreaTree = () => {
  // 递归处理单个节点：清空二级节点的 children（删除三级及以下）
  const processNode = (node) => {
    // 如果当前节点有子节点（说明是一级节点，子节点是二级）
    if (Array.isArray(node.children) && node.children.length > 0) {
      // 删除三级
      node.children.forEach(secondLevelNode => {
        secondLevelNode.children = [];
      });
    }
  };
  if (Array.isArray(areaTreeList.value)) {
    areaTreeList.value.forEach(node => processNode(node));
  } else if (typeof areaTreeList.value === 'object' && areaTreeList.value !== null) {
    processNode(areaTreeList.value);
  }
}

// 触发负责范围改变时
const changeArea = (val) => {
  console.log('11111111111', val)
  // getRoleList(val)
}

// 取消新增
const closeDialogAdd = () => {
  dialogAdd.value = false
  formref.value.resetFields()
  dialogForm.receive_range = ''
}
// 确定新增/编辑
const makeSureBtn = () => {
  let html = ''
  if (basicEditor.value) {
    html = basicEditor.value.contentHandle();
    const text = basicEditor.value.textHandle();
    console.log('基础编辑器HTML内容：', html);
    console.log('基础编辑器纯文本：', text);
    // previewContent.value = html; // 预览内容
  }
  formref.value.validate(async (valid) => {
    if (valid) {
      const loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })

      // 如果是新增走一下逻辑
      let params = {
        session: vocabularyStore.session,
        user_name: vocabularyStore.user_name,
        title: dialogForm.title,
        content: html,
        receive_range: dialogForm.receive_range.join(',')
      }

      try {
        const res = await dealerService.addDistributorNotice(params)
        if (res.result_code === 200) {
          ElMessage({
            message: '操作成功',
            type: 'success',
          })
          getNoticesList()
          closeDialogAdd()
        } else if (res.result_code === 913) {
          ElMessage({
            message: '经销商已存在',
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
      console.log('valid3', valid)
      return false
    }
  })
}

// 获取经销商详情
const getDetail = async (id) => {
  const params = {
    session: vocabularyStore.session,
    user_name: vocabularyStore.user_name,
    id: id,
  }
  try {
    const res = await dealerService.getNoticeDetail(params)
    if (res.result_code === 200) {
      if (res.notice) {
        detailData.value = res.notice
      }
    }
  } catch (error) {
    console.log(error)
  }
}
// 切换下一页---暂时注释
// const handleCurrentChange = (page) => {
//   pageIndex.value = page
//   getNoticesList() // 表格数据
// }
// 查询
const btnSearch = () => {
  getNoticesList()
}
// 重置
const btnReset = () => {
  searchForm.title = ''
  searchForm.is_release = ''
  getNoticesList()
}
// 新增
const btnAdded = () => {
  dialogTitle.value = '新增'
  dialogAdd.value = true
  getRoleTree()
  getRoleList()
  getAreaTree()
}
// 编辑
const edit = async (row) => {
  await getDetail(row.id)
  await getAreaTree()
  dialogForm.title = detailData.value.title
  dialogForm.receive_range = detailData.value.receive_range ? detailData.value.receive_range.split(',').map(item => Number(item.trim())) : ''
  // dialogForm.account = detailData.value.account_name
  dialogForm.id = row.id
  dialogType.value = 'edit'
  dialogTitle.value = '编辑'
  dialogAdd.value = true
}

// 查看
const detail = (row) => {
  getDetail(row.id)
  dialogDetail.value = true
}
// 删除公告
const del = async (row) => {
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
      id: row.id
    }
    dealerService.deleteDistributorNotice(params).then((res) => {
      if (res.result_code === 200) {
        getNoticesList()
        ElMessage({
          message: `删除成功`,
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

const editStatus = async (row) => {
  ElMessageBox.confirm(
    '是否确认发布',
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
      id: row.id
    }
    dealerService.releaseDistributorNotice(params).then((res) => {
      if (res.result_code === 200) {
        getNoticesList()
        ElMessage({
          message: `发布成功`,
          type: 'success',
          duration: 1000
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

:deep(.el-table__cell .cell) {
  display: flex;
  align-items: center;
}

.role-card {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  height: 631px;
  overflow: auto;
  justify-content: start;
  align-content: baseline;
}

.role-card-item {
  background: #F3F5F8;
  border-radius: 20px;
  padding: 11px 22px;
  height: 150px;
  width: 310px;
  cursor: pointer;
}

.role-card-item .label {
  display: flex;
  justify-content: end;
}

.role-card-item .title {
  font-size: 22px;
  color: #000000;
  font-weight: bold;
}

.role-card-item .desc {
  width: 306px;
  margin: 10px 0;
  height: 50px;
  font-size: 16px;
  color: #000000;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
}

.role-card-item .select {
  width: 20px;
  height: 20px;
}

.role-card-item .select_icon {
  width: 20px;
  height: 20px;
  display: flex;
  float: right;
}

.detail-box {
  display: flex;
  flex-direction: column;
}

.detail-box .detail-item {
  display: flex;
  flex-direction: column;
}

.detail-box .detail-item .detail-mes {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
}

.detail-box .detail-item h6 {
  font-size: 18px;
  margin: 0;
  margin-bottom: 10px;
}

.power-info {
  margin-left: 100px;
  margin-bottom: 20px;
  font-size: 16px;
}
</style>
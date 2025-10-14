<template>
  <div class="page">
    <div class="page-title" id="page-title">
      <h4>省列表</h4>
    </div>

    <el-form id="cityForms" :inline="true" :model="searchForm" size="large" label-width="60px">
      <div style="display: flex;align-items: center;justify-content: space-between;">
        <div style="margin-right: 20px;">
          <el-form-item label="省">
            <el-input style="width: 240px" 
              class="search-input"
              clearable
              placeholder="请输入内容"
              v-model="searchForm.province"
              >
            </el-input>
          </el-form-item>
        
        </div>
        <div>
          <el-form-item>
            <el-button @click="btnSearch">查询</el-button>
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" @click="btnReset">重置</el-button>
          </el-form-item>
          
          <el-form-item>
            <el-button type="success" @click="btnAdded">新增</el-button>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <el-table :data="provinceList" class="table-info" :max-height="screenHeight" 
      v-loading="loading" header-cell-class-name="header_row_class" ref="multipleTable"  stripe
      element-loading-text="拼命加载中，主人请稍后...">
      <el-table-column label="省">
        <template #default="scope">
          <div class="over-hidden">{{scope.row.province || '-'}}</div>
        </template>
      </el-table-column>

      <el-table-column label="制单人">
        <template #default="scope">
          <div>{{scope.row.maker || '-'}}</div>
        </template>
      </el-table-column>

      <el-table-column label="制单日期">
        <template #default="scope">
          <div>{{scope.row.make_date || '-'}}</div>
        </template>
      </el-table-column>

      <el-table-column label="修改人">
        <template #default="scope">
          <div>{{scope.row.modifier || '-'}}</div>
        </template>
      </el-table-column>

      <el-table-column label="修改日期">
        <template #default="scope">
          <div>{{scope.row.modify_date || '-'}}</div>
        </template>
      </el-table-column>

      <el-table-column  label="操作"  fixed="right">
        <template #default="scope">
          <el-button class="button-style" link type="primary" @click="edit(scope.row)">
            修改
          </el-button>
          <!-- <el-button class="button-style" link type="primary" @click="detail(scope.row)">
            查看
          </el-button> -->
          <el-button class="button-style" link type="danger" @click="del(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination style="color: #666666;margin: 20px 0 0 20px;" v-show="total > 0" @current-change="handleCurrentChange" :current-page="pageIndex" :page-size="pageSize" layout="total, prev, pager, next" prev-text="上一页" next-text="下一页" :total="total">
    </el-pagination>

     <!-- 新增/编辑弹窗 -->
     <div class="add-dialog">
      <el-dialog
        v-model="dialogAdd"
        title="新增"
        width="500"
        :show-close="false"
        :destroy-on-close="true"
        @close="closeDialogAdd"
        >
        <el-form :inline="true" ref="formref" id="form" :model="dialogForm" size="large" label-width="100px" :rules="rules">
          <el-form-item label="省" prop="province" label-width="130px">
            <el-input 
              class="search-input"
              clearable
              placeholder=""
              :maxlength="50"
              :disabled="dialogFormDisabled"
              v-model="dialogForm.province"
              >
            </el-input>
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
  import { ref, onMounted, reactive} from 'vue';
  import aiAgentService from '@/service/AiAgentService.js';
  import { useVocabularyStore } from '@/store/vocabulary';
  import { ElMessage, ElMessageBox, ElLoading} from 'element-plus'
  let vocabularyStore = useVocabularyStore();
  let searchForm = reactive({
    province: '' // 省
  })
  let pageIndex = ref(1)
  let pageSize = ref(10) 
  let total = ref(0)
  let dialogAdd = ref(false)
  let loading = ref(false)
  let provinceList = ref([]) // 表格数据
  let dialogForm = reactive({
    province: '', // 省名称
    id:''
  })
  let rules = ref({
    province: [
      { required: true, message: '请输入', trigger: 'blur' }
    ]
  });
  let screenHeight = ref(0) // 表格高
  let formref = ref()
  const dialogFormDisabled = ref(false)

  onMounted(() =>{
    getProvinceList()
    window.addEventListener('resize', updateScreenHeight);
    updateScreenHeight();
  })
  // 获取所有的省
  const getProvinceList = async () => {
    const params = {
      session: vocabularyStore.session,
      user_name: vocabularyStore.user_name,
      page_index: pageIndex.value,
      page_size: pageSize.value,
      province: searchForm.province
    }
    try {
      const res = await aiAgentService.getProvincesList(params)
      if (res.result_code===200) {
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
  const updateScreenHeight =  () => {
    var element = document.getElementById('cityForms');
    if (element) {
      var rect = element.getBoundingClientRect();
      var formHeight = rect.height // form表单的高
    }

    var titleElement = document.getElementById('page-title');
    if (titleElement) {
      var rectTitle = titleElement.getBoundingClientRect();
      var titleHeight = rectTitle.height // 标题-页头高度
      
      var pageHeight = 80 // 分页高度

      var menuHeight = 64 // 导航栏高度
      screenHeight.value = window.innerHeight - formHeight - titleHeight - pageHeight - menuHeight
    }
  }
   // 取消新增
  const closeDialogAdd = () => {
    dialogAdd.value = false
    formref.value.resetFields()
    dialogForm.province = ''
    dialogForm.id = ''
    dialogFormDisabled.value = false
  }
   // 确定新增/编辑
  const makeSureBtn = () => {
    formref.value.validate(async(valid) => {
      if (valid) {
        const loading = ElLoading.service({
          lock: true,
          text: 'Loading',
          background: 'rgba(0, 0, 0, 0.7)',
        })
        let params = {
          province: dialogForm.province,
          id: dialogForm.id,
          session: vocabularyStore.session,
          user_name: vocabularyStore.user_name,
        }
        try {
          const res = await aiAgentService.editProvinces(params)
          if (res.result_code===200) {
            getProvinceList()
          } else if (res.result_code===913){
            ElMessage({
              message: '省份已存在',
              type: 'error',
            })
          } else {
            ElMessage({
              message: res.description,
              type: 'error',
            })
          }
          loading.close()
          closeDialogAdd()
        } catch (error) {
          console.log(error)
          loading.close()
        }
      } else {
        return false
      }
    })
  }
   // 切换下一页
  const handleCurrentChange = (page) => {
    pageIndex.value = page
    getProvinceList() // 表格数据
  }
   // 查询
  const btnSearch = () => {
    getProvinceList()
  }
   // 重置
  const btnReset = () => {
    searchForm.province = ''
    pageIndex.value = 1
    getProvinceList()
  }
   // 新增
  const btnAdded = () => {
    dialogAdd.value = true
  }
   // 编辑
  const edit  = (row) => {
    dialogAdd.value = true
    dialogForm.province = row.province
    dialogForm.id = row.id
  }
   // 查看
  // const detail =  (row) => {
  //   dialogAdd.value = true
  //   dialogForm.province = row.province
  //   dialogFormDisabled.value = true
  // }
  // 删除
  const del = (row) => {
    ElMessageBox.confirm(
      '是否确定删除？',
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
      aiAgentService.delAiProvince(params).then((res) => {
        if (res.result_code === 200) {
          getProvinceList()
          ElMessage({
            message: '删除成功',
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
.table-info{
  width: 96% !important;
  margin-left: 20px;
  border: 1px solid var(--el-border-color-lighter);
  border-right: 1px solid var(--el-border-color-lighter) !important;
}
.line{
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
.over-hidden{
  width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
#cityForms {
  padding: 0 20px;
}
#cityForms :deep(.el-form-item){
  margin-right: 10px !important;
}
.year-box{
  display: flex;
  margin-top: 20px;
}
.year-item{  
  margin-right: -1px;
  padding: 0px 14px;
  border: 1px solid #eee;
  cursor: pointer;
}
.active-years{
  background: rgba(64, 158, 255, 1);
  color: #fff;
}
</style>
<template>
  <div class="page">
    <div class="page-title" id="page-title">
      <h4>市列表</h4>
    </div>

    <el-form id="cityForms" :inline="true" :model="searchForm" size="large" label-width="80px">
      <div style="display: flex;align-items: center;justify-content: flex-end;">
        <div style="margin-right: 20px;">
          <el-form-item label="省" v-if="provinceList.length">
            <el-select v-model="searchForm.province_id" placeholder="请选择内容" style="width: 240px">
              <el-option
                v-for="item in provinceList"
                :key="item.id"
                :label="item.province"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="市">
            <el-input style="width: 240px" 
              class="search-input"
              clearable
              placeholder="请输入内容"
              v-model="searchForm.city"
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
    <el-table :data="cityList" class="table-info" :max-height="screenHeight" 
      v-loading="loading" header-cell-class-name="header_row_class" ref="multipleTable"  stripe
      element-loading-text="拼命加载中，主人请稍后...">
      <el-table-column label="省">
        <template #default="scope">
          <div class="over-hidden">{{scope.row.province || '-'}}</div>
        </template>
      </el-table-column>

      <el-table-column label="市">
        <template #default="scope">
          <div class="over-hidden">{{scope.row.city || '-'}}</div>
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
        <el-form :inline="true" ref="formref" id="form" :model="dialogForm" size="large" label-width="100px" :disabled="dialogFormDisabled" :rules="rules">
          <el-form-item label="省" prop="province_id">
            <el-select v-model="dialogForm.province_id" placeholder="请选择内容" style="width: 240px">
              <el-option
                v-for="item in provinceList"
                :key="item.id"
                :label="item.province"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="市" prop="city" label-width="100px">
            <el-input 
              class="search-input"
              clearable
              placeholder=""
              :maxlength="50"
              v-model="dialogForm.city"
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
    province_id: '', // 省id
    city: '', // 市
  })
  let pageIndex = ref(1)
  let pageSize = ref(10) 
  let total = ref(0)
  let dialogAdd = ref(false)
  let loading = ref(false)
  let provinceList = ref([]) // 省筛选数据
  let cityList = ref([]) // 省筛选数据
  let dialogForm = reactive({
    province_id: '', // 省名称
    city: '', // 市名称
    id:''
  })
  let rules = ref({
    province_id: [
      { required: true, message: '请选择', trigger: 'change' }
    ],
    city: [
      { required: true, message: '请输入', trigger: 'blur' }
    ]
  });
  let screenHeight = ref(0) // 表格高
  let formref = ref()
  const dialogFormDisabled = ref(false)

  onMounted(async() =>{
    window.addEventListener('resize', updateScreenHeight);
    await getProvinceList()
    await getCityList()
    updateScreenHeight()
  })
  // 获取所有的省---作为下拉筛选数据使用
  const getProvinceList = async () => {
    const params = {
      session: vocabularyStore.session,
      user_name: vocabularyStore.user_name,
      province: searchForm.province
    }
    try {
      const res = await aiAgentService.getProvincesList(params)
      if (res.list && res.list.length) {
        provinceList.value = res.list
      } else {
        provinceList.value = []
      }
    } catch (error) {
      console.error('获取省份列表失败', error)
    }  
  }
    // 获取所有的市--表格数据
    const getCityList = async () => {
    const params = {
      session: vocabularyStore.session,
      user_name: vocabularyStore.user_name,
      page_index: pageIndex.value,
      page_size: pageSize.value,
      province_id: searchForm.province_id,
      city: searchForm.city
    }
    try {
      const res = await aiAgentService.getAiCityList(params)
      if (res.result_code === 200) {
        if (res.list && res.list.length) {
          cityList.value = res.list
          total.value = res.total
        } else {
          cityList.value = []
          total.value = 0
        }
      } else {
        ElMessage({
          message: res.description,
          type: 'error',
        })
      }

    } catch (error) {
      console.error('获取列表失败', error)
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
    dialogForm.province_id = ''
    dialogForm.city = ''
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
          city: dialogForm.city,
          province_id: dialogForm.province_id,
          id: dialogForm.id,
          session: vocabularyStore.session,
          user_name: vocabularyStore.user_name,
        }
        try {
          const res = await aiAgentService.editAiCity(params)
          if (res.result_code===200) {
            getCityList()
          } else {
            ElMessage({
              message: res.description,
              type: 'error',
            })
          }
          closeDialogAdd()
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
   // 切换下一页
  const handleCurrentChange = (page) => {
    pageIndex.value = page
    getCityList() // 表格数据
  }
   // 查询
  const btnSearch = () => {
    getCityList()
  }
   // 重置
  const btnReset = () => {
    searchForm.province_id = ''
    searchForm.city = ''
    pageIndex.value = 1
    getCityList()
  }
   // 新增
  const btnAdded = () => {
    dialogAdd.value = true
  }
   // 编辑
  const edit  = (row) => {
    dialogAdd.value = true
    dialogForm.province_id = row.province_id
    dialogForm.id = row.id
    dialogForm.city = row.city
    console.log('2222', row)
    
  }
   // 查看
  // const detail =  (row) => {
  //   dialogAdd.value = true
  //   dialogForm.province_id = row.province_id
  //   dialogForm.id = row.id
  //   dialogForm.city = row.city
  //   dialogFormDisabled.value = true
  // }
  // 删除
  const del = (row) => {
    console.log('row222', row)
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
          getCityList()
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
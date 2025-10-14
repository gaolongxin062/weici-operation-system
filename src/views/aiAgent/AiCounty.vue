<template>
  <div class="page">
    <div class="page-title" id="page-title">
      <h4>区县列表</h4>
    </div>

    <el-form id="cityForms" :inline="true" :model="searchForm" size="large" label-width="60px">
      <div style="display: flex;align-items: center;">
        <div style="margin-right: 20px;">
          <el-form-item label="省" v-if="provinceList.length">
            <el-select filterable v-model="searchForm.province_id" placeholder="请选择内容" style="width: 240px" @change="changeProvince">
              <el-option
                v-for="item in provinceList"
                :key="item.id"
                :label="item.province"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="市">
            <el-select filterable v-model="searchForm.city_id" placeholder="请选择内容" style="width: 240px">
              <el-option
                v-for="item in cityList"
                :key="item.id"
                :label="item.city"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="区县">
            <el-input style="width: 240px" 
              class="search-input"
              clearable
              placeholder="请输入内容"
              v-model="searchForm.county"
            >
            </el-input>
          </el-form-item>
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
        <!-- <div>
          <el-form-item>
            <el-button @click="btnSearch">查询</el-button>
          </el-form-item>

          
          <el-form-item>
            <el-button type="primary" @click="btnReset">重置</el-button>
          </el-form-item>
          
          <el-form-item>
            <el-button type="success" @click="btnAdded">新增</el-button>
          </el-form-item>
        </div> -->
      </div>
    </el-form>
    <el-table :data="countyList" class="table-info" :max-height="screenHeight" 
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

      <el-table-column label="区县">
        <template #default="scope">
          <div class="over-hidden">{{scope.row.county || '-'}}</div>
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
        :title="dialogTitle"
        width="500"
        :show-close="false"
        :destroy-on-close="true"
        @close="closeDialogAdd"
        >
        <el-form :inline="true" ref="formref" id="form" :model="dialogForm" size="large" label-width="100px" :disabled="dialogFormDisabled" :rules="rules">
          <el-form-item label="省" prop="province_id">
            <el-select v-model="dialogForm.province_id" placeholder="请选择内容" style="width: 240px" @change="changeDialogProvince" filterable>
              <el-option
                v-for="item in dialogProvinceList"
                :key="item.id"
                :label="item.province"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="市" prop="city_id" label-width="100px">
            <el-select v-model="dialogForm.city_id" placeholder="请选择内容" style="width: 240px" filterable>
              <el-option
                v-for="item in dialogCityList"
                :key="item.id"
                :label="item.city"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="区县" prop="county" label-width="100px">
            <el-input 
              class="search-input"
              clearable
              placeholder=""
              :maxlength="50"
              v-model="dialogForm.county"
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
    city_id: '', // 市id
    county: '', // 区
  })
  let pageIndex = ref(1)
  let pageSize = ref(10) 
  let total = ref(0)
  let dialogAdd = ref(false)
  let loading = ref(false)
  let provinceList = ref([]) // 省筛选数据
  let cityList = ref([]) // 市筛选数据
  let dialogProvinceList = ref([]) // 省筛选数据---弹窗
  let dialogCityList = ref([]) // 市筛选数据---弹窗
  let countyList = ref([]) // 区筛选数据
  let dialogForm = reactive({
    province_id: '', // 省名称
    city_id: '', // 市名称
    county: '',
    id:''
  })
  let rules = ref({
    province_id: [
      { required: true, message: '请选择', trigger: 'change' }
    ],
    city_id: [
      { required: true, message: '请输入', trigger: 'blur' }
    ],
    county: [
      { required: true, message: '请输入', trigger: 'blur' }
    ]
  });
  let screenHeight = ref(0) // 表格高
  let formref = ref()
  const dialogFormDisabled = ref(false)
  const dialogTitle = ref('新增')
  onMounted(async() =>{
    window.addEventListener('resize', updateScreenHeight);
    await getProvinceList()
    await getCountyList()
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
    //筛选省获取下面的市
    const changeProvince = async (val) => {
      searchForm.city_id = ''
      getCityList('search', val)
    }
    const changeDialogProvince = async (val) => {
      dialogForm.city_id = ''
      await getCityList('edit', val)
    }
    // 获取所有的市--作为下拉select筛选数据使用
    const getCityList = async (type,province_id) => {
    const params = {
      session: vocabularyStore.session,
      user_name: vocabularyStore.user_name,
      province_id: province_id,
      city: ''
    }
    try {
      const res = await aiAgentService.getAiCityList(params)
      if (res.list && res.list.length) {
        if (res.result_code === 200) {
          if (type === 'edit') {
            dialogCityList.value = res.list
          } else {
            cityList.value = res.list
          }
        } else {
          ElMessage({
            message: res.description,
            type: 'error',
          })
        }
      } else {
        cityList.value = []
        dialogCityList.value = []
      }
    } catch (error) {
      console.error('获取列表失败', error)
    }  
  }
  // 获取所有的区县
  const getCountyList = async () => {
    const params = {
      session: vocabularyStore.session,
      user_name: vocabularyStore.user_name,
      page_index: pageIndex.value,
      page_size: pageSize.value,
      province_id: searchForm.province_id,
      city_id: searchForm.city_id,
      county: searchForm.county
    }
    try {
      const res = await aiAgentService.getAiCountyList(params)
      if (res.result_code === 200) {
        if (res.list && res.list.length) {
          countyList.value = res.list
          total.value = res.total
        } else {
          countyList.value = []
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
  const closeDialogAdd = (val) => {
    if (val==='add') {
      dialogForm.county = ''
      dialogForm.id = ''
      dialogFormDisabled.value = false
    } else {
      dialogProvinceList = []
      dialogCityList.value = []
      dialogAdd.value = false
      formref.value.resetFields()
      dialogForm.province_id = ''
      dialogForm.city_id = ''
      dialogForm.county = ''
      dialogForm.id = ''
      dialogFormDisabled.value = false
    }

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
          city_id: dialogForm.city_id,
          province_id: dialogForm.province_id,
          id: dialogForm.id,
          county: dialogForm.county,
          session: vocabularyStore.session,
          user_name: vocabularyStore.user_name,
        }
        try {
          const res = await aiAgentService.editAiCounty(params)
          if (res.result_code === 200) {
            getCountyList()
            // closeDialogAdd()
            if (dialogTitle.value === '新增') {
              closeDialogAdd('add')
            } else {
              closeDialogAdd()
            }
          }else if (res.result_code===913){
            ElMessage({
              message: '区县已存在',
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
   // 切换下一页
  const handleCurrentChange = (page) => {
    pageIndex.value = page
    getCountyList() // 表格数据
  }
   // 查询
  const btnSearch = () => {
    getCountyList()
  }
   // 重置
  const btnReset = () => {
    searchForm.province_id = ''
    searchForm.city_id = ''
    searchForm.county = ''
    pageIndex.value = 1
    getCountyList()
  }
   // 新增
  const btnAdded = () => {
    dialogTitle.value = '新增'
    dialogProvinceList = provinceList
    dialogAdd.value = true
  }
   // 编辑
  const edit  = async (row) => {
    dialogTitle.value = '编辑'
    dialogProvinceList = provinceList
    await getCityList('edit', row.province_id)
    dialogAdd.value = true
    dialogForm.province_id = row.province_id
    dialogForm.id = row.id
    dialogForm.city_id = row.city_id
    dialogForm.county = row.county
    console.log('2222', row)
    
  }
   // 查看
  // const detail =  async (row) => {
  //   dialogProvinceList = provinceList
  //   await getCityList('edit', row.province_id)
  //   dialogCityList = cityList
  //   dialogAdd.value = true
  //   dialogForm.province_id = row.province_id
  //   dialogForm.id = row.id
  //   dialogForm.city_id = row.city_id
  //   dialogForm.county = row.county
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
          getCountyList()
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
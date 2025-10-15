<template>
  <div class="page">
    <div class="page-title" id="page-title">
      <h4>区县列表</h4>
    </div>

    <el-form id="forms" :inline="true" :model="searchForm" size="large" label-width="60px">
      <div style="display: flex;align-items: center;">
        <div style="margin-right: 20px;display: flex;align-items: center;flex-wrap: wrap;">
          <el-form-item label="省" v-if="provinceList.length">
            <el-select filterable clearable v-model="searchForm.province_id" placeholder="请选择内容" style="width: 240px" @change="changeProvince">
              <el-option
                v-for="item in provinceList"
                :key="item.id"
                :label="item.province"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="市">
            <el-select filterable clearable v-model="searchForm.city_id" placeholder="请选择内容" style="width: 240px" @change="changeCity">
              <el-option
                v-for="item in cityList"
                :key="item.id"
                :label="item.city"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="区县">
            <el-select filterable clearable v-model="searchForm.county_id" placeholder="请选择内容" style="width: 240px">
              <el-option
                v-for="item in countyList"
                :key="item.id"
                :label="item.county"
                :value="item.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="学校">
            <el-input style="width: 240px" 
              class="search-input"
              clearable
              placeholder="请输入内容"
              v-model="searchForm.school"
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
            <el-button type="success" v-if="addPower" @click="btnAdded">新增</el-button>
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
    <el-table :data="schoolList" class="table-info" :max-height="screenHeight" 
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

      <el-table-column label="学校" min-width="110px">
        <template #default="scope">
          <div class="over-hidden">{{scope.row.name || '-'}}</div>
        </template>
      </el-table-column>

      <el-table-column label="制单人">
        <template #default="scope">
          <div>{{scope.row.maker || '-'}}</div>
        </template>
      </el-table-column>

      <el-table-column label="制单日期" min-width="110px">
        <template #default="scope">
          <div>{{scope.row.make_date || '-'}}</div>
        </template>
      </el-table-column>

      <el-table-column label="修改人">
        <template #default="scope">
          <div>{{scope.row.modifier || '-'}}</div>
        </template>
      </el-table-column>

      <el-table-column label="修改日期" min-width="110px">
        <template #default="scope">
          <div>{{scope.row.modify_date || '-'}}</div>
        </template>
      </el-table-column>

      <el-table-column  label="操作"  fixed="right" v-if="deletePower || editPower">
        <template #default="scope">
          <el-button v-if="editPower" class="button-style" link type="primary" @click="edit(scope.row)">
            修改
          </el-button>
          <!-- <el-button class="button-style" link type="primary" @click="detail(scope.row)">
            查看
          </el-button> -->
          <el-button v-if="deletePower" class="button-style" link type="danger" @click="del(scope.row)">
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
            <el-select filterable clearable v-model="dialogForm.province_id" placeholder="请选择内容" style="width: 240px" @change="changeDialogProvince">
              <el-option
                v-for="item in dialogProvinceList"
                :key="item.id"
                :label="item.province"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="市" prop="city_id" label-width="100px">
            <el-select filterable clearable v-model="dialogForm.city_id" placeholder="请选择内容" style="width: 240px"  @change="changeDialogCity">
              <el-option
                v-for="item in dialogCityList"
                :key="item.id"
                :label="item.city"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="区县" prop="county_id" label-width="100px">
            <el-select filterable clearable v-model="dialogForm.county_id" placeholder="请选择内容" style="width: 240px">
              <el-option
                v-for="item in dialogCountyListt"
                :key="item.id"
                :label="item.county"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="学校" prop="school" label-width="100px">
            <el-input 
              class="search-input"
              clearable
              placeholder="请输入"
              :maxlength="50"
              v-model="dialogForm.school"
              >
            </el-input>
          </el-form-item>
        </el-form>

        <template #footer>
          <div class="dialog-footer">
            <el-button @click="closeDialogAdd">取消</el-button>
            <el-button v-if="!dialogFormDisabled" type="primary" @click="makeSureBtn">
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
  import basicService from '@/service/BasicService.js';
  import aiAgentService from '@/service/AiAgentService.js';
  import { useScreenHeight } from '@/hooks/useScreenHeight.js';
  const { screenHeight } = useScreenHeight();
  import { useVocabularyStore } from '@/store/vocabulary';
  import { ElMessage, ElMessageBox, ElLoading} from 'element-plus'
  let vocabularyStore = useVocabularyStore();
  let searchForm = reactive({
    province_id: '', // 省id
    city_id: '', // 市id
    county_id: '', // 区
    school: '',
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
  let dialogCountyListt = ref([]) // 区筛选数据---弹窗
  let countyList = ref([]) // 区筛选数据
  let schoolList = ref([]) // 学校筛选数据
  let dialogForm = reactive({
    province_id: '', // 省名称
    city_id: '', // 市名称
    county_id: '',
    school: '',
    id:''
  })
  let rules = ref({
    province_id: [
      { required: true, message: '请选择', trigger: 'change' }
    ],
    city_id: [
      { required: true, message: '请选择', trigger: 'change' }
    ],
    county_id: [
      { required: true, message: '请选择', trigger: 'change' }
    ],
    school: [
      { required: true, message: '请输入', trigger: 'blur' }
    ]
  });
  let formref = ref()
  const dialogFormDisabled = ref(false)
  const dialogTitle = ref('新增')
  const addPower = ref(false)
  const editPower = ref(false)
  const deletePower = ref(false)
  onMounted(async() =>{
    getUserPower()
    await getProvinceList()
    await getSchoolList()
  })
  // 获取用户权限
  const getUserPower = () => {
    return basicService.getPower(
      vocabularyStore.user_name,
      vocabularyStore.session,
    )
      .then((res) => {
        // console.log(res)
        if (res.data.findIndex(item => item.menu_index == 'school_add') !== -1) addPower.value = true
        if (res.data.findIndex(item => item.menu_index == 'school_edit') !== -1) editPower.value = true
        if (res.data.findIndex(item => item.menu_index == 'school_del') !== -1) deletePower.value = true
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        loading.value = false
      })
  }
  // 获取所有的省---作为下拉筛选数据使用
  const getProvinceList = async () => {
    const params = {
      session: vocabularyStore.session,
      user_name: vocabularyStore.user_name,
      province: searchForm.province
    }
    try {
      const res = await aiAgentService.getProvincesList(params)
      if (res.result_code === 200) {
        if (res.list && res.list.length) {
          provinceList.value = res.list
        } else {
          provinceList.value = []
        }
      } else {
        ElMessage({
          message: res.description,
          type: 'info',
          duration: 3000
        })
      }
    } catch (error) {
      console.error('获取省份列表失败', error)
    }  
  }
    //筛选省获取下面的市
    const changeProvince = async (val) => {
      searchForm.city_id = ''
      searchForm.county_id = ''
      getCityList('search', val)
    }
    // 获取所有的县区
    const changeCity = async (val) => {
      searchForm.county_id = ''
      getCountyList('search', val)
    }
    const changeDialogProvince = async (val) => {
      dialogForm.city_id = ''
      dialogForm.county_id = ''
      await getCityList('edit', val)
    }
    const changeDialogCity = async (val) => {
      dialogForm.county_id = ''
      await getCountyList('edit', val)
    }
    // 获取所有的市--作为下拉select筛选数据使用
    const getCityList = async (type, province_id) => {
    const params = {
      session: vocabularyStore.session,
      user_name: vocabularyStore.user_name,
      province_id: province_id,
      city: ''
    }
    try {
      const res = await aiAgentService.getAiCityList(params)
      if (res.result_code === 200) {
        if (res.list && res.list.length) {
          if(type === 'edit') {
            dialogCityList.value = res.list
          } else {
            cityList.value = res.list
            console.log('222',cityList )
          }
        } else {
          cityList.value = []
          dialogCityList.value = []
        }
      } else {
        ElMessage({
          message: res.description,
          type: 'info',
          duration: 3000
        })
      }
    } catch (error) {
      console.error('获取列表失败', error)
    }  
  }
  // 获取所有的区县
  const getCountyList = async (type, city_id) => {
    const params = {
      session: vocabularyStore.session,
      user_name: vocabularyStore.user_name,
      province_id: type === 'edit' ? dialogForm.province_id : searchForm.province_id,
      city_id: city_id,
      county: searchForm.county
    }
    try {
      const res = await aiAgentService.getAiCountyList(params)
      if (res.result_code === 200) {
        if (res.list && res.list.length) {
          if(type === 'edit') {
            dialogCountyListt = res.list
          } else {
            countyList.value = res.list
          }
        } else {
          countyList.value = []
          dialogCountyListt = []
        }
      } else {
        ElMessage({
          message: res.description,
          type: 'error'
        })
      }
    } catch (error) {
      console.error('获取列表失败', error)
    }  
  }

  // 获取所有的学校
  const getSchoolList = async () => {
    const params = {
      session: vocabularyStore.session,
      user_name: vocabularyStore.user_name,
      page_index: pageIndex.value,
      page_size: pageSize.value,
      province_id: searchForm.province_id,
      city_id: searchForm.city_id,
      county_id: searchForm.county_id,
      school: searchForm.school
    }
    try {
      const res = await aiAgentService.getAiSchoolList(params)
      if (res.result_code === 200) {
        if (res.list && res.list.length) {
          schoolList.value = res.list
          total.value = res.total
        } else {
          schoolList.value = []
          total.value = 0
        }
      } else {
        ElMessage({
          message: res.description,
          type: 'error'
        })
      }

    } catch (error) {
      console.error('获取列表失败', error)
    }  
  }
   // 取消新增
  const closeDialogAdd = (val) => {
    if (val === 'add') {
      dialogForm.school = ''
      dialogForm.id = ''
      dialogFormDisabled.value = false
    } else {
      dialogProvinceList = []
      dialogCityList.value = []
      dialogCountyListt = []
      dialogAdd.value = false
      formref.value.resetFields()
      dialogForm.province_id = ''
      dialogForm.city_id = ''
      dialogForm.county_id = ''
      dialogForm.school = ''
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
          county_id: dialogForm.county_id,
          school: dialogForm.school,
          session: vocabularyStore.session,
          user_name: vocabularyStore.user_name,
        }
        try {
          const res = await aiAgentService.editAiSchool(params)
          if (res.result_code === 200) {
            getSchoolList()
            if (dialogTitle.value === '新增') {
              closeDialogAdd('add')
            } else {
              closeDialogAdd()
            }
          }else if (res.result_code===913){
            ElMessage({
              message: '学校已存在',
              type: 'error',
            })
          } else {
            ElMessage({
              message: res.description,
              type: 'error'
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
    getSchoolList() // 表格数据
  }
   // 查询
  const btnSearch = () => {
    getSchoolList()
  }
   // 重置
  const btnReset = () => {
    searchForm.province_id = ''
    searchForm.city_id = ''
    searchForm.county_id = ''
    searchForm.school = ''
    cityList = []
    countyList = []
    pageIndex.value = 1
    getSchoolList()
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
    await getCountyList('edit', row.city_id)
    dialogAdd.value = true
    dialogForm.province_id = row.province_id
    dialogForm.id = row.id
    dialogForm.city_id = row.city_id
    dialogForm.county_id = row.county_id
    dialogForm.school = row.name
    
  }
   // 查看
  // const detail =  async (row) => {
  //   dialogProvinceList = provinceList
  //   await getCityList('edit', row.province_id)
  //   await getCountyList('edit', row.city_id)
  //   dialogAdd.value = true
  //   dialogForm.province_id = row.province_id
  //   dialogForm.id = row.id
  //   dialogForm.city_id = row.city_id
  //   dialogForm.county_id = row.county_id
  //   dialogForm.school = row.name
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
      aiAgentService.delAiSchool(params).then((res) => {
        if (res.result_code === 200) {
          getSchoolList()
          ElMessage({
            message: '删除成功',
            type: 'success',
            duration: 1000
          })
        }else if(res.result_code === 919) {
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
<template>
  <div class="page">
    <div class="page-title" id="page-title">
      <h4>区域管理</h4>
    </div>
    <div class="area-box"> 
      <div class="tab-class">
        <div style="margin-right:40px;" :class="{'login-active' : currentTab === 1}" @click="tabChange(1)">城市</div>
        <div :class="{'login-active' : currentTab === 2}" @click="tabChange(2)">区域</div>
      </div>
      <el-form id="cityForms" :inline="true" :model="cityForm" size="large" label-width="50px">
        <div style="display: flex;align-items: center;justify-content: space-between;">
          <div>
            <el-form-item label="省份">
              <el-select
                collapse-tags
                collapse-tags-tooltip 
                multiple
                v-model="cityForm.province"
                placeholder="请选择"
                style="width: 160px" @change="changeProvince"
              >
              <el-option
                v-for="item in provinceData"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
              </el-select>
            </el-form-item>


            <el-form-item label="城市">
              <el-select
                collapse-tags
                collapse-tags-tooltip 
                multiple
                v-model="cityForm.city"
                placeholder="请选择"
                style="width: 160px" @change="changeCity"
              >
              <el-option
                v-for="item in cityData"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
              </el-select>
            </el-form-item>

            <el-form-item label="区" v-if="currentTab === 2">
              <el-select
                collapse-tags
                collapse-tags-tooltip 
                multiple
                v-model="cityForm.area"
                placeholder="请选择"
                style="width: 160px" @change="changeArea"
              >
              <el-option
                v-for="item in areaData"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
              </el-select>
            </el-form-item>

            <el-form-item label="状态">
              <el-select
                v-model="cityForm.state"
                placeholder="请选择"
                style="width: 100px"
              >
              <el-option
                v-for="item in stateData"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
              </el-select>
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
              <el-button type="success" v-if="addPower" @click="btnAdded">新增</el-button>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <div class="line"></div>
      <el-table :data="cityListData" class="table-info" :max-height="screenHeight" 
        v-loading="loading" header-cell-class-name="header_row_class" ref="multipleTable"  stripe
        element-loading-text="拼命加载中，主人请稍后...">

        <el-table-column label="所属省份">
          <template #default="scope">
            <div>{{scope.row.province}}</div>
          </template>
        </el-table-column>

        <el-table-column label="城市">
          <template #default="scope">
            <div>{{scope.row.city}}</div>
          </template>
        </el-table-column>

        <el-table-column label="区域" v-if="currentTab === 2">
          <template #default="scope">
            <div>{{scope.row.county}}</div>
          </template>
        </el-table-column>

        <el-table-column label="创建人">
          <template #default="scope">
            <div>{{scope.row.maker_name}}</div>
          </template>
        </el-table-column>

        <el-table-column label="创建时间">
          <template #default="scope">
            <div>{{scope.row.make_date}}</div>
          </template>
        </el-table-column>

        <el-table-column  label="操作"  fixed="right">
          <template #default="scope">
              <el-button class="button-style" link type="danger"  @click="delArea(scope.row)" v-if="deletePower">
                删除
            </el-button>
            <el-button class="button-style" link type="primary" @click="btnStopDisable(scope.row)" v-if="disablePower">
                {{scope.row.stop_flag === 0 ? '禁用' : '启用' }}
            </el-button>
          </template>
        </el-table-column>

      </el-table>

      
      <el-pagination style="color: #666666;margin: 20px 0 0 20px;" v-show="total > 0" @current-change="handleCurrentChange" :current-page="pageIndex" :page-size="pageSize" layout="total, prev, pager, next" prev-text="上一页" next-text="下一页" :total="total">
      </el-pagination>

    </div>

    <!-- 新增弹窗-选择省份/城市/区域 -->
    <div class="add-dialog">
      <el-dialog
        v-model="dialogAddCity"
        title="新增"
        width="600"
        :show-close="false"
        :destroy-on-close="true"
        @close="closeDialogAdd"
        >
        

        <el-form :inline="true" id="form" ref="formref" :model="cityDialogForm" size="large" label-width="100px" :rules="rules">
          <el-form-item label="选择省份" prop="province" label-width="130px">
            <el-select
              v-model="cityDialogForm.province"
              placeholder="请选择"
              @change="changeDialogProvince"
            >
            <el-option
              v-for="item in provinceDialogData"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
            </el-select>
          </el-form-item>


          <el-form-item label="选择城市" prop="city" label-width="130px">
            <el-select
              v-model="cityDialogForm.city"
              placeholder="请选择"
              @change="changeDialogCity"
            >
            <el-option
              v-for="item in cityDialogData"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
            </el-select>
          </el-form-item>

          
          <el-form-item label="选择区域" prop="city" v-if="currentTab === 2" label-width="130px">
            <el-select
              v-model="cityDialogForm.area"
              placeholder="请选择"
              @change="changeDialogArea"
            >
            <el-option
              v-for="item in areaDialogData"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
            </el-select>
          </el-form-item>


        </el-form>

        <template #footer>
          <div class="dialog-footer">
            <el-button @click="closeDialogAdd">取消</el-button>
            <el-button type="primary" @click="makeSureBtn">
            确定
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
import ManageApi from '@/service/ManageApi';
import { useVocabularyStore } from '@/store/vocabulary';
  import { ElMessage, ElLoading, ElMessageBox} from 'element-plus'
// import { useRouter } from 'vue-router';
let vocabularyStore = useVocabularyStore();
// const router = useRouter();
let pageIndex = ref(1)
let pageSize = ref(10) 
let total = ref(0)
let provinceData = ref([]) // 省份
let cityData = ref([]) // 城市
let areaData = ref([]) // 区域
let stateData = ref([
  {
    id: 0,
    name: '启用'
  },
  {
    id: 1,
    name: '禁用'
  }
]) // 状态
let cityForm = reactive({
  province: '', // 省份
  city: '', // 城市
  area: '', // 区域
  state: '', // 状态
})
let cityDialogForm = reactive({ // 新增
  province: '', // 省份
  city: '', // 城市
  area: '', // 区域
})
let formref = ref()
let provinceDialogData = ref([]) // 新增省份
// let addProvinceName = ref('') // 新增省份名字
let cityDialogData = ref([]) // 新增城市
// let addCityName = ref('') // 新增城市名字
let areaDialogData = ref([]) // 新增区域
// let addAreaName = ref([]) // 新增区域名字
let rules = ref({
  province: [
    { required: true, message: '请选择', trigger: 'change' }
  ],
  city: [
    { required: true, message: '请选择', trigger: 'change' }
  ],
});
let screenHeight = ref(0) // 表格高
let cityListData = ref([]) // 表格数据
let loading = ref(false)
let dialogAddCity = ref(false)
let currentTab = ref(1) // tab选择项-默认城市
let addType = ref(1) // 来源：1：新增城市页面，2：新增区域页面

let addPower = ref(false) // 用户是否有增加操作权限
let disablePower = ref(false) // 用户是否有禁用操作权限
let deletePower = ref(false) // 用户是否有删除操作权限
onMounted(() =>{
  getUserPower() // 获取用户权限列表
  getProvinceList() // 获取省份
  window.addEventListener('resize', updateScreenHeight);
  updateScreenHeight();
  getQuestionDataList() // 表格数据-城市
})
function getUserPower() {
  return basicService.getPower(
    vocabularyStore.user_name,
    vocabularyStore.session,
  )
    .then((res) => {
      // console.log(res)
      if (res.data.findIndex(item => item.menu_index == 'base_area_add') !== -1) addPower.value = true
      if (res.data.findIndex(item => item.menu_index == 'base_area_disable') !== -1) disablePower.value = true
      if (res.data.findIndex(item => item.menu_index == 'base_area_delete') !== -1) deletePower.value = true
    })
    .catch((error) => {
      console.log(error)
    })
    .finally(() => {
      loading.value = false
    })
} // 获取用户权限
function updateScreenHeight () {
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

    // console.log(height)
    screenHeight.value = window.innerHeight - formHeight - titleHeight - pageHeight - menuHeight - 130
    // wordSelectHeight.value = window.innerHeight - titleHeight - menuHeight - 50
  }
}
function btnSearch () { // 查询
  if (currentTab.value === 1) {
    getQuestionDataList() // 表格数据-城市
  } else {
    getQuestionCountyDataList() // 表格数据-区域
  }
}
function btnReset () { // 重置
  cityForm.province = ''
  cityForm.city = ''
  cityForm.area = ''
  cityForm.state = ''
  // cityListData.value = []
  // total.value = 0
  pageIndex.value = 1
  if (currentTab.value === 2) {
    getQuestionCountyDataList() // 表格数据-区域
  } else {
    getQuestionDataList() // 表格数据-城市
  }
}
function changeDialogProvince () { // 切换新增省份
  cityDialogForm.city = ''
  cityDialogForm.area = ''
  getAddCityList() // 新增获取城市
}
function changeDialogCity () { // 切换新增城市
  getAddCountyList() // 切换新增区域
  cityDialogForm.area = ''
}
function changeDialogArea () { // 切换新增区域


}
function tabChange (num) {
  currentTab.value = num
  // cityListData.value = []
  // total.value = 0
  addType.value = num
  cityForm.province = ''
  cityForm.city = ''
  cityForm.area = ''
  cityForm.state = ''
  if (currentTab.value === 2) {
    getAreaList()
    getQuestionCountyDataList() // 表格数据-区域
  } else {
    getQuestionDataList() // 表格数据-城市
  }
}
function btnAdded () { // 新增
  dialogAddCity.value = true
  getAddProvince() // 新增获取省
}
function getAddProvince () { // 新增获取省
  // 参数1： 1: 查询省份，2：查询城市，3：查询区域
  ManageApi.getProvinceCityList(addType.value, 0, vocabularyStore.session, 1, vocabularyStore.user_name, '', '').then((res) => {
    if (res.result_code === 200) {
      provinceDialogData.value = res.data
      // if (provinceDialogData.value.length) {
      //   cityDialogForm.province = provinceDialogData.value[0].id
      //   addProvinceName.value = provinceDialogData.value[0].name
      // }
      // getAddCityList() // 新增获取城市
    }
  }).catch((error) => {
    console.log(error)
  })
}
function getAddCityList () { // 新增获取城市
  // 参数2： 1: 查询省份，2：查询城市，3：查询区域
  ManageApi.getProvinceCityList(addType.value, cityDialogForm.province || 0, vocabularyStore.session, 2, vocabularyStore.user_name, '', '').then((res) => {
    if (res.result_code === 200) {
      cityDialogData.value = res.data
      // if (cityDialogData.value.length) {
      //   cityDialogForm.city = cityDialogData.value[0].id
      //   addCityName.value = cityDialogData.value[0].name
      // }
      // getAddCountyList()
    }
  }).catch((error) => {
    console.log(error)
  })
}

function getAddCountyList () { // 新增获取区域
  // 参数2： 来源：1：新增城市页面，2：新增区域页面
  // 参数3： 1: 查询省份，2：查询城市，3：查询区域
  ManageApi.getProvinceCityList(2, cityDialogForm.city || 0, vocabularyStore.session, 3, vocabularyStore.user_name, '', '').then((res) => {
    if (res.result_code === 200) {
      areaDialogData.value = res.data
      // if (areaDialogData.value.length) {
      //   cityDialogForm.area = areaDialogData.value[0].id
      //   addAreaName.value = areaDialogData.value[0].name
      // }
    }
  }).catch((error) => {
    console.log(error)
  })
}
function delArea (row) { // 删除
  if (currentTab.value === 1) { // 城市
    ElMessageBox.confirm(
      '确定后数据不可恢复，请谨慎操作',
      '是否确认删除',
      {
        confirmButtonText: '确定',
        confirmButtonClass: 'button-confirm',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }
    ).then(() => {
      ManageApi.getUpdateCity(row.id, vocabularyStore.session, vocabularyStore.user_name, 1, row.stop_flag).then((res) => {
        if (res.result_code === 200) {
          cityForm.province = ''
          cityForm.city = ''
          getQuestionDataList() // 表格数据-城市
          getUpdataProvinceList() // 更新省份
          ElMessage({
            message: '删除成功',
            type: 'success',
            duration: 1000
          })
        } else if (res.result_code === 1008) {
          ElMessage({
            message: '<strong>其下关联<b style="color: red">区域/学校 </b> 禁止删除</strong>',
            type: 'info',
            dangerouslyUseHTMLString: true,
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
  } else { // 区域
    ElMessageBox.confirm(
      '确定后数据不可恢复，请谨慎操作',
      '是否确认删除',
      {
        confirmButtonText: '确定',
        confirmButtonClass: 'button-confirm',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }
    ).then(() => {
      ManageApi.getUpdateCounty(row.id, vocabularyStore.session, vocabularyStore.user_name, 1, row.stop_flag).then((res) => {
        if (res.result_code === 200) {
          getQuestionCountyDataList() // 表格数据-区域
          cityForm.province = ''
          cityForm.city = ''
          cityForm.area = ''
          getUpdataProvinceList() // 更新省份
          ElMessage({
            message: '删除成功',
            type: 'success',
            duration: 1000
          })
        }  else if (res.result_code === 1010) {
          ElMessage({
            message: '<strong>其下关联<b style="color: red">区域/学校 </b> 禁止删除</strong>',
            type: 'info',
            dangerouslyUseHTMLString: true,
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
}
function btnStopDisable (row) { // 启用/禁用
  if (currentTab.value === 1) { // 城市
    ElMessageBox.confirm(
      `${row.stop_flag === 0 ? '禁用后，其下的学校、商品等信息都会受到影响，请谨慎操作' : ''}`,
      `${row.stop_flag === 0 ? '是否确认禁用' : '是否确认启用'}`,
      {
        confirmButtonText: '确定',
        confirmButtonClass: 'button-confirm',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }
    ).then(() => {
      ManageApi.getUpdateCity(row.id, vocabularyStore.session, vocabularyStore.user_name, 0, row.stop_flag === 0 ? 1 : 0).then((res) => {
        if (res.result_code === 200) {
          cityForm.province = ''
          cityForm.city = ''
          getQuestionDataList() // 表格数据-城市
          getUpdataProvinceList() // 更新省份
          ElMessage({
            message: `${row.stop_flag === 0 ? '禁用成功' : '启用成功'}`,
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
  } else { // 区域
    ElMessageBox.confirm(
      `${row.stop_flag === 0 ? '禁用后，其下的学校、商品等信息都会受到影响，请谨慎操作' : ''}`,
      `${row.stop_flag === 0 ? '是否确认禁用' : '是否确认启用'}`,
      {
        confirmButtonText: '确定',
        confirmButtonClass: 'button-confirm',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }
    ).then(() => {
      ManageApi.getUpdateCounty(row.id, vocabularyStore.session, vocabularyStore.user_name, 0, row.stop_flag === 0 ? 1 : 0).then((res) => {
        if (res.result_code === 200) {
          cityForm.province = ''
          cityForm.city = ''
          cityForm.area = ''
          getQuestionCountyDataList() // 表格数据-区域
          getUpdataProvinceList() // 更新省份
          ElMessage({
            message: `${row.stop_flag === 0 ? '禁用成功' : '启用成功'}`,
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
}
function closeDialogAdd () { // 取消新增
  dialogAddCity.value = false
  cityDialogForm.province = ''
  cityDialogForm.city = ''
  cityDialogForm.area = ''
  formref.value.resetFields()
}
function getCityName () { // 获取新增的城市名字
  return cityDialogData.value.find(item => {
    return item.id === cityDialogForm.city
  }).name
}
function getProvinceName () { // 获取新增的省份名字
  return provinceDialogData.value.find(item => {
    return item.id === cityDialogForm.province
  }).name
}
function getCountyName () { // 获取新增的区域名字
  return areaDialogData.value.find(item => {
    return item.id === cityDialogForm.area
  }).name
}
function makeSureBtn () { // 确定新增
  if (currentTab.value === 1) { // 城市新增
    formref.value.validate((valid) => {
      if (valid) {
        const loading = ElLoading.service({
          lock: true,
          text: 'Loading',
          background: 'rgba(0, 0, 0, 0.7)',
        })
        // console.log(formDialog)
        ManageApi.getAddCity(getCityName(), cityDialogForm.city, getProvinceName(), cityDialogForm.province, vocabularyStore.session, vocabularyStore.user_name).then((res) => {
          if (res.result_code === 200) {
            ElMessage({
              message: '新增成功',
              type: 'success',
              duration: 3000
            })
            closeDialogAdd()
            getUpdataProvinceList() // 更新省份
            getQuestionDataList() // 表格数据-城市
          } else {
            ElMessage({
              message: res.description,
              type: 'info',
              duration: 3000
            })
          }
          loading.close()
        }).catch((error) => {
          console.log(error)
        })
      } else {
        return false
      }
    })
  } else { // 区域新增
    formref.value.validate((valid) => {
    if (valid) {
      const loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })
      // console.log(formDialog)
      ManageApi.getAddCounty(cityDialogForm.city, getCountyName(), cityDialogForm.area, cityDialogForm.province, vocabularyStore.session, vocabularyStore.user_name).then((res) => {
        if (res.result_code === 200) {
          ElMessage({
            message: '新增成功',
            type: 'success',
            duration: 3000
          })
          closeDialogAdd()
          getUpdataProvinceList() // 更新省份
          getQuestionCountyDataList() // 表格数据-区域
        } else {
          ElMessage({
            message: res.description,
            type: 'info',
            duration: 3000
          })
        }
        loading.close()
      }).catch((error) => {
        console.log(error)
      })
    } else {
      return false
    }
  })
  }
}
function getUpdataProvinceList () { // 更新省份
  // 类型 1：查询省份，2：查询城市，3：查询区域
  ManageApi.getQuestionList(0, 1, vocabularyStore.session, vocabularyStore.user_name, '', '').then((res) => {
    if (res.result_code === 200) {
      provinceData.value = res.data
      getCityList() // 获取城市
    }
  }).catch((error) => {
    console.log(error)
  })
}
function getProvinceList () { // 省份
  // 类型 1：查询省份，2：查询城市，3：查询区域
  ManageApi.getQuestionList(0, 1, vocabularyStore.session, vocabularyStore.user_name, '', '').then((res) => {
    if (res.result_code === 200) {
      provinceData.value = res.data
      // if (provinceData.value.length) {
      //   cityForm.province = provinceData.value[0].id
      // }
      // getCityList() // 获取城市
    }
  }).catch((error) => {
    console.log(error)
  })
}
function getCityList () { // 城市
  // 类型 1：查询省份，2：查询城市，3：查询区域
  ManageApi.getQuestionList(cityForm.province === '' ? 0 : cityForm.province.join(','), 2, vocabularyStore.session, vocabularyStore.user_name, '', '').then((res) => {
    if (res.result_code === 200) {
      cityData.value = res.data
      // if (cityData.value.length) {
      //   cityForm.city = cityData.value[0].id
      // }
      if (currentTab.value === 2) {
        getAreaList()
      }
    }
  }).catch((error) => {
    console.log(error)
  })
}
function changeProvince () { // 切换省份
  cityForm.city = ''
  cityForm.area = ''
  getCityList()
}
function changeCity () { // 切换城市
  if (currentTab.value === 2) {
    cityForm.area = ''
    getAreaList()
  }
}
function changeArea () { // 切换区域

}
function getAreaList () { // 区域
  // 类型 1：查询省份，2：查询城市，3：查询区域
  ManageApi.getQuestionList(cityForm.city === '' ? 0 : cityForm.city.join(','), 3, vocabularyStore.session, vocabularyStore.user_name, '', '').then((res) => {
    if (res.result_code === 200) {
      areaData.value = res.data
      // if (areaData.value.length) {
      //   cityForm.area = areaData.value[0].id
      // }
    }
  }).catch((error) => {
    console.log(error)
  })
}
function handleCurrentChange (page) { // 切换下一页
  pageIndex.value = page
  if (currentTab.value === 1) {
    getQuestionDataList() // 表格数据-城市
  } else {
    getQuestionCountyDataList() // 表格数据-区域
  }
}
function formateCity () {
  if (cityForm.city === '') { // 城市传参
    return ''
  } else {
    return cityForm.city.join(',')
  }
}
function formateProvince () {
  if (cityForm.province === '') { // 省份传参
    return ''
  } else {
    return cityForm.province.join(',')
  }
}
function formateCounty () {
  if (cityForm.area === '') { // 区域传参
    return ''
  } else {
    return cityForm.area.join(',')
  }
}
function getQuestionDataList () { // 表格数据-城市
  ManageApi.getCityList( formateCity(), formateProvince(), cityForm.state, vocabularyStore.session, vocabularyStore.user_name, pageIndex.value, pageSize.value).then((res) => {
    if (res.result_code === 200) {
      cityListData.value = res.data
      total.value = res.total
      if (res.data.length === 0 && pageIndex.value > 1) {
        pageIndex.value = pageIndex.value - 1
        getQuestionDataList()
      }
      // console.log(res)
    }
  }).catch((error) => {
    console.log(error)
  })
}
function getQuestionCountyDataList () { // 表格数据--区域
  ManageApi.getCountyList(vocabularyStore.session, vocabularyStore.user_name, formateCity(), formateCounty(), pageIndex.value, pageSize.value, formateProvince(), cityForm.state).then((res) => {
    if (res.result_code === 200) {
      cityListData.value = res.data
      total.value = res.total
      if (res.data.length === 0 && pageIndex.value > 1) {
        pageIndex.value = pageIndex.value - 1
        getQuestionCountyDataList()
      }
      // console.log(res)
    }
  }).catch((error) => {
    console.log(error)
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
.area-box{
  box-sizing: border-box;
  width: 100%;
  padding: 0 20px;
}
.line{
  margin: 30px 0;
  border: 1px dotted #eee;
}
.add-dialog :deep(.form-box){
  text-align:center;
  /* margin:0 auto;
  width:53%; */
}
.tab-class{
  display: flex;
  align-items: center;
  margin-bottom:41px;
  justify-content: flex-start;
  cursor: pointer;
}
.tab-class div{
  font-size: 20px;
  /* font-family: PingFangSC-Medium, myPingFang; */
  font-weight: 500;
  color: #4C4F4C;
}
.login-active{
  
  font-size: 22px !important;
  font-weight: 600 !important;
  color: #1C9B4D !important;;
}
.login-active:after{
  height: 4px;
  background: #29B561;
  border-radius: 2px;
  content: '';
  display: block;
  position: relative;
  top: 11px;
}
#form .el-select {
  --el-select-width: 350px;
}

#form .el-input {
  --el-input-width: 350px;
}
</style>
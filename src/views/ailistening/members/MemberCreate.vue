<template>
  <div class="page">
    <div class="page-title" id="page-title">
      <h4>会员开通</h4>
    </div>

    <el-form id="cityForms" :inline="true" :model="memberForm" size="large" label-width="80px">
      <div style="display: flex;align-items: center;justify-content: flex-end;">
        <div style="margin-right: 20px;">
          <!-- <el-form-item label="省份">
            <el-select
              v-model="memberForm.province"
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
              v-model="memberForm.city"
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

          <el-form-item label="区县">
            <el-select
              v-model="memberForm.area"
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

          <el-form-item label="学校">
            <el-input style="width: 120px" 
              class="search-input"
              clearable
              placeholder="请输入内容"
              v-model="memberForm.school"
              >
            </el-input>
          </el-form-item> -->
          <el-form-item label="账号">
            <el-input style="width: 120px" 
              class="search-input"
              clearable
              placeholder="请输入内容"
              v-model="memberForm.userCode"
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
            <el-button type="success" v-if="addPower" @click="btnAdded">新增</el-button>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <!-- <div class="line"></div> -->
    <el-table :data="memberList" class="table-info" :max-height="screenHeight" 
      v-loading="loading" header-cell-class-name="header_row_class" ref="multipleTable"  stripe
      element-loading-text="拼命加载中，主人请稍后...">

      <el-table-column  width="100" align="center" label="序号">
        <template #default="scope">
          <div class="title-resource">{{(pageIndex-1)*pageSize+(scope.$index)+1}}&nbsp;&nbsp;</div>
        </template>
      </el-table-column>

      <el-table-column label="账号">
        <template #default="scope">
          <div class="over-hidden" :title="scope.row.user_code">{{scope.row.user_code}}</div>
        </template>
      </el-table-column>

      <el-table-column label="天数">
        <template #default="scope">
          <div>{{scope.row.trial_date}}</div>
        </template>
      </el-table-column>

      <el-table-column label="开始时间">
        <template #default="scope">
          <div>{{scope.row.trial_start_time}}</div>
        </template>
      </el-table-column>

      <el-table-column label="结束时间">
        <template #default="scope">
          <div>{{scope.row.trial_end_time}}</div>
        </template>
      </el-table-column>

      <el-table-column label="创建人">
        <template #default="scope">
          <div class="over-hidden" :title="scope.row.maker_name">{{scope.row.maker_name ? scope.row.maker_name : '-'}}</div>
        </template>
      </el-table-column>

      <el-table-column label="创建日期">
        <template #default="scope">
          <div>{{scope.row.make_date}}</div>
        </template>
      </el-table-column>

      <el-table-column  label="操作"  fixed="right">
        <template #default="scope">
            <el-button class="button-style" link type="primary" v-if="editPower" @click="editSchool(scope.row)">
              编辑
            </el-button>
            <el-button class="button-style" link type="danger" v-if="deletePower" @click="delSchool(scope.row)">
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
        v-model="dialogAddMember"
        title="新增"
        width="600"
        :show-close="false"
        :destroy-on-close="true"
        @close="closeDialogAdd"
        >
        <el-dialog
          v-model="notActivatedVisible"
          width="300"
          title="未开通账号"
          append-to-body
        >
        <div v-for="(item, index) in filteredUserCodesList" :key="index" style="margin-bottom: 10px;">
          {{ item }}
        </div>
        </el-dialog>
        <el-form :inline="true" ref="formref" id="form" :model="memberDialogForm" size="large" label-width="100px" :rules="rules">
             
          <el-form-item label="账号" prop="user_codes" label-width="130px">
            <el-input
              @blur="handleBlur"
              v-model="memberDialogForm.user_codes"
              :rows="4"
              @input="handleInput"
              :maxlength="50"
              type="textarea"
              placeholder="请输入账号，多个用，隔开"
            />
          </el-form-item>

          <el-form-item label="会员" prop="recharge_types" label-width="130px">
            <el-radio-group  v-model="rechargeType" style="margin-right: 60px;">
              <el-radio :value='1'>套餐</el-radio>
              <el-radio :value='2'>自定义天数</el-radio>
            </el-radio-group>
            <!-- 套餐 -->
            <div v-if="rechargeType === 1" class="year-box">
              <div v-for="(item, index) in memberType" :key="index" class="year-item" @click="selectedYears(item)" :class="{'active-years': memberTypeId === item.id}">
                {{ item. name}}
              </div>
            </div>
            <!-- 自定义天数 -->
            <div v-if="rechargeType === 2" style="margin-top: 20px;">
              <el-input-number
                v-model="trialDate"
                controls-position="right"
                size="large"
                :min="1"
                @change="handleChange"
              />
            </div>
          </el-form-item>

          <el-form-item label="开始时间" prop="trial_start_times" label-width="130px">
            <!-- :disabled-date="disabledStartDate" -->
            <el-date-picker
              @change="dataChange"
              v-model="memberDialogForm.trial_start_times"
              placeholder="选择日期"
            />
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
  import memberApi from '@/service/MemberService.js';
  import basicService from '@/service/BasicService.js';
  import { useVocabularyStore } from '@/store/vocabulary';
  import format from '@/utils/DateUtil.js'
  import { ElMessage, ElMessageBox, ElLoading} from 'element-plus'
  let vocabularyStore = useVocabularyStore();
  let memberForm = reactive({
    // province: '', // 省份
    // city: '', // 城市
    // area: '', // 区域
    // school: '', // 学校
    userCode: '' // 账号
  })
  let pageIndex = ref(1)
  let pageSize = ref(10) 
  let total = ref(0)
  // let provinceData = ref([]) // 省份
  // let cityData = ref([]) // 城市
  // let areaData = ref([]) // 区域
  let dialogAddMember = ref(false)
  let notActivatedVisible = ref(false)
  let filteredUserCodesList= ref('') // 未开通的账号数组
  let loading = ref(false)
  let memberList = ref([]) // 表格数据
  let memberDialogForm = reactive({
    user_codes: '', // 账号 多个账号用，隔开
    recharge_types: 0, // 会员套餐(1是一年套餐(默认值1) 2是二年套餐 3是三年套餐 4是半年套餐)/体验天数 (默认值0)
    trial_start_times: '', // 开始时间
  })
  let rechargeType = ref(0) // 充值类型: 1是会员套餐 2是体验天数
  let memberType = ref([ // 会员套餐:
    {
      id: 1,
      name: '一年'
    },
    {
      id: 2,
      name: '二年'
    },
    {
      id: 3,
      name: '三年'
    },
    {
      id: 4,
      name: '半年'
    },
  ])
  let memberTypeId = ref(1) // 会员套餐:是一年套餐(默认值1
  let trialDate = ref(30) // 体验天数 (默认值0)
  function validatePhoneNumbers(str) {
    if (!str) return false
    const phoneNumbers = str.split(',')
    for (const phone of phoneNumbers) {
      if (!phone || phone.length !== 11) {
        return false
      }
    }
    return true
  }
  var validateUserCode = (rule, value, callback) => {
    let result = validatePhoneNumbers(value)
    if (!result) {
      callback(new Error("请输入有效的11位账号、多个用，隔开、末尾不能是，"))
    } else {
      callback()
    }
  }
  let rules = ref({
    user_codes: [
      { required: true, message: '请输入账号', trigger: 'blur' },
      {validator: validateUserCode, trigger: 'blur'}
    ],
    recharge_types: [
      { required: true, message: '请选择', trigger: 'blur' }
    ],
    trial_start_times: [
      { required: true, message: '请选择日期', trigger: 'change' }
    ]
  });
  let screenHeight = ref(0) // 表格高
  let memberIds = ref(0) // 开通记录id(自增主键)
  let formref = ref()

  let addPower = ref(false) // 用户是否有增加操作权限
  let editPower = ref(false) // 用户是否有编辑操作权限
  let deletePower = ref(false) // 用户是否有删除操作权限
  onMounted(() =>{
    getUserPower() // 获取用户权限列表
    // getProvinceList() // 获取省份
    window.addEventListener('resize', updateScreenHeight);
    updateScreenHeight();
    getSchoolListData() // 表格数据
  })
  // const disabledStartDate = (time) => {
  //   return format.formatDateDay(time.getTime()) < format.formatDateDay(new Date().getTime())
  // }
  function getUserPower() {
    return basicService.getPower(
      vocabularyStore.user_name,
      vocabularyStore.session,
    )
      .then((res) => {
        // console.log(res)
        if (res.data.findIndex(item => item.menu_index == 'member-create-add') !== -1) addPower.value = true
        if (res.data.findIndex(item => item.menu_index == 'member-create-edit') !== -1) editPower.value = true
        if (res.data.findIndex(item => item.menu_index == 'member-create-dele') !== -1) deletePower.value = true
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
      screenHeight.value = window.innerHeight - formHeight - titleHeight - pageHeight - menuHeight
      // wordSelectHeight.value = window.innerHeight - titleHeight - menuHeight - 50
    }
  }
  function selectedYears (item) {
    memberTypeId.value = item.id
  }
  function closeDialogAdd () { // 取消新增
    dialogAddMember.value = false
    formref.value.resetFields()
    memberDialogForm.user_codes = ''
    memberDialogForm.trial_date = 0
    memberDialogForm.trial_start_times = ''
    rechargeType.value = 0
    memberTypeId.value = 1 // 会员套餐:是一年套餐(默认值1
    trialDate.value = 30 // 体验天数 (默认值0)
  }
  function handleInput (value) {
    // 只允许输入数字或英文逗号
    //编辑时候的账号不能输入, 新增时候可以输入,
    const filteredValue = memberIds.value ? value.replace(/[^0-9]/g, "") : value.replace(/[^0-9,]/g, "");
    memberDialogForm.user_codes = filteredValue
  }
  function handleChange () { // 自定义天数输入框
    // console.log(trialDate.value)
  }
  function dataChange (now) {
    memberDialogForm.trial_start_times = format.formatDateDay(now.getTime())
  }
  function makeSureBtn () { // 确定新增/编辑
    formref.value.validate((valid) => {
      if (valid) {
        if (rechargeType.value === 0) {
          ElMessage({
            message: '请选择会员套餐或自定义天数',
            type: 'info',
            duration: 3000
          })
          return
        }
        if (memberDialogForm.trial_start_times === '') {
          ElMessage({
            message: '请选择开始时间',
            type: 'info',
            duration: 3000
          })
          return
        }
        const loading = ElLoading.service({
          lock: true,
          text: 'Loading',
          background: 'rgba(0, 0, 0, 0.7)',
        })
        let params = {
          recharge_type: rechargeType.value, // 充值类型: 1是会员套餐 2是体验天数
          user_name: vocabularyStore.user_name,
          session: vocabularyStore.session,
          trial_start_time: memberDialogForm.trial_start_times, // 体验开始日期
          user_codes: memberDialogForm.user_codes, // 学生账号集合`
          id: memberIds.value, // 开通记录id(自增主键)
          member_type: rechargeType.value === 1 ? memberTypeId.value : 0, // 会员套餐: 1是一年套餐(默认值1) 2是二年套餐 3是三年套餐 4是半年套餐
          trial_date: rechargeType.value === 2 ? trialDate.value : 0 // 体验天数 (默认值0)
        }
        // console.log(formDialog)
        // 1004 @@@所有账号都在有效期内，无法开通  1005 部分账号开通成功 1006 所有用户都已经是正式会员，不能重复添加体验会员 1007 全部账号开通成功 @@@
        memberApi.saveStudentMember(params).then((res) => {
          if (res.result_code === 1004 || res.result_code === 1006) {
            ElMessage({
              message: res.description,
              type: 'error',
              // duration: 1000
            })
            closeDialogAdd()
          }
          // 部分开通成功或者全部成功 1007全部 1005部分
          if (res.result_code === 1007) {
            ElMessage({
              message: res.description,
              type: 'success',
              // duration: 1000
            })
            pageIndex.value = 1
            getSchoolListData()
            closeDialogAdd()
          }
          if (res.result_code === 1005) {
            filteredUserCodesList.value = res.filteredUserCodes
            ElMessage({
              message: `${res.description}`,
              type: 'success',
              duration: 1000
            })
            setTimeout(() => {
              notActivatedVisible.value = true
            }, 900)
          }
          loading.close()
        }).catch((error) => {
          console.log('error', error)
        })
      } else {
        return false
      }
    })
  }
  // function changeProvince () { // 切换省份
  //   memberForm.city = ''
  //   memberForm.area = ''
  //   getCityList()
  // }
  // function changeCity () { // 切换城市
  //   memberForm.area = ''
  //   getAreaList()
  // }
  // function changeArea () { // 切换区域

  // }
  // function getProvinceList () { // 省份
  //   let params = {
  //     user_name: vocabularyStore.user_name,
  //     session: vocabularyStore.session
  //   }
  //   memberApi.getProvincesList(params).then((res) => {
  //     if (res.result_code === 200) {
  //       provinceData.value = res.list
  //     }
  //   }).catch((error) => {
  //     console.log(error)
  //   })
  // }
  // function getCityList () { // 城市
  //   let params = {
  //     id: memberForm.province,
  //     user_name: vocabularyStore.user_name,
  //     session: vocabularyStore.session
  //   }
  //   memberApi.getCityList(params).then((res) => {
  //     if (res.result_code === 200) {
  //       cityData.value = res.list
  //     }
  //   }).catch((error) => {
  //     console.log(error)
  //   })
  // }
  // function getAreaList () { // 区域
  //   let params = {
  //     id: memberForm.city,
  //     user_name: vocabularyStore.user_name,
  //     session: vocabularyStore.session
  //   }
  //   memberApi.getCountyList(params).then((res) => {
  //     if (res.result_code === 200) {
  //       areaData.value = res.list
  //     }
  //   }).catch((error) => {
  //     console.log(error)
  //   })
  // }
  function handleBlur () { // 学校名称/详细地址-禁止首尾空格
    memberDialogForm.user_codes = memberDialogForm.user_codes.trim()
  }
  function handleCurrentChange (page) { // 切换下一页
    pageIndex.value = page
    getSchoolListData() // 表格数据
  }
  function getSchoolListData () { // 表格数据
    let params = {
      user_name: vocabularyStore.user_name,
      session: vocabularyStore.session,
      page_index: pageIndex.value,
      page_size: pageSize.value,
      user_code: memberForm.userCode
    }
    memberApi.studentMemberList(params).then((res) => {
      if (res.result_code === 200) {
        memberList.value = res.list
        total.value = res.total
        if (res.list.length === 0 && pageIndex.value > 1) {
          pageIndex.value = pageIndex.value - 1
          getSchoolListData()
        }
      }
    }).catch((error) => {
      console.log(error)
    })
  }
  function btnSearch () { // 查询
    getSchoolListData()
  }
  function btnReset () { // 重置
    // memberForm.province = ''
    // memberForm.city = ''
    // memberForm.area = ''
    // memberForm.school = ''
    memberForm.userCode = ''
    pageIndex.value = 1
    getSchoolListData()
    // total.value = 0
    // memberList.value = []
  }
  function btnAdded () { // 新增
    memberIds.value = 0
    dialogAddMember.value = true
    const now = new Date();
    memberDialogForm.trial_start_times = format.formatDateDay(now.getTime())
  }
  function editSchool (row) { // 编辑
    dialogAddMember.value = true
    memberDialogForm.user_codes = row.user_code
    memberDialogForm.trial_start_times = row.trial_start_time
    // memberDialogForm.recharge_types = row.trial_start_time
    memberIds.value = row.id
    rechargeType.value = row.recharge_type // 充值类型: 1是会员套餐 2是体验天数
    memberTypeId.value = row.member_type === 0 ? 4 : row.member_type // 套餐
    trialDate.value = row.trial_date // 自定义天数
    if (row.recharge_type === 1) {
      trialDate.value = 30
    } else {
      memberTypeId.value = 1
    }
  }
  function delSchool (row) { // 删除
    ElMessageBox.confirm(
      // '删除后将同步下架其学校的商品，请谨慎操作',
      '是否确定删除？',
      {
        confirmButtonText: '确定',
        confirmButtonClass: 'button-confirm',
        cancelButtonText: '取消',
        // type: 'warning',
        center: true,
      }
    ).then(() => {
      let params = {
        user_name: vocabularyStore.user_name,
        session: vocabularyStore.session,
        id: row.id
      }
      memberApi.removeStudentMember(params).then((res) => {
        if (res.result_code === 200) {
          getSchoolListData() // 表格数据-区域
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
  --el-select-width: 350px;
}

#form .el-input {
  --el-input-width: 350px;
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
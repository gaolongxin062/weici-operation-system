<template>
  <div class="page">
    <div class="page-title" id="page-title">
      <h4>会员套餐配置</h4>
    </div>

    <el-form id="cityForms" :inline="true" :model="memberForm" size="large" label-width="80px">
      <div style="display: flex;align-items: center;justify-content: flex-end;">
        <div style="margin-right: 20px;">
          <el-form-item label="套餐名称">
            <el-input style="width: 120px" 
              class="search-input"
              clearable
              placeholder="请输入内容"
              v-model="memberForm.vip_name"
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

      <!-- <el-table-column  width="100" align="center" label="序号">
        <template #default="scope">
          <div class="title-resource">{{(pageIndex-1)*pageSize+(scope.$index)+1}}&nbsp;&nbsp;</div>
        </template>
      </el-table-column> -->

      <el-table-column label="套餐名称">
        <template #default="scope">
          <div class="over-hidden" :title="scope.row.vip_name">{{scope.row.vip_name}}</div>
        </template>
      </el-table-column>

      <el-table-column label="有效期">
        <template #default="scope">
          <div>{{scope.row.member_type === 4 ? '半' : scope.row.member_type}}年</div>
        </template>
      </el-table-column>

      <el-table-column label="原价">
        <template #default="scope">
          <div>￥{{scope.row.original_money}}</div>
        </template>
      </el-table-column>

      <el-table-column label="现价">
        <template #default="scope">
          <div>￥{{scope.row.now_money}}</div>
        </template>
      </el-table-column>

      <el-table-column label="IOS商品ID">
        <template #default="scope">
          <div>{{scope.row.apple_id}}</div>
        </template>
      </el-table-column>

      <el-table-column label="是否开启">
        <template #default="scope">
          <div>{{scope.row.stop_flag === 0 ? '是' : '否'}}</div>
        </template>
      </el-table-column>

      <el-table-column label="创建人">
        <template #default="scope">
          <div class="over-hidden" :title="scope.row.maker_name">{{scope.row.maker_name ? scope.row.maker_name : '-'}}</div>
        </template>
      </el-table-column>

      <!-- <el-table-column label="创建日期">
        <template #default="scope">
          <div>{{scope.row.make_date}}</div>
        </template>
      </el-table-column> -->

      <el-table-column  label="操作"  fixed="right">
        <template #default="scope">
            <el-button class="button-style" link type="primary" v-if="editPower" @click="edit(scope.row)">
              编辑
            </el-button>
            <el-button class="button-style" link type="danger" v-if="deletePower" @click="del(scope.row)">
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
        width="500"
        :show-close="false"
        :destroy-on-close="true"
        @close="closeDialogAdd"
        >
        <el-form :inline="true" ref="formref" id="form" :model="memberDialogForm" size="large" label-width="100px" :rules="rules">
             

          <el-form-item label="套餐名称" prop="vip_name" label-width="130px">
            <el-input 
              class="search-input"
              clearable
              placeholder=""
              :maxlength="50"
              @blur="handleBlur"
              v-model="memberDialogForm.vip_name"
              >
            </el-input>
          </el-form-item>

          <el-form-item label="有效期" prop="member_type" label-width="130px">
            <el-select
              v-model="memberDialogForm.member_type"
              placeholder="请选择"
            >
            <el-option
              v-for="item in memberType"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
            </el-select>
          </el-form-item>

          <el-form-item label="原价" prop="original_money" label-width="130px">
            <el-input 
              class="search-input"
              clearable
              placeholder=""
              :maxlength="50"
              @input="handleInputOriginal"
              @blur="handleBlur"
              v-model="memberDialogForm.original_money"
              >
            </el-input>￥
          </el-form-item>

          <el-form-item label="会员价" prop="now_money" label-width="130px">
            <el-input 
              class="search-input"
              clearable
              placeholder=""
              :maxlength="50"
              @input="handleInputNow"
              @blur="handleBlur"
              v-model="memberDialogForm.now_money"
              >
            </el-input>￥
          </el-form-item>

          <el-form-item label="IOS商品ID" prop="apple_id" label-width="130px">
            <el-input 
              class="search-input"
              clearable
              placeholder=""
              :maxlength="50"
              @blur="handleBlur"
              v-model="memberDialogForm.apple_id"
              >
            </el-input>
          </el-form-item>

          <el-form-item label="是否开启" prop="stop_flag" label-width="130px">
            <el-switch v-model="memberDialogForm.stop_flag" />
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
  import { ElMessage, ElMessageBox, ElLoading} from 'element-plus'
  let vocabularyStore = useVocabularyStore();
  let memberForm = reactive({
    vip_name: '' // 套餐名称
  })
  let pageIndex = ref(1)
  let pageSize = ref(10) 
  let total = ref(0)
  let dialogAddMember = ref(false)
  let loading = ref(false)
  let memberList = ref([]) // 表格数据
  let memberDialogForm = reactive({
    vip_name: '', // 套餐名称
    member_type: 1, // 会员套餐(有效期类型): 1是一年套餐(默认值1) 2是二年套餐 3是三年套餐 4是半年套餐
    original_money: '', // 原价
    now_money: '', // 会员价
    apple_id: '', // IOS商品ID
    stop_flag: false, // 是否启用: 0是启用 1是停用
  })
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
  let rules = ref({
    vip_name: [
      { required: true, message: '请输入', trigger: 'blur' }
    ],
    member_type: [
      { required: true, message: '请选择', trigger: 'change' }
    ],
    original_money: [
      { required: true, message: '请输入', trigger: 'blur' }
    ],
    now_money: [
      { required: true, message: '请输入', trigger: 'blur' }
    ],
    apple_id: [
      { required: true, message: '请输入', trigger: 'blur' }
    ]
  });
  let screenHeight = ref(0) // 表格高
  let memberIds = ref(0) // 会员套餐id
  let formref = ref()

  let addPower = ref(false) // 用户是否有增加操作权限
  let editPower = ref(false) // 用户是否有编辑操作权限
  let deletePower = ref(false) // 用户是否有删除操作权限
  onMounted(() =>{
    getUserPower() // 获取用户权限列表
    window.addEventListener('resize', updateScreenHeight);
    updateScreenHeight();
    getListData() // 表格数据
  })
  function getUserPower() {
    return basicService.getPower(
      vocabularyStore.user_name,
      vocabularyStore.session,
    )
      .then((res) => {
        // console.log(res)
        if (res.data.findIndex(item => item.menu_index == 'BuyPackage-add') !== -1) addPower.value = true
        if (res.data.findIndex(item => item.menu_index == 'BuyPackage-edit') !== -1) editPower.value = true
        if (res.data.findIndex(item => item.menu_index == 'BuyPackage-dele') !== -1) deletePower.value = true
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        loading.value = false
      })
  } // 获取用户权限
  function handleBlur () { // 禁止首尾空格
    // memberDialogForm.vip_name = memberDialogForm.vip_name.trim()
    // memberDialogForm.original_money = memberDialogForm.original_money.trim()
    // memberDialogForm.now_money = memberDialogForm.now_money.trim()
    // memberDialogForm.apple_id = memberDialogForm.apple_id.trim()
  }
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
  function closeDialogAdd () { // 取消新增
    dialogAddMember.value = false
    formref.value.resetFields()
    memberDialogForm.vip_name = ''
    memberDialogForm.member_type = 1
    memberDialogForm.original_money = ''
    memberDialogForm.now_money = ''
    memberDialogForm.apple_id = ''
    memberDialogForm.stop_flag = false
  }
  function handleInputOriginal (value) {
    // 只允许输入数字
    const filteredValue = value.replace(/[^0-9,]/g, "")
    memberDialogForm.original_money = filteredValue
  }
  function handleInputNow (value) {
    // 只允许输入数字
    const filteredValue = value.replace(/[^0-9,]/g, "")
    memberDialogForm.now_money = filteredValue
  }
  function makeSureBtn () { // 确定新增/编辑
    formref.value.validate((valid) => {
      if (valid) {
        const loading = ElLoading.service({
          lock: true,
          text: 'Loading',
          background: 'rgba(0, 0, 0, 0.7)',
        })
        let params = {
          apple_id: memberDialogForm.apple_id,
          user_name: vocabularyStore.user_name,
          session: vocabularyStore.session,
          member_type: memberDialogForm.member_type,
          now_money: memberDialogForm.now_money,
          original_money: memberDialogForm.original_money,
          stop_flag: memberDialogForm.stop_flag === true ? 0 : 1, // 是否启用: 0是启用 1是停用
          vip_name: memberDialogForm.vip_name,
          id: memberIds.value
        }
        // console.log(formDialog)
        memberApi.savePackage(params).then((res) => {
          if (res.result_code === 200) {
            ElMessage({
              message: `${memberIds.value ? '编辑成功' : '新增成功'}`,
              type: 'success',
              duration: 3000
            })
            pageIndex.value = 1
            getListData()
            closeDialogAdd()
          } else {
            ElMessage({
              message: res.description,
              type: 'info',
              duration: 3000
            })
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
  function handleCurrentChange (page) { // 切换下一页
    pageIndex.value = page
    getListData() // 表格数据
  }
  function getListData () { // 表格数据
    let params = {
      user_name: vocabularyStore.user_name,
      session: vocabularyStore.session,
      page_index: pageIndex.value,
      page_size: pageSize.value,
      vip_name: memberForm.vip_name
    }
    memberApi.packageList(params).then((res) => {
      if (res.result_code === 200) {
        memberList.value = res.list
        total.value = res.total
        if (res.list.length === 0 && pageIndex.value > 1) {
          pageIndex.value = pageIndex.value - 1
          getListData()
        }
      }
    }).catch((error) => {
      console.log(error)
    })
  }
  function btnSearch () { // 查询
    getListData()
  }
  function btnReset () { // 重置
    memberForm.vip_name = ''
    pageIndex.value = 1
    getListData()
    // total.value = 0
    // memberList.value = []
  }
  function btnAdded () { // 新增
    memberIds.value = 0
    dialogAddMember.value = true
  }
  function edit (row) { // 编辑
    dialogAddMember.value = true
    memberDialogForm.vip_name = row.vip_name
    memberDialogForm.member_type = row.member_type
    memberDialogForm.original_money = row.original_money
    memberDialogForm.now_money = row.now_money
    memberDialogForm.apple_id = row.apple_id
    memberDialogForm.stop_flag = row.stop_flag === 0 ? true : false
    memberIds.value = row.id
  }
  function del (row) { // 删除
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
      memberApi.removePackage(params).then((res) => {
        if (res.result_code === 200) {
          getListData() // 表格数据-区域
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
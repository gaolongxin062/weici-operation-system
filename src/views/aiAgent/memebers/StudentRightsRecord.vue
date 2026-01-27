<template>
  <div class="page define-page" :class="isMobileDevice ? 'mobile-page' : 'computer-page'">
    <div class="page-title" id="page-title">
      <h4>作文批改学生权益记录</h4>
    </div>
    <div class="content-box">
      <el-form :inline="true" id="forms" :model="formData" size="large" label-width="90px" @submit.prevent>
        <el-form-item label="经销商：" label-width="130px">
          <el-select
            style="width: 180px;"
            placeholder="请选择"
            clearable
            v-model="formData.distributor"
            @change="changeDistributor"
          >
            <el-option v-for="item in distributorsList" :key="item.distributor_id" :label="item.distributor_name" :value="item.distributor_id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学校：" label-width="130px">
            <el-select
              style="width: 180px;"
              placeholder="请选择"
              clearable
              v-model="formData.school"
              @change="changeSchool"
            >
              <el-option v-for="item in schoolList" :key="item.school_id" :label="item.school_name" :value="item.school_id"></el-option>
            </el-select>
        </el-form-item>
         <el-form-item label="班级：" label-width="130px">
            <el-select
              style="width: 180px;"
              placeholder="请选择"
              clearable
              v-model="formData.classroom"
            >
              <el-option v-for="item in classList" :key="item.class_id" :label="item.class_name" :value="item.class_id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="学生姓名：" label-width="130px">
          <el-input class="search-input" clearable placeholder="请输入学生姓名" v-model="formData.student_name"></el-input>
        </el-form-item>
        <div style="margin: 10px 20px;">
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button type="primary" @click="onReset">重置</el-button>
        </div>
      </el-form>
    </div>
    <el-table :data="list" v-loading="loading" header-cell-class-name="header_row_class" style="width: 100%" stripe element-loading-text="拼命加载中，主人请稍后..." :max-height="screenHeight" ref="tableRef" >
        <el-table-column width="80" align="center" label="序号">
          <template #default="scope">
            <div>{{ showIndex(scope.$index) }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="student_name" label="学生姓名" min-width="200px" />
        <el-table-column prop="class_name" label="班级" min-width="150px"/>
        <el-table-column prop="school_name" label="学校" min-width="200px" />
        <el-table-column prop="distributor_name" label="经销商" min-width="200px" />
        <el-table-column label="购买类型"  min-width="130px" >
          <template #default="scope">
            <div>{{ scope.row.pay_type === 1 ? '统一购买' : '自愿购买' }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="use_number" label="作文批改次数"  min-width="120px"  />
        <el-table-column prop="remaining_count" label="剩余次数"  min-width="120px" />
        <el-table-column prop="start_time" label="权益开始时间" min-width="140" />
        <el-table-column prop="end_time" label="权益结束时间" min-width="140" />
        <el-table-column label="操作" fixed="right"  min-width="160px">
          <template #default="scope">
            <el-button class="button-style" link type="primary" @click="check(scope.row)">
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination style="color: #666666;margin: 20px 0 0 20px;" v-show="total > 0"
        @current-change="handleCurrentChange" :current-page="pageIndex" :page-size="pageSize"
        layout="total, prev, pager, next" prev-text="上一页" next-text="下一页" :total="total">
      </el-pagination>
  </div>
  <el-dialog v-model="checkVisible" title="查看" width="600" :close-on-click-modal="false" append-to-body :destroy-on-close="true">
    <div style="padding-left: 40px;">
      <div class="marginBottom">
        <span style="font-weight: bold;">学生姓名：</span>
        {{ currentRowMsg.student_name }}
      </div>
      <div class="marginBottom">
        <span style="font-weight: bold;">班级：</span>
        {{ currentRowMsg.class_name }}
      </div>
      <div class="marginBottom">
        <span style="font-weight: bold;">学校：</span>
        {{ currentRowMsg.school_name }}
      </div>
      <div class="marginBottom">
        <span style="font-weight: bold;">经销商：</span>
        {{ currentRowMsg.distributor_name }}
      </div>
      <div class="marginBottom">
        <span style="font-weight: bold;">购买类型：</span>
        {{ currentRowMsg.pay_type === 1 ? '统一购买' : '自愿购买' }}
      </div>
      <div class="marginBottom">
        <span style="font-weight: bold;">作文批改次数：</span>
        {{ currentRowMsg.use_number }}
      </div>
      <div class="marginBottom">
        <span style="font-weight: bold;">剩余次数：</span>
        {{ currentRowMsg.remaining_count }}
      </div>
      <div class="marginBottom">
        <span style="font-weight: bold;"> 权益开始时间：</span>
        {{ currentRowMsg.start_time }}
      </div>
      <div class="marginBottom">
        <span style="font-weight: bold;"> 权益结束时间：</span>
        {{ currentRowMsg.end_time }}
      </div>
    </div>
  </el-dialog>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useVocabularyStore } from '@/store/vocabulary';
import { useScreenHeight } from '@/hooks/useScreenHeight.js';
import AiAgentMemebers from '@/service/AiAgentMemebers.js';
const vocabularyStore = useVocabularyStore();
const { screenHeight, isMobileDevice} = useScreenHeight();
import { ElMessage } from 'element-plus'


let formData = reactive({
  distributor: '', // 经销商
  school: '', // 学校
  classroom: '', // 班级
  student_name: '', // 学生姓名
}) // 表单内容
let tableRef = ref(null)
let list = ref([]) // 表格数据
let loading = ref(false) // 加载标记
let total = ref(0)
let pageIndex = ref(1)
let pageSize = ref(10)
let checkVisible = ref(false)
let distributorsList = ref([]) // 经销商列表
let schoolList = ref([]) // 学校列表
let classList = ref([]) // 班级列表
let currentRowMsg = reactive(null)

onMounted(() => {
  // 设置页面展示高度
  // window.addEventListener('resize', updateScreenHeight)
  // updateScreenHeight()
  // 经销商数据
  initMemberList()
  // 列表数据
  getList()
})

// 动态设置表格高度
// const updateScreenHeight = () => {
//   var element = document.getElementById('form');
//   if (element) {
//     var rect = element.getBoundingClientRect();
//     var formHeight = rect.height // form表单的高
//   }
    
//    var pageHeight = 80 // 分页高度
//    var menuHeight = 64 // 导航栏高度
//    screenHeight.value = window.innerHeight - formHeight - pageHeight - menuHeight - 100
// }

// 查询
const onSubmit = () => {
  getList()
} 

// 重置
const onReset = () => {
  schoolList.value = []
  classList.value = []
  formData.distributor = ''
  formData.classroom = '', 
  formData.distributo = '', 
  formData.school = ''
  formData.student_name = ''
  pageIndex.value = 1
  pageSize.value = 10
  getList()
} 

// 获取表格数据
const getList = () => {
 loading.value = true
  let params = {
    user_name: vocabularyStore.user_name,
    session: vocabularyStore.session,
    class_id: formData.classroom, 
    distributor_id: formData.distributor, 
    school_id: formData.school, 
    student_name: formData.student_name, 
    page_index: pageIndex.value, // 当前页
    page_size: pageSize.value, // 分页大小
  }
  return AiAgentMemebers.getStudentPayList(params)
    .then((res) => {
      if (res.result_code === 200) {
        list.value = res.data
        total.value = res.total
      } else {
        ElMessage({
          message: '获取产品配置数据失败',
          type: 'error',
          duration: 3000
        })
      }
    })
    .catch((error) => {
      console.log(error)
    })
    .finally(() => {
      loading.value = false
    })

} 

// 获取经销商数据
const initMemberList = () => {
  let params = {
    user_name: vocabularyStore.user_name,
    session: vocabularyStore.session,
    distributor_name: formData.distributor
  }
  distributorsList.value = []
  return AiAgentMemebers.getDistributors(params)
    .then((res) => {
      if (res.result_code === 200) {
        distributorsList.value = res.data
      } else {
        ElMessage({
          message: '获取经销商数据失败',
          type: 'error',
          duration: 3000
        })
      }
    })
    .catch((error) => {
      console.log(error)
    })
    .finally(() => {
      loading.value = false
    })
}

// 经销商下拉框事件
const changeDistributor = () => {
  if (formData.distributor) {
    getSchool()
  } else {
    formData.school = ''
    schoolList.value = []
    formData.classroom = ''
    classList.value = []
  }
}

// 学校下拉框事件
const changeSchool = () => {
  if (formData.school) {
    getSchoolClass()
  } else {
    formData.classroom = ''
    classList.value = []
  }
}

// 获取学校
const getSchool = () => {
  let params = {
    user_name: vocabularyStore.user_name,
    session: vocabularyStore.session,
    distributor_id: formData.distributor
  }
  formData.school = ''
  schoolList.value = []
  return AiAgentMemebers.getSchool(params)
    .then((res) => {
      if (res.result_code === 200) {
        schoolList.value = res.data
      } else {
        ElMessage({
          message: '获取学校数据失败',
          type: 'error',
          duration: 3000
        })
      }
    })
    .catch((error) => {
      console.log(error)
    })
    .finally(() => {
      loading.value = false
    })
}

// 获取学校下的班级
const getSchoolClass = () => {
  let params = {
    user_name: vocabularyStore.user_name,
    session: vocabularyStore.session,
    distributor_id: formData.distributor,
    school_id: formData.school
  }
  formData.classroom = ''
  classList.value = []
  return AiAgentMemebers.getSchoolClass(params)
    .then((res) => {
      if (res.result_code === 200) {
        classList.value = res.data
      } else {
        ElMessage({
          message: '获取班级数据失败',
          type: 'error',
          duration: 3000
        })
      }
    })
    .catch((error) => {
      console.log(error)
    })
    .finally(() => {
      loading.value = false
    })
}

// 序号
const showIndex = (index) => {
  return index + 1 + (pageIndex.value - 1) * pageSize.value
} 

// 点击分页
const handleCurrentChange = async (page) => { // 切换下一页
  pageIndex.value = page
  await getList()
} 

const check = (row) => {
  checkVisible.value = true
  currentRowMsg = row
}
</script>
<style scoped>
.content-box {
  padding: 20px;
  box-sizing: border-box;
}
#form .el-select {
  --el-select-width: 150px;
}

.no-success-list {
  max-height: 50vh;
  overflow: auto;
}
.marginBottom {
  margin-bottom: 20px;
}
</style>

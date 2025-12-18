<template>
  <div class="page define-page">
    <div class="page-title" id="page-title">
      <h4>作文批改学生权限开通</h4>
    </div>
    <div class="content-box">
      <el-form :inline="true" id="form" :model="formData" size="large" label-width="90px" @submit.prevent>
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
            >
              <el-option v-for="item in schoolList" :key="item.school_id" :label="item.school_name" :value="item.school_id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="创建人：" label-width="130px">
          <el-input class="search-input" clearable placeholder="请输入姓名" v-model="formData.user"></el-input>
        </el-form-item>
        <el-form-item label="创建时间：" label-width="130px">
           <el-date-picker
              v-model="formData.date"
              type="daterange"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
        </el-form-item>
      </el-form>
      <div style="margin: 10px 20px;">
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button type="primary" @click="onReset">重置</el-button>
        <el-button type="success" @click="newlyAdded">新增</el-button>
      </div>
      <el-table :data="list" class="table-info" v-loading="loading" header-cell-class-name="header_row_class" style="width: 100%" stripe element-loading-text="拼命加载中，主人请稍后..." :max-height="screenHeight" ref="tableRef" >
        <el-table-column width="80" align="center" label="序号">
          <template #default="scope">
            <div>{{ showIndex(scope.$index) }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="distributor_name" label="经销商" min-width="120px" />
        <el-table-column prop="pay_number" label="收款人数" min-width="100px" />
        <el-table-column prop="pay_money" label="收款金额" min-width="100px" />
        <el-table-column prop="school_name" label="学校" min-width />
        <el-table-column prop="count" label="次数"  min-width="130px" />
        <el-table-column prop="start_time" label="开始时间"  min-width="140px"  />
        <el-table-column prop="end_time" label="结束时间"  min-width="140px" />
        <el-table-column prop="maker_name" label="创建人" min-width="120" />
        <el-table-column prop="make_date" label="创建时间"  min-width="140px" />
        <el-table-column label="操作" fixed="right"  min-width="160px">
          <template #default="scope">
            <el-button class="button-style" link type="primary" @click="check(scope.row)">
              查看
            </el-button>
            <el-button class="button-style" link type="primary" @click="voided(scope.row)">
              作废
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination style="color: #666666;margin: 20px 0 0 20px;" v-show="total > 0"
      @current-change="handleCurrentChange" :current-page="pageIndex" :page-size="pageSize"
      layout="total, prev, pager, next" prev-text="上一页" next-text="下一页" :total="total">
    </el-pagination>
    </div>
  </div>
  <el-dialog top="5vh" v-model="dialogVisible" title="新增" width="800" :close-on-click-modal="false" append-to-body :destroy-on-close="true" @close="close">
    <div style="padding-left: 30px;max-height: 650px;overflow-y: auto;padding-right: 15px;">
      <el-form ref="formRef" id="form" :model="dislogFormData" size="large" label-width="150px" :rules="rules">
        <el-form-item label="经销商:" label-width="130px" prop="distributor">
          <el-select style="width: 200px;" v-model="dislogFormData.distributor" clearable filterable placeholder="请输入经销商姓名" :filter-method="filterMethod" @change="changeDialogDistributor">
            <el-option v-for="item in distributorsList" :key="item.distributor_id" :label="item.distributor_name" :value="item.distributor_id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择学校：" label-width="130px" prop="school">
          <el-select  style="width: 180px;margin-right: 10px;" clearable  v-model="dislogFormData.province" placeholder="请选择省份" @change="changeDialogProvince">
            <el-option v-for="item in provinceList" :key="item.province_id" :label="item.province" :value="item.province_id"></el-option>
          </el-select>
          <el-select  style="width: 180px;margin-right: 10px;" clearable  v-model="dislogFormData.city" placeholder="请选择市" @change="changeDialogCity">
            <el-option v-for="item in cityList" :key="item.city_id" :label="item.city" :value="item.city_id"></el-option>
          </el-select>
          <el-select  style="width: 180px;margin-right: 10px;" clearable  v-model="dislogFormData.district" placeholder="请选择区县" @change="changeDialogCounty">
            <el-option v-for="item in countyList" :key="item.county_id" :label="item.county" :value="item.county_id"></el-option>
          </el-select>
          <el-select  style="width: 180px;margin-top: 10px;" clearable  v-model="dislogFormData.school" placeholder="请选择学校" @change="changeDialogSchool">
            <el-option v-for="item in schoolList" :key="item.school_id" :label="item.school_name" :value="item.school_id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择老师：" label-width="130px" prop="teacher">
          <el-select style="width: 300px;" v-model="dislogFormData.teacher" multiple placeholder="请选择老师" v-if="teacherList.length > 0" @change="changeTeacher">
            <el-option
              v-for="item in teacherList"
              :key="item.teacher_id"
              :label="item.name"
              :value="item.teacher_id">
            </el-option>
          </el-select>
          <span v-else>暂无老师</span>
        </el-form-item>
        <el-form-item label="选择班级：" label-width="130px">
          <div v-if="dislogFormData.teacher.length > 0">
            <div style="color: red;">共选择{{totalStudent}}个学生</div>
            <div v-for="(item, index) in classList" :key="index">
              <span>{{item.name}}：</span>
              <span style="color: red;">共选择{{item.totalStudents}}个学生</span><br>
              <div v-if="item.list.length > 0"  @click.stop>
                <div v-for="iItem in item.list" :key="iItem.class_id" style="display: inline-block;border:1px solid #ccc;padding: 5px;margin-bottom: 10px;border-radius: 10px;margin-right: 10px;">
                  <el-checkbox v-model="iItem.isChecked" :value="iItem.class_id" name="type" :disabled="iItem.student_nums === 0 ? true: false" @change="classChange">
                    {{iItem.class_name}}
                  </el-checkbox> 
                <span :style="{ display: 'inline-block', marginLeft: '15px', color: iItem.student_nums !== 0 ? '#0271E3' : '#999', cursor: iItem.student_nums !== 0 ? 'pointer' : 'not-allowed' }" @click.stop="iItem.student_nums !== 0 ? checkStudent(iItem, item.name) : null">筛选学生</span>
                </div>
              </div>
              <span v-else>暂无班级</span>
            </div>
          </div>
          <span v-else>暂无班级</span>
        </el-form-item>
        <el-form-item label="次数：" label-width="130px" prop="num">
          <el-input-number v-model="dislogFormData.num"></el-input-number>
          <span style="margin-left: 10px;">次/人</span>
        </el-form-item>
        <el-form-item :label="item.type_name + '：'" label-width="130px" v-for="(item, index) in info" :key="index">
          <span>{{ item.config_value }}</span>
        </el-form-item>
        <el-form-item  label="开始时间：" label-width="130px" prop="startTime" >
          <el-date-picker
            type="date"
            v-model="dislogFormData.startTime"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间：" label-width="130px" prop="endTime" >
          <el-date-picker
            type="date"
            v-model="dislogFormData.endTime"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="收款金额：" label-width="130px">
          <el-input-number v-model="dislogFormData.amount" :precision='2' :min="0"></el-input-number>
          <span style="margin-left: 10px;">次/人</span>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save" :loading="saveLoading">保存</el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog v-model="studentVisible" title="筛选学生" width="600" :show-close="false" :close-on-click-modal="false" append-to-body :destroy-on-close="true">
    <div>{{ currentClass.name }}:</div>
     <el-table
        center
        max-height="250"
        ref="studentTableRef"
        :data="studentList"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="学生姓名"
          prop="student_name">
        </el-table-column>
      </el-table>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="classSave">保存</el-button>
        </div>
      </template>
  </el-dialog>
  <el-dialog v-model="checkVisible" title="查看" width="600" :close-on-click-modal="false" append-to-body :destroy-on-close="true" top="5vh">
    <div style="padding-left: 40px;max-height: 650px;overflow-y: auto;padding-right: 15px;">
      <div class="marginBottom">
        <span style="font-weight: bold;">经销商：</span>
        {{ studentDetails.distributor_name }}
      </div>
      <div class="marginBottom">
        <span style="font-weight: bold;">选择学校：</span>
        {{ studentDetails.school_name }}
      </div>
      <div class="marginBottom">
        <span style="font-weight: bold;">选择老师：</span>
        {{ studentDetails.teacher_info }}
      </div>
      <div class="marginBottom" style="max-width: 400px;overflow-y: auto;">
        <span style="font-weight: bold;">选择班级：</span>
        <span style="color: red;display: inline-block;margin-left: 10px;margin-bottom: 10px;">共选择{{studentDetails.pay_number}}个学生</span>
        <div class="teacher" v-for="(item, index) in studentDetails.class_info" :key="index">
          <span>{{item.teacherName}}：</span>
          <span style="color: red;display: inline-block;margin-left: 10px;">共选择{{item.student_nums ? item.student_nums : 0}}个学生</span>
          <div style="margin-top: 10px;margin-bottom: 10px;" v-for="(otem, ondex) in item.student_list" :key="ondex">{{otem.class_name}}：{{ otem.student_info}}</div>
        </div>
      </div>
      <div class="marginBottom">
        <span style="font-weight: bold;">次数：</span>
        {{ studentDetails.count }}次/人
      </div>
      <div style="display: flex;justify-content: space-between;flex-wrap:wrap">
        <div class="marginBottom" v-for="(item, index) in info" :key="index">
          <span style="font-weight: bold;">{{ item.type_name + '：' }}</span>
          <span>{{ item.config_value }}</span>
        </div>
      </div>
      <div style="display: flex;justify-content: space-between;">
        <div class="marginBottom">
          <span style="font-weight: bold;">开始时间：</span>
          {{ studentDetails.start_time }}
        </div>
        <div class="marginBottom">
          <span style="font-weight: bold;">结束时间：</span>
          {{ studentDetails.end_time }}
        </div>
        <div class="marginBottom">
          <span style="font-weight: bold;">收款金额：</span>
          {{ studentDetails.pay_money }}元
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useScreenHeight } from '@/hooks/useScreenHeight.js';
import AiAgentMemebers from '@/service/AiAgentMemebers.js';
import { useVocabularyStore } from '@/store/vocabulary';
import AiAgentService from '@/service/AiAgentService';
const { screenHeight } = useScreenHeight();
const vocabularyStore = useVocabularyStore();
import { ElMessage, ElMessageBox } from 'element-plus'


let formData = reactive({
  distributor: '', // 经销商
  school: '', // 学校
  user: '', // 创建人
  date: '' // 创建时间
}) // 表单内容
let distributorsList = ref([]) // 经销商列表
let distributorName = ref('') // 新增弹窗经销商输入的值
let schoolList = ref([]) // 学校列表
let provinceList = ref([]) // 新增弹窗省列表数据
let cityList = ref([]) // 新增弹窗市列表数据
let countyList = ref([]) // 新增弹窗区县列表
let teacherList = ref([]) // 新增弹窗教师列表
let classList = ref([]) // 新增弹窗教师下班级列表
let studentList = ref([]) // 当前学生列表
let currentClass = reactive(null)
let tableRef = ref(null)
let list = ref([]) // 表格数据
let loading = ref(false) // 加载标记
let total = ref(0)
let pageIndex = ref(1)
let pageSize = ref(10)
let dialogVisible = ref(false) // 弹窗显隐
let formRef = ref(null)
let dislogFormData = reactive({
  distributor: '', // 经销商
  province: '' , // 省
  city: '', // 市
  district: '', // 区县
  school: '', // 学校
  teacher: [], // 老师
  num: 0, //次数
  amount: 0, //金额
  startTime: '', // 开始时间
  endTime: '' // 结束
}) // 弹窗表单
let rules = ref({
  distributor: [
    { required: true, message: '请选择经销商', trigger: 'change' }
  ],
  school: [
    { required: true, message: '请选择学校', trigger: 'change', }
  ],
  teacher: [
    { type: 'array', required: true, message: '请选择老师', trigger: 'change'}
  ],
  num: [
    { required: true, message: '请输入次数', trigger: 'blur' },
  ],
  startTime: [
    { required: true, message: '请选择开始时间', trigger: 'change' },
    {
      validator: (rule, value, callback) => {
        if (maxEndTime.value && value && value < maxEndTime.value) {
          callback(new Error('开始时间不能小于最大结束时间'));
        } else {
          callback();
        }
      },
      trigger: 'change'
    }
  ],
  endTime: [
    { required: true, message: '请选择结束时间', trigger: 'change' },
    {
      validator: (rule, value, callback) => {
        if (value && dislogFormData.startTime && value <= dislogFormData.startTime) {
          callback(new Error('结束时间必须大于开始时间'));
        } else if (value && maxEndTime.value && value <= maxEndTime.value) {
          callback(new Error('结束时间必须大于最大结束时间'));
        } else {
          callback();
        }
      },
      trigger: 'change'
    }
  ]
});
let studentVisible = ref(false) // 筛选学生弹窗
let studentTableRef = ref(null)
let checkVisible = ref(false) // 查看弹窗显隐
let totalStudent = ref(0) // 新增班级总人数
let maxEndTime = ref('') // 限制日期
let studentDetails = reactive(null)// 学生详情
let saveLoading = ref(false) // 保存按钮加载状态
let info = ref([])
onMounted(() => {
  // 设置页面展示高度
  window.addEventListener('resize', updateScreenHeight)
  updateScreenHeight()
  // 经销商数据
  initMemberList()
  // 列表数据
  getList()
  // 获取使用次数
  getUseInfo()
})

// 动态设置表格高度
const updateScreenHeight = () => {
  var element = document.getElementById('form');
  if (element) {
    var rect = element.getBoundingClientRect();
    var formHeight = rect.height // form表单的高
  }
    
   var pageHeight = 80 // 分页高度
   var menuHeight = 64 // 导航栏高度
   screenHeight.value = window.innerHeight - formHeight - pageHeight - menuHeight - 100
}

// 序号
const showIndex = (index) => {
  return index + 1 + (pageIndex.value - 1) * pageSize.value
}

// 查询
const onSubmit = () => {
  getList()
}

// 重置
const onReset = () => {
  formData.distributor = ''
  formData.school = ''
  formData.user = ''
  formData.date = []
  pageIndex.value = 1
  pageSize.value = 10
  schoolList.value = []
  getList()
}

// 新增
const newlyAdded = () => {
  dialogVisible.value = true
}

function getUseInfo () {
    let params = {
      user_name: vocabularyStore.user_name,
      session: vocabularyStore.session,
      type: 2
    }
    return AiAgentService.getUse(params)
      .then((res) => {
        if (res.result_code === 200) {
          info.value = res.data
        }
    }).catch((error) => {
      console.log(error)
    })
  } // 获取默认次数数据

// 获取经销商数据
const initMemberList = () => {
  let params = {
    user_name: vocabularyStore.user_name,
    session: vocabularyStore.session,
    distributor_name: distributorName.value
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

// 获取学校数据
const getSchool = () => {
  let params = {
    user_name: vocabularyStore.user_name,
    session: vocabularyStore.session,
    distributor_id: dialogVisible.value ? dislogFormData.distributor : formData.distributor,
    province_ids: dislogFormData.province,
    city_ids: dislogFormData.city,
    county_ids: dislogFormData.district
  }
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

// 获取省数据
const getProvinceList = () => {
  let params = {
    user_name: vocabularyStore.user_name,
    session: vocabularyStore.session,
    distributor_id: dislogFormData.distributor
  }
  provinceList.value = []
  return AiAgentMemebers.getProvinceList(params)
    .then((res) => {
      if (res.result_code === 200) {
        provinceList.value = res.list
      } else {
        ElMessage({
          message: '获取省数据失败',
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

// 获取市数据
const getCityList = () => {
  let params = {
    user_name: vocabularyStore.user_name,
    session: vocabularyStore.session,
    distributor_id: dislogFormData.distributor
  }
  cityList.value = []
  return AiAgentMemebers.getCityList(params)
    .then((res) => {
      if (res.result_code === 200) {
        cityList.value = res.list
      } else {
        ElMessage({
          message: '获取市数据失败',
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

// 获取区县
const getCountyList = () => {
  let params = {
    user_name: vocabularyStore.user_name,
    session: vocabularyStore.session,
    distributor_id: dislogFormData.distributor
  }
  countyList.value = []
  return AiAgentMemebers.getCountyList(params)
    .then((res) => {
      if (res.result_code === 200) {
        countyList.value = res.list
      } else {
        ElMessage({
          message: '获取区县数据失败',
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

// 获取教师数据
const getTeacher = () => {
  let params = {
    user_name: vocabularyStore.user_name,
    session: vocabularyStore.session,
    distributor_id: dislogFormData.distributor, // 经销商id
    province_id: dislogFormData.province, // 省id
    city_id: dislogFormData.city, // 市id
    county_id: dislogFormData.district, // 区县id
    ids: dislogFormData.school// 学校id，多个用英文逗号分隔
  }
  teacherList.value = []
  return AiAgentMemebers.getTeacher(params)
    .then((res) => {
      if (res.result_code === 200) {
        teacherList.value = res.data
      } else {
        ElMessage({
          message: '获取教师数据失败',
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

// 获取教师下班级数据
const getTeacherClass = () => {
  let params = {
    user_name: vocabularyStore.user_name,
    session: vocabularyStore.session,
    ids: dislogFormData.teacher.join(',') // 教师id，多个用英文逗号分隔
  }
  return AiAgentMemebers.getTeacherClass(params)
    .then((res) => {
      if (res.result_code === 200) {
        const allList = res.data.map(item => ({
          ...item,
          studentList: [], // 初始化学生列表
          isChecked: item.student_nums !== 0, // 是否选中班级 默认值fasle
        }));
        
        // 保留已存在的老师数据，只更新新老师的数据
        const existingTeachers = classList.value.filter(item => 
          dislogFormData.teacher.includes(item.id)
        );
        
        const newTeachers = dislogFormData.teacher
          .filter(teacherId => !existingTeachers.some(t => t.id === teacherId))
          .map(teacherId => {
            const teacher = teacherList.value.find(t => t.teacher_id === teacherId);
            return {
              id: teacherId,
              teacherCode: teacher ? teacher.teacher_code : '',
              name: teacher ? teacher.name : '',
              list: allList.filter(item => item.teacher_id === teacherId)
            };
          });
        
        // 合并现有老师和新老师的数据
        classList.value = [...existingTeachers, ...newTeachers];
        calculation()
        console.log('1', classList.value)
      } else {
        ElMessage({
          message: '获取教师下班级数据失败',
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

// 获取班级下学生列表
const getClassStudent = (id) => {
  let params = {
    user_name: vocabularyStore.user_name,
    session: vocabularyStore.session,
    class_id: id
  }
  studentList.value = []
  return AiAgentMemebers.getClassStudent(params)
    .then((res) => {
      if (res.result_code === 200) {
        studentList.value = res.data
        // 自动勾选已存在的学生数据
        nextTick(() => {
          if (currentClass && currentClass.studentList && studentList.value) {
            // 如果班级已选中，则全选所有学生
            if (currentClass.isChecked) {
              setTimeout(() => {
                if (studentTableRef.value) {
                  studentList.value.forEach(student => {
                    studentTableRef.value.toggleRowSelection(student, true)
                  })
                }
              }, 0)
            } else {
              // 创建已选学生ID的Set以提高查找效率
              const selectedStudentIds = new Set(
                currentClass.studentList.map(s => s.student_id)
              )
              
              // 批量处理选中状态
              const rowsToSelect = studentList.value.filter(student => 
                selectedStudentIds.has(student.student_id)
              )
              
              // 使用setTimeout确保DOM完全更新后再执行选中操作
              setTimeout(() => {
                if (studentTableRef.value && rowsToSelect.length > 0) {
                  // 批量设置选中状态
                  rowsToSelect.forEach(student => {
                    studentTableRef.value.toggleRowSelection(student, true)
                  })
                }
              }, 0)
            }
          }
        })
      } else {
        ElMessage({
          message: '获取班级下学生数据失败',
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
    schoolList.value = []
  }
} 

// 新增弹窗经销商选择框输入的值
const filterMethod = (value) => {
  distributorName.value = value
  initMemberList()
}

// 新增弹窗经销商change事件
const changeDialogDistributor = () => {
  if (dislogFormData.distributor) {
    dislogFormData.province = ''
    // 查询省
    getProvinceList()
    teacherList.value = [] // 教师
    dislogFormData.teacher = [] // 已选教师数据
  } else {
    provinceList.value = [] // 省
    cityList.value = [] // 市
    countyList.value = [] // 区县
    schoolList.value = [] // 学校
    teacherList.value = [] // 教师
    dislogFormData.teacher = [] // 已选教师数据
  }
 
  // 清空
  dislogFormData.province = '' // 省
  dislogFormData.city = '' // 市
  dislogFormData.district = '' // 区县
  dislogFormData.school = '' // 学校
}

// 新增弹窗省change事件
const changeDialogProvince = () => {
  if (dislogFormData.province) {
    dislogFormData.city = ''
    // 查询市
    getCityList()
  } else {
    // 清空市
    dislogFormData.city = ''
    cityList.value = []
    // 区县
    countyList.value = []
    dislogFormData.district = ''
    // 学校
    dislogFormData.school = ''
    // 学校列表
    schoolList.value = []
    // 教师
    teacherList.value = [] 
    // 已选教师数据
    dislogFormData.teacher = [] 
  }
}

// 新增弹窗市change事件
const changeDialogCity = () => {
  if (dislogFormData.city) {
    // 查询市区
    getCountyList()
  } else {
    // 教师
    teacherList.value = [] 
    // 已选教师数据
    dislogFormData.teacher = [] 
  }
  dislogFormData.district = ''
  dislogFormData.school = ''
  schoolList.value = []
  countyList.value = []
}

// 新增区县change事件
const changeDialogCounty = () => {
  if (dislogFormData.district) {
    dislogFormData.school = ''
    // 查询学校
    getSchool()
  } else {
    dislogFormData.school = ''
    schoolList.value = []
    // 教师
    teacherList.value = [] 
    // 已选教师数据
    dislogFormData.teacher = [] 
  }

}

// 新增学校change事件
const changeDialogSchool = () => {
  if (dislogFormData.school) {
    const matchedSchool = schoolList.value.find(item => item?.school_id === dislogFormData.school);
    maxEndTime.value = matchedSchool ? matchedSchool.max_end_time : '';
    // 获取教师
    getTeacher()
  } else {
    teacherList.value = []
    // 教师
    teacherList.value = [] 
    // 已选教师数据
    dislogFormData.teacher = [] 
  }
  
}

// 新增老师change事件
const changeTeacher = () => {
  if (dislogFormData.teacher.length > 0) {
    getTeacherClass()
  } else {
    // 教师
    classList.value = []
  }
}

// 新增弹窗关闭事件
const close = () => {
  dialogVisible.value = false
  // 弹窗关闭清空新增弹窗里面经销商输入的值
  distributorName.value = ''
  // 经销商
  initMemberList()
  // 学校
  if (formData.distributor) {
    getSchool()
  } else {
    schoolList.value = []
  }
  // 清空弹窗表单值
  dislogFormData.distributor = ''
  dislogFormData.province = ''
  dislogFormData.city = ''
  dislogFormData.district = ''
  dislogFormData.school = ''
  dislogFormData.teacher = []
  dislogFormData.num = 0
  dislogFormData.amount = 0
  dislogFormData.startTime = ''
  dislogFormData.endTime = ''
}

// 获取表格数据
const getList = () => {
  loading.value = true
  let params = {
    user_name: vocabularyStore.user_name,
    session: vocabularyStore.session,
    distributor_id: formData.distributor, // 经销商id
    end_time: formData.date.length > 0 ? formData.date[1] : '', // 创建结束时间
    maker: formData.user, // 创建人姓名
    page_index: pageIndex.value, // 当前页
    page_size: pageSize.value, // 分页大小
    school_id: formData.school, // 学校id
    start_time: formData.date.length > 0 ? formData.date[0] : '', // 创建开始日期
  }
  return AiAgentMemebers.getUnifyPaylist(params)
    .then((res) => {
      if (res.result_code === 200) {
        list.value = res.data
        total.value = res.total
      } else {
        ElMessage({
          message: '获取学生权益列表失败',
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

// 点击分页
const handleCurrentChange = async (page) => {
  pageIndex.value = page
  await getList()
}

// 新增弹窗保存
const save = async () => {
  if (!formRef.value || saveLoading.value) return
  try {
    saveLoading.value = true
    const valid = await formRef.value.validate()
    if (valid) {
      if (totalStudent.value === 0) {
          ElMessage({
            message: '请至少选择1个学生',
            type: 'error',
            duration: 3000
          })
          saveLoading.value = false
        } else {
          // 构建class_json参数
          const classJsonData = classList.value.map(teacher => ({
            teacher_id: teacher.id,
            teacher_code: teacher.teacherCode,
            class: teacher.list
              .filter(classItem => classItem.isChecked || (classItem.studentList && classItem.studentList.length > 0))
              .map(classItem => ({
                class_id: classItem.class_id,
                student_id: classItem.isChecked 
                  ? classItem.studentList.map(student => student.student_id)
                  : (classItem.studentList || []).map(student => student.student_id)
              }))
          }));
          
          let params = {
            city_id: dislogFormData.city, // 市id
            class_json: JSON.stringify(classJsonData), // 班级id和学生id集合
            count: dislogFormData.num, // 次数
            county_id: dislogFormData.district, // 区县id
            distributor_id: dislogFormData.distributor, // 经销商id
            end_time: dislogFormData.endTime, // 结束时间
            pay_money: dislogFormData.amount, // 收款金额
            pay_number: totalStudent.value, // 付费人数
            province_id: dislogFormData.province, // 省id
            school_id: dislogFormData.school, // 学校id
            user_name: vocabularyStore.user_name,
            session: vocabularyStore.session,
            start_time: dislogFormData.startTime, // 开始时间
            teacher_json: '[' + dislogFormData.teacher.join(',') + ']' // 教师id集合
          }
          AiAgentMemebers.addUnifyPay(params)
          .then((res) => {
            if (res.result_code === 200) {
              ElMessage({
                message: '新增成功',
                type: 'success',
                duration: 1000
              })
              close()
              getList()
            } else if (res.result_code === 1001) {
              ElMessage({
                message: '数据不存在',
                type: 'error',
                duration: 3000
              })
            } else if (res.result_code === 1002) {
              ElMessage({
                message: '会员已存在',
                type: 'error',
                duration: 3000
              })
            } else if (res.result_code === 1003) {
              ElMessage({
                message: '账号已存在',
                type: 'error',
                duration: 3000
              })
            } else if (res.result_code === 1004) {
              ElMessage({
                message: '权益有效期内,请勿重复开通',
                type: 'error',
                duration: 3000
              })
            } else if (res.result_code === 1005) {
              ElMessage({
                message: '部分账号开通成功',
                type: 'error',
                duration: 3000
              })
            } else if (res.result_code === 1006) {
              ElMessage({
                message: '所有用户都已经是正式会员，不能重复添加体验会员',
                type: 'error',
                duration: 3000
              })
            } else if (res.result_code === 1007) {
              ElMessage({
                message: '全部账号开通成功',
                type: 'error',
                duration: 3000
              })
            } else if (res.result_code === 1008) {
              ElMessage({
                message: '使用次数超出最大限制',
                type: 'error',
                duration: 3000
              })
            } else {
              return false
            }
          })
          .catch((error) => {
            console.log(error)
          })
          .finally(() => {
            loading.value = false
            saveLoading.value = false
          })
        }
    }
  } catch (error) {
    console.log('表单验证失败', error)
    saveLoading.value = false
  }
}

// 新增弹窗选择班级勾选事件
const classChange = (classItem) => {
  if (!classItem.isChecked && typeof classItem === 'object') {
    // 当取消勾选班级时，清除该班级的学生选择
    classItem.studentList = [];
    classItem.total = 0;
    classItem.status = false;
    classItem.total = 0;
    classItem.status = false;
  }
  console.log('2', classList.value)
  calculation()
}

// 点击筛选学生
const checkStudent = (iItem, name) => {
  studentVisible.value = true
  Object.assign(iItem, { name })
  currentClass = iItem
  getClassStudent(iItem.class_id)
}

// 筛选学生表格筛选事件
const handleSelectionChange = (options) => {
  classList.value.forEach((teacherItem) => {
    // 如果当前教师ID匹配
    if (teacherItem.id === currentClass.teacher_id) {
      // 遍历该教师下的班级列表
      teacherItem.list.forEach((classItem) => {
        // 如果班级ID匹配
        if (classItem.class_id === currentClass.class_id) {
          // 将选中的学生数据赋值给对应班级的studentList
          classItem.studentList = [...options];
          // 更新选中学生的总数
          classItem.total = options.length;
          // 更新状态为已选择
          classItem.status = options.length > 0;
          classItem.isChecked = classItem.student_nums === classItem.studentList.length ? true : false
        }
      });
    }
  });
} 

// 筛选学生确定按钮事件
const classSave = () => {
  studentVisible.value = false
  console.log('3', classList.value)
  calculation()
}

const calculation = () => {
  let total = 0
  classList.value.forEach(teacher => {
    let teacherTotal = 0
    teacher.list.forEach(classItem => {
      if (classItem.isChecked) {
        teacherTotal += classItem.student_nums
        total += classItem.student_nums
      } else {
        const studentCount = classItem.studentList ? classItem.studentList.length : 0
        teacherTotal += studentCount
        total += studentCount
      }
    })
    teacher.totalStudents = teacherTotal
  })
  totalStudent.value = total
  console.log('计算', classList.value)
}

// 作废
const voided = (option) => {
  let params = {
    user_name: vocabularyStore.user_name,
    session: vocabularyStore.session,
    id: option.id
  }
  ElMessageBox.confirm('确定将该条数据作废吗？', '提示信息', {
    confirmButtonText: '确定',
    confirmButtonClass: 'button-confirm',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    return AiAgentMemebers.unifyPayDelete(params)
    .then((res) => {
      if (res.result_code === 200) {
        ElMessage({
          message: '权益已作废',
          type: 'success',
          duration: 3000
        })
        getList()
      } else {
        ElMessage({
          message: '作废学生权益失败',
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
  }).catch(() => {
  })
}

// 查看
const check = (option) => {
  let params = {
    user_name: vocabularyStore.user_name,
    session: vocabularyStore.session,
    id: option.id
  }
  return AiAgentMemebers.getUnifyPayDetail(params)
    .then((res) => {
      if (res.result_code === 200) {
        checkVisible.value = true
        studentDetails = res.data
        console.log('查看', studentDetails)
      } else {
        ElMessage({
          message: '获取学生权益详情失败',
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
</script>
<style scoped>
.marginBottom {
  margin-bottom: 20px;
}
.teacher {
  padding-left: 70px;
  max-height: 400px;
  overflow-y: auto;
}
</style>
<template>
  <div class="page define-page">
    <div class="page-title" id="page-title">
      <h4>作文批改学生权限开通</h4>
    </div>
    <div class="content-box">
      <el-form :inline="true" id="form" :model="formData" size="large" label-width="90px" @submit.prevent>
        <el-form-item label="经销商：" label-width="130px">
          <el-select
            placeholder="请选择"
            filterable
            clearable
            v-model="formData.distributor"
          >
          <!-- v-for="item in provinceData"
            :key="item.id"
            :label="item.province"
            :value="item.id" -->
            <el-option></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学校：" label-width="130px">
            <el-select
              placeholder="请选择"
              filterable
              clearable
              v-model="formData.school"
            >
            <!-- v-for="item in provinceData"
              :key="item.id"
              :label="item.province"
              :value="item.id" -->
              <el-option></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="创建人：" label-width="130px">
          <el-input class="search-input" clearable placeholder="请输入姓名" v-model="formData.user"></el-input>
        </el-form-item>
        <el-form-item label="创建时间：" label-width="130px">
           <el-date-picker
              v-model="formData.date"
              type="datetimerange"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
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
        <el-table-column prop="1" label="经销商" min-width="120px" />
        <el-table-column prop="2" label="收款人数" min-width="100px" />
        <el-table-column prop="3" label="收款金额" min-width="100px" />
        <el-table-column prop="4" label="学校" min-width />
        <el-table-column prop="5" label="次数"  min-width="130px" />
        <el-table-column prop="6" label="开始时间"  min-width="140px"  />
        <el-table-column prop="7" label="结束时间"  min-width="140px" />
        <el-table-column prop="8" label="创建人" min-width="120" />
        <el-table-column prop="9" label="创建时间"  min-width="140px" />
        <el-table-column label="操作" fixed="right"  min-width="160px">
          <template>
            <!-- #default="scope" -->
            <el-button class="button-style" link type="primary" @click="check">
              查看
            </el-button>
            <el-button class="button-style" link type="primary" @click="voided">
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
    <!-- <el-select v-model="value" placeholder="Select" style="width: 240px" multiple>
      <el-option-group
        v-for="group in options"
        :key="group.label"
        :label="group.label"
      >
        <el-option
          v-for="item in group.options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-option-group>
    </el-select> -->
  </div>
  <el-dialog top="5vh" v-model="dialogVisible" title="新增" width="800" :close-on-click-modal="false" append-to-body :destroy-on-close="true">
    <el-form ref="formRef" id="form" :model="dislogFormData" size="large" label-width="150px" :rules="rules">
      <el-form-item label="经销商:" label-width="130px" prop="name">
        <el-select style="width: 200px;" v-model="dislogFormData.name" filterable placeholder="请输入经销商姓名">
          <!-- <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option> -->
        </el-select>
      </el-form-item>
      <el-form-item label="选择学校：" label-width="130px" prop="school">
        <el-select  style="width: 180px;margin-right: 10px;"  v-model="dislogFormData.province" placeholder="请选择省份">
          <el-option label="Zone one" value="shanghai" />
          <el-option label="Zone two" value="beijing" />
        </el-select>
        <el-select  style="width: 180px;margin-right: 10px;"  v-model="dislogFormData.city" placeholder="请选择市">
          <el-option label="Zone one" value="shanghai" />
          <el-option label="Zone two" value="beijing" />
        </el-select>
        <el-select  style="width: 180px;margin-right: 10px;"  v-model="dislogFormData.district" placeholder="请选择区县">
          <el-option label="Zone one" value="shanghai" />
          <el-option label="Zone two" value="beijing" />
        </el-select>
        <el-select  style="width: 180px;margin-top: 10px;"  v-model="dislogFormData.school" placeholder="请选择学校">
          <el-option label="Zone one" value="shanghai" />
          <el-option label="Zone two" value="beijing" />
        </el-select>
      </el-form-item>
      <el-form-item label="选择老师：" label-width="130px" prop="teacher">
        <el-checkbox-group v-model="dislogFormData.teacher">
          <el-checkbox value="Online activities" name="type">
            老师1
          </el-checkbox>
          <el-checkbox value="Promotion activities" name="type">
            老师2
          </el-checkbox>
          <el-checkbox value="Offline activities" name="type">
            老师3
          </el-checkbox>
          <el-checkbox value="Simple brand exposure" name="type">
            老师4
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="选择班级：" label-width="130px">
        <div style="height: 400px;overflow-y: auto;">
          <div style="color: red;">共选择80个学生</div>
          <div>
            <span>老师1：</span>
            <span style="color: red;">共选择40个学生</span>
            <el-checkbox-group>
              <el-checkbox value="Online activities" name="type" v-for="value in 10" :key="value">
                班级{{ value }}
                <span style="display: inline-block;margin-left: 15px;color: #0271E3;" @click="checkStudent">筛选学生</span>
              </el-checkbox> 
            </el-checkbox-group>
          </div>
          <div>
            <span>老师2：</span>
            <span style="color: red;">共选择40个学生</span>
            <el-checkbox-group>
              <el-checkbox value="Online activities" name="type" v-for="value in 12" :key="value">
                班级{{ value }}
                <span style="display: inline-block;margin-left: 15px;color: #0271E3;" @click="checkStudent">筛选学生</span>
              </el-checkbox> 
            </el-checkbox-group>
          </div>
          <div>
            <span>老师1：</span>
            <span style="color: red;">共选择40个学生</span>
            <el-checkbox-group>
              <el-checkbox value="Online activities" name="type" v-for="value in 10" :key="value">
                班级{{ value }}
                <span style="display: inline-block;margin-left: 15px;color: #0271E3;" @click="checkStudent">筛选学生</span>
              </el-checkbox> 
            </el-checkbox-group>
          </div>
          <div>
            <span>老师2：</span>
            <span style="color: red;">共选择40个学生</span>
            <el-checkbox-group>
              <el-checkbox value="Online activities" name="type" v-for="value in 12" :key="value" style="border:1px solid #ccc;padding: 5px;margin-bottom: 10px;border-radius: 10px;">
                班级{{ value }}
                <span style="display: inline-block;margin-left: 15px;color: #0271E3;" @click="checkStudent">筛选学生</span>
              </el-checkbox> 
            </el-checkbox-group>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="次数：" label-width="130px" prop="num">
        <el-input-number v-model="dislogFormData.num"></el-input-number>
        <span style="margin-left: 10px;">次/人</span>
      </el-form-item>
      <el-form-item  label="开始时间：" label-width="130px" prop="startTime" >
        <el-date-picker
          type="datetime"
          v-model="dislogFormData.startTime"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间：" label-width="130px" prop="endTime" >
        <el-date-picker
          type="datetime"
          v-model="dislogFormData.endTime"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="收款金额：" label-width="130px">
        <el-input-number v-model="dislogFormData.num" :precision='2' :min="0"></el-input-number>
        <span style="margin-left: 10px;">次/人</span>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog v-model="studentVisible" title="筛选学生" width="600" :close-on-click-modal="false" append-to-body :destroy-on-close="true">
    <div>班级1:</div>
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
          prop="name">
        </el-table-column>
      </el-table>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="studentVisible = false">取消</el-button>
          <el-button type="primary" @click="studentVisible = false">保存</el-button>
        </div>
      </template>
  </el-dialog>
  <el-dialog v-model="checkVisible" title="查看" width="600" :close-on-click-modal="false" append-to-body :destroy-on-close="true">
    <div style="padding-left: 40px;">
      <div class="marginBottom">经销商：张伟</div>
      <div class="marginBottom">选择学校：北京市大兴区大兴中学</div>
      <div class="marginBottom">选择老师：张伟、张晓</div>
      <div class="marginBottom">
        <span>选择班级：</span>
        <span style="color: red;display: inline-block;margin-left: 10px;margin-bottom: 10px;">共选择40个学生</span>
        <div class="teacher">
          <span>老师1：</span>
          <span style="color: red;display: inline-block;margin-left: 10px;margin-bottom: 10px;">共选择40个学生</span>
          <div style="margin-top: 10px;">一菲、美嘉、婉瑜</div>
        </div>
      </div>
      <div class="marginBottom">次数：10000次/人</div>
      <div class="marginBottom">开始时间：2025-12-3 10:28:38</div>
      <div class="marginBottom">结束时间：2025-12-3 10:28:38</div>
      <div class="marginBottom">收款金额：100000元</div>
    </div>
  </el-dialog>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useScreenHeight } from '@/hooks/useScreenHeight.js';
const { screenHeight } = useScreenHeight();
// ElMessage,
import {  ElMessageBox } from 'element-plus'


  // const value = ref('')
  // const options = [
  // {
  //   label: '老师1',
  //   options: [
  //     {
  //       value: 'Shanghai',
  //       label: '班级1',
  //     },
  //     {
  //       value: 'Beijing',
  //       label: '班级2',
  //     },
  //   ],
  // },
  // {
  //   label: '老师2',
  //   options: [
  //     {
  //       value: 'Chengdu',
  //       label: '班级1',
  //     },
  //     {
  //       value: 'Shenzhen',
  //       label: '班级2',
  //     },
  //     {
  //       value: 'Guangzhou',
  //       label: '班级3',
  //     },
  //     {
  //       value: 'Dalian',
  //       label: '班级4',
  //     },
  //   ],
  // },
  // ]
let formData = ref({
  distributor: '', // 经销商
  school: '', // 学校
  user: '', // 创建人
  date: '' // 创建时间
}) // 表单内容
let tableRef = ref(null)
let list = ref([]) // 表格数据
let loading = ref(false) // 加载标记
let total = ref(0)
let pageIndex = ref(1)
let pageSize = ref(10)
let dialogVisible = ref(false) // 弹窗显隐
let formRef = ref(null)
let dislogFormData = ref({
  name: '', // 经销商
  province: '' , // 省
  city: '', // 市
  district: '', // 区县
  school: '', // 学校
  teacher: [], // 老师
  num: 0, //次数
  startTime: '', // 开始时间
  endTime: '' // 结束
}) // 弹窗表单
let rules = ref({
  name: [
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
    { required: true, message: '请选择开始时间', trigger: 'change' }
  ],
  endTime: [
    { required: true, message: '请选择结束时间', trigger: 'change' }
  ]
});
let studentVisible = ref(false) // 筛选学生弹窗
let studentTableRef = ref(null)
let studentList = ref([
  {
    name: '学生1'
  },
  {
    name: '学生2'
  },
  {
    name: '学生3'
  },
  {
    name: '学生1'
  },
  {
    name: '学生2'
  },
  {
    name: '学生3'
  },
  {
    name: '学生1'
  },
  {
    name: '学生2'
  },
  {
    name: '学生3'
  }
  ,{
    name: '学生1'
  },
  {
    name: '学生2'
  },
  {
    name: '学生3'
  },
  {
    name: '学生1'
  },
  {
    name: '学生2'
  },
  {
    name: '学生3'
  },
  {
    name: '学生1'
  },
  {
    name: '学生2'
  },
  {
    name: '学生3'
  }
]) // 筛选学生列表数据
let checkVisible = ref(false) // 查看弹窗显隐


onMounted(() => {
   // 设置页面展示高度
  window.addEventListener('resize', updateScreenHeight)
  updateScreenHeight()
})

const updateScreenHeight = () => {
  var element = document.getElementById('form');
  if (element) {
    var rect = element.getBoundingClientRect();
    var formHeight = rect.height // form表单的高
  }
    
   var pageHeight = 80 // 分页高度
   var menuHeight = 64 // 导航栏高度
   screenHeight.value = window.innerHeight - formHeight - pageHeight - menuHeight - 100
} // 动态设置表格高度

const showIndex = (index) => {
  return index + 1 + (pageIndex.value - 1) * pageSize.value
} // 序号

const onSubmit = () => {

} // 查询

const onReset = () => {

} // 重置

const newlyAdded = () => {
  dialogVisible.value = true
} // 新增

const getList = () => {

} // 获取表格数据

const handleCurrentChange = async (page) => { // 切换下一页
  pageIndex.value = page
  await getList()
} // 点击分页

const save = async () => {
  if (!formRef.value) return
  try {
    const valid = await formRef.value.validate()
    if (valid) {
      console.log('表单验证通过，提交数据')
      // 这里添加实际提交逻辑
    }
  } catch (error) {
    console.log('表单验证失败', error)
  }
} // 新增弹窗保存

const checkStudent = () => {
  studentVisible.value = true
} // 点击筛选学生

const handleSelectionChange = (options) => {
  console.log('勾选数据', options)

} // 筛选学生表格筛选事件

const voided = () => {
  ElMessageBox.confirm('确定该条数据作废吗？', '提示信息', {
    confirmButtonText: '确定',
    confirmButtonClass: 'button-confirm',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
  }).catch(() => {
  })
} // 作废

const check = () => {
  checkVisible.value = false
}
</script>
<style scoped>
.marginBottom {
  margin-bottom: 20px;
}
.teacher {
  padding-left: 70px;
}
</style>
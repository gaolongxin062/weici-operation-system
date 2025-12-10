<template>
  <div class="page define-page">
    <div class="page-title" id="page-title">
      <h4>作文批改学生权限开通</h4>
    </div>
    <div class="content-box">
      <el-form :inline="true" id="form" :model="formData" size="large" label-width="90px" @submit.prevent>
        <el-form-item label="产品类型：" label-width="130px">
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
         <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="list" class="table-info" v-loading="loading" header-cell-class-name="header_row_class" style="width: 100%" stripe element-loading-text="拼命加载中，主人请稍后..." :max-height="screenHeight" ref="tableRef" >
        <el-table-column width="80" align="center" label="序号">
          <template #default="scope">
            <div>{{ showIndex(scope.$index) }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="1" label="产品类型" min-width="120px" />
        <el-table-column prop="2" label="权益名称" min-width="100px" />
        <el-table-column prop="3" label="权益简介" min-width="100px" />
        <el-table-column prop="8" label="创建人" min-width="120" />
        <el-table-column prop="9" label="创建时间"  min-width="140px" />
        <el-table-column label="操作" fixed="right"  min-width="160px">
          <template>
            <!-- #default="scope" -->
            <el-button class="button-style" link type="primary" @click="check">
              查看
            </el-button>
            <el-button class="button-style" link type="primary" @click="update">
              修改
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
  <el-dialog v-model="dialogVisible" :title="type === 0 ? '查看' : '修改' " width="800" :close-on-click-modal="false" append-to-body :destroy-on-close="true">
    <el-form ref="formRef" id="form" :model="dislogFormData" size="large" label-width="150px">
        <el-form-item label="产品类型：">
          <el-input style="width: 200px;" v-model="dislogFormData.type" :disabled="true"></el-input>
        </el-form-item>
        <span style="display: inline-block;margin-left: 66px;vertical-align: top;">产品权益：</span>
        <div style="height: 200px;display: inline-block;vertical-align: top;overflow-y: auto;margin-bottom: 20px;padding: 0 20px;">
          <div v-for="(item, index) in rightsList" :key="item.id" class="first-item">
            <span style="margin-bottom: 10px;display: inline-block;">权益{{ index + 1 }}</span>
            <el-form-item  label="名称:" label-width="50px">
              <el-input style="width: 200px;" v-model="item.name" max="10" placeholder="请输入权益名称" :disabled="type === 0 ? true : false"  />
            </el-form-item>
            <el-form-item  label="简介:" label-width="50px">
              <el-input style="width: 300px;" v-model="item.msg" max="20" placeholder="请输入权益简介" :disabled="type === 0 ? true : false" />
              <span class="del" @click="deleteRight(index)" v-if="type === 1">删除</span>
            </el-form-item>
          </div>
        </div>
        <el-form-item label="创建人：" v-if="type === 0">
          <el-input style="width: 200px;" v-model="dislogFormData.name" :disabled="type === 0 ? true : false"></el-input>
        </el-form-item>
        <el-form-item label="创建时间：" v-if="type === 0" >
          <el-input style="width: 200px;" v-model="dislogFormData.date" :disabled="type === 0 ? true : false"></el-input>
        </el-form-item>
    </el-form>
    <div class="add"  @click="addRight" v-if="type === 1">+点击添加权益</div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ type === 0 ? '关闭':'取消' }}</el-button>
        <el-button type="primary" @click="save" v-if="type === 1">保存</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useScreenHeight } from '@/hooks/useScreenHeight.js';
const { screenHeight } = useScreenHeight();
import { ElMessage } from 'element-plus';

let formData = ref({
  distributor: '', // 产品类型
  user: '', // 创建人
  date: '' // 创建时间
}) // 表单内容
let tableRef = ref(null)
let list = ref([

]) // 表格数据
let loading = ref(false) // 加载标记
let total = ref(0)
let pageIndex = ref(1)
let pageSize = ref(10)
let dialogVisible = ref(true) // 弹窗显隐
let formRef = ref(null)
let dislogFormData = ref({
  type: '1', // 产品类型
  name: '小A', // 创建人
  date: '2025-12-09' // 创建时间
}) // 弹窗表单
// 动态权益组数据（响应式数组）
let rightsList = ref([
  { name: '', msg: '' },
  { name: '', msg: '' } // 初始2组
]);
let type = ref(0) // 0查看 1修改


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

const getList = () => {

} // 获取表格数据

const handleCurrentChange = async (page) => { // 切换下一页
  pageIndex.value = page
  await getList()
} // 点击分页

const save = async () => { 
  const hasEmptyItem = rightsList.value.some(item => { 
    const nameIsEmpty = !item.name?.trim()
    const valueIsEmpty = !item.msg?.trim()
    return nameIsEmpty || valueIsEmpty
  });
  if (hasEmptyItem) {
    ElMessage.error('请完善所有权益名称和简介')
    return;
  }
  console.log(rightsList.value)
} // 新增弹窗保存

const check = () => {
  type.value = 0
}
const update = () => {
  type.value = 1
  dialogVisible.value = true
} // 修改事件


const addRight = () => {
  rightsList.value.push({
    name: '',
    value: ''
  });
} // 新增权益组


const deleteRight = (index) => {
  rightsList.value.splice(index, 1);
} // 删除权益组
</script>
<style scoped>
.marginBottom {
  margin-bottom: 20px;
}
.teacher {
  padding-left: 70px;
}
.del {
  display: inline-block;
  text-align: center;
  vertical-align: middle;
  margin-left: 10px;
  color: red;
  cursor: pointer;
}
.add {
  margin: 0 auto;
  width: 500px;
  height: 30px;
  cursor: pointer;
  text-align: center;
  line-height: 30px;
  color: #0271E3;
  border: 1px solid #ccc;
}
.first-item { margin-left: 20px; }
.other-item { margin-left: 160px; }
</style>
<template>
  <div class="page define-page">
    <div class="page-title" id="page-title">
      <h4>订单记录</h4>
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
         <el-form-item label="班级：" label-width="130px">
            <el-select
              placeholder="请选择"
              filterable
              clearable
              v-model="formData.classroom"
            >
            <!-- v-for="item in provinceData"
              :key="item.id"
              :label="item.province"
              :value="item.id" -->
              <el-option></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="订单号：" label-width="130px">
          <el-input class="search-input" clearable placeholder="请输入订单号" v-model="formData.order"></el-input>
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
      </div>
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
      <div class="marginBottom">订单号：这里是订单号</div>
      <div class="marginBottom">支付金额：80.00</div>
      <div class="marginBottom">支付时间：2025-12-3 10:28:38</div>
      <div class="marginBottom">学生姓名：张晓</div>
      <div class="marginBottom">班级：高二8班</div>
      <div class="marginBottom">学校：学校名</div>
      <div class="marginBottom">经销商：张三</div>
      <div class="marginBottom">产品名称：产品名1</div>
      <div class="marginBottom">付费周期：半年</div>
      <div class="marginBottom">产品折扣：7折</div>
      <div class="marginBottom">服务费：50/人</div>
    </div>
  </el-dialog>
</template>
<script setup>
import { ref } from 'vue'

let formData = ref({
  distributor: '', // 经销商
  school: '', // 学校
  classroom: '', // 班级
  order: '', // 订单号
  date: '' // 创建时间
}) // 表单内容
let tableRef = ref(null)
let list = ref([]) // 表格数据
let loading = ref(false) // 加载标记
let total = ref(0)
let pageIndex = ref(1)
let pageSize = ref(10)
let checkVisible = ref(false)

const onSubmit = () => {

} // 查询

const onReset = () => {

} // 重置

const getList = () => {

} // 获取表格数据

const showIndex = (index) => {
  return index + 1 + (pageIndex.value - 1) * pageSize.value
} // 序号

const handleCurrentChange = async (page) => { // 切换下一页
  pageIndex.value = page
  await getList()
} // 点击分页

const check = () => {
  checkVisible.value = false
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

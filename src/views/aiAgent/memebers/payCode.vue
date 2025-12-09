<template>
    <div class="page define-page">
        <div class="page-title" id="page-title">
            <h4>付费码管理</h4>
        </div>
        <div class="content-box">
      <el-form :inline="true" id="form" :model="formData" size="large" label-width="90px" @submit.prevent>
        <el-form-item label="产品：" label-width="130px">
          <el-input class="search-input" clearable placeholder="请输入姓名" v-model="formData.product"></el-input>
        </el-form-item>
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
        <el-form-item label="付费周期：" label-width="130px">
          <el-select
            placeholder="请选择"
            filterable
            clearable
            v-model="formData.cycle"
          >
          <el-option></el-option>
          <!-- v-for="item in provinceData"
            :key="item.id"
            :label="item.province"
            :value="item.id" -->
          </el-select>
        </el-form-item>
        <el-form-item label="状态：" label-width="130px">
          <el-select
            placeholder="请选择"
            filterable
            clearable
            v-model="formData.status"
          >
          <el-option></el-option>
          <!-- v-for="item in provinceData"
            :key="item.id"
            :label="item.province"
            :value="item.id" -->
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
        <el-form-item>
          <el-button type="success" @click="onAdd">新增</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="list" class="table-info" v-loading="loading" header-cell-class-name="header_row_class" style="width: 100%" stripe element-loading-text="拼命加载中，主人请稍后..." :max-height="screenHeight" ref="tableRef" >
        <el-table-column width="80" align="center" label="序号">
          <template #default="scope">
            <div>{{ showIndex(scope.$index) }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="1" label="产品ID" min-width="120px" />
        <el-table-column prop="2" label="产品" min-width="100px" />
        <el-table-column prop="3" label="产品类型" min-width="100px" />
        <el-table-column prop="4" label="付费周期" min-width />
        <el-table-column prop="5" label="次数(次)"  min-width="130px" />
        <el-table-column prop="6" label="折扣价(元/人)"  min-width="140px"  />
        <el-table-column prop="7" label="服务费"  min-width="140px" />
        <el-table-column prop="7" label="会员价(元/人)"  min-width="140px" />
        <el-table-column prop="7" label="划线价(元/人)"  min-width="140px" />
        <el-table-column prop="7" label="所属经销商"  min-width="140px" />
        <el-table-column prop="7" label="付费码失效时间"  min-width="140px" />
        <el-table-column prop="8" label="创建人" min-width="120" />
        <el-table-column prop="9" label="创建时间"  min-width="140px" />
        <el-table-column label="操作" fixed="right"  min-width="160px">
          <template>
            <!-- #default="scope" -->
            <el-button class="button-style" link type="primary" @click="check">
              查看
            </el-button>
            <el-button class="button-style" link type="primary">
              下载付费码
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
</template>
<script setup>
import { ref } from 'vue'

let formData = ref({
  product: '', // 产品
  distributor: '', // 产品类型
  cycle: '', // 付费周期
  status: '', // 状态
  user: '', // 创建人
  date: '' // 创建时间
}) // 表单内容
let list = ref([]) // 表格数据
let loading = ref(false) // 加载标记
let total = ref(0)
let pageIndex = ref(1)
let pageSize = ref(10)

// 列表
const getList = () => {

}

// 分页
const handleCurrentChange = async (page) => { // 切换下一页
  pageIndex.value = page
  await getList()
}

const showIndex = (index) => {
  return index + 1 + (pageIndex.value - 1) * pageSize.value
} // 序号

// 查询
const onSubmit = () => {

} 

// 重置
const onReset = () => {

} 
</script>
<style scoped></style>
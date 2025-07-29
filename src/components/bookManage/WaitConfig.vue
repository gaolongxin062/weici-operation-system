<template>
  <el-form :inline="true" :model="formData" class="demo-form-inline">
    <el-form-item label="名称">
      <el-input v-model="formData.user" placeholder="Approved by" clearable />
    </el-form-item>
    <el-form-item label="类型">
      <el-select v-model="formData.region" placeholder="Activity zone" clearable>
        <el-option label="Zone one" value="shanghai" />
        <el-option label="Zone two" value="beijing" />
      </el-select>
    </el-form-item>
    <el-form-item label="出版时间">
      <el-date-picker v-model="formData.date" type="date" placeholder="Pick a date" clearable />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">查询</el-button>
      <el-button type="primary" @click="onSubmit">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { reactive } from 'vue'

const formData = reactive({
  bookName: '',
  type: '',
  date: '',
}) // 表单数据

const onSubmit = () => {
  console.log(formData)
}
</script>

<style scoped>
.demo-form-inline .el-input {
  --el-input-width: 220px;
}

.demo-form-inline .el-select {
  --el-select-width: 220px;
}
</style>

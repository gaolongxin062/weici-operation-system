<template>
  <div class="page define-page">
    <div class="page-title" id="page-title">
      <h4>产品配置</h4>
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
        <el-table-column prop="6" label="统一售价(元/人)"  min-width="140px"  />
        <el-table-column prop="7" label="最低价(元/人)"  min-width="140px" />
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
            <el-button class="button-style" link type="primary" @click="status">
              启用
            </el-button>
            <el-button class="button-style" link type="primary" @click="del">
              删除
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
  <el-dialog v-model="checkVisible" title="查看" width="600" :close-on-click-modal="false" append-to-body :destroy-on-close="true">
    <div style="padding-left: 40px;">
      <div class="marginBottom">产品：产品名称</div>
      <div class="marginBottom">产品类型：作文批改</div>
      <div class="marginBottom">付费周期：半年</div>
      <div class="marginBottom">次数：10000次/人</div>
      <div class="marginBottom">统一售价：80/人</div>
      <div class="marginBottom">最低价：60/人</div>
      <div class="marginBottom">上下架：启用</div>
    </div>
  </el-dialog>
  <el-dialog v-model="visible" :title="type === 0 ? '新增' : '修改'" width="600" :close-on-click-modal="false" append-to-body :destroy-on-close="true">
     <el-form ref="formRef" id="form" :model="dislogFormData" size="large" label-width="150px" :rules="rules">
      <el-form-item label="产品：" label-width="130px" prop="product">
        <el-input style="width: 200px;" v-model="dislogFormData.product" maxlength="20" ></el-input>
      </el-form-item>
      <el-form-item label="产品类型：" label-width="130px" prop="type">
        <el-radio-group v-model="dislogFormData.type">
          <el-radio label="作文批改" :disabled="type === 1 ? true : false">作文批改</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="付费周期：" label-width="130px" prop="cycle">
        <el-checkbox-group v-model="dislogFormData.cycle">
          <el-checkbox value="Online activities" name="type">
            半年
          </el-checkbox>
          <el-checkbox value="Promotion activities" name="type">
            一年
          </el-checkbox>
          <el-checkbox value="Offline activities" name="type">
            两年
          </el-checkbox>
          <el-checkbox value="Simple brand exposure" name="type">
            三年
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="次数：" label-width="130px" prop="num">
        <el-input-number v-model="dislogFormData.num" :precision="0" min="1"></el-input-number>
        <span style="margin-left: 10px;">次/人</span>
      </el-form-item>
      <el-form-item  label="统一售价：" label-width="130px" prop="price" >
       <el-input-number v-model="dislogFormData.price" :precision="2"  min="1"></el-input-number>
        <span style="margin-left: 10px;">元/人</span>
      </el-form-item>
      <el-form-item label="最低价：" label-width="130px" prop="lowPrice" >
       <el-input-number v-model="dislogFormData.lowPrice" :precision="2"  min="1"></el-input-number>
        <span style="margin-left: 10px;">元/人</span>
      </el-form-item>
      <el-form-item label="上下架：" label-width="130px" prop="status">
        <el-radio-group v-model="dislogFormData.status">
          <el-radio label="启用">启用</el-radio>
          <el-radio label="禁用">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </div>
    </template>
  </el-dialog>
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
let visible = ref(false) // 新增/修改弹窗显隐控制
let checkVisible = ref(false) // 查看弹窗显隐
let type = ref(1) // 0新增 1修改
let formRef = ref(null)
let dislogFormData = ref({
  product: '', // 产品
  type: '作文批改' , // 类型
  cycle: [], // 周期
  num: 0, //次数
  price: '', // 统一售价
  lowPrice: '', // 最低价
  status: '启用' // 上下架
}) // 弹窗表单
let rules = ref({
  product: [
    { required: true, message: '请输入产品', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择产品类型', trigger: 'change', }
  ],
  cycle: [
    { type: 'array', required: true, message: '请选择付费周期', trigger: 'change'}
  ],
  num: [
    { required: true, message: '请输入次数', trigger: 'blur' },
  ],
  price: [
    { required: true, message: '请输入统一售价', trigger: 'blur' }
  ],
  lowPrice: [
    { required: true, message: '请输入最低价', trigger: 'blur' }
  ],
  status: [
    { type: 'array', required: true, message: '请选择上架还是下架', trigger: 'change'}
  ],
});

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

// 新增
const onAdd = () => {
  type.value = 0
  visible.value = true
}

// 查看
const check = () => {
  checkVisible.value = true
}

// 修改
const update = () => {
  type.value = 1
  visible.value = true
}

// 启用/禁用
const status = () => {

}

// 删除
const del = () => {

}

// 保存
const save = async () => {
   if (!formRef.value) return
  try {
    const valid = await formRef.value.validate()
    if (valid) {
      visible.value = false
      console.log('表单验证通过，提交数据')
      // 这里添加实际提交逻辑
    }
  } catch (error) {
    console.log('表单验证失败', error)
  }
}

</script>
<style scoped>
.marginBottom {
  margin-bottom: 20px;
}
</style>
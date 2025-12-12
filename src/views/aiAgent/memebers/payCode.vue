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
    <el-dialog v-model="visible" title="新增" width="800" :close-on-click-modal="false" append-to-body :destroy-on-close="true" top="5vh">
      <el-form ref="formRef" id="form" :model="dislogFormData" size="large" label-width="150px" :rules="rules">
        <el-form-item label="产品：" label-width="130px" prop="product">
           <el-select style="width: 200px;" v-model="dislogFormData.product" filterable placeholder="请选择产品">
          <!-- <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option> -->
        </el-select>
        </el-form-item>
        <el-form-item label="产品类型：" label-width="130px" prop="type">
          <el-radio-group v-model="dislogFormData.type">
            <el-radio label="作文批改" disabled>作文批改</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="付费周期：" label-width="130px" prop="product">
          <el-input style="width: 200px;" disabled v-model="dislogFormData.product"></el-input>
        </el-form-item>
        <el-form-item label="次数：" label-width="130px" prop="num">
          <el-input-number v-model="dislogFormData.num" disabled :precision="0" min="1"></el-input-number>
          <span style="margin-left: 10px;">次/人</span>
        </el-form-item>
        <el-form-item  label="统一售价：" label-width="130px" prop="price" >
        <el-input-number v-model="dislogFormData.price" disabled :precision="2"  min="1"></el-input-number>
          <span style="margin-left: 10px;">元/人</span>
        </el-form-item>
        <el-form-item label="最低价：" label-width="130px" prop="lowPrice" >
        <el-input-number v-model="dislogFormData.lowPrice" disabled :precision="2"  min="1"></el-input-number>
          <span style="margin-left: 10px;">元/人</span>
        </el-form-item>
        <el-form-item label="产品名称：" label-width="130px" prop="name">
          <el-input style="width: 200px;" v-model="dislogFormData.name" maxlength="20" placeholder="请输入产品名称"></el-input>
        </el-form-item>
        <span style="display: inline-block;margin-left: 48px;vertical-align: top;" v-if="rightsList.length !== 0">产品权益：</span>
        <div style="height: 200px;display: inline-block;vertical-align: top;overflow-y: auto;margin-bottom: 20px;padding: 0 20px;" v-if="rightsList.length !== 0">
          <div v-for="(item, index) in rightsList" :key="item.id" class="first-item">
            <span style="margin-bottom: 10px;display: inline-block;">权益{{ index + 1 }}</span>
            <el-form-item  label="名称:" label-width="50px">
              <el-input style="width: 200px;" v-model="item.name" max="10" placeholder="请输入权益名称" :disabled="type === 0 ? true : false"  />
            </el-form-item>
            <el-form-item  label="简介:" label-width="50px">
              <el-input style="width: 300px;" v-model="item.msg" max="20" placeholder="请输入权益简介" :disabled="type === 0 ? true : false" />
              <span class="del" @click="deleteRight(index)">删除</span>
            </el-form-item>
          </div>
        </div>
        <div class="add"  @click="addRight">+点击添加权益</div>
        <el-form-item label="折扣价：" label-width="130px" prop="discountedPrice">
          <el-input-number style="width: 200px;" v-model="dislogFormData.discountedPrice" maxlength="20" placeholder="请输入折扣价"></el-input-number>
        </el-form-item>
        <el-form-item label="服务费：" label-width="130px">
          <el-input-number style="width: 200px;" v-model="dislogFormData.serviceFee" maxlength="20" placeholder="请输入服务费"></el-input-number>
        </el-form-item>
        <el-form-item label="会员价：" label-width="130px">
          <el-input-number style="width: 200px;" v-model="dislogFormData.memberPrice" maxlength="20" placeholder="请输入会员价"></el-input-number>
        </el-form-item>
        <el-form-item label="划线价：" label-width="130px">
          <el-input-number style="width: 200px;" v-model="dislogFormData.originalPrice" maxlength="20" placeholder="请输入划线价"></el-input-number>
        </el-form-item>
        <el-form-item label="付费码失效时间：" label-width="140px" prop="time">
           <el-date-picker
            type="datetime"
            v-model="dislogFormData.time"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择失效时间">
        </el-date-picker>
        </el-form-item>
        <el-form-item label="经销商：" label-width="130px" prop="dealer">
          <el-select
            style="width: 200px;"
            placeholder="请选择"
            filterable
            clearable
            v-model="dislogFormData.dealer"
          >
          <!-- v-for="item in provinceData"
            :key="item.id"
            :label="item.province"
            :value="item.id" -->
            <el-option></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="付费码可用班级：" label-width="140px" prop="school">
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
            <div>
              <span>老师1：</span>
              <el-checkbox-group>
                <el-checkbox value="Online activities" name="type" v-for="value in 10" :key="value">
                  班级{{ value }}
                </el-checkbox> 
              </el-checkbox-group>
            </div>
            <div>
              <span>老师2：</span>
              <el-checkbox-group>
                <el-checkbox value="Online activities" name="type" v-for="value in 12" :key="value">
                  班级{{ value }}
                </el-checkbox> 
              </el-checkbox-group>
            </div>
            <div>
              <span>老师1：</span>
              <el-checkbox-group>
                <el-checkbox value="Online activities" name="type" v-for="value in 10" :key="value">
                  班级{{ value }}
                </el-checkbox> 
              </el-checkbox-group>
            </div>
            <div>
              <span>老师2：</span>
              <el-checkbox-group>
                <el-checkbox value="Online activities" name="type" v-for="value in 12" :key="value" style="border:1px solid #ccc;padding: 5px;margin-bottom: 10px;border-radius: 10px;">
                  班级{{ value }}
                </el-checkbox> 
              </el-checkbox-group>
            </div>
          </div>
        </el-form-item>
        <div style="height: 1px;border-bottom: 1px solid #ccc;margin-bottom: 10px;"></div>
        <el-form-item label="URL地址：" label-width="130px">
          <el-input style="width: 200px;" v-model="dislogFormData.url" maxlength="20" placeholder="请输入URL地址"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" style="margin-left: 50px;margin-bottom: 10px;">生成付费码</el-button>
      <el-table :data="list2" class="table-info" v-loading="loading2" header-cell-class-name="header_row_class" style="width: 100%" stripe element-loading-text="拼命加载中，主人请稍后..." :max-height="screenHeight" ref="tableRef" >
        <el-table-column prop="1" label="产品名称_班级" min-width="120px" />
        <el-table-column prop="2" label="班级付费二维码" min-width="100px" />
        <el-table-column prop="3" label="班级付费链接" min-width="100px" />
        <el-table-column label="操作" fixed="right"  min-width="160px">
          <template>
            <!-- #default="scope" -->
            <el-button class="button-style" link type="primary">
              预览宣传页
            </el-button>
            <el-button class="button-style" link type="primary">
              下载
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="visible = false">取消</el-button>
          <el-button type="primary" @click="save">批量下载付费码</el-button>
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
let visible = ref(false)
let formRef = ref(null)
let dislogFormData = ref({
  product: '', // 产品
  type: '作文批改' , // 类型
  cycle: [], // 周期
  num: 0, //次数
  price: '', // 统一售价
  lowPrice: '', // 最低价
  name: '', // 产品名称
  discountedPrice: '', // 折扣价
  serviceFee: '', // 服务费
  memberPrice: '', // 会员价
  originalPrice: '', // 划线价
  time: '', // 付费码失效时间
  dealer: '', // 所属经销商
  province: '' , // 省
  city: '', // 市
  district: '', // 区县
  school: '', // 学校
  teacher: [], // 老师
  url: '' // url地址
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
  name: [
    { required: true, message: '请输入产品名称', trigger: 'blur' }
  ],
  discountedPrice: [
    { required: true, message: '请输入折扣价', trigger: 'blur' }
  ],
  time: [
    { required: true, message: '请选择开始时间', trigger: 'change' }
  ],
  dealer: [
    { required: true, message: '输入经销商名字', trigger: 'change'}
  ],
  school: [
    { required: true, message: '输入经销商名字', trigger: 'change'}
  ],
  teacher: [
    { type: 'array', required: true, message: '请选择老师', trigger: 'change'}
  ],
});
// 动态权益组数据（响应式数组）
let rightsList = ref([
  { name: '', msg: '' },
  { name: '', msg: '' } // 初始2组
]);
let list2 = ref([]) // 弹窗表格数据列表
let loading2 = ref(false) // 加载标记

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
  visible.value = true
}

// 查看
const check = () => {
  
}

// 删除权益组
const deleteRight = (index) => {
  rightsList.value.splice(index, 1);
} 

// 新增权益组
const addRight = () => {
  rightsList.value.push({
    name: '',
    value: ''
  });
} 

// 弹窗保存
const save = () => {

}
</script>
<style scoped>
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
  margin-bottom: 10px;
}
</style>
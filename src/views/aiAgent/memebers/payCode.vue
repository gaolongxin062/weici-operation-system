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
                style="width: 200px;"
                placeholder="请选择"
                clearable
                v-model="formData.distributor"
              >
                <el-option v-for="item in productType" :key="item.id" :label="item.title" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="付费周期：" label-width="130px">
              <el-select
                style="width: 200px;"
                placeholder="请选择付费周期"
                clearable
                v-model="formData.cycle"
              >
                <el-option v-for="item in cycleList" :key="item.item_value" :label="item.item_name" :value="item.item_value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="状态：" label-width="130px">
              <el-select
                  placeholder="请选择状态"
                  style="width: 200px;"
                  clearable
                  v-model="formData.status"
                >
                  <el-option v-for="item in statusList" :key="item.id" :label="item.title" :value="item.id"></el-option>
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
            <el-table-column prop="product_id" label="产品ID" min-width="120px" />
            <el-table-column prop="product_name" label="产品" min-width="100px" />
              <el-table-column label="产品类型" min-width="100px" >
                <template #default="scope">
                  <div>{{ getProductTypeTitle(scope.row.type) }}</div>
                </template>
              </el-table-column>
              <el-table-column label="付费周期" min-width >
                <template #default="scope">
                  <div>{{ getCycleTitle(scope.row.cycle) }}</div>
                </template>
              </el-table-column>
            <el-table-column prop="num" label="次数(次)"  min-width="130px" />
            <el-table-column label="折扣价(元/人)"  min-width="140px">
              <template #default="scope">
                <div>{{ scope.row.discount_price  / 100  }}</div>
              </template>
            </el-table-column>
            <el-table-column  label="服务费"  min-width="140px">
              <template #default="scope">
                <div>{{ scope.row.service_price  / 100  }}</div>
              </template>
            </el-table-column>
            <el-table-column label="会员价(元/人)"  min-width="140px">
              <template #default="scope">
                <div>{{ scope.row.vip_price  / 100  }}</div>
              </template>
            </el-table-column>
            <el-table-column label="划线价(元/人)"  min-width="140px">
              <template #default="scope">
                <div>{{ scope.row.list_price  / 100  }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="distributor_name" label="所属经销商"  min-width="140px" />
            <el-table-column prop="disabled_time" label="付费码失效时间"  min-width="140px" />
            <el-table-column prop="maker" label="创建人" min-width="120" />
            <el-table-column prop="make_date" label="创建时间"  min-width="180px" />
            <el-table-column label="操作" fixed="right"  min-width="160px">
              <template #default="scope">
                <el-button class="button-style" link type="primary" @click="check(scope.row)">
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
        <el-form-item label="选择产品：" label-width="130px" prop="product">
            <el-select style="width: 200px;" v-model="dislogFormData.product" placeholder="请选择产品" @change="changeProduct">
              <el-option v-for="item in productList" :key="item.id" :label="item.title" :value="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="产品类型：" label-width="130px" v-if="dislogFormData.product">
          <span>{{ getProductTypeTitle(dislogFormData.type) }}</span>
        </el-form-item>
        <el-form-item label="付费周期：" label-width="130px" v-if="dislogFormData.product">
           <el-select
            style="width: 200px;"
            placeholder="请选择付费周期"
            clearable
            disabled
            v-model="dislogFormData.cycle"
          >
            <el-option v-for="item in cycleList" :key="item.item_value" :label="item.item_name" :value="item.item_value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="次数：" label-width="130px" v-if="dislogFormData.product">
          <el-input-number v-model="dislogFormData.num" disabled></el-input-number>
          <span style="margin-left: 10px;">次/人</span>
        </el-form-item>
        <el-form-item  label="统一售价：" label-width="130px" v-if="dislogFormData.product">
          <el-input-number v-model="dislogFormData.price" disabled></el-input-number>
          <span style="margin-left: 10px;">元/人</span>
        </el-form-item>
        <el-form-item label="最低价：" label-width="130px" v-if="dislogFormData.product">
          <el-input-number v-model="dislogFormData.lowPrice" disabled></el-input-number>
          <span style="margin-left: 10px;">元/人</span>
        </el-form-item>
        <el-form-item label="产品名称：" label-width="130px" prop="name">
          <el-input style="width: 200px;" v-model="dislogFormData.name" maxlength="20" placeholder="请输入产品名称"></el-input>
        </el-form-item>
        <div  v-if="dislogFormData.product">
          <span style="display: inline-block;margin-left: 66px;vertical-align: top;">产品权益：</span>
          <div style="display: inline-block;vertical-align: top;margin-bottom: 20px;padding: 0 20px;">
            <div v-for="(item, index) in rightsList" :key="item.id" class="first-item">
              <span style="margin-bottom: 10px;display: inline-block;">权益{{ index + 1 }}</span>
              <el-form-item  label="名称:" label-width="50px">
                <el-input style="width: 200px;" v-model="item.title" maxlength="10" placeholder="请输入权益名称"  />
              </el-form-item>
              <el-form-item  label="简介:" label-width="50px">
                <el-input style="width: 300px;" v-model="item.info" maxlength="20" placeholder="请输入权益简介"  />
                <span class="del" @click="deleteRight(item, index)" v-if="rightsList.length > 0">删除</span>
              </el-form-item>
            </div>
          </div>
          <div class="add"  @click="addRight">+点击添加权益</div>
        </div>
        <el-form-item label="折扣价：" label-width="130px" prop="discountedPrice" v-if="dislogFormData.product">
          <el-input-number style="width: 200px;" v-model="dislogFormData.discountedPrice" :min="dislogFormData.lowPrice" placeholder="请输入折扣价" @change="discountPrice"></el-input-number>
        </el-form-item>
        <el-form-item label="服务费：" label-width="130px">
          <el-input-number style="width: 200px;" v-model="dislogFormData.serviceFee" :min="0" placeholder="请输入服务费" @change="serviceFeeChange"></el-input-number>
        </el-form-item>
        <el-form-item label="会员价：" label-width="130px">
          <el-input-number style="width: 200px;" v-model="dislogFormData.memberPrice" placeholder="请输入会员价" disabled></el-input-number>
        </el-form-item>
        <el-form-item label="划线价：" label-width="130px">
          <el-input-number style="width: 200px;" v-model="dislogFormData.originalPrice" :min="0" placeholder="请输入划线价"></el-input-number>
        </el-form-item>
        <el-form-item label="付费码失效时间：" label-width="140px" prop="time">
           <el-date-picker
            type="date"
            style="width: 190px;"
            v-model="dislogFormData.time"
            placeholder="请选择失效时间">
        </el-date-picker>
        </el-form-item>
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
        <el-form-item label="付费码可用班级：" label-width="150px" prop="teacher">
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
            <div v-for="(item, index) in classList" :key="index">
              <span>{{item.name}}：</span>
              <div v-if="item.list.length > 0"  @click.stop>
                <div v-for="iItem in item.list" :key="iItem.class_id" style="display: inline-block;border:1px solid #ccc;padding: 5px;margin-bottom: 10px;border-radius: 10px;margin-right: 10px;">
                  <el-checkbox v-model="iItem.isChecked" :value="iItem.class_id" name="type" :disabled="iItem.student_nums === 0 ? true: false" @change="classChange">
                    {{iItem.class_name}}
                  </el-checkbox> 
                </div>
              </div>
              <span v-else>暂无班级</span>
            </div>
          </div>
          <span v-else>暂无班级</span>
        </el-form-item>
        <div style="height: 1px;border-bottom: 1px solid #ccc;margin-bottom: 10px;"></div>
        <el-form-item label="URL地址：" prop="url" label-width="130px">
          <el-input style="width: 200px;" v-model="dislogFormData.url" maxlength="20" placeholder="请输入URL地址"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" style="margin-left: 50px;margin-bottom: 10px;" @click="generate" :loading="loading3" :disabled="loading3">生成付费码</el-button>
      <el-table :data="payCodeList" v-loading="loading3" class="table-info" header-cell-class-name="header_row_class" style="width: 100%" stripe element-loading-text="拼命加载中，主人请稍后..." :max-height="screenHeight" ref="tableRef" >
        <el-table-column prop="product_name_class" label="产品名称_班级" min-width="120px" />
        <el-table-column label="班级付费二维码" min-width="200px">
          <template #default="scope">
            <img style="width: 150px;height: 150px;" :src="scope.row.qr_code" alt="">
          </template>
        </el-table-column>
        <el-table-column prop="pay_link" label="班级付费链接" min-width="200px" />
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
          <el-button type="primary" v-if="payCodeList.length > 0">批量下载付费码</el-button>
        </div>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useVocabularyStore } from '@/store/vocabulary';
import { useScreenHeight } from '@/hooks/useScreenHeight.js';
import { useOssImage } from '@/hooks/useOssImage.js';
import AiAgentMemebers from '@/service/AiAgentMemebers.js';
import { ElMessage } from 'element-plus'
const vocabularyStore = useVocabularyStore();
const { screenHeight } = useScreenHeight();
const { getOssImageUrl } = useOssImage()


let formData = reactive({
  product: '', // 产品
  distributor: '', // 产品类型
  cycle: '', // 付费周期
  status: '', // 状态
  user: '', // 创建人
  date: '' // 创建时间
}) // 表单内容
const productList = ref([]) // 选择产品列表
let list = ref([]) // 表格数据
let loading = ref(false) // 加载标记
let total = ref(0)
let pageIndex = ref(1)
let pageSize = ref(10)
let visible = ref(false)
let formRef = ref(null)
let statusList = ref([ // 状态
  {
    id: 0,
    title: '全部'
  },
  {
    id: 1,
    title: '未失效'
  },
  {
    id: 2,
    title: '已失效'
  }
])
let productType = ref([ // 产品类型
  {
    id: 1,
    title: '作文批改'
  }
])
let cycleList = ref([]) // 付费周期
let dislogFormData = reactive({
  product: '', // 产品
  type: '' , // 类型
  cycle: '', // 周期
  num: 0, //次数
  price: '', // 统一售价
  lowPrice: '', // 最低价
  name: '', // 产品名称
  discountedPrice: 0, // 折扣价
  serviceFee: 0, // 服务费
  memberPrice: 0, // 会员价
  originalPrice: 0, // 划线价
  time: '', // 付费码失效时间
  distributor: '', // 所属经销商
  province: '' , // 省
  city: '', // 市
  district: '', // 区县
  school: '', // 学校
  teacher: [], // 老师
  url: '' // url地址
}) // 弹窗表单
let rules = ref({
  product: [
    { required: true, message: '请选择产品', trigger: 'change' }
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
  distributor: [
    { required: true, message: '输入经销商名字', trigger: 'change'}
  ],
  school: [
    { required: true, message: '请选择学校名字', trigger: 'change'}
  ],
  teacher: [
    { type: 'array', required: true, message: '请选择老师', trigger: 'change'}
  ],
  url: [
    { required: true, message: '请输入URL地址', trigger: 'blur' }
  ]
});
// 动态权益组数据（响应式数组）
let rightsList = ref([]);
let distributorsList = ref([]) // 经销商列表
let provinceList = ref([]) // 新增弹窗省列表数据
let cityList = ref([]) // 新增弹窗市列表数据
let countyList = ref([]) // 新增弹窗区县列表
let teacherList = ref([]) // 新增弹窗教师列表
let schoolList = ref([]) // 学校列表
let classList = ref([]) // 新增弹窗教师下班级列表
let distributorName = ref('') // 新增弹窗经销商输入的值
let payCodeList = ref([]) // 弹窗表格数据列表
let loading3 = ref(false)

onMounted(() => {
  // 设置页面展示高度
  window.addEventListener('resize', updateScreenHeight)
  updateScreenHeight()
  // 获取选择产品下拉框数据
  getProductList()
  // 付费周期
  getProductCycleList()
  // 经销商列表
  initMemberList()
  // 列表数据
  getList()
  dislogFormData.time = getDefaultExpiryDate()
})

// 获取默认失效日期（当前日期加30天）
const getDefaultExpiryDate = () => {
  const date = new Date()
  date.setDate(date.getDate() + 30)
  return date.toISOString().split('T')[0]
}

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


// 列表
const getList = () => {
  loading.value = true
  let params = {
    user_name: vocabularyStore.user_name,
    session: vocabularyStore.session,
    cycle: formData.cycle, // 付费周期
    end_time: formData.date.length > 0 ? formData.date[1] : '', // 结束时间
    name: formData.user, // 创建人
    enable: formData.status ? formData.status : 2, // 状态
    title: formData.product, // 产品名称
    start_time: formData.date.length > 0 ? formData.date[0] : '', // 开始时间
    type: formData.distributor ? formData.distributor : 1, // 产品类型
    page_index: pageIndex.value, // 当前页
    page_size: pageSize.value, // 分页大小
  }
  return AiAgentMemebers.getCodePayList(params)
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
  getList()
} 

// 重置
const onReset = () => {
  formData.product = '', // 产品
  formData.distributor = '', // 产品类型
  formData.cycle = '', // 付费周期
  formData.status = '', // 状态
  formData.user = '', // 创建人
  formData.date = '' // 创建时间
  getList()
}

// 新增
const onAdd = () => {
  visible.value = true
}

// 查看
const check = () => {
  
}

// 新增权益组
const addRight = () => {
  rightsList.value.push({
    title: '',
    info: '',
    id: 0
  });
}

// 获取选择产品下拉框数据
const getProductList = () => {
  let params = {
    user_name: vocabularyStore.user_name,
    session: vocabularyStore.session,
  }
  return AiAgentMemebers.getProductList(params)
    .then((res) => {
      if (res.result_code === 200) {
        productList.value = res.data
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
    })
}

// 根据id获取产品类型标题
const getProductTypeTitle = (id) => {
  const type = productType.value && id ? productType.value.find(item => item.id === id) : ''
  return type ? type.title : id
}

// 根据cycle值获取付费周期标题
const getCycleTitle = (cycleValue) => {
  const cycle = cycleList.value.find(item => item.item_value === cycleValue.toString())
  return cycle ? cycle.item_name : cycleValue
}

// 付费周期
const getProductCycleList = () => {
  let params = {
    user_name: vocabularyStore.user_name,
    session: vocabularyStore.session
  }
  return AiAgentMemebers.getProductCycleList(params)
    .then((res) => {
      if (res.result_code === 200) {
        cycleList.value = res.data
      } else {
        ElMessage({
          message: '获取付费周期失败',
          type: 'error',
          duration: 3000
        })
      }
    })
    .catch((error) => {
      console.log(error)
    })
    .finally(() => {
    })
}

// 获取权益列表
const getAllRightsList = (type) => {
  let params = {
    user_name: vocabularyStore.user_name,
    session: vocabularyStore.session,
    type: type // 产品类型
  }
  return AiAgentMemebers.allRightList(params)
    .then((res) => {
      if (res.result_code === 200) {
        if (res.data.length > 0) {
        rightsList.value = res.data
        } else {
          rightsList.value = [
            {
              id: 0,
              info: '',
              title: ''
            },
            {
              id: 0,
              info: '',
              title: ''
            },
          ]
        }
      } else {
        ElMessage({
          message: '获取权益列表失败',
          type: 'error',
          duration: 3000
        })
      }
    })
    .catch((error) => {
      console.log(error)
    })
    .finally(() => {
    })
}

// 删除权益组
const deleteRight = (item, index) => {
  if (item.id) {
    let params = {
      user_name: vocabularyStore.user_name,
      session: vocabularyStore.session,
      id: item.id // 产品类型
    }
    AiAgentMemebers.delRights(params)
    .then((res) => {
      if (res.result_code === 200) {
        ElMessage({
          message: '删除成功',
          type: 'success',
          duration: 3000
        })
        getAllRightsList(dislogFormData.type)
      } else {
        ElMessage({
          message: '删除产品配置失败',
          type: 'error',
          duration: 3000
        })
      }
    })
    .catch((error) => {
      console.log(error)
    })
    .finally(() => {
    })
  } else {
    rightsList.value.splice(index, 1);
  }
} 

// 新增选择产品下拉框change事件
const changeProduct = (option) => {
  // 循环productList数组，找到与option匹配的对象
  const selectedProduct = productList.value.find(item => item.id === option)
  if (selectedProduct) {
    // 将匹配对象的属性赋值给dislogFormData对应的字段
    dislogFormData.type = selectedProduct.type || ''
    // dislogFormData.product = selectedProduct.cycle.toString() || ''
    dislogFormData.cycle =  selectedProduct.cycle.toString() || ''
    dislogFormData.num = selectedProduct.num || 0
    dislogFormData.price = selectedProduct.price / 100  || ''
    dislogFormData.lowPrice = Number(selectedProduct.min_price / 100)  || ''
    dislogFormData.discountedPrice = selectedProduct.min_price / 100  || ''
    dislogFormData.memberPrice = (selectedProduct.min_price / 100) +  dislogFormData.serviceFee || ''
    getAllRightsList(dislogFormData.type)
  }
}

// 新增折扣价change
const discountPrice = (value) => {
 dislogFormData.memberPrice = dislogFormData.serviceFee +value
}

// 新增服务费change
const serviceFeeChange = (value) => {
  console.log('服务费', value)
  dislogFormData.memberPrice = value + dislogFormData.discountedPrice
}

// 获取经销商数据
const initMemberList = () => {
  let params = {
    user_name: vocabularyStore.user_name,
    session: vocabularyStore.session
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
    })
}

// 获取学校数据
const getSchool = () => {
  let params = {
    user_name: vocabularyStore.user_name,
    session: vocabularyStore.session,
    distributor_id: dislogFormData.distributor,
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
    })
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


// 生成付费码
const generate = async () => {
  if (!formRef.value) return
  try {
    const valid = await formRef.value.validate()
    if (valid) {
      if (rightsList.value.length > 0) {
        const hasEmptyItem = rightsList.value.some(item => { 
          const nameIsEmpty = !item.title?.trim()
          return nameIsEmpty
        });
        if (hasEmptyItem) {
          ElMessage.error('请完善所有权益名称和简介')
          return;
        }
      }
      // 检查是否至少选择了一个班级
      const hasSelectedClass = classList.value.some(teacher => 
        teacher.list.some(cls => cls.isChecked)
      )
      
      if (!hasSelectedClass) {
        ElMessage.error('至少选择一个班级')
        return
      }
       // 处理班级数据，构建符合要求的数据结构
      const classData = classList.value.map(teacher => ({
        teacher_id: teacher.id,
        teacher_code: teacher.teacherCode,
        class: teacher.list
          .filter(classItem => classItem.isChecked)
          .map(classItem => classItem.class_id)
      }));
      let params = {
        user_name: vocabularyStore.user_name,
        session: vocabularyStore.session,
        city_id: dislogFormData.city,
        class_json: JSON.stringify(classData), // 班级id和学生id
        county_id: dislogFormData.district,
        disabled_time: dislogFormData.time,
        discount_price: dislogFormData.discountedPrice * 100,
        distributor_id: dislogFormData.distributor,
        list_price: dislogFormData.originalPrice * 100,
        product_id: dislogFormData.product,
        product_name: dislogFormData.name,
        province_id: dislogFormData.province,
        rights_json: JSON.stringify(rightsList.value),
        school_id: dislogFormData.school,
        teacher_json: JSON.stringify(dislogFormData.teacher),
        url_path: dislogFormData.url,
        service_price: dislogFormData.serviceFee * 100
      }
      loading3.value = true
      AiAgentMemebers.payAdd(params)
        .then(async (res) => {
          if (res.result_code === 200) {
            if (res.pay_code_list.length > 0) {
              const qrCodeUrls = await Promise.all(
                res.pay_code_list.map(item => getOssImageUrl(item.qr_code, 'composition-pay'))
              );
              
              const processedList = res.pay_code_list.map((item, index) => ({
                ...item,
                qr_code: qrCodeUrls[index]
              }));
              payCodeList.value = processedList;
            }
            loading3.value = false
          } else {
            ElMessage({
              message: '新增失败',
              type: 'error',
              duration: 1000
            })
          }
        })
        .catch((error) => {
          console.log(error)
          loading3.value = false
        })
        .finally(() => {
          loading3.value = false
        })
    }
  } catch (error) {
    console.log('表单验证失败', error)
  }
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
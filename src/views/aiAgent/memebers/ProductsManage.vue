<template>
  <div class="page define-page">
    <div class="page-title" id="page-title">
      <h4>产品配置</h4>
    </div>
    <div class="content-box">
      <el-form :inline="true" id="form" :model="formData" size="large" label-width="90px" @submit.prevent>
        <el-form-item label="产品：" label-width="130px">
          <el-input class="search-input" clearable placeholder="请输入产品名称" v-model="formData.product"></el-input>
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
          <el-input class="search-input" clearable placeholder="请输入创建人" v-model="formData.user"></el-input>
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
        <el-table-column prop="id" label="产品ID" min-width="120px" />
        <el-table-column prop="title" label="产品" min-width="100px" />
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
        <el-table-column prop="price" label="统一售价(元/人)"  min-width="140px"  />
        <el-table-column prop="min_price" label="最低价(元/人)"  min-width="140px" />
        <!-- <el-table-column prop="enable" label="状态"  min-width="140px" /> -->
        <el-table-column label="状态" min-width >
          <template #default="scope">
            <div>{{ getEnable(scope.row.enable) }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="maker" label="创建人" min-width="120" />
        <el-table-column prop="maker_date" label="创建时间"  min-width="140px" />
        <el-table-column label="操作" fixed="right"  min-width="180px">
          <template #default="scope">
            <el-button class="button-style" link type="primary" @click="check(scope.row)">
              查看
            </el-button>
            <el-button class="button-style" link type="primary" @click="update(scope.row)" :disabled="getEnable(scope.row.enable) === '启用' ? true : false">
              修改
            </el-button>
            <el-button class="button-style" link type="primary" @click="status(scope.row)">
              {{ getEnable(scope.row.enable) === '启用' ? '禁用' : '启用'  }}
            </el-button>
            <el-button class="button-style" link type="primary" @click="del(scope.row)">
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
      <div class="marginBottom">产品：{{ currentMsg.title }}</div>
      <div class="marginBottom">产品类型：{{ getProductTypeTitle(currentMsg.type) }}</div>
      <div class="marginBottom">付费周期：{{ getCycleTitle(currentMsg.cycle) }}</div>
      <div class="marginBottom">次数：{{ currentMsg.num }}次/人</div>
      <div class="marginBottom">统一售价：{{ currentMsg.price }}元/人</div>
      <div class="marginBottom">最低价：{{ currentMsg.min_price }}元/人</div>
      <div class="marginBottom">上下架：{{ getEnable(currentMsg.enable) }}</div>
    </div>
  </el-dialog>
  <el-dialog v-model="visible" :title="type === 0 ? '新增' : '修改'" width="600" :close-on-click-modal="false" append-to-body :destroy-on-close="true">
     <el-form ref="formRef" id="form" :model="dislogFormData" size="large" label-width="150px" :rules="rules">
      <el-form-item label="产品：" label-width="130px" prop="product">
        <el-input style="width: 200px;" v-model="dislogFormData.product" maxlength="20"></el-input>
      </el-form-item>
      <el-form-item label="产品类型：" label-width="130px" prop="type">
        <el-radio-group v-model="dislogFormData.type">
          <el-radio v-for="(item, index) in productType" :key="index" :label="item.id">{{ item.title }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="付费周期：" label-width="130px" prop="cycle">
        <el-select
            style="width: 200px;"
            placeholder="请选择付费周期"
            clearable
            v-model="dislogFormData.cycle"
          >
            <el-option v-for="item in cycleList" :key="item.item_value" :label="item.item_name" :value="item.item_value"></el-option>
          </el-select>
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
        <el-radio-group v-model="dislogFormData.status" :disabled="type === 0 ? false : true">
          <el-radio :label="1">启用</el-radio>
          <el-radio :label="0">禁用</el-radio>
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
import { ref, reactive, onMounted } from 'vue'
import { useScreenHeight } from '@/hooks/useScreenHeight.js';
import AiAgentMemebers from '@/service/AiAgentMemebers.js';
import { useVocabularyStore } from '@/store/vocabulary';
import { ElMessage, ElMessageBox } from 'element-plus'
const vocabularyStore = useVocabularyStore();
const { screenHeight } = useScreenHeight();

let formData = reactive({
  product: '', // 产品
  distributor: 1, // 产品类型
  cycle: '', // 付费周期
  status: 2, // 状态
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
let dislogFormData = reactive({
  id: 0,
  product: '', // 产品
  type: '' , // 类型
  cycle: '', // 周期
  num: 0, //次数
  price: '', // 统一售价
  lowPrice: '', // 最低价
  status: '' // 上下架
}) // 弹窗表单
let rules = ref({
  product: [
    { required: true, message: '请输入产品', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择产品类型', trigger: 'change', }
  ],
  cycle: [
    { required: true, message: '请选择付费周期', trigger: 'change' }
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
    { required: true, message: '请选择产品状态', trigger: 'change'}
  ],
});
let cycleList = ref([]) // 付费周期
let statusList = ref([ // 状态
  {
    id: 2,
    title: '全部'
  },
  {
    id: 1,
    title: '启用'
  },
  {
    id: 0,
    title: '禁用'
  }
])
let productType = ref([ // 产品类型
  {
    id: 1,
    title: '作文批改'
  }
])
let currentMsg = reactive(null) // 当前产品配置详情

onMounted(() => {
  // 设置页面展示高度
  window.addEventListener('resize', updateScreenHeight)
  updateScreenHeight()
  // 付费周期
  getProductCycleList()
  // 列表数据
  getList()
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
      loading.value = false
    })
}

// 获取表格数据
const getList = () => {
  loading.value = true
  let params = {
    user_name: vocabularyStore.user_name,
    session: vocabularyStore.session,
    cycle: formData.cycle, // 付费周期
    enable: formData.status ? formData.status : 2, // 状态
    end_time: formData.date.length > 0 ? formData.date[1] : '', // 结束时间
    name: formData.user, // 创建人
    start_time: formData.date.length > 0 ? formData.date[0] : '', // 开始时间
    title: formData.product, // 产品名称
    type: formData.distributor ? formData.distributor : 1, // 产品类型
    page_index: pageIndex.value, // 当前页
    page_size: pageSize.value, // 分页大小
  }
  return AiAgentMemebers.getProductList(params)
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

// 根据id获取产品类型标题
const getProductTypeTitle = (id) => {
  const type = productType.value.find(item => item.id === id)
  return type ? type.title : id
}

// 根据cycle值获取付费周期标题
const getCycleTitle = (cycleValue) => {
  const cycle = cycleList.value.find(item => item.item_value === cycleValue.toString())
  return cycle ? cycle.item_name : cycleValue
}

// 根据enable值获取付费周期标题
const getEnable = (id) => {
  const enable = statusList.value.find(item => item.id === id)
  return enable ? enable.title : id
}

// 查询
const onSubmit = () => {
  getList()
} 

// 重置
const onReset = () => {
  formData.product = ''
  formData.distributor = 1
  formData.cycle = ''
  formData.status = 2
  formData.user = ''
  formData.date = []
  pageIndex.value = 1
  pageSize.value = 10
  getList()
} 

// 新增
const onAdd = () => {
  type.value = 0
  visible.value = true
  currentMsg = null
  dislogFormData.product = ''
  dislogFormData.type = ''
  dislogFormData.cycle = ''
  dislogFormData.num = ''
  dislogFormData.price = ''
  dislogFormData.lowPrice = ''
  dislogFormData.status = ''
  dislogFormData.id = 0
}

// 查看
const check = (option) => {
  let params = {
    user_name: vocabularyStore.user_name,
    session: vocabularyStore.session,
    id: option.id
  }
  return AiAgentMemebers.getProductDetail(params)
    .then((res) => {
      if (res.result_code === 200) {
        currentMsg = res.data
        checkVisible.value = true
      } else {
        ElMessage({
          message: '获取产品配置详情失败',
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

// 修改
const update = (option) => {
  type.value = 1
  visible.value = true
  currentMsg = option
  dislogFormData.product = option.title
  dislogFormData.type = option.type
  dislogFormData.cycle = option.cycle.toString()
  dislogFormData.num = option.num
  dislogFormData.price = option.price
  dislogFormData.lowPrice = option.min_price
  dislogFormData.status = option.enable
  dislogFormData.id = (type.value === 0 ? 0 : currentMsg.id)
}

// 启用/禁用
const status = (option) => {
  let params = {
    user_name: vocabularyStore.user_name,
    session: vocabularyStore.session,
    id: option.id,
    action: option.enable === 1 ? 0 : 1,
    type: 0
  }
  return AiAgentMemebers.productAction(params)
    .then((res) => {
      if (res.result_code === 200) {
        if (option.enable === 1) {
          ElMessage({
            message: '产品禁用成功!',
            type: 'success',
            duration: 3000
          })
        } else {
          ElMessage({
            message: '产品启用成功!',
            type: 'success',
            duration: 3000
          })
        }
        getList()
      } else {
        ElMessage({
          message: '产品状态配置失败',
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

// 删除
const del = (option) => {
  let params = {
    user_name: vocabularyStore.user_name,
    session: vocabularyStore.session,
    id: option.id,
    action: 2,
    type: 1
  }
  ElMessageBox.confirm('确定将该条数据删除吗？', '提示信息', {
    confirmButtonText: '确定',
    confirmButtonClass: 'button-confirm',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    return AiAgentMemebers.productAction(params)
    .then((res) => {
      if (res.result_code === 200) {
        ElMessage({
          message: '删除成功',
          type: 'success',
          duration: 3000
        })
        getList()
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
      loading.value = false
    })
  }).catch(() => {
  })
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
      let params = {
            user_name: vocabularyStore.user_name,
            session: vocabularyStore.session,
            cycle: dislogFormData.cycle,// 付费周期
            enable: dislogFormData.status,// 上下架 0禁用 1启用
            id: dislogFormData.id,
            min_price: dislogFormData.lowPrice,// 最低价
            num: dislogFormData.num,// 次数
            price: dislogFormData.price,// 统一售价
            title: dislogFormData.product,// 产品名称
            type: dislogFormData.type// 产品类型
          }
          AiAgentMemebers.productEdit(params)
          .then((res) => {
            if (res.result_code === 200) {
              if (type.value === 0) {
                ElMessage({
                  message: '新增成功',
                  type: 'success',
                  duration: 1000
                })
              } else {
                ElMessage({
                  message: '修改成功',
                  type: 'success',
                  duration: 1000
                })
              }
              close()
              getList()
            } else {
              ElMessage({
                message: '失败',
                type: 'error',
                duration: 1000
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
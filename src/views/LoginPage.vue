<template>
  <div class="login" style="overflow-y: hidden;">
    <div class="login-form_info">
      <img src="../assets/images/login-left.png" >
      <div class="login-right">
        <div class="login-top">
          <img src="../assets/images/logo-icon.png" alt="">
          <div>维词听力运营管理后台</div>
        </div>
        <div class="title">高中版</div>
        <el-form ref="loginFormref"  @submit.prevent :model="loginForm" :rules="rules">
          <el-form-item prop="user_phone" >
            <el-input size="large"  @input="inputValue"  maxlength="11"  :autofocus="true" style="line-height: 20px;" v-model="loginForm.user_phone" placeholder="请输入账号">
              <template #prefix>
                <img src="../assets/images/user.png" alt="">
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="pwd">
            <el-input type="password" size="large" @keyup.enter="login" v-model="loginForm.pwd" placeholder="请输入密码">
              <template #prefix>
                <img src="../assets/images/pwd.png" alt="">
              </template>
            </el-input>
          </el-form-item>
          <el-form-item style="margin-top: 54px;">
            <a href="javascript:;" @click="login" class="login-Btn">登录</a>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { ref, onMounted, toRefs ,reactive } from 'vue';
  import { useRouter } from 'vue-router';
  import md5 from 'js-md5';
  import IndexService from '@/service/IndexService';
  import { ElMessage ,ElLoading} from 'element-plus'

  import { useVocabularyStore } from '@/store/vocabulary';
  let vocabularyStore = useVocabularyStore();
  let loginFormref = ref()
  let loginForm = reactive({
    user_phone: '',
    pwd: ''
  });
  let rules = ref({
    user_phone: [
      { required: true, message: '请输入账号！', trigger: 'blur' }
    ],
    pwd: [
      { required: true, message: '密码不能为空！', trigger: 'blur' }
    ]
  });
  let user_phone_copy = ref('');
  const router = useRouter();
  function inputValue(value) {
    user_phone_copy.value = value
    // console.log(value)
  }
  // 登录
  function  login () {
    // 密码登录
    loginFormref.value.validate((valid) => {
      if (valid) {
        const loading = ElLoading.service({
          lock: true,
          text: '登录中...',
          background: 'rgba(0, 0, 0, 0.7)',
        })
        let loginFormRef = toRefs(loginForm)
        IndexService.login(user_phone_copy.value, md5(loginFormRef.pwd.value)).then((res) => {
            let resultCode = res.result_code
            if (resultCode === 200) {
              loading.close()
              vocabularyStore.setUserName(user_phone_copy.value)
              vocabularyStore.setSession(res.session)
              
              sessionStorage.setItem('user_name', user_phone_copy.value)
              sessionStorage.setItem('session', res.session)
              // vocabularyStore.setBookVersion(res.book_version)
              initTree(user_phone_copy.value, res.session)
              // console.log(sessionStorage.getItem('defaultPath'))
            } else {
              loading.close()
              initResultCode(res.description)
            }
            loading.close()
        }).catch(function (error) {
          console.log(error)
          loading.close()
        });
          loading.close()
      } else {
        return false
      }
    })
  }
      
  // 登录接口的错误提示
  function  initResultCode (description) {
    ElMessage({
      message: description,
      type: 'error'
    })
  }
  function initTree (user_name, session) {
    IndexService.accountMenu(user_name, session).then((res) => {
      if (res.result_code === 200) {
        if (res.menu.length) {
          // let defaultPath = res.menu[0].children[0].path // 默认跳转的路由
          sessionStorage.setItem('defaultPath', '/home')
          // sessionStorage.setItem('defaultPath', defaultPath)
        }
        // console.log(res.menu.length)
        if (res.menu.length === 0) {
          ElMessage({
            message: "该用户暂无任何查看权限",
            type: "error",
            duration: 1000
          });
          return
        }
        setTimeout(() => {
          router.push({
            path: sessionStorage.getItem('defaultPath')
          })
        }, 100)
        // console.log(defaultPath)
      }
      // console.log(res)
    }).catch((error) => {
      console.log(error)
    })
  }
  // 计算属性
  onMounted(() => {
    loginForm.user_phone = sessionStorage.getItem('user_name') || ''
    user_phone_copy.value = loginForm.user_phone
  })
</script>
<style>
  .el-message-box__wrapper .el-message-box :deep(.el-message-box__title){
    width:95%;
  }
</style>

<style scoped>
  .login-Btn{
    width: 170px;
    height: 61px;
    background: linear-gradient( 180deg, #404248 0%, #404248 95%, #404248 100%);
    border-radius: 14px;
    text-align: center;
    line-height: 61px;
    color: #fff;
    display: inline-block;
    /* margin: 0 auto; */
    font-family: SourceHanSansCN, SourceHanSansCN;
    font-weight: 800;
    font-size: 26px;
    letter-spacing: 4px;
    font-style: normal;
  }
  :deep(.el-input--large .el-input__wrapper){
    border-radius: 14px;
    border: 3px solid #6084F4;
    height: 50px;
  }
  :deep(.el-form-item.is-error .el-input__wrapper, .el-form-item.is-error .el-input__wrapper.is-focus, .el-form-item.is-error .el-input__wrapper:focus, .el-form-item.is-error .el-input__wrapper:hover, .el-form-item.is-error .el-select__wrapper, .el-form-item.is-error .el-select__wrapper.is-focus, .el-form-item.is-error .el-select__wrapper:focus, .el-form-item.is-error .el-select__wrapper:hover, .el-form-item.is-error .el-textarea__inner, .el-form-item.is-error .el-textarea__inner.is-focus, .el-form-item.is-error .el-textarea__inner:focus, .el-form-item.is-error .el-textarea__inner:hover){
    border: 1px solid red !important;
  }
  :deep(.el-checkbox__input.is-checked+.el-checkbox__label){
    font-family: 'myPingFang';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;

    color: rgba(0, 0, 0, 0.88);
  }

  .login {
    padding: 60px 245px;
    /* margin: 0; */
    /* background-color: #f9f9f9; */
    height: 100%;
    max-height: 100%;
    background: url("../assets/images/logo-bg.png") no-repeat;
    background-size: 100% 100%; 
    box-sizing: border-box;
    -webkit-user-select: none;
  }

  .login-form_info {
    max-height: 100%;
    height: 100%;
    width: 100%;
    display: flex;
    padding:39px 68px;
    box-sizing: border-box;
    /* flex-direction: column; */
    justify-content: space-between;
    align-items: center;
    background: url("../assets/images/small-login-bg.png") no-repeat;
    background-size: 100% 100%;
    -webkit-user-select: none;
  }
  .login-right{
    width: 408px;
    height: 548px;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 38px;
    padding:41px 35px;
    box-sizing: border-box;
  }
  .login-top{
    display: flex;
    align-items: center;
    /* margin-top: 41px; */
    margin-bottom:55px;
  }
  .login-top div{
    font-family: SourceHanSansCN, SourceHanSansCN;
    font-weight: 800;
    font-size: 26px;
    color: #000000;
    line-height: 39px;
    letter-spacing: 4px;
    text-align: right;
    font-style: normal;
    margin-left:10px;
  }
  .title{
    width: 170px;
    height: 61px;
    background: linear-gradient( 180deg, #6084F4 0%, #6084F4 100%);
    border-radius: 14px;
    font-family: SourceHanSansCN, SourceHanSansCN;
    font-weight: 800;
    font-size: 26px;
    color: #FFFFFF;
    line-height: 61px;
    letter-spacing: 4px;
    text-align: center;
    font-style: normal;
    margin-bottom:87px;
  }
 .el-input__inner{
    font-family: SourceHanSansCN, SourceHanSansCN;
    font-weight: 500;
    font-size: 14px;
    color: #060606;
    line-height: 21px;
    letter-spacing: 2px;
    text-align: right;
    font-style: normal;
    color:red !important;
  }
</style>
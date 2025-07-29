<template>
    <div class="menu">
        <div class="menu-logo">
            <div style="display: flex;align-items: center;">
              <h3>维词AI听力训练营数据管理后台</h3>
                <!-- <img src="@/assets/logo.png"/> -->
                <el-icon color="#fff" size="25" v-if="expand"  @click="expandClick"><Expand /></el-icon>
                <el-icon color="#fff" size="25" v-else   @click="foldClick"><Fold /></el-icon>
            </div>
            <div class="menu-right">
                <div><b>{{vocabularyStore.user_name}}</b>,欢迎你</div>
                <div style="cursor: pointer;margin:0 20px;" @click="password">[修改密码]</div>
                <!-- <div>[切换用户]</div> -->
                <div style="cursor: pointer" @click="edit">[退出]</div>
            </div>
        </div>
        <el-dialog
            v-model="dialogVisible"
            title="修改密码"
            width="500"
            @close="handleClose"
        >
            <div>
                <el-form :inline="true" :model="pwdForm" :rules="pwdRules" ref="pwdFormRef" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="旧密码" prop="old_pwd">
                    <el-input type="password" v-model="pwdForm.old_pwd" placeholder="请输入旧密码"></el-input>
                    </el-form-item>
                    <el-form-item label="新密码" prop="new_pwd">
                        <el-input type="password" v-model="pwdForm.new_pwd" placeholder="请输入新密码"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="confirm_pwd">
                        <el-input type="password" v-model="pwdForm.confirm_pwd" placeholder="请输入确认密码"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="handleClose">取消</el-button>
                    <el-button type="primary" @click="savePassWord">
                    提交
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import { useVocabularyStore } from "@/store/vocabulary";
import { useRouter } from "vue-router";
import { ElMessage} from 'element-plus'
import md5 from 'js-md5';
import IndexService from '@/service/IndexService';
let vocabularyStore = useVocabularyStore();
let expand = ref(false);
const router = useRouter();
let dialogVisible = ref(false);
let pwdForm = reactive({
  new_pwd: "",
  old_pwd: "",
  confirm_pwd: ""
});
let pwdFormRef = ref(null);
let pwdRules = reactive({
  old_pwd: [{ required: true, validator: validatePass, trigger: "blur" }],
  new_pwd: [{ required: true, validator: validatePass, trigger: "blur" }],
  confirm_pwd: [{ required: true, validator: validatePass2, trigger: "blur" }]
});
var reg = new RegExp("^[A-Za-z0-9\u4e00-\u9fa5]+$");
function validatePass(rule, value, callback) {
  if (!reg.test(value)) {
    callback(new Error("请输入密码，只能是数字、英文"));
  } else {
    callback();
  }
}
function validatePass2(rule, value, callback) {
  if (!reg.test(value)) {
    callback(new Error("请再次输入密码，只能是数字、英文"));
  } else if (value !== pwdForm.new_pwd) {
    callback(new Error("两次输入密码不一致!"));
  } else {
    callback();
  }
}
onMounted(() => {
  expand.value = vocabularyStore.expandMenu;
});
function expandClick() {
  expand.value = !expand.value;
  vocabularyStore.setExpandMenu(false);
}
function foldClick() {
  expand.value = !expand.value;
  vocabularyStore.setExpandMenu(true);
}
function edit() {
  router.push({
    path: "/login"
  });
  sessionStorage.setItem('user_name', '')
  sessionStorage.setItem('session', '')
  sessionStorage.setItem('defaultPath', '')
  vocabularyStore.setUserName('')
  vocabularyStore.setSession('')
}
function password() {
  dialogVisible.value = true;
}
function handleClose() {
  dialogVisible.value = false;
  pwdFormRef.value.resetFields();
}
function savePassWord() {
  pwdFormRef.value.validate(valid => {
    if (valid) {
      IndexService.accountPassword(
        vocabularyStore.user_name,
        vocabularyStore.session,
        md5(pwdForm.old_pwd),
        md5(pwdForm.new_pwd),
        md5(pwdForm.confirm_pwd)
      )
        .then(res => {
          if (res.result_code === 200) {
            ElMessage({
              message: "修改成功",
              type: "success",
              duration: 1000
            });
            handleClose()
          } else if (res.result_code === 916) {
            ElMessage({
              message: res.description,
              type: "error",
              duration: 1000
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      return false;
    }
  });
}
</script>

<style scoped>
.menu {
  display: flex;
  flex-direction: row;
  align-items: center;
  background: linear-gradient(to bottom, #7cbd21 0%, #00b400 100%);
  height: 100%;
  color: #fff;
}

.menu .menu-logo {
  display: flex;
  padding: 0 20px;
  height: 100%;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  justify-content: space-between;
}

.menu .menu-logo img {
  display: inline-block;
  height: 50px;
  /* margin-left: 20px; */
}
.menu .menu-logo i {
  margin-left: 15px;
  line-height: 40px !important;
  display: inline-block;
}

/* .menu .menu-content {
        flex: 1;
        box-sizing: border-box;
    }

    .menu .menu-operation {
      margin-right: 15px;
      color: #FFFFFF;
    } */

.menu .menu-logo .el-icon {
  cursor: pointer;
}
.menu-right {
  display: flex;
  width: initial;
  align-items: center;
  justify-content: space-around;
}
</style>
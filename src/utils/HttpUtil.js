import router from '../router';

import axios from 'axios';
import {
  ElMessage
} from 'element-plus';
import qs from 'qs';
import sysConfig from '../config';

const service = axios.create({
  baseURL: sysConfig.BASE_URL,
  timeout: 6000000000,
  responseType: 'json',
  withCredentials: false, // 是否允许带cookie这些
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
  }
});

// POST传参序列化(添加请求拦截器)
service.interceptors.request.use(
  config => {
    // 在发送请求之前做某件事
    // 添加系统级参数
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        bound_id: sysConfig.BOUND_ID,
        app_id: sysConfig.APP_ID
      };
    } else if (config.method === 'post') {
      config.data = qs.stringify({
        ...config.data,
        bound_id: sysConfig.BOUND_ID,
        app_id: sysConfig.APP_ID
      });
    }
    return config;
  },
  error => {
    ElMessage({
      // 饿了么的消息弹窗组件,类似toast
      showClose: true,
      message: '网络错误，请检查您的网络是否通畅！',
      type: 'error',
      duration: 1000
    })
    return Promise.reject(error);
  }
)

// 返回状态判断(添加响应拦截器)
service.interceptors.response.use(
  res => {
    // console.log(res)
    // 对响应数据做些事
    if (res.data && res.data.result_code !== 200) {
      if (res.data.result_code === 911 || res.data.result_code === 400) {
        router.push({
          name: 'LoginPage'
        });
      }
    }
    return res;
  },
  error => {
    ElMessage({
      showClose: true,
      message: '网络错误，请检查您的网络是否通畅！',
      type: 'error',
      duration: 1000
    });
    // 返回 response 里的错误信息
    let errorInfo = error.data ? error.data.message : error.data;
    return Promise.reject(errorInfo);
  }
)

export default service

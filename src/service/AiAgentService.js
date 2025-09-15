import service from "../utils/HttpUtil";
import {
  aiAgentApi
} from './API';

function getCompositionList(params) {
  return new Promise((resolve, reject) => {
    service.get(aiAgentApi.getCompositionList, {
      params
    }).then(res => {
      if (res.status === 200) {
        resolve(res.data);
      } else reject(res);
    }).catch(err => {
      reject(err);
    });
  });
}
// 获取用户AI作文默认使用次数
function getUse(params) {
  return new Promise((resolve, reject) => {
    service.get(aiAgentApi.getUse, {
      params
    }).then(res => {
      if (res.status === 200) {
        resolve(res.data);
      } else reject(res);
    }).catch(err => {
      reject(err);
    });
  });
}
// 新增修改
function saveComposition(params) {
  return new Promise((resolve, reject) => {
    service.post(
      aiAgentApi.saveComposition,
      params
    ).then(res => {
      if (res.status === 200) resolve(res.data);
      else reject(res);
    }).catch(err => {
      reject(err);
    })
  });
}
function batchComposition(params) {
  return new Promise((resolve, reject) => {
    service.post(
      aiAgentApi.batchComposition,
      params
    ).then(res => {
      if (res.status === 200) resolve(res.data);
      else reject(res);
    }).catch(err => {
      reject(err);
    })
  });
}
// 删除
function getCompositionDetail(params) {
  return new Promise((resolve, reject) => {
    service.post(
      aiAgentApi.getCompositionDetail,
      params
    ).then(res => {
      if (res.status === 200) resolve(res.data);
      else reject(res);
    }).catch(err => {
      reject(err);
    })
  });
}

export default {
  getCompositionList,
  saveComposition,
  getUse,
  getCompositionDetail,
  batchComposition,
}

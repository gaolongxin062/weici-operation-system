import service from "../utils/HttpUtil";
import {
  MemberService,
} from './API';


function getProvincesList(params) {
  return new Promise((resolve, reject) => {
    service.get(MemberService.getProvincesList, {
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
function getCityList(params) {
  return new Promise((resolve, reject) => {
    service.get(MemberService.getCityList, {
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
function getCountyList(params) {
  return new Promise((resolve, reject) => {
    service.get(MemberService.getCountyList, {
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
function getTrialList(params) {
  return new Promise((resolve, reject) => {
    service.get(MemberService.getTrialList, {
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
function getTcList(params) {
  return new Promise((resolve, reject) => {
    service.get(MemberService.getTcList, {
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
function trialSave(params) {
  return new Promise((resolve, reject) => {
    service.post(
      basicApi.trialSave,
      params
    ).then(res => {
      if (res.status === 200) resolve(res.data);
      else reject(res);
    }).catch(err => {
      reject(err);
    })
  });
}
function trialRemove(params) {
  return new Promise((resolve, reject) => {
    service.post(
      basicApi.trialRemove,
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
  getProvincesList,
  getCityList,
  getCountyList,
  getTrialList,
  getTcList,
  trialSave,
  trialRemove,
}

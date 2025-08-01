import service from "../utils/HttpUtil";
import {
  wordRaceMemberApi,
  memberApi
} from './API';


function getProvincesList(params) {
  return new Promise((resolve, reject) => {
    service.get(wordRaceMemberApi.getProvincesList, {
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
    service.get(wordRaceMemberApi.getCityList, {
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
    service.get(wordRaceMemberApi.getCountyList, {
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
    service.get(wordRaceMemberApi.getTrialList, {
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

function getTeacherList(params) {
  return new Promise((resolve, reject) => {
    service.get(memberApi.getTeacherList, {
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
      wordRaceMemberApi.trialSave,
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
      wordRaceMemberApi.trialRemove,
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
  getTeacherList,
  trialSave,
  trialRemove,
}

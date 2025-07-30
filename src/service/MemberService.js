import service from "../utils/HttpUtil";
import {
  memberApi,
} from './API';


function getProvincesList(params) {
  return new Promise((resolve, reject) => {
    console.log('params', params)
    service.get(memberApi.getProvincesList, {
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
    service.get(memberApi.getCityList, {
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
    service.get(memberApi.getCountyList, {
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
    service.get(memberApi.getTrialList, {
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
    service.get(memberApi.getTcList, {
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
      memberApi.trialSave,
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
      memberApi.trialRemove,
      params
    ).then(res => {
      if (res.status === 200) resolve(res.data);
      else reject(res);
    }).catch(err => {
      reject(err);
    })
  });
}
function removeStudentMember(params) {
  return new Promise((resolve, reject) => {
    service.post(
      memberApi.removeStudentMember,
      params
    ).then(res => {
      if (res.status === 200) resolve(res.data);
      else reject(res);
    }).catch(err => {
      reject(err);
    })
  });
}
function saveStudentMember(params) {
  return new Promise((resolve, reject) => {
    service.post(
      memberApi.saveStudentMember,
      params
    ).then(res => {
      if (res.status === 200) resolve(res.data);
      else reject(res);
    }).catch(err => {
      reject(err);
    })
  });
}
function studentMemberList(params) {
  return new Promise((resolve, reject) => {
    service.get(memberApi.studentMemberList, {
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

export default {
  getProvincesList,
  getCityList,
  getCountyList,
  getTrialList,
  getTcList,
  trialSave,
  trialRemove,
  removeStudentMember,
  saveStudentMember,
  studentMemberList
}

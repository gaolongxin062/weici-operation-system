import service from "../utils/HttpUtil";
import {
  reviewApi,
} from './API';
function getTeacherCheckList(params) {
  return new Promise((resolve, reject) => {
    service.get(reviewApi.getTeacherCheckList, {
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
function getAppList(params) {
  return new Promise((resolve, reject) => {
    service.get(reviewApi.getAppList, {
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
function getSchoolList(params) {
  return new Promise((resolve, reject) => {
    service.get(reviewApi.getSchoolList, {
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
function deleteTeacherCheck(params) {
  return new Promise((resolve, reject) => {
    service.post(
      reviewApi.deleteTeacherCheck,
      params
    ).then(res => {
      if (res.status === 200) resolve(res.data);
      else reject(res);
    }).catch(err => {
      reject(err);
    })
  });
}
function saveTeacherCheck(params) {
  return new Promise((resolve, reject) => {
    service.post(
      reviewApi.saveTeacherCheck,
      params
    ).then(res => {
      if (res.status === 200) resolve(res.data);
      else reject(res);
    }).catch(err => {
      reject(err);
    })
  });
}
function changeTeacherCheck(params) {
  return new Promise((resolve, reject) => {
    service.post(
      reviewApi.changeTeacherCheck,
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
  getTeacherCheckList,
  getAppList,
  getSchoolList,
  deleteTeacherCheck,
  saveTeacherCheck,
  changeTeacherCheck
}

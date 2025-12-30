import service from "../utils/HttpUtil";
import {
    teacherPowerApi
} from './API';

/**
 * 根据教师code获取学校信息
 * @param teacher_code 教师code
 * @param session session
 * @param user_name 账号
 * @param city_id 城市id
 * @param county_id 区县id
 * @param province_id 省份id
 * @param school_name 学校名称
 * @param page_index 页码
 * @param page_size 每页数量
 * @returns {Promise<Object>}
 */
const ApiGetAiUserList = (params) => {
  return new Promise((resolve, reject) => {
    service.get(teacherPowerApi.getAiUserList, {
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

/**
 * 停用或启用ai教师用户
 * @param id id
 * @param session session
 * @param user_name 账号
 * @param status 状态 0启用 1停用
 * @returns {Promise<Object>}
 */
const apiStopAiUser = (params) => {
  return new Promise((resolve, reject) => {
    service.post(
        teacherPowerApi.stopAiUser,
      params
    ).then(res => {
      if (res.status === 200) resolve(res.data);
      else reject(res);
    }).catch(err => {
      reject(err);
    })
  });
}

/**
 * 获取ai用户权限树
 * @param teacher_code 教师code
 * @param session session
 * @param user_name 账号
 * @param city_id 城市id
 * @param county_id 区县id
 * @param province_id 省份id
 * @param school_name 学校名称
 * @param page_index 页码
 * @param page_size 每页数量
 * @returns {Promise<Object>}
 */
const ApiAiUserRightTree = (params) => {
    return new Promise((resolve, reject) => {
      service.get(teacherPowerApi.aiUserRightTree, {
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

/**
 * 新增或编辑ai教师用户
 * @param city_id 城市id
 * @param county_id 区县id
 * @param province_id 省份id
 * @param school_id 学校id
 * @param teacher_codes 教师codes
 * @param session session
 * @param user_name 账号
 * @param right_end 权限末级
 * @param rights 权限
 * @param user_source  用户来源
 * @param id
 * @returns {Promise<Object>}
 */
const apiAddAiUser = (params) => {
return new Promise((resolve, reject) => {
    service.post(
        teacherPowerApi.addAiUser,
    params
    ).then(res => {
    if (res.status === 200) resolve(res.data);
    else reject(res);
    }).catch(err => {
    reject(err);
    })
});
}

/**
 * 获取ai教师用户详情
 * @param id 列表id
 * @param session session
 * @param user_name 账号
 * @returns {Promise<Object>}
 */
const ApiAiUserDetail = (params) => {
  return new Promise((resolve, reject) => {
    service.get(teacherPowerApi.getAiUserDetail, {
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
// function getUse(params) {
//   return new Promise((resolve, reject) => {
//     service.get(aiAgentApi.getUse, {
//       params
//     }).then(res => {
//       if (res.status === 200) {
//         resolve(res.data);
//       } else reject(res);
//     }).catch(err => {
//       reject(err);
//     });
//   });
// }
// // 新增修改
// function saveComposition(params) {
//   return new Promise((resolve, reject) => {
//     service.post(
//       aiAgentApi.saveComposition,
//       params
//     ).then(res => {
//       if (res.status === 200) resolve(res.data);
//       else reject(res);
//     }).catch(err => {
//       reject(err);
//     })
//   });
// }

export default {
    ApiGetAiUserList,
    apiStopAiUser,
    ApiAiUserRightTree,
    apiAddAiUser,
    ApiAiUserDetail
    // saveComposition,
    // getUse
  }
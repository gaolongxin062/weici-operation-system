import service from "../utils/HttpUtil";
import {
  aiAgentMemebersApi
} from './API';

// -----------------作文批改学生权益开通
/**
 * 经销商列表
 * @param session 
 * @param user_name 
 * @param distributor_name 经销商姓名  非
 * @param page_index 当前页  非
 * @param page_size 分页大小  非
 * @returns {Promise<unknown>}
 */
function getDistributors(params) {
  return new Promise((resolve, reject) => {
    service.get(aiAgentMemebersApi.getDistributors, {
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
 * 学校列表
 * @param session 
 * @param user_name 
 * @param distributor_id 经销商id
 * @param city_ids 市id,多个英文逗号分隔  非
 * @param county_ids 区县id，多个英文逗号分隔  非
 * @param province_ids 省id,多个英文逗号分隔  非
 * @param school 学校名称  非
 * @returns {Promise<unknown>}
 */
function getSchool(params) {
  return new Promise((resolve, reject) => {
    service.get(aiAgentMemebersApi.getSchool, {
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
 * 省列表
 * @param session 
 * @param user_name 
 * @param distributor_id 经销商id
 * @param page_index 
 * @param page_size 
 * @param province 省名称  非
 * @returns {Promise<unknown>}
 */
function getProvinceList(params) {
  return new Promise((resolve, reject) => {
    service.get(aiAgentMemebersApi.getProvinceList, {
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
 * 市列表
 * @param session 
 * @param user_name 
 * @param distributor_id 经销商id
 * @param page_index 
 * @param page_size 
 * @param city 市名称  非
 * @param province_ids 省id，多个英文逗号分隔
 * @returns {Promise<unknown>}
 */
function getCityList(params) {
  return new Promise((resolve, reject) => {
    service.get(aiAgentMemebersApi.getCityList, {
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
 * 区/县列表
 * @param session 
 * @param user_name 
 * @param distributor_id 经销商id
 * @param page_index 
 * @param page_size 
 * @param city_ids 市id,多个英文逗号分隔  非
 * @param province_ids 省id，多个英文逗号分隔
 * @returns {Promise<unknown>}
 */
function getCountyList(params) {
  return new Promise((resolve, reject) => {
    service.get(aiAgentMemebersApi.getCountyList, {
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
 * 老师列表
 * @param session 
 * @param user_name 
 * @param distributor_id 经销商id
 * @param page_index 
 * @param page_size 
 * @param city_ids 市id  非
 * @param county_id 区县id  非
 * @param ids 学校id  非
 * @param province_id 省id
 * @param phone 手机号或姓名
 * @param school 学校名称
 * @returns {Promise<unknown>}
 */
function getTeacher(params) {
  return new Promise((resolve, reject) => {
    service.get(aiAgentMemebersApi.getTeacher, {
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
 * 老师下的班级列表
 * @param session 
 * @param user_name
 * @param ids 教师id
 * @returns {Promise<unknown>}
 */
function getTeacherClass(params) {
  return new Promise((resolve, reject) => {
    service.get(aiAgentMemebersApi.getTeacherClass, {
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
 * 老师下的班级列表
 * @param session 
 * @param user_name
 * @param class_id 班级id
 * @returns {Promise<unknown>}
 */
function getClassStudent(params) {
  return new Promise((resolve, reject) => {
    service.get(aiAgentMemebersApi.getClassStudent, {
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
 * 学生权益列表
 * @param session 
 * @param user_name
 * @param distributor_id 经销商id
 * @param end_time 创建结束时间
 * @param maker 创建人名字
 * @param page_index 当前页
 * @param page_size 分页大小
 * @param school_id 学校id
 * @param start_time 创建开始时间
 * @returns {Promise<unknown>}
 */
function getUnifyPaylist(params) {
  return new Promise((resolve, reject) => {
    service.get(aiAgentMemebersApi.getUnifyPaylist, {
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
 * 学生权益详情
 * @param session 
 * @param user_name
 * @param id 学生权益id
 * @returns {Promise<unknown>}
 */
function getUnifyPayDetail(params) {
  return new Promise((resolve, reject) => {
    service.get(aiAgentMemebersApi.getUnifyPayDetail, {
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
 * 作废学生权益
 * @param session 
 * @param user_name
 * @param id 学生权益id
 * @returns {Promise<unknown>}
 */
function unifyPayDelete(params) {
  return new Promise((resolve, reject) => {
    service.post(aiAgentMemebersApi.unifyPayDelete, params).then(res => {
      if (res.status === 200) {
        resolve(res.data);
      } else reject(res);
    }).catch(err => {
      reject(err);
    });
  });
}


/**
 * 新增学生权益
 * @param session 
 * @param user_name
 * @param city_id 市id
 * @param class_json 班级id和学生id集合
 * @param count 次数(次/每人)
 * @param county_id 区县id
 * @param distributor_id 经销商id
 * @param end_time 结束时间
 * @param pay_money 收款金额
 * @param pay_number 付费人数(共选择的学生数)
 * @param province_id 省id
 * @param school_id 学校id
 * @param start_time 开始时间
 * @param teacher_json 教师id集合:[1,2,3]
 * @returns {Promise<unknown>}
 */
function addUnifyPay(params) {
  return new Promise((resolve, reject) => {
    service.post(aiAgentMemebersApi.addUnifyPay, params).then(res => {
      if (res.status === 200) {
        resolve(res.data);
      } else reject(res);
    }).catch(err => {
      reject(err);
    });
  });
}

// ------------------------ 产品配置

/**
 * 产品配置列表
 * @param session 
 * @param user_name
 * @param cycle 付费周期
 * @param enable 状态 0禁用 1启用 2全部
 * @param end_time 结束日期
 * @param name 创建人
 * @param start_time 开始时间
 * @param title 产品名称
 * @param type 产品类型
 * @param page_index 当前页
 * @param page_index 分页大小 
 * @returns {Promise<unknown>}
 */
function getProductList(params) {
  return new Promise((resolve, reject) => {
    service.get(aiAgentMemebersApi.getProductList, {
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
    getDistributors,
    getSchool,
    getProvinceList,
    getCityList,
    getCountyList,
    getTeacher,
    getTeacherClass,
    getClassStudent,
    getUnifyPaylist,
    getUnifyPayDetail,
    unifyPayDelete,
    addUnifyPay,
    getProductList
}

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
 * 付费周期
 * @param session 
 * @param user_name
 * @returns {Promise<unknown>}
 */
function getProductCycleList(params) {
  return new Promise((resolve, reject) => {
    service.get(aiAgentMemebersApi.getProductCycleList, {
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

/**
 * 产品配置详情
 * @param session 
 * @param user_name
 * @param id 
 * @returns {Promise<unknown>}
 */
function getProductDetail(params) {
  return new Promise((resolve, reject) => {
    service.get(aiAgentMemebersApi.getProductDetail, {
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
 * 产品配置详情
 * @param session 
 * @param user_name
 * @param action  0 禁用 1 启用 （删除不用传）
 * @param id
 * @param type 0启用/禁用   1删除
 * @returns {Promise<unknown>}
 */
function productAction(params) {
  return new Promise((resolve, reject) => {
    service.get(aiAgentMemebersApi.productAction, {
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
 * 新增学生权益
 * @param session 
 * @param user_name
 * @param cycle 付费周期
 * @param enable 上下架 0禁用 1启用
 * @param id 0新增，修改传id
 * @param min_price 最低价
 * @param num 次数
 * @param price 统一售价
 * @param title 产品名称
 * @param type 作文类型
 * @returns {Promise<unknown>}
 */
function productEdit(params) {
  return new Promise((resolve, reject) => {
    service.post(aiAgentMemebersApi.productEdit, params).then(res => {
      if (res.status === 200) {
        resolve(res.data);
      } else reject(res);
    }).catch(err => {
      reject(err);
    });
  });
}

/**
 * 用户权益列表
 * @param session 
 * @param user_name
 * @param end_time 结束时间
 * @param name 创建人
 * @param start_time 开始时间
 * @param type 产品类型(没选设置为0)
 * @param page_index 
 * @param page_size
 * @returns {Promise<unknown>}
 */
function getRightsList(params) {
  return new Promise((resolve, reject) => {
    service.get(aiAgentMemebersApi.getRightsList, {
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
 * 修改权益列表
 * @param session 
 * @param user_name
 * @param type 产品类型 1作文批改
 * @returns {Promise<unknown>}
 */
function allRightList(params) {
  return new Promise((resolve, reject) => {
    service.get(aiAgentMemebersApi.allRightList, {
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
 * 删除权益
 * @param session 
 * @param user_name
 * @param id 
 * @returns {Promise<unknown>}
 */
function delRights(params) {
  return new Promise((resolve, reject) => {
    service.post(aiAgentMemebersApi.delRights, params).then(res => {
      if (res.status === 200) {
        resolve(res.data);
      } else reject(res);
    }).catch(err => {
      reject(err);
    });
  });
}

/**
 * 保存用户权益
 * @param session 
 * @param user_name
 * @param data 权益内容（json数组 [{id,title,info}]）id没值传0
 * @param type 产品类型 1作文批改
 * @returns {Promise<unknown>}
 */
function saveRightsEdit(params) {
  return new Promise((resolve, reject) => {
    service.post(aiAgentMemebersApi.saveRightsEdit, params).then(res => {
      if (res.status === 200) {
        resolve(res.data);
      } else reject(res);
    }).catch(err => {
      reject(err);
    });
  });
}

/**
 * 新增班级购买记录
 * @param session 
 * @param user_name
 * @param city_id 市id
 * @param class_json 班级id和学生id集合:[{teacher_id:1,teacher_code:15572217971,class:[1,2,3]	
 * @param county_id 区县id
 * @param disabled_time 失效时间
 * @param discount_price 折扣价
 * @param distributor_id 经销商id
 * @param list_price 划线价
 * @param product_id 产品id
 * @param product_name 产品名称
 * @param province_id 省id
 * @param rights_json 产品权益集合:[{title:'名称1',info:'简介1'},{title:'名称2',info:'简介2'}]
 * @param school_id 学校id
 * @param teacher_json 教师id集合:[1,2,3]
 * @param url_path url地址
 * @param service_price 服务费
 * @returns {Promise<unknown>}
 */
function payAdd(params) {
  return new Promise((resolve, reject) => {
    service.post(aiAgentMemebersApi.payAdd, params).then(res => {
      if (res.status === 200) {
        resolve(res.data);
      } else reject(res);
    }).catch(err => {
      reject(err);
    });
  });
}

/**
 * 付费码列表
 * @param session 
 * @param user_name
 * @param cycle 付费周期 (1半年，2一年，3两年，4三年)
 * @param name 创建人
 * @param end_time 结束时间
 * @param end_time 开始时间
 * @param product_name 产品名称
 * @param state 状态 全部 1未失效 2已失效
 * @param type 产品类型 1作文批改
 * @param page_index 
 * @param page_size
 * @returns {Promise<unknown>}
 */
function getCodePayList(params) {
  return new Promise((resolve, reject) => {
    service.get(aiAgentMemebersApi.getCodePayList, {
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
 * 付费码详情
 * @param session 
 * @param user_name
 * @param id
 * @returns {Promise<unknown>}
 */
function getCodePayDetail(params) {
  return new Promise((resolve, reject) => {
    service.get(aiAgentMemebersApi.getCodePayDetail, {
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
    getProductCycleList,
    getProductList,
    getProductDetail,
    productAction,
    productEdit,
    getRightsList,
    allRightList,
    delRights,
    saveRightsEdit,
    payAdd,
    getCodePayList,
    getCodePayDetail
}

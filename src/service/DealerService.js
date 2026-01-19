import service from "../utils/HttpUtil"
import { dealerApi } from "./API"

// 获取职务列表
const getDistributorRoleList = (params) => {
  return new Promise((resolve, reject) => {
    service
      .get(dealerApi.getDistributorRoleList, {
        params
      })
      .then((res) => {
        if (res.status === 200) {
          resolve(res.data)
        } else reject(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

// 获取经销商的权限树
const getDistributorRightTree = (params) => {
  return new Promise((resolve, reject) => {
    service
      .get(dealerApi.getDistributorRightTree, {
        params
      })
      .then((res) => {
        if (res.status === 200) {
          resolve(res.data)
        } else reject(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
const editDistributorRole = (params) => {
  return new Promise((resolve, reject) => {
    service
      .post(dealerApi.editDistributorRole, params)
      .then((res) => {
        if (res.status === 200) resolve(res.data)
        else reject(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
// 删除职务
const removeDistributorRole = (params) => {
  return new Promise((resolve, reject) => {
    service
      .post(dealerApi.removeDistributorRole, params)
      .then((res) => {
        if (res.status === 200) resolve(res.data)
        else reject(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
/**
 * 获取职务信息
 * @param session session
 * @param user_name 账号
 * @param name 姓名
 * @param phone 手机
 */
const getDistributorRole = (params) => {
  return new Promise((resolve, reject) => {
    service
      .get(dealerApi.getDistributorRole, {
        params
      })
      .then((res) => {
        if (res.status === 200) {
          resolve(res.data)
        } else reject(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
/**
 * 获取经销商列表
 * @param session session
 * @param user_name 账号
 * @param name 姓名
 * @param phone 手机
 */
const getDistributorList = (params) => {
  return new Promise((resolve, reject) => {
    service
      .get(dealerApi.getDistributorList, {
        params
      })
      .then((res) => {
        if (res.status === 200) {
          resolve(res.data)
        } else reject(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

/**
 * 获取职务及下放职务列表
 * @param session session
 * @param user_name 账号
 * @param user_id 上级经销商id
 * @param role_level 职务等级(获取下放等级时必传,为当前所选职务等级)
 */
const getChoosableRoleList = (params) => {
  return new Promise((resolve, reject) => {
    service
      .get(dealerApi.getChoosableRoleList, {
        params
      })
      .then((res) => {
        if (res.status === 200) {
          resolve(res.data)
        } else reject(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
/**
 * 获取权限树
 * @param session session
 * @param user_name 账号
 * @param user_id 上级经销商id
 */
const distributorAreaTree = (params) => {
  return new Promise((resolve, reject) => {
    service
      .get(dealerApi.distributorAreaTree, {
        params
      })
      .then((res) => {
        if (res.status === 200) {
          resolve(res.data)
        } else reject(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

/**
新增经销商
@param session 唯一身份
@param user_name 账号
@param account 经销商账号
@param phone 手机号
@param area_ids 负责范围 (区域 id / 学校 id)
@param id 经销商 id
@param is_special 是否特例 1 特例
@param name 姓名
@param parent_id 所属上级 id 无上级为 0
@param password 经销商密码
@param role_id 职务 id
@param remark 负责范围描述（非必填）
@param school_ids 是否特例 (学校 id)（非必填）
@param sub_role_ids 下放职务（非必填）
*/
const addDistributor = (params) => {
  return new Promise((resolve, reject) => {
    service
      .post(dealerApi.addDistributor, params)
      .then((res) => {
        if (res.status === 200) resolve(res.data)
        else reject(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

/**
重置经销商密码
@param session 唯一身份
@param user_name 账号
@param user_id 经销商 id
*/
const resetDistributorPwd = (params) => {
  return new Promise((resolve, reject) => {
    service
      .post(dealerApi.resetDistributorPwd, params)
      .then((res) => {
        if (res.status === 200) resolve(res.data)
        else reject(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}


/**
 * 获取权限树
 * @param session session
 * @param user_name 账号
 * @param distributor_id 经销商id
 * @param type 职务 操作类型 0禁用 1删除
 */
const disableDistributor = (params) => {
  return new Promise((resolve, reject) => {
    service
      .post(dealerApi.disableDistributor, params)
      .then((res) => {
        if (res.status === 200) resolve(res.data)
        else reject(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

/**
 * 获取经销商详情
 * @param session session
 * @param user_name 账号
 * @param user_id 上级经销商id
 */
const getDistributorDetail = (params) => {
  return new Promise((resolve, reject) => {
    service
      .get(dealerApi.getDistributorDetail, {
        params
      })
      .then((res) => {
        if (res.status === 200) {
          resolve(res.data)
        } else reject(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

/**
 * 获取可排除的学校列表
 * @param session session
 * @param user_name 账号
 * @param area_ids 负责范围(区域id/学校id)
 * @param parent_id 所属上级id
 * @param school_name 学校名称
 */
const getExcludeSchoolList = (params) => {
  return new Promise((resolve, reject) => {
    service
      .get(dealerApi.getExcludeSchoolList, {
        params
      })
      .then((res) => {
        if (res.status === 200) {
          resolve(res.data)
        } else reject(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

/**
 * 修改经销商信息
 * @param session session
 * @param user_name 账号
 * @param account 经销商账号
 * @param distributor_id 经销商id
 * @param distributor_name 经销商名称
 * @param phone 手机号
 */
const updateDistributorInfo = (params) => {
  return new Promise((resolve, reject) => {
    service
      .post(dealerApi.updateDistributorInfo, params)
      .then((res) => {
        if (res.status === 200) resolve(res.data)
        else reject(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

/**
 * 启用经销商
 * @param session session
 * @param user_name 账号
 * @param distributor_id 经销商id
 */
const enableDistributor = (params) => {
  return new Promise((resolve, reject) => {
    service
      .post(dealerApi.enableDistributor, params)
      .then((res) => {
        if (res.status === 200) resolve(res.data)
        else reject(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

/**
 * 变更经销商权限
 * @param session session
 * @param user_name 账号
 * @param area_ids 负责范围(区域id/学校id)
 * @param role_id 职务
 * @param user_id 经销商id
 * @param remark 描述
 * @param school_ids 是否特例(学校id)
 * @param sub_role_ids 下放职务
 */
const updateDistributorAuth = (params) => {
  return new Promise((resolve, reject) => {
    service
      .post(dealerApi.updateDistributorAuth, params)
      .then((res) => {
        if (res.status === 200) resolve(res.data)
        else reject(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

/**
 * 获取公告列表
 * @param session session
 * @param user_name 账号
 * @param is_release 发布状态
 * @param page_index 页码
 * @param page_size 每页数量
 * @param title 公告名称
 */
const getDistributorNotices = (params) => {
  return new Promise((resolve, reject) => {
    service
      .get(dealerApi.getDistributorNotices, {
        params
      })
      .then((res) => {
        if (res.status === 200) {
          resolve(res.data)
        } else reject(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

/**
 * 新增/编辑公告
 * @param session session
 * @param user_name 账号
 * @param title 公告名称
 * @param content 公告内容
 * @param receive_range 接收范围
 */
const addDistributorNotice = (params) => {
  return new Promise((resolve, reject) => {
    service
      .post(dealerApi.addDistributorNotice, params)
      .then((res) => {
        if (res.status === 200) resolve(res.data)
        else reject(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

/**
 * 删除公告
 * @param session session
 * @param user_name 账号
 * @param id 公告id
 */
const deleteDistributorNotice = (params) => {
  return new Promise((resolve, reject) => {
    service
      .post(dealerApi.deleteDistributorNotice, params)
      .then((res) => {
        if (res.status === 200) resolve(res.data)
        else reject(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

/**
 * 发布公告
 * @param session session
 * @param user_name 账号
 * @param id 公告id
 */
const releaseDistributorNotice = (params) => {
  return new Promise((resolve, reject) => {
    service
      .post(dealerApi.releaseDistributorNotice, params)
      .then((res) => {
        if (res.status === 200) resolve(res.data)
        else reject(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

/**
 * 获取公告详情
 * @param session session
 * @param user_name 账号
 * @param id 公告id
 */
const getNoticeDetail = (params) => {
  return new Promise((resolve, reject) => {
    service
      .get(dealerApi.getNoticeDetail, {
        params
      })
      .then((res) => {
        if (res.status === 200) {
          resolve(res.data)
        } else reject(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

/**
 * 检查经销商权限状态
 * @param session session
 * @param user_name 账号
 * @param distributor_id 经销商id
 */
const checkDistributorAuth = (params) => {
  return new Promise((resolve, reject) => {
    service
      .post(dealerApi.checkDistributorAuth, params)
      .then((res) => {
        if (res.status === 200) resolve(res.data)
        else reject(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

/**
 * 获取公告详情
 * @param session session
 * @param user_name 账号
 * @param id 公告id
 */
const getCheckDistributorQuote = (params) => {
  return new Promise((resolve, reject) => {
    service
      .get(dealerApi.checkDistributorQuote, {
        params
      })
      .then((res) => {
        if (res.status === 200) {
          resolve(res.data)
        } else reject(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

export default {
  getDistributorRoleList,
  getDistributorRightTree,
  editDistributorRole,
  removeDistributorRole,
  getDistributorRole,
  getDistributorList,
  getChoosableRoleList,
  distributorAreaTree,
  addDistributor,
  resetDistributorPwd,
  disableDistributor,
  getDistributorDetail,
  getExcludeSchoolList,
  updateDistributorInfo,
  enableDistributor,
  updateDistributorAuth,
  getDistributorNotices,
  addDistributorNotice,
  deleteDistributorNotice,
  releaseDistributorNotice,
  getNoticeDetail,
  checkDistributorAuth,
  getCheckDistributorQuote
}

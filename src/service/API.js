export let vocabularyApi = {
  login: '/login', // 密码登录
  accountVersion: '/version', // 获取教材版本
  accountBook: '/book', // 获取教材册别
  accountUnit: '/unit', // 获取教材单元
  accountRighttree: '/righttree', // 获取权限树
  accountWord: '/word', // 教材词汇
  accountEdituser: '/edituser', // 添加/修改用户
  accountUserlist: '/userlist', // 用户列表
  accountRemoveuser: '/removeuser', // 删除用户
  accountRolelist: '/rolelist', // 角色列表
  accountEditrole: '/editrole', // 添加/修改角色
  accountRemoverole: '/removerole', // 删除角色
  accountUsertree: '/usertree', // 获取用户树
  accountRoletree: '/roletree', // 获取角色树
  accountSaveuserrole: '/saveuserrole', // 保存用户角色
  accountUserrole: '/userrole', // 获取用户角色
  accountSaveroleright: '/saveroleright', // 保存角色权限
  accountRoleright: '/roleright', // 获取角色权限
  accountSysmenu: '/sysmenu', // 获取系统菜单
  accountMenu: '/menu', // 获取权限菜单
  accountEditmenu: '/editmenu', // 添加/修改功能菜单
  accountMenulist: '/menulist', // 获取功能列表
  accountRemovemenu: '/removemenu', // 删除功能菜单
  accountQuestionsList: '/questions/list', // 获取题型列表
  accountPointList: '/point/list', // 获取考点列表
  accountWordTestList: '/word/test/list', // 单词题库列表
  accountDifficultyList: '/difficulty/list', // 获取难度列表
  accountWordAttribute: '/word/attribute', // 单词属性查询
  accountWordTestSet: '/word/test/set', // 单词题库新增/修改
  accountWordTestDel: '/word/test/del', // 单词题库删除
  accountTestGroupList: '/test/group/list', // 词汇竞赛组卷查询列表
  accountZjGroup: '/zj/group', // 词汇竞卷组卷
  accountZjGroupReset: '/zj/group/reset', // 组卷换一换
  accountZjGroupResetWord: '/zj/group/reset/word', // 组卷换一换获取单词
  accountSaveGroup: '/save/group', // 保存组卷
  accountGroupDownload: '/group/download', // 导出组卷试题
  accountGroupList: '/group/list', // 组卷列表
  accountDelGroup: '/del/group', // 删除组卷
  accountGroupDetail: '/group/detail', // 组卷详情查看
  accountPassword: '/password', // 修改密码
}

export let basicApi = {
  getQuestionList: '/questions/list', // 获取题型列表
  delQuestion: '/questions/del', // 删除题型
  setQuestion: '/questions/set', // 新增和修改题型
  getQuestionInfo: '/questions', // 获取题型信息
  getDifficultyList: '/difficulty/list', // 获取难度列表
  delDifficulty: '/difficulty/del', // 删除难度
  setDifficulty: '/difficulty/set', // 新增和修改难度
  getDifficultyInfo: '/difficulty', // 获取难度信息
  getPointList: '/point/list', // 获取考点列表
  delPoint: '/point/del', // 删除考点
  setPoint: '/point/set', // 新增和修改考点
  getPointInfo: '/point', // 获取考点信息
  getPower: '/right/zsgc', // 获取权限
}

export let manageApi = {
  // 书籍管理
  getBookNumber: '/operation/book/getBootNumber', // 获取书籍数量
  exportQrcode: '/operation/book/exportQrcode', // 导出二维码
  getConfigDetail: '/operation/book/getConfigDetail', // 获取待审核与已配置详情
  getConfigList: '/operation/book/getConfigList', // 获取待审核与已配置列表
  getNotConfigList: '/operation/book/getNotConfigList', // 获取待配置列表
  saveConfig: '/operation/book/save', // 配置
  updateState: '/operation/book/update', // 编辑与审核
  addKey: '/operation/projectKey/addKey', // 激活码-新增激活码
  exportKey: '/operation/projectKey/exportKey', // 激活码-导出激活码
  getInfoList: '/operation/projectKey/getInfoList', // 激活码-获取详情列表
  getKeyList: '/operation/projectKey/getKeyList', // 激活码-激活查询
  getList: '/operation/projectKey/getList', // 激活码-获取列表
  // 产品管理
  auditGoods: '/operation/goods/auditGoods', // 审核与删除商品
  getGoodsDetail: '/operation/goods/getGoodsDetail', // 获取商品详情
  getGoodsList: '/operation/goods/getGoodsList', // 获取待审核与已审核列表
  getGoodsNumber: '/operation/goods/getGoodsNumber', // 获取商品数量
  saveGoods: '/operation/goods/saveGoods', // 新增与修改商品
  // 发布管理
  auditRelease: '/operation/release/auditRelease', // 发布管理审核、删除、下架商品
  getReleaseDetail: '/operation/release/getReleaseDetail', // 发布管理获取详情
  getReleaseList: '/operation/release/getReleaseList', // 获取待审核与已发布列表
  getReleaseNumber: '/operation/release/getReleaseNumber', // 获取发布数量
  saveRelease: '/operation/release/saveRelease', // 新增与修改发布信息
  // 下架管理
  auditDowns: '/operation/downs/auditDowns', // 审核与删除接口
  getDownsDetail: '/operation/downs/getDownsDetail', // 获取详情
  getDownsList: '/operation/downs/getDownsList', // 获取待审核与已下架列表
  getDownsNumber: '/operation/downs/getDownsNumber', // 获取下架数量
  getActivationList: '/operation/activation/getActivationList' // 获取数据列表
}

export let memberApi = {
  getProvincesList: '/provincesList', // 获取所有的省
  getCityList: '/cityList', // 获取所有的市
  getCountyList: '/countyList', // 获取所有的区县
  getTrialList: '/trialList', // 教师体验开通列表
  trialSave: '/trialSave', // 教师体验开通编辑
  trialRemove: '/trialRemove', // 教师体验开通删除
  getTcList: '/Tclist', // 教师列表
  getTeacherList: '/teacher/list', // 教师列表
  removeStudentMember: '/removeStudentMember', // 学生会员开通删除
  saveStudentMember: '/saveStudentMember', // 学生会员开通编辑
  studentMemberList: '/studentMemberList', // 学生会员开通列表
  packageList: '/packageList', // 会员套餐列表
  savePackage: '/savePackage', // 会员套餐编辑
  removePackage: '/removePackage', // 会员套餐删除
  renewalMember: '/renewalMember', // 批量续期
}

export let wordRaceMemberApi = {
  getProvincesList: '/provincesList', // 获取所有的省
  getCityList: '/cityList', // 获取所有的市
  getCountyList: '/countyList', // 获取所有的区县
  getTrialList: '/contest/list', // 教师体验开通列表
  trialSave: '/contest/save', // 教师体验开通编辑
  trialRemove: '/contest/del', // 教师体验开通删除
  renewalMember: '/renewalContestMember', // 批量续期
}

export let aiAgentApi = {
  getCompositionList: '/composition/list', // 教师体验开通列表
  getUse: '/composition/getUse', // 获取使用次数
  saveComposition: '/composition/save', // 新增编辑ai agent权限
  removeComposition: '/composition/del', // 教师体验开通删除
  getCompositionDetail: '/composition/detail', // 获取用户权限详情
  batchComposition: '/composition/batch', // 批量续期
  getTcList: '/Tclist', // 教师列表
  getTeacherList: '/teacher/list', // 教师列表
  removeStudentMember: '/removeStudentMember', // 学生会员开通删除
  saveStudentMember: '/saveStudentMember', // 学生会员开通编辑
  studentMemberList: '/studentMemberList', // 学生会员开通列表
  packageList: '/packageList', // 会员套餐列表
  savePackage: '/savePackage', // 会员套餐编辑
  removePackage: '/removePackage', // 会员套餐删除
  getProvincesList: '/getAiProvinceList', // 获取所有的省
  editProvinces: '/editAiProvince', // 编辑跟新增省
  delAiProvince: '/delAiProvince', // 删除省市区县
  getAiCityList: '/getAiCityList', // 获取所有的市
  editAiCity: '/editAiCity', // 编辑跟新增市
  getAiCountyList: '/getAiCountyList', // 获取所有的区县列表
  editAiCounty: '/editAiCounty', // 编辑跟新增区县
  getAiSchoolList: '/getAiSchoolList', // 获取所有的学校列表
  editAiSchool: '/editAiSchool', // 编辑跟新增区县
  delAiSchool: '/delAiSchool', // 删除学校信息
}

// 班级作文批改付费
export let aiAgentMemebersApi = {
  getDistributors: '/pay/getDistributors', // 经销商列表
  getSchool: '/distributor/school', // 获取经销商学校
  getProvinceList: '/distributor/province/list', // 省列表
  getCityList: '/distributor/city/list', // 市列表
  getCountyList: '/distributor/county/list', // 区列表
  getTeacher: '/distributor/teacher', // 教师列表
  getTeacherClass: '/teacher/class', // 教师班级
  getClassStudent: '/class/student', // 班级学生列表
  getUnifyPaylist: '/unify/pay/list', // 学生权益列表
  getUnifyPayDetail : '/unify/pay/detail', // 获取学生权益详情
  unifyPayDelete: '/unify/pay/delete', // 作废学生权益
  addUnifyPay: '/add/unify/pay' // 新增学生权益
}

// 审核管理
export let reviewApi = {
  getTeacherCheckList: '/getTeacherCheckList', // 教师认证列表
  getAppList: '/getAppList', // 高中维词产品列表
  getSchoolList: '/getSchoolList', // 学校列表
  deleteTeacherCheck: '/deleteTeacherCheck', // 删除教师认证列表
  saveTeacherCheck: '/saveTeacherCheck', // 新增与修改教师认证列表
  changeTeacherCheck: '/changeTeacherCheck', // 管理教师认证资格
}

// 经销商管理api
export let dealerApi = {
  getDistributorRoleList: '/distributorRoleList', // 职务列表
  getDistributorRightTree: '/distributorRightTree', // 获取经销商的权限树
  editDistributorRole: '/editDistributorRole', // 新增/修改权限树
  removeDistributorRole: '/removeDistributorRole', // 删除职务
  getDistributorRole: '/getDistributorRole', // 获取职务信息
  getDistributorList: '/getDistributorList', // 获取经销商列表
  getChoosableRoleList: '/getChoosableRoleList', // 获取职务及下放职务列表
  distributorAreaTree: '/distributorAreaTree', // 获取区域范围树
  addDistributor: '/addDistributor', // 新增经销商
  resetDistributorPwd: '/resetDistributorPwd', // 重置经销商密码
  disableDistributor: '/disableDistributor', // 禁用/删除经销商
  updateDistributorInfo: '/updateDistributorInfo', // 修改经销商信息
  getDistributorDetail: '/getDistributorDetail', // 获取经销商详情
  getExcludeSchoolList: '/getExcludeSchoolList', // 获取可排除的学校列表
  checkDistributorAuth: '/checkDistributorAuth', // 检查经销商权限状态 ---启用前调用
  enableDistributor: '/enableDistributor', // 启用经销商
  updateDistributorAuth: '/updateDistributorAuth', // 变更经销商权限
  getDistributorNotices: '/getDistributorNotices', // 获取公告列表
  addDistributorNotice: '/addDistributorNotice', // 新增/编辑公告
  deleteDistributorNotice: '/deleteDistributorNotice', // 删除公告
  releaseDistributorNotice: '/releaseDistributorNotice', // 发布公告
  getNoticeDetail: '/getNoticeDetail', // 获取公告详情
}
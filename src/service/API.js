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
  removeStudentMember: '/removeStudentMember', // 学生会员开通删除
  saveStudentMember: '/saveStudentMember', // 学生会员开通编辑
  studentMemberList: '/studentMemberList', // 学生会员开通列表
}
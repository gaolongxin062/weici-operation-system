import service from "../utils/HttpUtil";
import {
  vocabularyApi,
} from './API';

/**
 * 密码登录
 * @param user_name 账号
 * @param password 密码
 * @returns {Promise<unknown>}
 */
function login(user_name, password) {
  return new Promise((resolve, reject) => {
    service.post(vocabularyApi.login, {
      user_name: user_name,
      password: password
    }).then(res => {
      if (res.status === 200) resolve(res.data);
      else reject(res);
    }).catch(err => {
      reject(err);
    })
  });
}


/**
 * 获取教材版本
 */
function accountVersion(key_word, user_name, session) {
  return new Promise((resolve, reject) => {
    service.get(vocabularyApi.accountVersion, {
      params: {
        key_word: key_word,
        user_name: user_name,
        session: session
      }
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
 * 获取教材册别
 */
function accountBook(user_name, session, page_index, page_size, version_id) {
  return new Promise((resolve, reject) => {
    service.get(vocabularyApi.accountBook, {
      params: {
        user_name: user_name,
        session: session,
        page_index: page_index,
        page_size: page_size,
        version_id: version_id
      }
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
 * 获取教材单元
 */
function accountUnit(user_name, session, page_index, page_size, version_id, book_id) {
  return new Promise((resolve, reject) => {
    service.get(vocabularyApi.accountUnit, {
      params: {
        user_name: user_name,
        session: session,
        page_index: page_index,
        page_size: page_size,
        version_id: version_id,
        book_id: book_id
      }
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
 * 获取权限树
 */
function accountRighttree(user_name, session) {
  return new Promise((resolve, reject) => {
    service.get(vocabularyApi.accountRighttree, {
      params: {
        user_name: user_name,
        session: session
      }
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
 * 教材词汇
 */
function accountWord(user_name, session, version_id, book_id, flag, key_word, page_index, page_size, unit_id, standard_flag, point, lv_frequency) {
  return new Promise((resolve, reject) => {
    service.get(vocabularyApi.accountWord, {
      params: {
        user_name: user_name,
        session: session,
        version_id: version_id,
        book_id: book_id,
        flag: flag,
        key_word: key_word,
        page_index: page_index,
        page_size: page_size,
        unit_id: unit_id,
        standard_flag: standard_flag, // 课标词 -1全部 1课标词 0非课标词	
        point: point, // 重难点 -1全部 1重难点 0非重难点
        lv_frequency: lv_frequency, // 词频 -1全部 词频等级
      }
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
 * 添加 / 修改用户
 * @param user_name 账号
 * @param password 密码
 * @returns {Promise<unknown>}
 */
function accountEdituser(user_name, session, password, input_user_name, manager, nickname, stop_flag, user_id) {
  return new Promise((resolve, reject) => {
    service.post(vocabularyApi.accountEdituser, {
      user_name: user_name,
      session: session,
      password: password,
      input_user_name: input_user_name, // 用户名
      manager: manager, // 管理员标记
      nickname: nickname, // 姓名
      stop_flag: stop_flag, // 停用标记
      user_id: user_id // 用户id
    }).then(res => {
      if (res.status === 200) resolve(res.data);
      else reject(res);
    }).catch(err => {
      reject(err);
    })
  });
}


/**
 * 用户列表
 */
function accountUserlist(user_name, session, sort_name, sort_order, page_index, page_size, filter_user_name) {
  return new Promise((resolve, reject) => {
    service.get(vocabularyApi.accountUserlist, {
      params: {
        user_name: user_name,
        session: session,
        sort_name: sort_name, // 排序字段:user_name 用户名 ,nickname 姓名
        sort_order: sort_order, // 排序规则:ascending 正序, descending 倒序
        page_index: page_index,
        page_size: page_size,
        filter_user_name: filter_user_name // 用户名
      }
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
 * 删除用户
 */
function accountRemoveuser(user_name, session, user_id) {
  return new Promise((resolve, reject) => {
    service.post(vocabularyApi.accountRemoveuser, {
      user_name: user_name,
      session: session,
      user_id: user_id
    }).then(res => {
      if (res.status === 200) resolve(res.data);
      else reject(res);
    }).catch(err => {
      reject(err);
    })
  });
}

/**
 * 删除角色
 */
function accountRemoverole(user_name, session, role_id) {
  return new Promise((resolve, reject) => {
    service.post(vocabularyApi.accountRemoverole, {
      user_name: user_name,
      session: session,
      role_id: role_id
    }).then(res => {
      if (res.status === 200) resolve(res.data);
      else reject(res);
    }).catch(err => {
      reject(err);
    })
  });
}

/**
 * 角色列表
 */
function accountRolelist(user_name, session, sort_name, sort_order, page_index, page_size, role_name) {
  return new Promise((resolve, reject) => {
    service.get(vocabularyApi.accountRolelist, {
      params: {
        user_name: user_name,
        session: session,
        sort_name: sort_name, // 排序字段:role_name 角色名称, role_desc 描述
        sort_order: sort_order, // 排序规则:ascending 正序, descending 倒序
        page_index: page_index,
        page_size: page_size,
        role_name: role_name // 角色名
      }
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
 * 添加 / 修改角色
 */
function accountEditrole(user_name, session, role_desc, role_name, role_id) {
  return new Promise((resolve, reject) => {
    service.post(vocabularyApi.accountEditrole, {
      user_name: user_name,
      session: session,
      role_desc: role_desc,
      role_name: role_name,
      role_id: role_id
    }).then(res => {
      if (res.status === 200) resolve(res.data);
      else reject(res);
    }).catch(err => {
      reject(err);
    })
  });
}


/**
 * 获取用户树
 */
function accountUsertree(user_name, session) {
  return new Promise((resolve, reject) => {
    service.get(vocabularyApi.accountUsertree, {
      params: {
        user_name: user_name,
        session: session
      }
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
 * 获取角色树
 */
function accountRoletree(user_name, session) {
  return new Promise((resolve, reject) => {
    service.get(vocabularyApi.accountRoletree, {
      params: {
        user_name: user_name,
        session: session
      }
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
 * 保存用户角色
 */
function accountSaveuserrole(user_name, session, user_id, roles) {
  return new Promise((resolve, reject) => {
    service.post(vocabularyApi.accountSaveuserrole, {
      user_name: user_name,
      session: session,
      user_id: user_id,
      roles: roles
    }).then(res => {
      if (res.status === 200) resolve(res.data);
      else reject(res);
    }).catch(err => {
      reject(err);
    })
  });
}

/**
 * 获取用户角色
 */
function accountUserrole(user_name, session, user_id) {
  return new Promise((resolve, reject) => {
    service.get(vocabularyApi.accountUserrole, {
      params: {
        user_name: user_name,
        session: session,
        user_id: user_id
      }
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
 * 保存角色权限
 */
function accountSaveroleright(user_name, session, role_id, rights, right_end) {
  return new Promise((resolve, reject) => {
    service.post(vocabularyApi.accountSaveroleright, {
      user_name: user_name,
      session: session,
      role_id: role_id,
      rights: rights,
      right_end: right_end
    }).then(res => {
      if (res.status === 200) resolve(res.data);
      else reject(res);
    }).catch(err => {
      reject(err);
    })
  });
}

/**
 * 获取角色权限
 */
function accountRoleright(user_name, session, role_id) {
  return new Promise((resolve, reject) => {
    service.get(vocabularyApi.accountRoleright, {
      params: {
        user_name: user_name,
        session: session,
        role_id: role_id
      }
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
 * 获取系统菜单
 */
function accountSysmenu(user_name, session) {
  return new Promise((resolve, reject) => {
    service.get(vocabularyApi.accountSysmenu, {
      params: {
        user_name: user_name,
        session: session
      }
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
 * 获取权限菜单
 */
function accountMenu(user_name, session) {
  return new Promise((resolve, reject) => {
    service.get(vocabularyApi.accountMenu, {
      params: {
        user_name: user_name,
        session: session
      }
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
 * 获取题型列表
 */
function accountQuestionsList(user_name, session, page_index, page_size, type) {
  return new Promise((resolve, reject) => {
    service.get(vocabularyApi.accountQuestionsList, {
      params: {
        user_name: user_name,
        session: session,
        page_index: page_index,
        page_size: page_size,
        type: type
      }
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
 * 获取考点列表
 */
function accountPointList(user_name, session, page_index, page_size, key_word) {
  return new Promise((resolve, reject) => {
    service.get(vocabularyApi.accountPointList, {
      params: {
        user_name: user_name,
        session: session,
        page_index: page_index,
        page_size: page_size,
        key_word: key_word
      }
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
 * 单词题库列表
 */
function accountWordTestList(user_name, session, page_index, page_size, difficulty, point_id, question_id, question_type, subject, word) {
  return new Promise((resolve, reject) => {
    service.get(vocabularyApi.accountWordTestList, {
      params: {
        user_name: user_name,
        session: session,
        page_index: page_index,
        page_size: page_size,
        difficulty: difficulty,
        point_id: point_id,
        question_id: question_id,
        question_type: question_type,
        subject: subject,
        word: word
      }
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
 * 获取难度列表
 */
function accountDifficultyList(user_name, session, page_index, page_size, key_word) {
  return new Promise((resolve, reject) => {
    service.get(vocabularyApi.accountDifficultyList, {
      params: {
        user_name: user_name,
        session: session,
        page_index: page_index,
        page_size: page_size,
        key_word: key_word
      }
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
 * 单词属性查询
 */
function accountWordAttribute(user_name, session, page_index, page_size, key_word, lv_frequency, point, standard_flag, outpoint) {
  return new Promise((resolve, reject) => {
    service.get(vocabularyApi.accountWordAttribute, {
      params: {
        user_name: user_name,
        session: session,
        page_index: page_index,
        page_size: page_size,
        key_word: key_word,
        lv_frequency: lv_frequency, // 词频 -1全部 词频等级
        point: point, // 重难点 -1全部 1重难点 0非重难点
        standard_flag: standard_flag, // 课标词 -1全部 1课标词 0非课标词	
        outpoint // 课标外派词 0全部 1课标外词 0非课派词	
      }
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
 * 单词题库新增 / 修改
 */
function accountWordTestSet(user_name, session, test_id, json) {
  return new Promise((resolve, reject) => {
    service.post(vocabularyApi.accountWordTestSet, {
      user_name: user_name,
      session: session,
      test_id: test_id,
      json: json
    }).then(res => {
      if (res.status === 200) resolve(res.data);
      else reject(res);
    }).catch(err => {
      reject(err);
    })
  });
}

/**
 * 单词题库删除
 */
function accountWordTestDel(user_name, session, test_id) {
  return new Promise((resolve, reject) => {
    service.post(vocabularyApi.accountWordTestDel, {
      user_name: user_name,
      session: session,
      test_id: test_id
    }).then(res => {
      if (res.status === 200) resolve(res.data);
      else reject(res);
    }).catch(err => {
      reject(err);
    })
  });
}
/**
 * 词汇竞赛组卷查询列表
 */
function accountTestGroupList(user_name, session, source_type, book, letter, lv_frequency, point, standard_flag, unit, version_id, word, page_index, page_size) {
  return new Promise((resolve, reject) => {
    service.get(vocabularyApi.accountTestGroupList, {
      params: {
        user_name: user_name,
        session: session,
        source_type: source_type, // 1教材词汇 2课标词汇
        book: book,
        letter: letter,
        lv_frequency: lv_frequency, // 词频 0全部
        point: point, // 重难点词 -1全部 1是 0否
        standard_flag: standard_flag, // 是否课标 -1全部 1课标 0非课标
        unit: unit,
        version_id: version_id,
        word: word,
        page_index: page_index,
        page_size: page_size,
      }
    }).then(res => {
      if (res.status === 200) {
        resolve(res.data);
      } else reject(res);
    }).catch(err => {
      reject(err);
    });
  });
}

// /**
//  * 词汇竞卷组卷
//  */
function accountZjGroup(user_name, session, test_count, word_ids) {
  return new Promise((resolve, reject) => {
    service.post(vocabularyApi.accountZjGroup, {
      user_name: user_name,
      session: session,
      test_count: test_count, // 题数
      word_ids: word_ids // 单词id,逗号分隔
    }).then(res => {
      if (res.status === 200) resolve(res.data);
      else reject(res);
    }).catch(err => {
      reject(err);
    })
  });
}
/**
 * 组卷换一换
 */
function accountZjGroupReset(user_name, session, difficulty_id, point_ids, question_ids, question_type, test_ids, word_id, page_index, page_size) {
  return new Promise((resolve, reject) => {
    service.get(vocabularyApi.accountZjGroupReset, {
      params: {
        user_name: user_name,
        session: session,
        difficulty_id: difficulty_id, // 难度 0全部
        point_ids: point_ids, // 考点id，逗号分隔
        question_ids: question_ids, // 题型id, 逗号分隔
        question_type: question_type, // 题型分类 0全部
        test_ids: test_ids,
        word_id: word_id,
        page_index: page_index,
        page_size: page_size,
      }
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
 * 组卷换一换获取单词
 */
function accountZjGroupResetWord(user_name, session, ids, source_type, version_id, page_index, page_size, word) {
  return new Promise((resolve, reject) => {
    service.get(vocabularyApi.accountZjGroupResetWord, {
      params: {
        user_name: user_name,
        session: session,
        ids: ids, // 题id
        source_type: source_type, // 1教材词汇 2课标词汇
        version_id: version_id,
        page_index: page_index,
        page_size: page_size,
        word: word
      }
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
 * 导出组卷试题
 */
function accountGroupDownload(user_name, session, group_id) {
  return new Promise((resolve, reject) => {
    service.get(vocabularyApi.accountGroupDownload, {
      params: {
        user_name: user_name,
        session: session,
        group_id: group_id
      }
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
 * 保存组卷
 */
function accountSaveGroup(user_name, session, test_ids, group_name, group_id, version_id) {
  return new Promise((resolve, reject) => {
    service.post(vocabularyApi.accountSaveGroup, {
      user_name: user_name,
      session: session,
      test_ids: test_ids,
      group_name: group_name,
      group_id: group_id,
      version_id: version_id
    }).then(res => {
      if (res.status === 200) resolve(res.data);
      else reject(res);
    }).catch(err => {
      reject(err);
    })
  });
}
/**
 * 组卷列表
 */
function accountGroupList(user_name, session, key, page_index, page_size) {
  return new Promise((resolve, reject) => {
    service.get(vocabularyApi.accountGroupList, {
      params: {
        user_name: user_name,
        session: session,
        key: key,
        page_index: page_index,
        page_size: page_size
      }
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
 * 删除组卷
 */
function accountDelGroup(user_name, session, group_id) {
  return new Promise((resolve, reject) => {
    service.post(vocabularyApi.accountDelGroup, {
      user_name: user_name,
      session: session,
      group_id: group_id
    }).then(res => {
      if (res.status === 200) resolve(res.data);
      else reject(res);
    }).catch(err => {
      reject(err);
    })
  });
}
/**
 * 组卷详情查看
 */
function accountGroupDetail(user_name, session, group_id) {
  return new Promise((resolve, reject) => {
    service.get(vocabularyApi.accountGroupDetail, {
      params: {
        user_name: user_name,
        session: session,
        group_id: group_id
      }
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
 * 修改密码
 */
function accountPassword(user_name, session, old_password, new_password, confirm_password) {
  return new Promise((resolve, reject) => {
    service.post(vocabularyApi.accountPassword, {
      user_name: user_name,
      session: session,
      old_password: old_password,
      new_password: new_password,
      confirm_password: confirm_password
    }).then(res => {
      if (res.status === 200) resolve(res.data);
      else reject(res);
    }).catch(err => {
      reject(err);
    })
  });
}

/**
 * 添加 / 修改功能菜单
 */
function accountEditmenu(user_name, session, stop_flag, right_flag, path, parent_code, menu_name, menu_index, menu_id, menu_code, icon) {
  return new Promise((resolve, reject) => {
    service.post(vocabularyApi.accountEditmenu, {
      user_name: user_name,
      session: session,
      stop_flag: stop_flag,
      right_flag: right_flag,
      path: path,
      parent_code: parent_code,
      menu_name: menu_name,
      menu_index: menu_index,
      menu_id: menu_id,
      menu_code: menu_code,
      icon: icon
    }).then(res => {
      if (res.status === 200) resolve(res.data);
      else reject(res);
    }).catch(err => {
      reject(err);
    })
  });
}

/**
 * 获取功能列表
 */
function accountMenulist(user_name, session, menu_code, sort_name, sort_order, page_index, page_size) {
  return new Promise((resolve, reject) => {
    service.get(vocabularyApi.accountMenulist, {
      params: {
        user_name: user_name,
        session: session,
        menu_code: menu_code,
        sort_name, // 排序字段:menu_code 菜单编码, menu_index 菜单索引, menu_name 菜单名称
        sort_order, // 排序规则:ascending 正序, descending 倒序
        page_index,
        page_size
      }
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
 * 删除功能菜单
 */
function accountRemovemenu(user_name, session, menu_id) {
  return new Promise((resolve, reject) => {
    service.post(vocabularyApi.accountRemovemenu, {
      user_name: user_name,
      session: session,
      menu_id
    }).then(res => {
      if (res.status === 200) resolve(res.data);
      else reject(res);
    }).catch(err => {
      reject(err);
    })
  });
}

export default {
  accountRemovemenu,
  accountMenulist,
  accountEditmenu,
  accountPassword,
  accountGroupDetail,
  accountDelGroup,
  accountGroupList,
  accountGroupDownload,
  accountSaveGroup,
  accountZjGroupResetWord,
  accountZjGroupReset,
  accountZjGroup,
  accountTestGroupList,
  accountWordTestDel,
  accountWordTestSet,
  accountWordAttribute,
  accountDifficultyList,
  accountWordTestList,
  accountPointList,
  accountQuestionsList,
  accountMenu,
  accountSysmenu,
  accountRoleright,
  accountSaveroleright,
  accountUserrole,
  accountSaveuserrole,
  accountRoletree,
  accountUsertree,
  accountRemoverole,
  accountEditrole,
  accountRolelist,
  accountRemoveuser,
  accountUserlist,
  accountEdituser,
  accountWord,
  accountRighttree,
  accountUnit,
  accountBook,
  accountVersion,
  login
}

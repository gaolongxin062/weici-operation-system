import service from "../utils/HttpUtil";
import config from "@/config/index";
import axios from 'axios';

import {
  basicApi,
} from './API';

/**
 * 密码登录
 * @param user_name 账号
 * @param password 密码
 * @returns {Promise<unknown>}
 */
function getQuestionList(user_name, session, type, page_index, page_size) {
  return new Promise((resolve, reject) => {
    let params = {
      user_name,
      session,
      type
    }
    if (page_index) {
      params = {
        ...params,
        page_index,
        page_size
      }
    }
    service.get(
      basicApi.getQuestionList,
      {params}
    ).then(res => {
      if (res.status === 200) {
        resolve(res.data);
      } else reject(res);
    }).catch(err => {
      reject(err);
    });
  });
}
function getQuestionInfo(user_name, session, question_id) {
  return new Promise((resolve, reject) => {
    let params = {
      user_name,
      session,
      question_id
    }
    service.get(basicApi.getQuestionInfo, {
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
function setQuestion(user_name, session, question_type, question_name, is_pk, question_id) {
  return new Promise((resolve, reject) => {
    let params = {
      user_name,
      session,
      question_type,
      question_name,
      is_pk,
    }
    if (question_id) {
      params = {
        ...params,
        question_id
      }
    }
    service.post(
      basicApi.setQuestion,
      params
    ).then(res => {
      if (res.status === 200) resolve(res.data);
      else reject(res);
    }).catch(err => {
      reject(err);
    })
  });
}
function delQuestion(user_name, session, question_id) {
  return new Promise((resolve, reject) => {
    let params = {
      user_name,
      session,
      question_id
    }
    service.post(
      basicApi.delQuestion,
      params
    ).then(res => {
      if (res.status === 200) resolve(res.data);
      else reject(res);
    }).catch(err => {
      reject(err);
    })
  });
}

function getDifficultyList(user_name, session, key_word, page_index, page_size) {
  return new Promise((resolve, reject) => {
    let params = {
      user_name,
      session,
      key_word
    }
    if (page_index) {
      params = {
        ...params,
        page_index,
        page_size
      }
    }
    service.get(
      basicApi.getDifficultyList,
      {params}
    ).then(res => {
      if (res.status === 200) {
        resolve(res.data);
      } else reject(res);
    }).catch(err => {
      reject(err);
    });
  });
}
function getDifficultyInfo(user_name, session, difficulty_id) {
  return new Promise((resolve, reject) => {
    let params = {
      user_name,
      session,
      difficulty_id
    }
    service.get(basicApi.getDifficultyInfo, {
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

function setDifficulty(user_name, session, difficulty_name, difficulty_id) {
  return new Promise((resolve, reject) => {
    let params = {
      user_name,
      session,
      difficulty_name
    }
    if (difficulty_id) {
      params = {
        ...params,
        difficulty_id
      }
    }
    service.post(
      basicApi.setDifficulty,
      params
    ).then(res => {
      if (res.status === 200) resolve(res.data);
      else reject(res);
    }).catch(err => {
      reject(err);
    })
  });
}
function delDifficulty(user_name, session, difficulty_id) {
  return new Promise((resolve, reject) => {
    let params = {
      user_name,
      session,
      difficulty_id
    }
    service.post(
      basicApi.delDifficulty,
      params
    ).then(res => {
      if (res.status === 200) resolve(res.data);
      else reject(res);
    }).catch(err => {
      reject(err);
    })
  });
}

function getPointList(user_name, session, key_word, page_index, page_size) {
  return new Promise((resolve, reject) => {
    let params = {
      user_name,
      session,
      key_word
    }
    if (page_index) {
      params = {
        ...params,
        page_index,
        page_size
      }
    }
    service.get(
      basicApi.getPointList,
      {params}
    ).then(res => {
      if (res.status === 200) {
        resolve(res.data);
      } else reject(res);
    }).catch(err => {
      reject(err);
    });
  });
}
function getPointInfo(user_name, session, point_id) {
  return new Promise((resolve, reject) => {
    let params = {
      user_name,
      session,
      point_id
    }
    service.get(basicApi.getPointInfo, {
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

function setPoint(user_name, session, point_name, point_id) {
  return new Promise((resolve, reject) => {
    let params = {
      user_name,
      session,
      point_name
    }
    if (point_id) {
      params = {
        ...params,
        point_id
      }
    }
    service.post(
      basicApi.setPoint,
      params
    ).then(res => {
      if (res.status === 200) resolve(res.data);
      else reject(res);
    }).catch(err => {
      reject(err);
    })
  });
}
function delPoint(user_name, session, point_id) {
  return new Promise((resolve, reject) => {
    let params = {
      user_name,
      session,
      point_id
    }
    service.post(
      basicApi.delPoint,
      params
    ).then(res => {
      if (res.status === 200) resolve(res.data);
      else reject(res);
    }).catch(err => {
      reject(err);
    })
  });
}

function getPower(user_name, session) {
  return new Promise((resolve, reject) => {
    let params = {
      user_name,
      session,
    }
    service.get(basicApi.getPower, {
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

const OssImg = axios.create({
  baseURL: config.BASE_URL,
  timeout: 60000,
  responseType: 'json',
  withCredentials: false, // 是否允许带cookie这些
  headers: {
    'Content-Type': 'multipart/form-data;'
  }
})
function getOssPower(user_name, session) {
  return new Promise((resolve, reject) => {
    let params = {
      user_name,
      session,
    }
    OssImg.get(basicApi.getOssPower, {
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
  getQuestionList,
  getQuestionInfo,
  setQuestion,
  delQuestion,
  getDifficultyList,
  getDifficultyInfo,
  setDifficulty,
  delDifficulty,
  getPointList,
  getPointInfo,
  setPoint,
  delPoint,
  getPower,
  getOssPower
}

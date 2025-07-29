import service from "../utils/HttpUtil";
import {
  basicApi,
} from './API';


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

export default {
  getQuestionInfo,
  delQuestion,
}

import service from "../utils/HttpUtil";
import {
  aiAgentApi
} from './API';

function getCompositionList(params) {
  return new Promise((resolve, reject) => {
    service.get(aiAgentApi.getCompositionList, {
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
function getUse(params) {
  return new Promise((resolve, reject) => {
    service.get(aiAgentApi.getUse, {
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
// 新增修改
function saveComposition(params) {
  return new Promise((resolve, reject) => {
    service.post(
      aiAgentApi.saveComposition,
      params
    ).then(res => {
      if (res.status === 200) resolve(res.data);
      else reject(res);
    }).catch(err => {
      reject(err);
    })
  });
}
// 所选择的账号有没有过开通体验的记录
function checkComposition(params) {
  return new Promise((resolve, reject) => {
    service.get(aiAgentApi.checkComposition, {
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
function batchComposition(params) {
  return new Promise((resolve, reject) => {
    service.post(
      aiAgentApi.batchComposition,
      params
    ).then(res => {
      if (res.status === 200) resolve(res.data);
      else reject(res);
    }).catch(err => {
      reject(err);
    })
  });
}
// 删除
function removeComposition(params) {
  return new Promise((resolve, reject) => {
    service.post(
      aiAgentApi.removeComposition,
      params
    ).then(res => {
      if (res.status === 200) resolve(res.data);
      else reject(res);
    }).catch(err => {
      reject(err);
    })
  });
}
function getCompositionDetail(params) {
  return new Promise((resolve, reject) => {
    service.post(
      aiAgentApi.getCompositionDetail,
      params
    ).then(res => {
      if (res.status === 200) resolve(res.data);
      else reject(res);
    }).catch(err => {
      reject(err);
    })
  });
}

// 获取所有的省
function getProvincesList(params) {
  return new Promise((resolve, reject) => {
    service.get(aiAgentApi.getProvincesList, {
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

// 编辑跟新增省
function editProvinces(params) {
  return new Promise((resolve, reject) => {
    service.get(aiAgentApi.editProvinces, {
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

// 删除省市区县
function delAiProvince(params) {
  return new Promise((resolve, reject) => {
    service.post(aiAgentApi.delAiProvince, params).then(res => {
      if (res.status === 200) {
        resolve(res.data);
      } else reject(res);
    }).catch(err => {
      reject(err);
    });
  });
}

// 获取所有的市
function getAiCityList(params) {
  return new Promise((resolve, reject) => {
    service.get(aiAgentApi.getAiCityList, {
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

// 编辑跟新增市
function editAiCity(params) {
  return new Promise((resolve, reject) => {
    service.post(aiAgentApi.editAiCity, params).then(res => {
      if (res.status === 200) {
        resolve(res.data);
      } else reject(res);
    }).catch(err => {
      reject(err);
    });
  });
}

// 获取所有的区县
function getAiCountyList(params) {
  return new Promise((resolve, reject) => {
    service.get(aiAgentApi.getAiCountyList, {
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

// 编辑跟新增区县
function editAiCounty(params) {
  return new Promise((resolve, reject) => {
    service.post(aiAgentApi.editAiCounty, params).then(res => {
      if (res.status === 200) {
        resolve(res.data);
      } else reject(res);
    }).catch(err => {
      reject(err);
    });
  });
}

// 获取所有的学校
function getAiSchoolList(params) {
  return new Promise((resolve, reject) => {
    service.get(aiAgentApi.getAiSchoolList, {
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

// 编辑跟新增学校
function editAiSchool(params) {
  return new Promise((resolve, reject) => {
    service.post(aiAgentApi.editAiSchool, params).then(res => {
      if (res.status === 200) {
        resolve(res.data);
      } else reject(res);
    }).catch(err => {
      reject(err);
    });
  });
}

// 删除学校信息
function delAiSchool(params) {
  return new Promise((resolve, reject) => {
    service.post(aiAgentApi.delAiSchool, params).then(res => {
      if (res.status === 200) {
        resolve(res.data);
      } else reject(res);
    }).catch(err => {
      reject(err);
    });
  });
}

export default {
  getCompositionList,
  saveComposition,
  checkComposition,
  getUse,
  removeComposition,
  batchComposition,
  getCompositionDetail,
  getProvincesList,
  editProvinces,
  delAiProvince,
  getAiCityList,
  editAiCity,
  getAiCountyList,
  editAiCounty,
  getAiSchoolList,
  editAiSchool,
  delAiSchool
}

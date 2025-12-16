
import {
  ref
} from "vue";
import {
  defineStore
} from "pinia";

export const useVocabularyStore = defineStore('vocabulary', () => {
  let expandMenu = ref(true) // 菜单是否展开
  let user_name = ref('');
  let session = ref('');
  let menuTreeLeftList = ref([]) // 左侧tree数据全局
  let powerInfo = ref({})
  let menuItemIndex = ref(sessionStorage.getItem('defaultPath'))
  function setExpandMenu (value) {
    expandMenu.value = value
  }
  function setSession (sessions) {
    session.value = sessions
  }
  function setUserName(user_names) {
    user_name.value = user_names
  }
  function setMenuItemIndex(path) {
    menuItemIndex.value = path
  }
  function setAccountMenuLefTree (list) {
    menuTreeLeftList.value = list
  }

  return {
    setAccountMenuLefTree,
    setMenuItemIndex,
    setSession,
    setUserName,
    user_name,
    menuItemIndex,
    session,
    menuTreeLeftList,
    expandMenu,
    setExpandMenu,
    powerInfo
  }
});

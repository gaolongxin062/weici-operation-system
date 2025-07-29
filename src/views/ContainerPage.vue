<template>
  <div id="app">
    <el-container style="height: 100%;">
      <el-header style="padding: 0;height: 64px;">
        <the-menu></the-menu>
      </el-header>
      <el-container style="height: calc(100% - 64px);" class="home-page">
        <el-aside class="left-side">
          <el-menu :unique-opened="true" :default-active="defaultActive" :router="true" :collapse="isCollapse" class="el-menu-vertical-demo">
            <template v-for="(item, index) in treeList" :key="index">
              <el-menu-item v-if="item.children.length === 0" :index="routering(item.path)">
                <el-icon>
                  <component :is="item.icon"></component>
                </el-icon>
                <span>{{item.menu_name}}</span>
              </el-menu-item>
              <el-sub-menu v-else :index="item.menu_code">
                <template #title>
                  <el-icon>
                    <component :is="item.icon"></component>
                  </el-icon>
                  <span>{{item.menu_name}}</span>
                </template>
                <el-menu-item v-for="(child, childIndex) in item.children" :key="childIndex" :index="routering(child.path)">
                  <el-icon v-if="child.icon">
                    <component :is="child.icon"></component>
                  </el-icon>
                  {{child.menu_name}}
                </el-menu-item>
              </el-sub-menu>
            </template>
          </el-menu>
        </el-aside>
        <el-main style="overflow: hidden;padding: 0;height: 100%;">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick} from 'vue';
import { useVocabularyStore } from '@/store/vocabulary';
import { useRouter } from 'vue-router';
import TheMenu from "../components/TheMenu"
import IndexService from '@/service/IndexService';
let vocabularyStore = useVocabularyStore();
let isCollapse = ref(false)
let treeList = ref([])
const router = useRouter();
let defaultActive = ref('')
onMounted(() => {
  nextTick(() => {
    // vocabularyStore.setExpandMenu(false)
    // isCollapse.value = vocabularyStore.expandMenu
    initTree()
    defaultActive.value = vocabularyStore.menuItemIndex
    // console.log(defaultActive.value)
    router.push({
      path: vocabularyStore.menuItemIndex
    })
  })
  // console.log(defaultActive.value)
})
function initTree () {
  IndexService.accountMenu(vocabularyStore.user_name, vocabularyStore.session).then((res) => {
    if (res.result_code === 200) {
      // console.log(res)

      treeList.value = res.menu
    }
    // console.log(res)
  }).catch((error) => {
    console.log(error)
  })
}
function routering (index) {
  if (index.includes('/')) {
    return index
  } else {
    return '/' + index
  }
}
watch(() => vocabularyStore.expandMenu, (newVal) => {
  isCollapse.value = newVal
})
watch(() => vocabularyStore.menuItemIndex, (newVal) => {
  defaultActive.value = newVal
})
watch(() => vocabularyStore.menuTreeLeftList, (newVal) => {
      treeList.value = newVal
    },
    {
      deep: true
    })

</script>

<style>
html,body {
  margin: 0;
  padding: 0;
  background-color: #ffffff;
  height: 100%;
  width: 100%;
}
a {
  text-decoration: none;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  overflow: hidden;
}

.main {
  width: 100%;
  margin: 0 auto;
  height: 100%;
  overflow: auto;
}
/* .home-page .el-menu{
  border-bottom: solid 1px var(--el-menu-border-color)
} */
/* .el-aside{
  width:100%;
} */
.el-aside {
  overflow: auto;
  box-sizing: border-box;
  flex-shrink: 0;
  width: auto !important;
  border: solid 1px var(--el-menu-border-color)
}
.el-menu{
  border-right: none !important
}

.icons {
  display: inline-block;
  width: 18px;
  height: 18px;
  margin-right: 5px;
  text-align: center;
}
</style>

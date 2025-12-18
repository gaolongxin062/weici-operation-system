// src/router/index.js  
import { createRouter, createWebHashHistory } from 'vue-router'
import { storeToRefs } from 'pinia';
import { useVocabularyStore } from '@/store/vocabulary';
import { pinia } from '@/main';

const routes = [{
    path: '/login',
    name: 'LoginPage',
    component: () => import('../views/LoginPage.vue'),
  },
  {
    path: '/',
    name: 'Container',
    component: () => import( '../views/ContainerPage.vue'),
    children: [
      {
        path: '/home',
        name: 'HomePage',
        component: () => import('../views/HomePage.vue'),
      },
      {
        path: '/sys/user',
        name: 'SysUser',
        component: () => import('../views/sys/SysUser.vue')
      },
      {
        path: '/sys/role',
        name: 'SysRole',
        component: () => import('../views/sys/SysRole.vue'),
      },
      {
        path: '/sys/user/role',
        name: 'SysUserRole',
        component: () => import('../views/sys/SysUserRole.vue'),
      },
      {
        path: '/sys/role/right',
        name: 'SysRoleRight',
        component: () => import('../views/sys/SysRoleRight.vue'),
      },
      {
        path: '/addmenu',
        name: 'SysAddmenu',
        component: () => import('@/views/sys/SysAddmenu.vue')
      },
      {
        path: '/ailisten/member/trial',
        name: 'MemberTrial',
        component: () => import('@/views/ailistening/members/MemberTrial.vue')
      },
      {
        path: '/ailisten/member/create',
        name: 'MemberCreate',
        component: () => import('@/views/ailistening/members/MemberCreate.vue')
      },
      {
        path: '/ailisten/member/buy/package',
        name: 'BuyPackage',
        component: () => import('@/views/ailistening/members/BuyPackage.vue')
      },
      {
        path: '/wordrace/member/trial',
        name: 'WordRaceMemberTrial',
        component: () => import('@/views/wordrace/members/MemberTrial.vue')
      },
      {
        path: '/ai/agent/manage',
        name: 'AiAgent',
        component: () => import('@/views/aiAgent/AiAgent.vue')
      },
      {
        path: '/ai/agent/province',
        name: 'AiProvince',
        component: () => import('@/views/aiAgent/AiProvince.vue')
      },
      {
        path: '/ai/agent/city',
        name: 'AiCity',
        component: () => import('@/views/aiAgent/AiCity.vue')
      },
      {
        path: '/ai/agent/county',
        name: 'AiCounty',
        component: () => import('@/views/aiAgent/AiCounty.vue')
      },
      {
        path: '/ai/agent/school',
        name: 'AiSchool',
        component: () => import('@/views/aiAgent/AiSchool.vue')
      },
      // 作文批改学生权益开通
      {
        path: '/ai/agent/memebers/activation/store',
        name: 'AiAgentMemebersActivationStore',
        component: () => import('@/views/aiAgent/memebers/ActivationStore.vue')
      },
      // 作文批改用户权益
      {
        path: '/ai/agent/memebers/user/rights',
        name: 'AiAgentMemebersUserRights',
        component: () => import('@/views/aiAgent/memebers/UserRights.vue')
      },
      // 产品配置
      {
        path: '/ai/agent/memebers/products/manage',
        name: 'AiAgentMemebersProductsManage',
        component: () => import('@/views/aiAgent/memebers/ProductsManage.vue')
      },
      // 付费码管理
      {
        path: '/ai/agent/memebers/pay/code/manager',
        name: 'AiAgentMemebersPayCodeManager',
        component: () => import('@/views/aiAgent/memebers/PayCodeManager.vue')
      },
      // 订单记录
      {
        path: '/ai/agent/memebers/order/record',
        name: 'AiAgentMemebersOrderRecord',
        component: () => import('@/views/aiAgent/memebers/OrderRecord.vue')
      },
      // 作文批改学生权益记录
      {
        path: '/ai/agent/memebers/student/rights/record',
        name: 'AiAgentMemebersStudentRightsRecord',
        component: () => import('@/views/aiAgent/memebers/StudentRightsRecord.vue')
      },
      {
        path: '/teacher/certification',
        name: 'TeacherCertification',
        component: () => import('@/views/review/TeacherCertification.vue')
      },
      {
        path: '/dealer/job',
        name: 'DealerJob',
        component: () => import('@/views/dealer/JobInfo.vue')
      },
      {
        path: '/dealer/info',
        name: 'DealerInfo',
        component: () => import('@/views/dealer/DealerInfo.vue')
      },
      {
        path: '/dealer/notice',
        name: 'NoticeManage',
        component: () => import('@/views/dealer/NoticeManage.vue')
      }
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  const vocabularyStore = useVocabularyStore(pinia);
  const { session } = storeToRefs(vocabularyStore);
  vocabularyStore.setMenuItemIndex(to.path === '/' ? sessionStorage.getItem('defaultPath') : to.path);
  if (session.value === '') {
    vocabularyStore.setExpandMenu(false);
    vocabularyStore.setUserName(sessionStorage.getItem('user_name'));
    vocabularyStore.setSession(sessionStorage.getItem('session'));
  }
  next();
});

export default router
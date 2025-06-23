import Vue from 'vue';
import VueRouter from 'vue-router';
// 导入需要跳转的组件（根据用户实际组件路径调整）
import TextClickAnimation from '@/components/TextClickAnimation.vue';
import VantaBackground from '@/components/VantaBackground.vue';

// 安装Vue Router插件
Vue.use(VueRouter);

// 定义路由规则（路径与组件的映射）
const routes = [
  { path: '/', name: 'Home', component: TextClickAnimation }, // 默认跳转至文字动画页面
  { path: '/vanta', name: 'Vanta', component: VantaBackground } // 跳转到Vanta背景组件
];

// 创建路由实例
const router = new VueRouter({ routes });

export default router;
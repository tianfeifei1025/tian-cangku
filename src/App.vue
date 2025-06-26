<template>
  <div id="app">
    <el-button type="success" @click="toggleXingYun">显示/隐藏星云关系图</el-button>

    <!-- 使用Vanta背景组件 -->
    <VantaBackground effect="BIRDS" color="#42b983" speed="1.5" />
    <!-- 使用文字点击动画组件 -->
    <TextClickAnimation />
    
    <XingYun v-if="showXingYun" />
  </div>
</template>

<script>
import VantaBackground from './components/VantaBackground.vue'
import TextClickAnimation from './components/TextClickAnimation.vue'
import XingYun from './components/xingyun.vue'

export default {  
  name: 'App',
  components: {    
      VantaBackground, // 注册Vanta背景组件
      TextClickAnimation, // 注册文字点击动画组件
      XingYun, // 注册星空组件
  },
  data() {
    return {
      showXingYun: false // 初始状态为隐藏星云图
    }
  },
  methods: {
    toggleXingYun() {
      // 点击按钮时切换显示状态
      this.showXingYun = !this.showXingYun
    }
  }
}
</script>

<style>
#app {  
  text-align: center;
  padding: 20px;
  /* 确保内容不被背景遮挡（根据需要调整） */
  position: relative;
  z-index: 1;
}
</style>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

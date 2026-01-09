<template>
  <div id="app">
    <!-- 使用Vanta背景组件 -->
    <VantaBackground effect="BIRDS" color="#42b983" speed="1.5" />
    <!-- 使用文字点击动画组件 -->
    <TextClickAnimation />
  </div>
</template>

<script>
import VantaBackground from './components/VantaBackground.vue'
import TextClickAnimation from './components/TextClickAnimation.vue'

export default {  
  name: 'App',
  components: {    
      VantaBackground, // 注册Vanta背景组件
      TextClickAnimation, // 注册文字点击动画组件
  },

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

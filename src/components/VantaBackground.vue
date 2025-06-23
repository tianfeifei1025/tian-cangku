<template>
  <div ref="vantaContainer" class="vanta-container"></div>
</template>

<script>
import VantaBirds from 'vanta/dist/vanta.clouds.min'
import * as THREE from 'three'
export default {
  data() { return { vantaInstance: null } },
  mounted() {
    this.vantaInstance = VantaBirds({  // 初始化Vanta的鸟类动画实例，并赋值给组件实例属性vantaInstance
      el: this.$refs.vantaContainer,  // 指定动画挂载的DOM元素（通过ref属性获取容器）
      THREE: THREE,  // 传入Three.js库（Vanta依赖Three.js进行3D渲染）
      mouseControls: true,  // 启用鼠标控制（通过鼠标移动交互影响动画）
      touchControls: true,  // 启用触摸控制（适用于移动端）
      gyroControls: false,  // 禁用陀螺仪控制（设备倾斜不影响动画）
      minHeight: 200.00,  // 动画容器的最小高度（单位：像素）
      minWidth: 200.00,  // 动画容器的最小宽度（单位：像素）
      speed: 3.00,  // 鸟类飞行的速度（数值越大，速度越快）
      skyColor: 0xb5ff,  // 天空背景颜色（十六进制颜色值，0xb5ff对应浅青色）
    })
  },
  beforeUnmount() {
    this.vantaInstance?.destroy()
  }
}
</script>

<style>
.vanta-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
}
</style>
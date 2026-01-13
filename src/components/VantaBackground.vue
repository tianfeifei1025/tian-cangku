<template>
  <div ref="vantaContainer" class="vanta-container"></div>
</template>

<script>
import VantaClouds from 'vanta/dist/vanta.clouds.min'
import * as THREE from 'three'

export default {
  name: 'VantaBackground',
  props: {
    // 与 App.vue 的 theme 联动：dark / light
    theme: {
      type: String,
      default: 'dark',
    },
  },
  data() {
    return {
      vantaInstance: null,
    }
  },
  watch: {
    theme: {
      immediate: true,
      handler() {
        // theme 变化时重建实例（Vanta 对动态改 options 的兼容性不稳定）
        this.rebuild()
      },
    },
  },
  mounted() {
    this.rebuild()
  },
  beforeUnmount() {
    if (this.vantaInstance) this.vantaInstance.destroy()
  },
  methods: {
    getOptions() {
      // 夜晚（你当前用的设置）
      const night = {
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        speed: 1,
        skyColor: 0x0b1020,
        cloudColor: 0x1a2a3a,
        cloudShadowColor: 0x101826,
        sunColor: 0x42b983,
        sunGlareColor: 0x7a64ff,
        sunlightColor: 0x42b983,
      }

      // 白天（按你给的 birds 那段参数需求）
      const day = {
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        skyColor: 0xb5ff,
        speed: 0.8,
      }

      return this.theme === 'light' ? day : night
    },
    rebuild() {
      if (!this.$refs.vantaContainer) return
      if (this.vantaInstance) {
        this.vantaInstance.destroy()
        this.vantaInstance = null
      }

      this.vantaInstance = VantaClouds({
        el: this.$refs.vantaContainer,
        THREE,
        ...this.getOptions(),
      })
    },
  },
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

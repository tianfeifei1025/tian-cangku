<template>
  <div class="container">
    <div ref="textContainer" class="text-content">
      这是一段会拆分动画的文字，点击按钮查看效果！
    </div>
    <button @click="handleAnimate">点击触发动画</button>
  </div>
</template>

<script>
import { gsap } from 'gsap'
import Splitting from 'splitting' // 导入文字拆分库

export default { 
  data() {
    return { 
      splitInstance: null, // 存储文字拆分实例
      isAnimated: false // 标记动画是否已触发（防止重复触发）
    }
  },
  mounted() {
    // 组件挂载后初始化文字拆分（确保DOM已渲染）
    this.$nextTick(() => {
      // 初始化Splitting拆分（按字符拆分）
      this.splitInstance = Splitting({ 
        target: this.$refs.textContainer, 
        by: 'chars', 
        key: 'textAnimation' // 唯一标识避免冲突
      })[0]
      // 初始隐藏所有拆分的字符（通过GSAP设置初始状态）
      gsap.set(this.splitInstance.chars, { opacity: 0, y: 80 })
    })
  },
  methods: {
    handleAnimate() {
      // 防止重复触发动画
      if (this.isAnimated) return
      this.isAnimated = true

      const chars = this.splitInstance?.chars
      if (!chars || chars.length === 0) {
        console.error('文字拆分失败，未获取到字符元素')
        return
      }

      // 执行动画：从下往上渐显
      gsap.to(chars, {
        duration: 1.2, 
        opacity: 1, // 从透明到完全显示
        y: 0, // 从下方80px移动到原位置
        rotationX: 0, // 旋转恢复为0度（正面显示）
        transformOrigin: '50% bottom', // 旋转原点（底部中心）
        ease: 'power4.out', // 缓动函数（加速后减速）
        stagger: 0.08, // 字符逐个播放（间隔0.08秒）
        onComplete: () => {
          console.log('动画完成')
          this.isAnimated = false // 允许再次触发
        }
      })
    }
  }
}
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 2rem;
}

.text-content {
  /* 容器初始不隐藏（字符级隐藏由GSAP控制） */
  opacity: 1;
  font-size: 2.5rem;
  font-weight: bold;
  color: #2c3e50;
  font-family: 'Mori', sans-serif;
}

/* Splitting生成的字符样式 */
.char {
  display: inline-block; /* 确保字符可以独立动画 */
}

button {
  padding: 0.8rem 1.5rem;
  font-size: 1.1rem;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

button:hover {
  background: #359b6d;
}
</style>
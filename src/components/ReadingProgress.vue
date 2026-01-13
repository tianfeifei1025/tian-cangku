<template>
  <div class="progress" :style="{ '--p': progress + '%' }" aria-hidden="true">
    <div class="bar"></div>
  </div>
</template>

<script>
export default {
  name: 'ReadingProgress',
  data() {
    return {
      progress: 0,
      raf: 0,
    }
  },
  mounted() {
    this.onScroll = this.onScroll.bind(this)
    window.addEventListener('scroll', this.onScroll, { passive: true })
    this.onScroll()
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.onScroll)
    cancelAnimationFrame(this.raf)
  },
  methods: {
    onScroll() {
      cancelAnimationFrame(this.raf)
      this.raf = requestAnimationFrame(() => {
        const doc = document.documentElement
        const scrollTop = doc.scrollTop || document.body.scrollTop
        const scrollHeight = doc.scrollHeight || document.body.scrollHeight
        const clientHeight = doc.clientHeight || window.innerHeight
        const total = Math.max(scrollHeight - clientHeight, 1)
        const p = Math.min(100, Math.max(0, (scrollTop / total) * 100))
        this.progress = Number(p.toFixed(2))
      })
    },
  },
}
</script>

<style scoped>
.progress {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 3px;
  z-index: 999;
  pointer-events: none;
  background: transparent;
}

.bar {
  height: 100%;
  width: var(--p);
  background: linear-gradient(90deg, rgba(66, 185, 131, 1), rgba(122, 100, 255, 1));
  box-shadow: 0 0 16px rgba(66, 185, 131, 0.35);
  border-radius: 999px;
}
</style>


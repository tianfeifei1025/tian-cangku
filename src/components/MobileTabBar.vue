<template>
  <nav class="tabbar" :class="{ show: visible }" role="navigation" aria-label="底部导航" data-tabbar>
    <router-link class="tab" to="/" exact>
      <span class="icon">🏠</span>
      <span class="label">首页</span>
    </router-link>

    <button class="tab" type="button" @click="$emit('open-sidebar')">
      <span class="icon">👤</span>
      <span class="label">名片</span>
    </button>

    <router-link class="tab" to="/about" exact>
      <span class="icon">📌</span>
      <span class="label">关于</span>
    </router-link>

    <router-link class="tab" to="/calendar" exact>
      <span class="icon">📅</span>
      <span class="label">日历</span>
    </router-link>
  </nav>
</template>

<script>
export default {
  name: 'MobileTabBar',
  data() {
    return {
      visible: false,
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
    scrollTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    onScroll() {
      cancelAnimationFrame(this.raf)
      this.raf = requestAnimationFrame(() => {
        const doc = document.documentElement
        const scrollTop = doc.scrollTop || document.body.scrollTop
        const scrollHeight = doc.scrollHeight || document.body.scrollHeight
        const clientHeight = doc.clientHeight || window.innerHeight
        
        // 判断是否滚动到底部（允许 5px 的误差）
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 5
        
        // 只有在滚动到底部时才显示
        this.visible = isAtBottom
      })
    },
  },
}
</script>

<style scoped>
.tabbar {
  position: fixed;
  left: 50%;
  bottom: 10px;
  transform: translateX(-50%) translateY(12px);
  width: min(520px, calc(100% - 16px));
  z-index: 120;
  display: none;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  padding: 10px;
  border-radius: 18px;
  border: 1px solid var(--border);
  /* 更“实心”的底部栏，减少透出背景造成的乱 */
  background: rgba(12, 16, 28, 0.92);
  backdrop-filter: blur(18px);
  box-shadow: var(--shadow);
  opacity: 0;
  transition: transform 0.18s ease, opacity 0.18s ease;
}

.tabbar.show {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

.tab {
  appearance: none;
  border: 1px solid transparent;
  background: transparent;
  color: var(--muted);
  border-radius: 16px;
  padding: 10px 8px;
  cursor: pointer;
  display: grid;
  place-items: center;
  gap: 6px;
  transition: 0.18s ease;
  text-decoration: none;
  font: inherit;
}

.tab:hover {
  color: var(--text);
  background: rgba(255, 255, 255, 0.08);
}

.tab.router-link-exact-active {
  color: var(--text);
  background: rgba(66, 185, 131, 0.18);
  border-color: rgba(66, 185, 131, 0.25);
}

.icon {
  font-size: 18px;
  line-height: 1;
}

.label {
  font-size: 12px;
}

@media (max-width: 600px) {
  .tabbar {
    display: grid;
  }
}
</style>

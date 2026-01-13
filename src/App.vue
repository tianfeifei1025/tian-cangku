<template>
  <div id="app" :data-theme="vantaTheme">
    <!-- 阅读进度条 -->
    <ReadingProgress />

    <!-- 背景层（Vanta） -->
    <VantaBackground :theme="vantaTheme" />

    <!-- 顶部导航 -->
    <header class="topbar">
      <div class="brand" @click="$router.push('/')">
        <span class="dot" />
        <span class="title">田饱肚儿的个人博客</span>
      </div>

      <nav class="nav">
        <router-link class="nav-link" to="/">首页</router-link>
        <router-link class="nav-link" to="/calendar">日历</router-link>
        <router-link class="nav-link" to="/about">关于MI</router-link>
      </nav>

      <div class="actions">
        <button
          ref="themeBtn"
          class="icon-btn"
          @click="toggleVantaTheme"
          :title="vantaTheme === 'dark' ? '切换到白天' : '切换到夜晚'"
        >
          <span v-if="vantaTheme === 'dark'">🌙</span>
          <span v-else>☀️</span>
        </button>
        <button class="btn" @click="drawerOpen = true">菜单</button>
      </div>
    </header>

    <!-- 移动端抽屉 -->
    <div class="drawer-mask" v-if="drawerOpen" @click="drawerOpen = false"></div>
    <aside class="drawer" :class="{ open: drawerOpen }">
      <div class="drawer-head">
        <div class="drawer-title">导航</div>
        <button class="icon-btn" @click="drawerOpen = false" title="关闭">✕</button>
      </div>
      <router-link class="drawer-link" to="/" @click="drawerOpen = false">首页</router-link>
      <router-link class="drawer-link" to="/calendar" @click="drawerOpen = false">日历</router-link>
      <router-link class="drawer-link" to="/about" @click="drawerOpen = false">关于MI</router-link>
      <div class="drawer-sep" />
      <div class="drawer-meta">
        <div class="meta-k">当前主题</div>
        <div class="meta-v">{{ vantaTheme === 'dark' ? '夜晚' : '白天' }}</div>
      </div>
    </aside>

    <!-- 主体布局 -->
    <main class="layout main">
      <section class="content">
        <router-view />
      </section>

      <aside class="sidebar" v-if="!isMobile">
        <div class="card glass">
          <div class="card-title">个人名片</div>
          <div class="card-body">
            <div class="avatar"></div>
            <div class="name">田饱肚儿</div>
            <div class="bio">记录生活、前端、随想。做一个有互动、有温度的博客。</div>
            <div class="tags">
              <span class="tag">Vue2</span>
              <span class="tag">HTML</span>
              <span class="tag">CSS</span>
              <span class="tag">JS</span>
              <span class="tag">ES6</span>
              <span class="tag">Webpack</span>
              <span class="tag">Vite</span>
              <span class="tag">Echarts</span>
              <span class="tag">Axios</span>
              <span class="tag">Vuex</span>
              <span class="tag">Vue-CLI</span>
              <span class="tag">Vue-Router</span>
            </div>
          </div>
        </div>

        <HotRanking />

        <div class="card glass">
          <div class="card-title">快捷操作</div>
          <div class="card-body">
            <router-link to="/calendar" class="btn ghost" style="width: 100%; margin-bottom: 10px; display: flex; align-items: center; justify-content: center; box-sizing: border-box;">打开日历</router-link>
            <button class="btn ghost" @click="scrollTop" style="width: 100%;">回到顶部</button>
          </div>
        </div>
      </aside>
    </main>

    <!-- 手机端：底部Tab栏 -->
    <MobileTabBar @open-sidebar="mobileSidebarOpen = true" />

    <!-- 手机端：名片弹层（把侧边栏内容放进来） -->
    <div class="modal-mask" v-if="mobileSidebarOpen" @click="mobileSidebarOpen = false"></div>
    <div class="mobile-panel glass" v-if="mobileSidebarOpen">
      <div class="mobile-panel-head">
        <div class="mobile-panel-title">个人名片</div>
        <button class="icon-btn" @click="mobileSidebarOpen = false" title="关闭">✕</button>
      </div>
      <div class="mobile-panel-body">
        <div class="avatar"></div>
        <div class="name">田饱肚儿</div>
        <div class="mobile-sub">前端 · 动效 · 随笔</div>
        <div class="bio">记录生活、前端、随想。做一个有互动、有温度的博客。</div>
        <div class="tags">
          <span class="tag">Vue2</span>
          <span class="tag">动画</span>
          <span class="tag">随笔</span>
        </div>
        <div style="height: 12px"></div>
        <button class="btn ghost mobile-primary" style="width: 100%" @click="scrollTop">回到顶部</button>
      </div>
    </div>

    <footer class="footer">
      <span>© {{ new Date().getFullYear() }}田饱肚儿的个人博客</span>
      <span class="sep">·</span>
      <a class="link" href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
    </footer>
  </div>
</template>

<script>
import VantaBackground from './components/VantaBackground.vue'
import ReadingProgress from './components/ReadingProgress.vue'
import MobileTabBar from './components/MobileTabBar.vue'
import HotRanking from './components/HotRanking.vue'

export default {
  name: 'App',
  components: {
    VantaBackground,
    ReadingProgress,
    MobileTabBar,
    HotRanking,
  },
  data() {
    return {
      // 仅控制 Vanta 背景：dark(夜) / light(昼)
      vantaTheme: 'dark',
      drawerOpen: false,
      mobileSidebarOpen: false,
      isMobile: false,
    }
  },
  created() {
    // 背景主题：优先用户手动选择，其次按时间自动
    const saved = localStorage.getItem('vanta_theme')
    if (saved === 'light' || saved === 'dark') {
      this.vantaTheme = saved
    } else {
      this.vantaTheme = this.getAutoVantaTheme()
    }

    // 每分钟检查一次时间（仅在没有手动选择时自动更新）
    this.autoTimer = window.setInterval(() => {
      const manual = localStorage.getItem('vanta_theme')
      if (manual === 'light' || manual === 'dark') return
      this.vantaTheme = this.getAutoVantaTheme()
    }, 60 * 1000)

    this.onResize = () => {
      this.isMobile = window.innerWidth <= 600
      if (!this.isMobile) this.mobileSidebarOpen = false
    }
  },
  mounted() {
    this.onResize && this.onResize()
    window.addEventListener('resize', this.onResize, { passive: true })
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.onResize)
    if (this.autoTimer) window.clearInterval(this.autoTimer)
  },
  methods: {
    getAutoVantaTheme() {
      const h = new Date().getHours()
      // 06:00 ~ 17:59 为白天，其余为夜晚
      return h >= 6 && h < 18 ? 'light' : 'dark'
    },
    toggleVantaTheme() {
      // 点击按钮：立即切换，并写入本地，覆盖自动模式
      this.vantaTheme = this.vantaTheme === 'dark' ? 'light' : 'dark'
      localStorage.setItem('vanta_theme', this.vantaTheme)
    },
    scrollTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
  },
}
</script>

<style>
:root {
  --page-gutter: 16px;

  /* 夜晚默认：深色文字在深色玻璃卡片上更清晰 */
  --bg: #0b1020;
  --panel: rgba(255, 255, 255, 0.08);
  --panel-strong: rgba(255, 255, 255, 0.12);
  --text: rgba(255, 255, 255, 0.92);
  --muted: rgba(255, 255, 255, 0.72);
  --border: rgba(255, 255, 255, 0.18);
  --brand: #42b983;
  --shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
}

/* 白天：调整UI元素以适应亮色背景，提升高级感 */
#app[data-theme='light'] {
  --text: rgba(10, 20, 40, 0.92);
  --muted: rgba(10, 20, 40, 0.72);
  --border: rgba(10, 20, 40, 0.15);
  --shadow: 0 10px 30px rgba(10, 20, 40, 0.12);

  /* 卡片玻璃效果微调，使其在亮背景下更清晰 */
  --panel: rgba(255, 255, 255, 0.45);
  --panel-strong: rgba(255, 255, 255, 0.65);
}

/* 白天模式下，给标题区域增加一个淡淡的背景，增强层次感 */
#app[data-theme='light'] .card-title {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(10, 20, 40, 0.1);
}

/* 白天模式下，抽屉菜单使用更“实”的亮色背景 */
#app[data-theme='light'] .drawer,
#app[data-theme='light'] .mobile-panel {
  /* 白天：背景别太白，压暗一点更高级且更衬字 */
  background: rgba(235, 240, 252, 0.92);
  backdrop-filter: blur(18px);
}

/* 白天模式下，底部 TabBar 也使用亮色背景 */
#app[data-theme='light'] .tabbar {
  background: rgba(235, 240, 252, 0.75);
  backdrop-filter: blur(14px);
}




html,
body {
  height: 100%;
}

body {
  margin: 0;
  overflow-x: hidden;
  background: radial-gradient(1200px 600px at 10% 10%, rgba(66, 185, 131, 0.22), transparent 55%),
    radial-gradient(900px 500px at 80% 20%, rgba(120, 100, 255, 0.22), transparent 55%),
    var(--bg);
  color: var(--text);
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji",
    "Segoe UI Emoji";
}

/* 白天模式下给正文一个很轻的阴影，提高在亮背景上的可读性（不改变卡片背景） */
#app[data-theme='light'] {
  /* 白天：去掉白色文字阴影（会让浅色区域发灰），改成更自然的深色阴影 */
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.08);
}
#app[data-theme='light'] .brand .title,
#app[data-theme='light'] .card-title,
#app[data-theme='light'] .drawer-title,
#app[data-theme='light'] .mobile-panel-title {
  color: rgba(10, 20, 40, 0.98);
}

/* 白天：确保名片弹层里的正文也是深色 */
#app[data-theme='light'] .mobile-panel-body {
  color: var(--muted);
}


#app {
  min-height: 100vh;
  position: relative;
  z-index: 1; /* 盖住背景 */
  overflow-x: hidden; /* 避免移动端/阴影造成横向溢出 */
  display: flex;
  flex-direction: column;
}

a {
  color: inherit;
  text-decoration: none;
}

/* 顶部导航 */
.topbar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 18px;
  box-sizing: border-box;
  margin: 16px auto 0;
  width: min(1100px, calc(100% - (var(--page-gutter) * 2)));
  border: 1px solid var(--border);
  background: linear-gradient(180deg, var(--panel-strong), var(--panel));
  backdrop-filter: blur(12px);
  border-radius: 14px;
  box-shadow: var(--shadow);
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
}

.brand .dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: var(--brand);
  box-shadow: 0 0 0 6px rgba(66, 185, 131, 0.18);
}

.brand .title {
  font-weight: 800;
  letter-spacing: 0.2px;
}

.nav {
  display: flex;
  align-items: center;
  gap: 10px;
}

.nav-link {
  padding: 8px 10px;
  border-radius: 10px;
  color: var(--muted);
  transition: 0.2s ease;
}

.nav-link.router-link-exact-active {
  color: var(--text);
  background: rgba(66, 185, 131, 0.18);
  border: 1px solid rgba(66, 185, 131, 0.25);
}

.nav-link:hover {
  color: var(--text);
  background: rgba(255, 255, 255, 0.08);
}

.actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.icon-btn {
  height: 36px;
  width: 36px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.06);
  color: var(--text);
  cursor: pointer;
  transition: transform 0.15s ease, background 0.2s ease;
}

.icon-btn:hover {
  transform: translateY(-1px);
  background: rgba(255, 255, 255, 0.12);
}

.btn {
  height: 36px;
  padding: 0 12px;
  border-radius: 12px;
  border: 1px solid rgba(66, 185, 131, 0.35);
  background: rgba(66, 185, 131, 0.18);
  color: var(--text);
  cursor: pointer;
  transition: 0.2s ease;
  font-size: 16px;
}

.btn:hover {
  background: rgba(66, 185, 131, 0.26);
}

.btn.ghost {
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.06);
}

.btn.ghost:hover {
  background: rgba(255, 255, 255, 0.12);
}

/* 名片弹层的主按钮：更像“行动按钮” */
.mobile-primary {
  border-color: rgba(66, 185, 131, 0.45);
  background: rgba(66, 185, 131, 0.18);
  font-weight: 800;
}

#app[data-theme='light'] .mobile-primary {
  background: rgba(66, 185, 131, 0.14);
}

/* 布局 */
.layout {
  width: min(1100px, calc(100% - (var(--page-gutter) * 2)));
  margin: 18px auto 0;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 16px;
  align-items: start;
}

.content {
  min-height: 60vh;
}

/* sticky footer：主内容区占满剩余高度，footer 在内容不足时贴底 */
.main {
  flex: 1 0 auto;
}

.footer {
  margin-top: auto;
}

.sidebar {
  position: sticky;
  top: 92px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.card {
  border: 1px solid var(--border);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--shadow);
}

.glass {
  background: linear-gradient(180deg, var(--panel-strong), var(--panel));
  backdrop-filter: blur(12px);
}

.card-title {
  padding: 12px 14px;
  font-weight: 700;
  border-bottom: 1px solid var(--border);
}

.card-body {
  padding: 14px;
  color: var(--muted);
}

.avatar {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(66, 185, 131, 0.9), rgba(120, 100, 255, 0.9));
  box-shadow: 0 12px 30px rgba(66, 185, 131, 0.22);
  margin-bottom: 10px;
}

.name {
  color: var(--text);
  font-weight: 800;
  margin-bottom: 6px;
}

.bio {
  line-height: 1.6;
  margin-bottom: 10px;
}

.mobile-sub {
  margin-top: -2px;
  margin-bottom: 10px;
  font-size: 12px;
  color: var(--muted);
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  font-size: 12px;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.06);
  color: var(--text);
}

/* 通用遮罩（用于抽屉/弹层） */
.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  z-index: 80;
}

/* 抽屉 */
.drawer-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.62);
  z-index: 50;
}

.drawer {
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: min(320px, 86vw);
  transform: translateX(110%);
  transition: transform 0.22s ease;
  z-index: 60;
  border-left: 1px solid var(--border);
  /* 手机端抽屉改成更“实心”的面板，避免半透明叠加显乱 */
  background: rgba(12, 16, 28, 0.96);
  backdrop-filter: blur(18px);
  padding: 14px;
}

.drawer.open {
  transform: translateX(0);
}

.drawer-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 10px;
}

.drawer-title {
  font-weight: 800;
}

.drawer-link {
  display: block;
  padding: 10px 10px;
  border-radius: 12px;
  color: var(--muted);
  margin-top: 8px;
  border: 1px solid transparent;
}

.drawer-link.router-link-exact-active {
  color: var(--text);
  background: rgba(66, 185, 131, 0.18);
  border-color: rgba(66, 185, 131, 0.25);
}

.drawer-link:hover {
  color: var(--text);
  background: rgba(255, 255, 255, 0.1);
}

.drawer-sep {
  height: 1px;
  background: var(--border);
  margin: 14px 0;
}

.drawer-meta {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
  align-items: center;
  color: var(--muted);
}

.meta-k {
  font-size: 12px;
}

.meta-v {
  font-size: 12px;
  color: var(--text);
}

/* Footer */
.footer {
  width: min(1100px, calc(100% - (var(--page-gutter) * 2)));
  margin: 18px auto 22px;
  padding: 12px 6px;
  color: var(--muted);
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
}

/* 手机端：footer 往上挪，避免被底部tabbar挡住 */

.footer .link {
  color: var(--text);
  opacity: 0.85;
}

.footer .link:hover {
  opacity: 1;
  text-decoration: underline;
}

/* 响应式 */
/* 手机端名片弹层 */
.mobile-panel {
  position: fixed;
  left: 50%;
  bottom: 100px; /* 避开底部tabbar */
  transform: translateX(-50%);
  width: min(520px, calc(100% - 16px));
  z-index: 130;
  border-radius: 22px;
  border: 1px solid color-mix(in srgb, var(--border) 70%, transparent);
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.35);
  overflow: hidden;
  animation: pop-up 0.22s ease;
  isolation: isolate;
}

/* 给面板加一点“光晕边缘”，更高级 */
.mobile-panel::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(800px 240px at 30% 0%, rgba(255, 255, 255, 0.22), transparent 55%),
    radial-gradient(600px 220px at 90% 10%, rgba(66, 185, 131, 0.18), transparent 60%);
  opacity: 0.65;
  z-index: 0;
}

.mobile-panel > * {
  position: relative;
  z-index: 1;
}

@keyframes pop-up {
  from {
    opacity: 0;
    transform: translate(-50%, 20px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0) scale(1);
  }
}

.mobile-panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 14px 12px;
  border-bottom: 1px solid color-mix(in srgb, var(--border) 70%, transparent);
}

.mobile-panel-title {
  font-weight: 900;
  letter-spacing: 0.2px;
}

.mobile-panel-body {
  padding: 14px;
  text-align: center;
}

.mobile-panel-body .avatar {
  margin: 2px auto 10px;
  width: 64px;
  height: 64px;
  border-radius: 18px;
  box-shadow: 0 18px 40px rgba(66, 185, 131, 0.22);
}

/* 响应式 */
@media (max-width: 980px) {
  .layout {
    grid-template-columns: 1fr;
  }
  .sidebar {
    position: static;
  }
}

/* 手机端：增加一种“紧凑展示”样式，避免边框看起来不齐 */
@media (max-width: 600px) {
  :root {
    --page-gutter: 8px;
  }

  /* 统一手机端左右留白，保证内容区与顶部对齐 */
  .layout {
    width: calc(100% - (var(--page-gutter) * 2));
    margin: 12px auto 0;
    gap: 12px;
  }

  .topbar {
    width: calc(100% - (var(--page-gutter) * 2));
    margin: 10px auto 0;
    padding: 12px;
    border-radius: 16px;
    box-sizing: border-box;
  }

  .nav {
    display: none; /* 手机端用抽屉代替 */
  }

  .actions {
    gap: 8px;
  }

  .layout {
    width: calc(100% - (var(--page-gutter) * 2));
    margin: 12px auto 0;
    gap: 12px;
  }

  .content,
  .sidebar {
    width: 100%;
  }

  .card {
    border-radius: 18px;
  }

  .footer {
    width: calc(100% - (var(--page-gutter) * 2));
    margin: 14px auto 18px;
    flex-wrap: wrap;
    margin-bottom: 100px;
  }
}
</style>

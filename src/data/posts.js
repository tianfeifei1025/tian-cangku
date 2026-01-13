// 文章数据：先用本地数据，后续可替换为 API/CMS
// 约定字段：id/title/date/tags/desc/content(md)

export const posts = [
  {
    id: 'p1',
    title: '第一篇：把项目改造成个人博客（Vue2）',
    date: '2026-01-09',
    tags: ['Vue2', '布局', 'CSS'],
    desc: '从背景动效到布局搭建：顶部导航、侧边栏、卡片动效与主题切换。',
    content: `# 把项目改造成个人博客（Vue2）

这是一篇示例文章：我们会逐步把这个项目变成更像博客的形态。

## 目标

- 首页文章列表：搜索/标签筛选
- 文章详情页：可分享链接
- Markdown 渲染 + 代码高亮

## 一段代码

\`\`\`js
export function hello(name) {
  return 'Hello ' + name
}
\`\`\`

> 后续可以把内容改成 Markdown 渲染、加上评论、归档页等。
`,
  },
  {
    id: 'p2',
    title: '一些动效小技巧：hover、微交互与玻璃拟态',
    date: '2026-01-08',
    tags: ['动效', 'CSS'],
    desc: '卡片在 hover 时抬升、光晕扫过；模态弹层进入动画；按钮轻微位移。',
    content: `# 动效小技巧

视觉质感主要靠：透明层 + blur + 细边框 + 柔和阴影。

## 建议

- 动效不要太重：0.15~0.25s 的位移/透明/缩放更“高级”。
- 移动端优先：抽屉导航、底部 Tab、触摸区域更大。
`,
  },
  {
    id: 'p3',
    title: '如何让博客更"可玩"：点赞、收藏、阅读进度条',
    date: '2026-01-05',
    tags: ['交互', '组件'],
    desc: '把喜欢的数据存到 localStorage，再做成排行榜/热度；再加阅读进度条更有沉浸感。',
    content: `# 让博客更"可玩"

点赞/收藏这种交互很适合用本地持久化：localStorage。

## 阅读进度条

监听 scroll，根据 documentElement.scrollTop 计算百分比即可。
`,
  },
  {
    id: 'p4',
    title: 'Vue2 响应式原理深度解析',
    date: '2026-01-12',
    tags: ['Vue2', '原理', 'JavaScript'],
    desc: '深入理解 Vue2 的响应式系统：Object.defineProperty、依赖收集、派发更新的完整流程。',
    content: `# Vue2 响应式原理深度解析

Vue2 的响应式系统是其核心特性之一，它通过数据劫持实现了数据的自动更新。本文将深入探讨其实现原理。

## 核心机制：Object.defineProperty

Vue2 使用 \`Object.defineProperty\` 来劫持对象的属性，在属性被访问和修改时进行拦截。

\`\`\`javascript
// 简化的响应式实现
function defineReactive(obj, key, val) {
  const dep = new Dep() // 依赖收集器
  
  Object.defineProperty(obj, key, {
    get() {
      // 依赖收集
      if (Dep.target) {
        dep.addSub(Dep.target)
      }
      return val
    },
    set(newVal) {
      if (newVal === val) return
      val = newVal
      // 派发更新
      dep.notify()
    }
  })
}
\`\`\`

## 依赖收集与派发更新

### Watcher 的作用

每个组件实例都对应一个 Watcher 实例，它会在组件渲染过程中把"接触"过的数据属性记录为依赖。

\`\`\`javascript
class Watcher {
  constructor(vm, expOrFn, cb) {
    this.vm = vm
    this.getter = expOrFn
    this.cb = cb
    this.value = this.get()
  }
  
  get() {
    Dep.target = this // 设置当前 Watcher
    const value = this.getter.call(this.vm)
    Dep.target = null
    return value
  }
  
  update() {
    const oldValue = this.value
    this.value = this.get()
    this.cb.call(this.vm, this.value, oldValue)
  }
}
\`\`\`

### Dep 依赖管理器

Dep 负责管理所有的 Watcher，当数据变化时通知所有依赖。

\`\`\`javascript
class Dep {
  constructor() {
    this.subs = []
  }
  
  addSub(sub) {
    this.subs.push(sub)
  }
  
  notify() {
    this.subs.forEach(sub => sub.update())
  }
}
\`\`\`

## 数组的特殊处理

由于 \`Object.defineProperty\` 无法监听数组的变化，Vue2 对数组方法进行了重写。

\`\`\`javascript
const arrayProto = Array.prototype
const arrayMethods = Object.create(arrayProto)

const methodsToPatch = [
  'push', 'pop', 'shift', 'unshift',
  'splice', 'sort', 'reverse'
]

methodsToPatch.forEach(method => {
  const original = arrayProto[method]
  arrayMethods[method] = function(...args) {
    const result = original.apply(this, args)
    const ob = this.__ob__
    ob.dep.notify() // 通知更新
    return result
  }
})
\`\`\`

## 总结

Vue2 的响应式系统通过以下步骤实现：

1. **数据劫持**：使用 \`Object.defineProperty\` 拦截属性访问
2. **依赖收集**：在 getter 中收集依赖的 Watcher
3. **派发更新**：在 setter 中通知所有依赖进行更新

这种机制使得我们只需要关注数据的变化，视图会自动更新，大大简化了开发流程。
`,
  },
  {
    id: 'p5',
    title: 'CSS Grid 布局实战指南',
    date: '2026-01-10',
    tags: ['CSS', '布局', 'Grid'],
    desc: '从基础到进阶，全面掌握 CSS Grid 布局：网格容器、网格项、响应式布局实践。',
    content: `# CSS Grid 布局实战指南

CSS Grid 是强大的二维布局系统，可以同时处理行和列，非常适合复杂的页面布局。

## 基础概念

### 网格容器与网格项

Grid 布局需要两个层级：
- **网格容器（Grid Container）**：设置 \`display: grid\` 的元素
- **网格项（Grid Item）**：网格容器的直接子元素

\`\`\`css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto;
  gap: 20px;
}
\`\`\`

## 常用属性

### grid-template-columns / grid-template-rows

定义网格的行和列。

\`\`\`css
/* 固定宽度 */
grid-template-columns: 200px 200px 200px;

/* 使用 fr 单位（比例） */
grid-template-columns: 1fr 2fr 1fr;

/* 使用 repeat() */
grid-template-columns: repeat(3, 1fr);

/* 使用 minmax() */
grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
\`\`\`

### gap

设置网格项之间的间距。

\`\`\`css
.container {
  gap: 20px; /* 行和列都是 20px */
  gap: 20px 10px; /* 行 20px，列 10px */
  row-gap: 20px;
  column-gap: 10px;
}
\`\`\`

### grid-area

为网格项指定名称，配合 \`grid-template-areas\` 使用。

\`\`\`css
.container {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main main"
    "footer footer footer";
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.footer { grid-area: footer; }
\`\`\`

## 响应式布局实践

### 自动适应列数

使用 \`auto-fit\` 或 \`auto-fill\` 配合 \`minmax()\` 实现响应式。

\`\`\`css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}
\`\`\`

### 媒体查询结合

\`\`\`css
.container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

@media (min-width: 768px) {
  .container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .container {
    grid-template-columns: repeat(3, 1fr);
  }
}
\`\`\`

## 实战案例：博客布局

\`\`\`css
.blog-layout {
  display: grid;
  grid-template-columns: 1fr 320px;
  grid-template-rows: auto 1fr auto;
  gap: 20px;
  min-height: 100vh;
}

.header {
  grid-column: 1 / -1;
}

.main-content {
  grid-column: 1;
}

.sidebar {
  grid-column: 2;
  position: sticky;
  top: 20px;
  height: fit-content;
}

.footer {
  grid-column: 1 / -1;
}

@media (max-width: 768px) {
  .blog-layout {
    grid-template-columns: 1fr;
  }
  
  .sidebar {
    grid-column: 1;
    position: static;
  }
}
\`\`\`

## 总结

CSS Grid 布局的优势：

1. **二维布局**：同时控制行和列
2. **灵活定位**：精确控制每个网格项的位置
3. **响应式友好**：配合 \`auto-fit\` 和 \`minmax()\` 轻松实现响应式
4. **代码简洁**：相比 Flexbox + 定位的组合，代码更清晰

Grid 是现代 CSS 布局的首选方案，特别适合复杂的页面结构。
`,
  },
  {
    id: 'p6',
    title: 'HTML5 语义化标签的最佳实践',
    date: '2026-01-08',
    tags: ['HTML', '语义化', 'SEO'],
    desc: '合理使用 HTML5 语义化标签提升代码可读性、SEO 友好性和可访问性。',
    content: `# HTML5 语义化标签的最佳实践

语义化 HTML 不仅让代码更易读，还能提升 SEO 效果和可访问性。本文将介绍 HTML5 语义化标签的正确使用方式。

## 什么是语义化？

语义化是指使用合适的 HTML 标签来表达内容的含义，而不是仅仅为了样式。

### 非语义化 vs 语义化

\`\`\`html
<!-- ❌ 非语义化 -->
<div class="header">
  <div class="nav">...</div>
</div>
<div class="main">
  <div class="article">...</div>
</div>

<!-- ✅ 语义化 -->
<header>
  <nav>...</nav>
</header>
<main>
  <article>...</article>
</main>
\`\`\`

## 常用语义化标签

### 结构标签

\`\`\`html
<header>
  <!-- 页面或区块的头部 -->
  <h1>网站标题</h1>
  <nav>
    <ul>
      <li><a href="/">首页</a></li>
      <li><a href="/about">关于</a></li>
    </ul>
  </nav>
</header>

<main>
  <!-- 主要内容区域 -->
  <article>
    <h2>文章标题</h2>
    <p>文章内容...</p>
  </article>
</main>

<aside>
  <!-- 侧边栏内容 -->
  <section>
    <h3>相关文章</h3>
  </section>
</aside>

<footer>
  <!-- 页脚信息 -->
  <p>&copy; 2026 我的博客</p>
</footer>
\`\`\`

### 内容标签

\`\`\`html
<!-- article: 独立的文章内容 -->
<article>
  <header>
    <h1>文章标题</h1>
    <time datetime="2026-01-08">2026年1月8日</time>
  </header>
  <section>
    <h2>章节标题</h2>
    <p>章节内容...</p>
  </section>
</article>

<!-- section: 文档中的章节 -->
<section>
  <h2>服务介绍</h2>
  <p>我们的服务内容...</p>
</section>

<!-- figure: 图片、图表等媒体内容 -->
<figure>
  <img src="image.jpg" alt="描述">
  <figcaption>图片说明</figcaption>
</figure>
\`\`\`

## SEO 优化

语义化标签对 SEO 有重要影响：

1. **搜索引擎理解**：使用正确的标签帮助搜索引擎理解页面结构
2. **关键词权重**：\`<h1>\`、\`<h2>\` 等标签中的关键词权重更高
3. **结构化数据**：配合 Schema.org 标记，提升搜索结果展示

\`\`\`html
<article itemscope itemtype="http://schema.org/BlogPosting">
  <h1 itemprop="headline">文章标题</h1>
  <time itemprop="datePublished" datetime="2026-01-08">2026-01-08</time>
  <div itemprop="articleBody">
    <p>文章内容...</p>
  </div>
</article>
\`\`\`

## 可访问性（A11y）

语义化标签对屏幕阅读器友好：

\`\`\`html
<!-- 使用 nav 标签，屏幕阅读器会识别为导航区域 -->
<nav aria-label="主导航">
  <ul>
    <li><a href="/">首页</a></li>
    <li><a href="/about">关于</a></li>
  </ul>
</nav>

<!-- 使用 main 标签，屏幕阅读器可以直接跳转到主要内容 -->
<main>
  <h1>页面标题</h1>
  <!-- 主要内容 -->
</main>
\`\`\`

## 实际应用示例

### 博客文章结构

\`\`\`html
<article>
  <header>
    <h1>Vue2 响应式原理深度解析</h1>
    <div class="meta">
      <time datetime="2026-01-12">2026-01-12</time>
      <span>作者：田飞飞</span>
    </div>
  </header>
  
  <main>
    <section>
      <h2>核心机制</h2>
      <p>内容...</p>
    </section>
    
    <section>
      <h2>依赖收集</h2>
      <p>内容...</p>
    </section>
  </main>
  
  <footer>
    <nav>
      <a href="/prev">上一篇</a>
      <a href="/next">下一篇</a>
    </nav>
  </footer>
</article>
\`\`\`

## 总结

使用语义化标签的好处：

1. **代码可读性**：一眼就能看出页面结构
2. **SEO 友好**：搜索引擎更容易理解内容
3. **可访问性**：屏幕阅读器能更好地导航
4. **维护性**：代码更清晰，维护更容易

记住：**用正确的标签表达正确的含义**，而不是用 \`<div>\` 和 \`<span>\` 包打天下。
`,
  },
  {
    id: 'p7',
    title: 'Vue2 组件通信的几种方式',
    date: '2026-01-15',
    tags: ['Vue2', '组件', '通信'],
    desc: '父子组件、兄弟组件、跨级组件的通信方案：props、$emit、$refs、事件总线、Vuex。',
    content: `# Vue2 组件通信的几种方式

在 Vue2 开发中，组件通信是一个重要话题。本文将介绍各种场景下的通信方案。

## 1. 父子组件通信

### Props 向下传递

父组件通过 props 向子组件传递数据。

\`\`\`vue
<!-- 父组件 -->
<template>
  <ChildComponent :message="parentMessage" />
</template>

<script>
export default {
  data() {
    return {
      parentMessage: '来自父组件的数据'
    }
  }
}
</script>

<!-- 子组件 -->
<script>
export default {
  props: {
    message: {
      type: String,
      required: true
    }
  }
}
</script>
\`\`\`

### $emit 向上传递

子组件通过 \`$emit\` 向父组件发送事件。

\`\`\`vue
<!-- 子组件 -->
<template>
  <button @click="handleClick">点击</button>
</template>

<script>
export default {
  methods: {
    handleClick() {
      this.$emit('child-event', '子组件的数据')
    }
  }
}
</script>

<!-- 父组件 -->
<template>
  <ChildComponent @child-event="handleChildEvent" />
</template>

<script>
export default {
  methods: {
    handleChildEvent(data) {
      console.log('收到子组件数据:', data)
    }
  }
}
</script>
\`\`\`

## 2. 兄弟组件通信

### 事件总线（Event Bus）

创建一个 Vue 实例作为事件中心。

\`\`\`javascript
// eventBus.js
import Vue from 'vue'
export default new Vue()

// 组件 A（发送）
import eventBus from './eventBus'
eventBus.$emit('message', 'Hello')

// 组件 B（接收）
import eventBus from './eventBus'
export default {
  mounted() {
    eventBus.$on('message', (data) => {
      console.log(data)
    })
  },
  beforeDestroy() {
    eventBus.$off('message')
  }
}
\`\`\`

### 通过父组件中转

\`\`\`vue
<!-- 父组件 -->
<template>
  <div>
    <ChildA @send="handleMessage" />
    <ChildB :message="message" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: ''
    }
  },
  methods: {
    handleMessage(data) {
      this.message = data
    }
  }
}
</script>
\`\`\`

## 3. 跨级组件通信

### provide / inject

祖先组件通过 \`provide\` 提供数据，后代组件通过 \`inject\` 注入。

\`\`\`vue
<!-- 祖先组件 -->
<script>
export default {
  provide() {
    return {
      theme: 'dark',
      user: this.user
    }
  }
}
</script>

<!-- 后代组件 -->
<script>
export default {
  inject: ['theme', 'user'],
  mounted() {
    console.log(this.theme, this.user)
  }
}
</script>
\`\`\`

## 4. 使用 Vuex 状态管理

对于复杂应用，使用 Vuex 集中管理状态。

\`\`\`javascript
// store/index.js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment(state) {
      state.count++
    }
  },
  actions: {
    increment({ commit }) {
      commit('increment')
    }
  }
})

// 组件中使用
export default {
  computed: {
    count() {
      return this.$store.state.count
    }
  },
  methods: {
    increment() {
      this.$store.dispatch('increment')
    }
  }
}
\`\`\`

## 5. $refs 访问组件实例

通过 \`$refs\` 直接访问子组件实例。

\`\`\`vue
<template>
  <ChildComponent ref="child" />
  <button @click="callChildMethod">调用子组件方法</button>
</template>

<script>
export default {
  methods: {
    callChildMethod() {
      this.$refs.child.childMethod()
    }
  }
}
</script>
\`\`\`

## 选择建议

- **父子组件**：使用 props 和 $emit
- **兄弟组件**：简单场景用事件总线，复杂场景用 Vuex
- **跨级组件**：使用 provide/inject 或 Vuex
- **全局状态**：使用 Vuex

## 总结

Vue2 提供了多种组件通信方式，选择合适的方案取决于具体场景。记住：**简单场景用简单方案，复杂场景用 Vuex**。
`,
  },
  {
    id: 'p8',
    title: 'CSS 变量与主题切换实现',
    date: '2026-01-11',
    tags: ['CSS', '主题', '变量'],
    desc: '使用 CSS 自定义属性实现主题切换：定义变量、动态切换、JavaScript 控制。',
    content: `# CSS 变量与主题切换实现

CSS 自定义属性（CSS Variables）是实现主题切换的最佳方案。本文将介绍如何利用 CSS 变量实现灵活的主题系统。

## CSS 变量基础

### 定义变量

在 \`:root\` 中定义全局变量。

\`\`\`css
:root {
  --primary-color: #42b983;
  --bg-color: #0b1020;
  --text-color: rgba(255, 255, 255, 0.92);
  --border-color: rgba(255, 255, 255, 0.18);
  --shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
}
\`\`\`

### 使用变量

使用 \`var()\` 函数引用变量。

\`\`\`css
.card {
  background: var(--bg-color);
  color: var(--text-color);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow);
}

.button {
  background: var(--primary-color);
}
\`\`\`

## 主题切换实现

### 定义多个主题

\`\`\`css
:root {
  /* 默认主题（深色） */
  --bg: #0b1020;
  --text: rgba(255, 255, 255, 0.92);
  --panel: rgba(255, 255, 255, 0.08);
}

[data-theme='light'] {
  /* 浅色主题 */
  --bg: #ffffff;
  --text: rgba(10, 20, 40, 0.92);
  --panel: rgba(255, 255, 255, 0.65);
}
\`\`\`

### JavaScript 切换主题

\`\`\`javascript
// 切换主题
function toggleTheme() {
  const root = document.documentElement
  const currentTheme = root.getAttribute('data-theme')
  const newTheme = currentTheme === 'light' ? 'dark' : 'light'
  
  root.setAttribute('data-theme', newTheme)
  localStorage.setItem('theme', newTheme)
}

// 初始化主题
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'dark'
  document.documentElement.setAttribute('data-theme', savedTheme)
}
\`\`\`

### Vue 组件实现

\`\`\`vue
<template>
  <div id="app" :data-theme="theme">
    <button @click="toggleTheme">切换主题</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      theme: 'dark'
    }
  },
  mounted() {
    const saved = localStorage.getItem('theme')
    if (saved) {
      this.theme = saved
    }
  },
  methods: {
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light'
      localStorage.setItem('theme', this.theme)
    }
  }
}
</script>
\`\`\`

## 高级用法

### 变量继承与覆盖

\`\`\`css
:root {
  --base-size: 16px;
  --spacing-unit: 8px;
}

.card {
  --card-padding: calc(var(--spacing-unit) * 2);
  padding: var(--card-padding);
}

.card-large {
  --card-padding: calc(var(--spacing-unit) * 3);
}
\`\`\`

### 计算与函数

\`\`\`css
:root {
  --primary: 66, 185, 131;
  --primary-rgb: var(--primary);
  --primary-color: rgb(var(--primary-rgb));
  --primary-alpha: rgba(var(--primary-rgb), 0.5);
}

.button {
  background: var(--primary-color);
  border: 1px solid var(--primary-alpha);
}
\`\`\`

### 响应式变量

\`\`\`css
:root {
  --page-gutter: 16px;
}

@media (max-width: 600px) {
  :root {
    --page-gutter: 8px;
  }
}

.container {
  padding: 0 var(--page-gutter);
}
\`\`\`

## 实际应用示例

### 完整的主题系统

\`\`\`css
:root {
  /* 深色主题 */
  --bg: #0b1020;
  --text: rgba(255, 255, 255, 0.92);
  --muted: rgba(255, 255, 255, 0.72);
  --border: rgba(255, 255, 255, 0.18);
  --panel: rgba(255, 255, 255, 0.08);
  --panel-strong: rgba(255, 255, 255, 0.12);
  --shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
  --brand: #42b983;
}

[data-theme='light'] {
  /* 浅色主题 */
  --bg: #ffffff;
  --text: rgba(10, 20, 40, 0.92);
  --muted: rgba(10, 20, 40, 0.72);
  --border: rgba(10, 20, 40, 0.15);
  --panel: rgba(255, 255, 255, 0.45);
  --panel-strong: rgba(255, 255, 255, 0.65);
  --shadow: 0 10px 30px rgba(10, 20, 40, 0.12);
  --brand: #42b983;
}

.card {
  background: linear-gradient(180deg, var(--panel-strong), var(--panel));
  color: var(--text);
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
}
\`\`\`

## 总结

CSS 变量的优势：

1. **动态性**：可以在运行时修改
2. **作用域**：支持局部覆盖
3. **维护性**：集中管理颜色和尺寸
4. **性能**：浏览器原生支持，性能优秀

使用 CSS 变量实现主题切换是现代前端开发的最佳实践。
`,
  },
]

export function getPostById(id) {
  return posts.find((p) => p.id === id)
}


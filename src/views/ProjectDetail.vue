<template>
  <div class="project-detail">
    <div v-if="project" class="paper glass">
      <header class="paper-head">
        <div class="kicker">项目</div>
        <h1 class="title">{{ project.title }}</h1>

        <div class="meta">
          <span class="date">{{ project.date }}</span>
          <div class="tags">
            <span v-for="tech in project.tech" :key="tech" class="tag">{{ tech }}</span>
          </div>
        </div>

        <div class="actions">
          <button class="btn ghost" @click="$router.go(-1)">← 返回</button>
          <a
            v-if="project.github"
            :href="project.github"
            target="_blank"
            rel="noopener"
            class="btn"
          >
            GitHub →
          </a>
          <a
            v-if="project.demo"
            :href="project.demo"
            target="_blank"
            rel="noopener"
            class="btn ghost"
          >
            在线预览 →
          </a>
        </div>
      </header>

      <article class="content markdown-body" v-html="renderedContent"></article>

      <footer class="paper-foot">
        <div class="tip">项目详情展示完成～</div>
        <button class="btn" @click="$router.push('/about')">返回关于</button>
      </footer>
    </div>

    <div v-else class="paper glass">
      <div class="empty">项目不存在或已被删除</div>
      <button class="btn" @click="$router.replace('/about')">返回关于</button>
    </div>
  </div>
</template>

<script>
import { getProjectById } from '@/data/projects'

let md = null
try {
  const MarkdownIt = require('markdown-it')
  md = new MarkdownIt({ html: true, linkify: true })
} catch (e) {
  md = null
}

export default {
  name: 'ProjectDetail',
  data() {
    return {
      project: null,
      renderedContent: '',
    }
  },
  computed: {
    projectId() {
      return this.$route.params.id
    },
  },
  watch: {
    projectId: {
      immediate: true,
      handler() {
        this.loadProject()
      },
    },
  },
  methods: {
    loadProject() {
      this.project = getProjectById(this.projectId)
      if (!this.project) {
        this.renderedContent = ''
        return
      }

      document.title = `${this.project.title} | 项目详情`

      if (!md) {
        this.renderedContent = `<pre>${(this.project.content || '').replace(/</g, '&lt;')}</pre>`
        return
      }

      this.renderedContent = md.render(this.project.content || '')
    },
  },
}
</script>

<style scoped>
.project-detail {
  width: 100%;
  box-sizing: border-box;
}

.paper {
  border: 1px solid var(--border);
  border-radius: 18px;
  overflow: hidden;
  box-shadow: var(--shadow);
  width: 100%;
  box-sizing: border-box;
}

.paper-head {
  padding: 18px 18px 14px;
  border-bottom: 1px solid var(--border);
  position: relative;
}

/* 顶部加一点装饰渐变，让页面不空 */
.paper-head::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(900px 260px at 20% 0%, rgba(66, 185, 131, 0.18), transparent 60%),
    radial-gradient(700px 240px at 80% 0%, rgba(122, 100, 255, 0.16), transparent 55%);
  opacity: 0.8;
  pointer-events: none;
}

.paper-head > * {
  position: relative;
  z-index: 1;
}

.kicker {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--muted);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.kicker::before {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: var(--brand);
  box-shadow: 0 0 0 6px rgba(66, 185, 131, 0.16);
}

.title {
  margin: 10px 0 10px;
  font-size: 28px;
  line-height: 1.25;
  color: var(--text);
  font-weight: 900;
}

.meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  color: var(--muted);
}

.date {
  font-size: 12px;
}

.tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  font-size: 12px;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.06);
  color: var(--text);
}

.actions {
  margin-top: 14px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn {
  height: 36px;
  padding: 0 14px;
  border-radius: 12px;
  border: 1px solid rgba(66, 185, 131, 0.35);
  background: rgba(66, 185, 131, 0.18);
  color: var(--text);
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.2s;
}

.btn.ghost {
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.06);
}

.btn:hover {
  filter: brightness(1.05);
  transform: translateY(-1px);
}

.content {
  padding: 16px 18px 18px;
}

.paper-foot {
  padding: 14px 18px 18px;
  border-top: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.tip {
  color: var(--muted);
  font-size: 12px;
}

.empty {
  padding: 20px;
  color: var(--muted);
  text-align: center;
}

@media (max-width: 768px) {
  .project-detail {
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
  }

  .paper {
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
  }

  .paper-head {
    padding: 16px 14px 12px;
    box-sizing: border-box;
  }
  .title {
    font-size: 22px;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }
  .content {
    padding: 14px;
    box-sizing: border-box;
    width: 100%;
    overflow-x: hidden;
  }
  .paper-foot {
    padding: 12px 14px 14px;
    flex-direction: column;
    align-items: stretch;
    box-sizing: border-box;
  }
  .btn {
    width: 100%;
    box-sizing: border-box;
  }
  .actions {
    flex-direction: column;
  }
}
</style>

<style>
/* 复用 PostDetail 的 Markdown 样式 */
.markdown-body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
  width: 100%;
  box-sizing: border-box;
  overflow-wrap: break-word;
  word-wrap: break-word;
  max-width: 100%;
}

.markdown-body * {
  max-width: 100%;
  box-sizing: border-box;
}

.markdown-body pre,
.markdown-body code {
  overflow-x: auto;
  word-break: normal;
}

.markdown-body h1,
.markdown-body h2,
.markdown-body h3 {
  margin-top: 1.4em;
  margin-bottom: 0.8em;
  color: var(--text);
  font-weight: 900;
}

.markdown-body p {
  margin: 1em 0;
  line-height: 1.85;
  color: var(--text);
}

.markdown-body a {
  color: var(--brand);
  text-decoration: none;
  border-bottom: 1px solid rgba(66, 185, 131, 0.55);
}

.markdown-body blockquote {
  margin: 1.5em 0;
  padding: 0.7em 1em;
  border-left: 4px solid var(--brand);
  background: rgba(66, 185, 131, 0.06);
  color: var(--muted);
  border-radius: 12px;
}

.markdown-body pre {
  border-radius: 12px;
  overflow: auto;
  margin: 1.2em 0;
  padding: 12px;
  background: rgba(0, 0, 0, 0.35);
  color: rgba(255, 255, 255, 0.92);
}

.markdown-body ul,
.markdown-body ol {
  padding-left: 1.5em;
  margin: 1em 0;
}

.markdown-body li {
  margin: 0.5em 0;
  line-height: 1.7;
}

#app[data-theme='light'] .markdown-body pre {
  background: rgba(10, 20, 40, 0.08);
  color: rgba(10, 20, 40, 0.92);
}

/* 白天主题下确保所有 markdown 文字都是深色 */
#app[data-theme='light'] .markdown-body {
  color: rgba(10, 20, 40, 0.92);
}

#app[data-theme='light'] .markdown-body p,
#app[data-theme='light'] .markdown-body li,
#app[data-theme='light'] .markdown-body ul,
#app[data-theme='light'] .markdown-body ol,
#app[data-theme='light'] .markdown-body strong,
#app[data-theme='light'] .markdown-body em,
#app[data-theme='light'] .markdown-body span,
#app[data-theme='light'] .markdown-body div {
  color: rgba(10, 20, 40, 0.92);
}

#app[data-theme='light'] .markdown-body h1,
#app[data-theme='light'] .markdown-body h2,
#app[data-theme='light'] .markdown-body h3,
#app[data-theme='light'] .markdown-body h4,
#app[data-theme='light'] .markdown-body h5,
#app[data-theme='light'] .markdown-body h6 {
  color: rgba(10, 20, 40, 0.98);
}

#app[data-theme='light'] .markdown-body blockquote {
  color: rgba(10, 20, 40, 0.75);
  background: rgba(66, 185, 131, 0.08);
}
</style>

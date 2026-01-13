<template>
  <div class="post-detail">
    <div v-if="post" class="paper glass">
      <header class="paper-head">
        <div class="kicker">文章</div>
        <h1 class="title">{{ post.title }}</h1>

        <div class="meta">
          <div class="meta-left">
            <span class="date">{{ post.date }}</span>
            <span class="reading-time" v-if="readingTime > 0">
              <span class="reading-text">{{ readingTime }} 分钟阅读</span>
            </span>
          </div>
          <div class="tags">
            <span v-for="tag in post.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </div>

        <div class="actions">
          <button class="btn ghost" @click="$router.go(-1)">← 返回</button>
          <button class="btn" @click="copyUrl">复制链接</button>
        </div>
      </header>

      <article class="content markdown-body" v-html="renderedContent"></article>

      <!-- 评论区域 -->
      <div class="comment-wrapper" v-if="post">
        <CommentSection :post-id="post.id" />
      </div>

      <footer class="paper-foot">
        <div class="tip">到这里就读完啦～</div>
        <button class="btn" @click="$router.push('/')">回到首页</button>
      </footer>
    </div>

    <div v-else class="paper glass">
      <div class="empty">文章不存在或已被删除</div>
      <button class="btn" @click="$router.replace('/')">返回首页</button>
    </div>
  </div>
</template>

<script>
import { getPostById } from '@/data/posts'
import CommentSection from '@/components/CommentSection.vue'

let md = null
try {
  const MarkdownIt = require('markdown-it')
  md = new MarkdownIt({
    html: true,
    linkify: true,
    // 为标题添加锚点
    anchor: {
      permalink: false,
      permalinkBefore: false,
      permalinkSymbol: '',
    },
  })
} catch (e) {
  md = null
}

export default {
  name: 'PostDetail',
  components: {
    CommentSection,
  },
  data() {
    return {
      post: null,
      renderedContent: '',
      readingTime: 0,
    }
  },
  computed: {
    postId() {
      return this.$route.params.id
    },
  },
  watch: {
    postId: {
      immediate: true,
      handler() {
        this.loadPost()
      },
    },
  },
  methods: {
    loadPost() {
      this.post = getPostById(this.postId)
      if (!this.post) {
        this.renderedContent = ''
        return
      }

      document.title = `${this.post.title} | 我的博客`

      if (!md) {
        this.renderedContent = `<pre>${(this.post.content || '').replace(/</g, '&lt;')}</pre>`
        return
      }

      let html = md.render(this.post.content || '')
      this.renderedContent = html
      
      // 计算阅读时间
      this.calculateReadingTime(this.post.content || '')
      
      // 在 DOM 更新后处理代码块
      this.$nextTick(() => {
        this.setupCodeBlocks()
      })
    },
    calculateReadingTime(content) {
      if (!content) {
        this.readingTime = 0
        return
      }
      
      // 去除 Markdown 标记
      // 移除代码块
      let text = content.replace(/```[\s\S]*?```/g, '')
      // 移除行内代码
      text = text.replace(/`[^`]+`/g, '')
      // 移除链接
      text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      // 移除图片
      text = text.replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
      // 移除标题标记
      text = text.replace(/^#{1,6}\s+/gm, '')
      // 移除列表标记
      text = text.replace(/^[*\-+]\s+/gm, '')
      text = text.replace(/^\d+\.\s+/gm, '')
      // 移除引用标记
      text = text.replace(/^>\s+/gm, '')
      // 移除粗体和斜体标记
      text = text.replace(/\*\*([^*]+)\*\*/g, '$1')
      text = text.replace(/\*([^*]+)\*/g, '$1')
      text = text.replace(/__([^_]+)__/g, '$1')
      text = text.replace(/_([^_]+)_/g, '$1')
      // 移除删除线
      text = text.replace(/~~([^~]+)~~/g, '$1')
      // 移除水平线
      text = text.replace(/^---+$/gm, '')
      // 移除 HTML 标签（如果有）
      text = text.replace(/<[^>]+>/g, '')
      
      // 计算字数（中文字符和英文单词）
      const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length
      const englishWords = text.replace(/[\u4e00-\u9fa5]/g, '').trim().split(/\s+/).filter(w => w.length > 0).length
      
      // 中文按字符数，英文按单词数（每个单词约 5 个字符）
      const totalChars = chineseChars + englishWords * 5
      
      // 按每分钟 300 字计算（适合中文阅读速度）
      const minutes = Math.ceil(totalChars / 300)
      
      // 至少显示 1 分钟
      this.readingTime = Math.max(1, minutes)
    },
    async copyUrl() {
      const url = window.location.href
      try {
        await navigator.clipboard.writeText(url)
      } catch (e) {
        const ta = document.createElement('textarea')
        ta.value = url
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
      }
    },
    setupCodeBlocks() {
      const contentEl = this.$el?.querySelector('.markdown-body')
      if (!contentEl) return
      
      const codeBlocks = contentEl.querySelectorAll('pre code')
      codeBlocks.forEach((codeEl) => {
        const pre = codeEl.parentElement
        if (pre.tagName === 'PRE' && !pre.closest('.code-block-wrapper')) {
          // 获取代码语言
          const lang = codeEl.className.match(/language-(\w+)/)?.[1] || ''
          const codeText = codeEl.textContent || ''
          
          // 创建代码块容器
          const wrapper = document.createElement('div')
          wrapper.className = 'code-block-wrapper'
          
          // 创建工具栏
          const toolbar = document.createElement('div')
          toolbar.className = 'code-toolbar'
          
          // 语言标签
          if (lang) {
            const langLabel = document.createElement('span')
            langLabel.className = 'code-lang'
            langLabel.textContent = lang
            toolbar.appendChild(langLabel)
          }
          
          // 复制按钮
          const copyBtn = document.createElement('button')
          copyBtn.className = 'code-copy-btn'
          copyBtn.innerHTML = '<span class="copy-text">复制</span>'
          copyBtn.onclick = (e) => {
            e.stopPropagation()
            this.copyCode(codeText, copyBtn)
          }
          toolbar.appendChild(copyBtn)
          
          // 包装代码块
          pre.parentNode.insertBefore(wrapper, pre)
          wrapper.appendChild(toolbar)
          wrapper.appendChild(pre)
        }
      })
    },
    async copyCode(code, btn) {
      try {
        await navigator.clipboard.writeText(code)
        // 显示成功反馈
        const originalHTML = btn.innerHTML
        btn.innerHTML = '<span class="copy-icon">✓</span><span class="copy-text">已复制</span>'
        btn.classList.add('copied')
        
        setTimeout(() => {
          btn.innerHTML = originalHTML
          btn.classList.remove('copied')
        }, 2000)
      } catch (e) {
        // 降级方案
        const ta = document.createElement('textarea')
        ta.value = code
        ta.style.position = 'fixed'
        ta.style.opacity = '0'
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
        
        // 显示成功反馈
        const originalHTML = btn.innerHTML
        btn.innerHTML = '<span class="copy-icon">✓</span><span class="copy-text">已复制</span>'
        btn.classList.add('copied')
        
        setTimeout(() => {
          btn.innerHTML = originalHTML
          btn.classList.remove('copied')
        }, 2000)
      }
    },
  },
}
</script>

<style scoped>
.post-detail {
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

.meta-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.date {
  font-size: 12px;
}

.reading-time {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--muted);
}

.reading-icon {
  font-size: 14px;
  line-height: 1;
}

.reading-text {
  font-weight: 500;
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
}

.btn {
  height: 36px;
  padding: 0 14px;
  border-radius: 12px;
  border: 1px solid rgba(66, 185, 131, 0.35);
  background: rgba(66, 185, 131, 0.18);
  color: var(--text);
  cursor: pointer;
}

.btn.ghost {
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.06);
}

.btn:hover {
  filter: brightness(1.05);
}

.content {
  padding: 16px 18px 18px;
}

.comment-wrapper {
  padding: 0 18px 18px;
  border-top: 1px solid var(--border);
  margin-top: 18px;
  padding-top: 18px;
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
}

@media (max-width: 768px) {
  .post-detail {
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
  
  .meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .meta-left {
    gap: 10px;
  }
  
  .reading-time {
    font-size: 11px;
  }
  .content {
    padding: 14px;
    box-sizing: border-box;
    width: 100%;
    overflow-x: hidden;
  }
  .comment-wrapper {
    padding: 0 14px 14px;
    margin-top: 14px;
    padding-top: 14px;
    box-sizing: border-box;
    width: 100%;
    max-width: 100%;
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
}
</style>

<style>
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
  position: relative;
}

/* 代码块容器 */
.markdown-body .code-block-wrapper {
  position: relative;
  margin: 1.2em 0;
}

.markdown-body .code-block-wrapper pre {
  margin: 0;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

/* 代码工具栏 */
.markdown-body .code-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: none;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  font-size: 12px;
}

.markdown-body .code-lang {
  color: rgba(255, 255, 255, 0.7);
  font-weight: 600;
  text-transform: uppercase;
  font-size: 11px;
  letter-spacing: 0.5px;
}

.markdown-body .code-copy-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
  user-select: none;
}

.markdown-body .code-copy-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.markdown-body .code-copy-btn.copied {
  background: rgba(66, 185, 131, 0.3);
  border-color: rgba(66, 185, 131, 0.5);
  color: rgba(66, 185, 131, 1);
}

.markdown-body .code-copy-btn .copy-icon {
  font-size: 14px;
  line-height: 1;
}

.markdown-body .code-copy-btn .copy-text {
  font-size: 12px;
}

#app[data-theme='light'] .markdown-body pre {
  background: rgba(10, 20, 40, 0.08);
  color: rgba(10, 20, 40, 0.92);
}

#app[data-theme='light'] .markdown-body .code-toolbar {
  background: rgba(10, 20, 40, 0.06);
  border-color: rgba(10, 20, 40, 0.15);
}

#app[data-theme='light'] .markdown-body .code-lang {
  color: rgba(10, 20, 40, 0.6);
}

#app[data-theme='light'] .markdown-body .code-copy-btn {
  border-color: rgba(10, 20, 40, 0.2);
  background: rgba(255, 255, 255, 0.6);
  color: rgba(10, 20, 40, 0.8);
}

#app[data-theme='light'] .markdown-body .code-copy-btn:hover {
  background: rgba(255, 255, 255, 0.75);
  border-color: rgba(10, 20, 40, 0.3);
}

#app[data-theme='light'] .markdown-body .code-copy-btn.copied {
  background: rgba(66, 185, 131, 0.2);
  border-color: rgba(66, 185, 131, 0.4);
  color: rgba(66, 185, 131, 0.9);
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

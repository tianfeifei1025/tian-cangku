<template>
  <div class="article-toc" :class="{ 'is-mobile': isMobile, 'is-open': tocOpen }">
    <div class="toc-header" @click="toggleTOC" v-if="isMobile">
      <span class="toc-title">目录</span>
      <span class="toc-toggle">{{ tocOpen ? '▲' : '▼' }}</span>
    </div>
    <div class="toc-content" v-show="!isMobile || tocOpen">
      <div v-if="tocItems.length > 0" class="toc-list">
        <div
          v-for="item in tocItems"
          :key="item.id"
          class="toc-item"
          :class="{ active: activeId === item.id, [`level-${item.level}`]: true }"
          @click="scrollTo(item.id)"
        >
          <span class="toc-link">{{ item.text }}</span>
        </div>
      </div>
      <div v-else class="toc-empty">暂无目录</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ArticleTOC',
  props: {
    content: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      tocItems: [],
      activeId: '',
      tocOpen: false,
      isMobile: false,
    }
  },
  mounted() {
    this.parseTOC()
    this.setupScrollListener()
    this.checkMobile()
    window.addEventListener('resize', this.checkMobile)
    // 移动端默认关闭目录
    if (this.isMobile) {
      this.tocOpen = false
    }
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll, true)
    window.removeEventListener('resize', this.checkMobile)
  },
  watch: {
    content() {
      this.parseTOC()
      this.$nextTick(() => {
        this.setupScrollListener()
      })
    },
  },
  methods: {
    checkMobile() {
      this.isMobile = window.innerWidth <= 768
      if (!this.isMobile) {
        this.tocOpen = true // 桌面端默认展开
      }
    },
    parseTOC() {
      if (!this.content) {
        this.tocItems = []
        return
      }

      // 创建临时 DOM 来解析 HTML
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = this.content

      const headings = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6')
      this.tocItems = Array.from(headings).map((heading, index) => {
        const level = parseInt(heading.tagName.charAt(1))
        const text = heading.textContent.trim()
        const id = heading.id || `heading-${index}`

        // 如果没有 id，设置一个
        if (!heading.id) {
          heading.id = id
        }

        return {
          id,
          text,
          level,
        }
      })
    },
    scrollTo(id) {
      const element = document.getElementById(id)
      if (element) {
        const offset = 100 // 顶部导航栏高度
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
        const offsetPosition = elementPosition - offset

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        })

        // 移动端点击后关闭目录
        if (this.isMobile) {
          this.tocOpen = false
        }
      }
    },
    setupScrollListener() {
      // 移除旧的监听器
      window.removeEventListener('scroll', this.handleScroll, true)

      // 添加新的监听器
      this.handleScroll = () => {
        const headings = this.tocItems.map((item) => document.getElementById(item.id)).filter(Boolean)

        if (headings.length === 0) return

        // 找到当前视口中最接近顶部的标题
        let currentId = ''
        const scrollPosition = window.scrollY + 150 // 偏移量

        for (let i = headings.length - 1; i >= 0; i--) {
          const heading = headings[i]
          if (heading.offsetTop <= scrollPosition) {
            currentId = heading.id
            break
          }
        }

        // 如果滚动到顶部，高亮第一个
        if (scrollPosition < headings[0]?.offsetTop) {
          currentId = headings[0].id
        }

        this.activeId = currentId
      }

      window.addEventListener('scroll', this.handleScroll, { passive: true })
      this.handleScroll() // 初始调用
    },
    toggleTOC() {
      this.tocOpen = !this.tocOpen
    },
  },
}
</script>

<style scoped>
.article-toc {
  position: sticky;
  top: 100px;
  max-height: calc(100vh - 120px);
  overflow-y: auto;
}

.toc-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border);
  border-radius: 10px;
  cursor: pointer;
  user-select: none;
  margin-bottom: 10px;
}

.toc-title {
  font-weight: 600;
  color: var(--text);
  font-size: 14px;
}

.toc-toggle {
  color: var(--muted);
  font-size: 12px;
  transition: transform 0.2s;
}

.toc-content {
  padding: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border);
  border-radius: 12px;
  backdrop-filter: blur(8px);
}

.toc-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.toc-item {
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.toc-item:hover {
  background: rgba(255, 255, 255, 0.08);
}

.toc-item.active {
  background: rgba(66, 185, 131, 0.15);
  border-left: 3px solid var(--brand);
  padding-left: 12px;
}

.toc-item.active .toc-link {
  color: var(--brand);
  font-weight: 600;
}

.toc-link {
  color: var(--muted);
  font-size: 13px;
  line-height: 1.5;
  display: block;
  transition: color 0.2s;
}

.toc-item.level-1 .toc-link {
  font-weight: 600;
  font-size: 14px;
  color: var(--text);
}

.toc-item.level-2 {
  padding-left: 16px;
}

.toc-item.level-3 {
  padding-left: 28px;
  font-size: 12px;
}

.toc-item.level-4,
.toc-item.level-5,
.toc-item.level-6 {
  padding-left: 40px;
  font-size: 12px;
}

.toc-empty {
  text-align: center;
  padding: 20px;
  color: var(--muted);
  font-size: 13px;
}

/* 移动端样式 */
@media (max-width: 980px) {
  .article-toc {
    position: fixed;
    bottom: 100px;
    right: 16px;
    width: 280px;
    max-width: calc(100vw - 32px);
    z-index: 100;
    max-height: 60vh;
  }

  .article-toc .toc-content {
    max-height: 50vh;
    overflow-y: auto;
    margin-top: 8px;
  }

  .article-toc:not(.is-open) .toc-content {
    display: none;
  }
}

/* 滚动条样式 */
.toc-content::-webkit-scrollbar {
  width: 4px;
}

.toc-content::-webkit-scrollbar-track {
  background: transparent;
}

.toc-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
}

.toc-content::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* 白天主题适配 */
#app[data-theme='light'] .toc-content {
  background: rgba(255, 255, 255, 0.5);
  border-color: rgba(10, 20, 40, 0.12);
}

#app[data-theme='light'] .toc-header {
  background: rgba(255, 255, 255, 0.6);
  border-color: rgba(10, 20, 40, 0.12);
}

#app[data-theme='light'] .toc-item:hover {
  background: rgba(255, 255, 255, 0.7);
}

#app[data-theme='light'] .toc-item.active {
  background: rgba(66, 185, 131, 0.12);
  border-left-color: var(--brand);
}

#app[data-theme='light'] .toc-link {
  color: rgba(10, 20, 40, 0.7);
}

#app[data-theme='light'] .toc-item.level-1 .toc-link {
  color: rgba(10, 20, 40, 0.92);
}

@media (max-width: 768px) {
  .article-toc {
    position: fixed;
    bottom: 80px;
    right: 16px;
    width: 280px;
    max-width: calc(100vw - 32px);
    z-index: 100;
  }
}
</style>

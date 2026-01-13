<template>
  <div class="home">
    <div class="hero glass">
      <div class="hero-title">欢迎来到我的博客</div>
      <div class="hero-sub">可搜索、可筛选、卡片动效 + 弹层阅读（后续还能接 Markdown / 后端）</div>

      <div class="controls">
        <input class="input" v-model.trim="keyword" placeholder="搜索标题 / 摘要…" />
        <div class="chips">
          <button
            v-for="t in allTags"
            :key="t"
            class="chip"
            :class="{ active: activeTag === t }"
            @click="activeTag = (activeTag === t ? '' : t)"
          >
            #{{ t }}
          </button>
        </div>
      </div>
    </div>

    <div class="grid">
      <article v-for="p in filteredPosts" :key="p.id" class="post glass" @click="openPost(p)">
        <div class="post-top">
          <div class="post-title">{{ p.title }}</div>
          <div class="post-date">{{ p.date }}</div>
        </div>
        <div class="post-desc">{{ p.desc }}</div>
        <div class="post-tags">
          <span v-for="t in p.tags" :key="t" class="tag">{{ t }}</span>
        </div>
      </article>
    </div>

    <!-- 文章弹层（快速预览） -->
    <div v-if="activePost" class="modal-mask" @click="closePost"></div>
    <div v-if="activePost" class="modal" role="dialog" aria-modal="true">
      <div class="modal-head">
        <div>
          <div class="modal-title">{{ activePost.title }}</div>
          <div class="modal-meta">{{ activePost.date }} · {{ activePost.tags.join(' / ') }}</div>
        </div>
        <button class="icon-btn" @click="closePost" title="关闭">✕</button>
      </div>

      <div class="modal-body">
        <p class="p">这是预览模式（为了更像真实博客，我们已经新增了文章详情页）。</p>
        <p class="p">点击下方「阅读全文」进入可分享链接的详情页面，并支持 Markdown/代码高亮。</p>
      </div>

      <div class="modal-foot">
        <button class="btn" @click="toggleLike(activePost.id)">
          {{ isLiked(activePost.id) ? '已点赞' : '点赞' }} · {{ likes[activePost.id] || 0 }}
        </button>
        <button class="btn ghost" @click="copyLink(activePost)">复制标题</button>
        <button class="btn" @click="goDetail(activePost)">阅读全文</button>
      </div>
    </div>
  </div>
</template>

<script>
import { posts } from '@/data/posts'

export default {
  name: 'HomePage',
  data() {
    return {
      keyword: '',
      activeTag: '',
      posts,
      activePost: null,
      likes: {},
    }
  },
  computed: {
    allTags() {
      const set = new Set()
      this.posts.forEach((p) => p.tags.forEach((t) => set.add(t)))
      return Array.from(set)
    },
    filteredPosts() {
      const kw = this.keyword.toLowerCase()
      return this.posts.filter((p) => {
        const hitKw = !kw || (p.title + p.desc).toLowerCase().includes(kw)
        const hitTag = !this.activeTag || p.tags.includes(this.activeTag)
        return hitKw && hitTag
      })
    },
  },
  created() {
    try {
      const raw = localStorage.getItem('blog_likes')
      this.likes = raw ? JSON.parse(raw) : {}
    } catch (e) {
      this.likes = {}
    }
  },
  watch: {
    likes: {
      deep: true,
      handler(v) {
        localStorage.setItem('blog_likes', JSON.stringify(v))
      },
    },
  },
  methods: {
    openPost(p) {
      this.activePost = p
      document.body.style.overflow = 'hidden'
    },
    closePost() {
      this.activePost = null
      document.body.style.overflow = ''
    },
    goDetail(p) {
      this.closePost()
      this.$router.push(`/post/${p.id}`)
    },
    toggleLike(id) {
      const cur = this.likes[id] || 0
      this.likes = {
        ...this.likes,
        [id]: cur ? 0 : 1,
      }
    },
    isLiked(id) {
      return (this.likes[id] || 0) > 0
    },
    async copyLink(p) {
      try {
        await navigator.clipboard.writeText(p.title)
      } catch (e) {
        const ta = document.createElement('textarea')
        ta.value = p.title
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
      }
    },
  },
}
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.hero {
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 16px;
  box-shadow: var(--shadow);
}

.hero-title {
  font-size: 22px;
  font-weight: 900;
  color: var(--text);
}

.hero-sub {
  margin-top: 6px;
  color: var(--muted);
  line-height: 1.6;
}

.controls {
  margin-top: 14px;
  display: grid;
  gap: 12px;
}

.input {
  height: 40px;
  border-radius: 14px;
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.06);
  color: var(--text);
  padding: 0 12px;
  outline: none;
  transition: 0.2s ease;
}

.input:focus {
  border-color: rgba(66, 185, 131, 0.5);
  box-shadow: 0 0 0 4px rgba(66, 185, 131, 0.15);
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.chip {
  padding: 8px 10px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.06);
  color: var(--text);
  cursor: pointer;
  transition: transform 0.15s ease, background 0.2s ease;
}

.chip:hover {
  transform: translateY(-1px);
  background: rgba(255, 255, 255, 0.12);
}

.chip.active {
  border-color: rgba(66, 185, 131, 0.45);
  background: rgba(66, 185, 131, 0.18);
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

.post {
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 14px;
  cursor: pointer;
  box-shadow: var(--shadow);
  position: relative;
  overflow: hidden;
  transition: transform 0.18s ease, border-color 0.2s ease;
}

.post::before {
  content: '';
  position: absolute;
  inset: -40% -20%;
  background: radial-gradient(closest-side, rgba(66, 185, 131, 0.22), transparent 55%);
  transform: translateX(-30%) translateY(-10%);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.post:hover {
  transform: translateY(-4px);
  border-color: rgba(66, 185, 131, 0.35);
}

.post:hover::before {
  opacity: 1;
}

.post-top {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  position: relative;
  z-index: 1;
}

.post-title {
  font-weight: 900;
  color: var(--text);
  line-height: 1.3;
}

.post-date {
  font-size: 12px;
  color: var(--muted);
  white-space: nowrap;
}

.post-desc {
  margin-top: 10px;
  color: var(--muted);
  line-height: 1.6;
  position: relative;
  z-index: 1;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
  position: relative;
  z-index: 1;
}

.tag {
  font-size: 12px;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.06);
  color: var(--text);
}

/* Modal */
.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  z-index: 80;
}

.modal {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: min(820px, calc(100% - 24px));
  max-height: min(78vh, 720px);
  z-index: 90;
  border: 1px solid var(--border);
  border-radius: 18px;
  overflow: hidden;
  background: linear-gradient(180deg, var(--panel-strong), var(--panel));
  backdrop-filter: blur(14px);
  box-shadow: var(--shadow);
  animation: pop 0.18s ease;
}

@keyframes pop {
  from {
    opacity: 0;
    transform: translate(-50%, -48%) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

.modal-head {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding: 14px;
  border-bottom: 1px solid var(--border);
}

.modal-title {
  font-size: 18px;
  font-weight: 900;
  color: var(--text);
}

.modal-meta {
  margin-top: 6px;
  font-size: 12px;
  color: var(--muted);
}

.modal-body {
  padding: 14px;
  overflow: auto;
}

.p {
  color: var(--muted);
  line-height: 1.8;
  margin: 0 0 10px;
}

.modal-foot {
  padding: 14px;
  border-top: 1px solid var(--border);
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

@media (max-width: 840px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>

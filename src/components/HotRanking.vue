<template>
  <div class="hot-ranking">
    <div class="card glass">
      <div class="card-title">热门榜单</div>
      <div class="card-body">
        <div v-if="hotPosts.length > 0" class="ranking-list">
          <div
            v-for="(post, index) in hotPosts"
            :key="post.id"
            class="ranking-item"
            @click="goToPost(post.id)"
          >
            <div class="rank-number" :class="getRankClass(index)">{{ index + 1 }}</div>
            <div class="rank-content">
              <div class="rank-title">{{ post.title }}</div>
            </div>
          </div>
        </div>
        <div v-else class="ranking-empty">
          <p>暂无热门文章</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { posts } from '@/data/posts'

export default {
  name: 'HotRanking',
  data() {
    return {
      hotPosts: [],
    }
  },
  mounted() {
    this.loadHotPosts()
    // 监听路由变化，当返回首页时更新榜单
    this.$watch(
      () => this.$route.path,
      () => {
        this.loadHotPosts()
      }
    )
  },
  methods: {
    handleStorageChange(e) {
      // 如果评论或点赞数据变化，重新加载榜单
      if (e.key && (e.key.startsWith('comments_') || e.key === 'blog_likes')) {
        this.loadHotPosts()
      }
    },
    loadHotPosts() {
      // 获取所有文章的评论数和点赞数
      const postStats = posts.map((post) => {
        // 获取评论数
        const commentKey = `comments_${post.id}`
        let commentCount = 0
        try {
          const comments = localStorage.getItem(commentKey)
          if (comments) {
            commentCount = JSON.parse(comments).length
          }
        } catch (e) {
          commentCount = 0
        }

        // 获取点赞数
        let likeCount = 0
        try {
          const likes = localStorage.getItem('blog_likes')
          if (likes) {
            const likesData = JSON.parse(likes)
            likeCount = likesData[post.id] || 0
          }
        } catch (e) {
          likeCount = 0
        }

        return {
          ...post,
          commentCount,
          likeCount,
          hotScore: commentCount * 2 + likeCount, // 评论权重更高
        }
      })

      // 按热度排序，取前5名
      this.hotPosts = postStats
        .filter((p) => p.hotScore > 0) // 只显示有评论或点赞的文章
        .sort((a, b) => b.hotScore - a.hotScore)
        .slice(0, 5)
    },
    getRankClass(index) {
      if (index === 0) return 'rank-gold'
      if (index === 1) return 'rank-silver'
      if (index === 2) return 'rank-bronze'
      return ''
    },
    goToPost(postId) {
      this.$router.push(`/post/${postId}`)
    },
  },
}
</script>

<style scoped>
.hot-ranking {
  width: 100%;
}

.ranking-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ranking-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border);
  cursor: pointer;
  transition: all 0.2s ease;
}

.ranking-item:hover {
  background: rgba(255, 255, 255, 0.06);
  transform: translateX(2px);
  border-color: color-mix(in srgb, var(--brand) 40%, transparent);
}

.rank-number {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.08);
  color: var(--muted);
  border: 1px solid var(--border);
}

.rank-number.rank-gold {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.3), rgba(255, 193, 7, 0.2));
  border-color: rgba(255, 215, 0, 0.4);
  color: rgba(255, 215, 0, 0.9);
}

.rank-number.rank-silver {
  background: linear-gradient(135deg, rgba(192, 192, 192, 0.3), rgba(169, 169, 169, 0.2));
  border-color: rgba(192, 192, 192, 0.4);
  color: rgba(192, 192, 192, 0.9);
}

.rank-number.rank-bronze {
  background: linear-gradient(135deg, rgba(205, 127, 50, 0.3), rgba(184, 115, 51, 0.2));
  border-color: rgba(205, 127, 50, 0.4);
  color: rgba(205, 127, 50, 0.9);
}

.rank-content {
  flex: 1;
  min-width: 0;
}

.rank-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ranking-empty {
  text-align: center;
  padding: 20px;
  color: var(--muted);
  font-size: 13px;
}

/* 白天主题适配 */
#app[data-theme='light'] .ranking-item {
  background: rgba(255, 255, 255, 0.4);
  border-color: rgba(10, 20, 40, 0.12);
}

#app[data-theme='light'] .ranking-item:hover {
  background: rgba(255, 255, 255, 0.55);
  border-color: var(--brand);
}

#app[data-theme='light'] .rank-number {
  background: rgba(255, 255, 255, 0.6);
  border-color: rgba(10, 20, 40, 0.15);
  color: rgba(10, 20, 40, 0.7);
}

#app[data-theme='light'] .rank-title {
  color: rgba(10, 20, 40, 0.92);
}
</style>

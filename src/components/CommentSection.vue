<template>
  <div class="comment-section">
    <div class="comment-header">
      <h3 class="comment-title">评论</h3>
      <span class="comment-count">{{ totalCount }} 条评论</span>
    </div>

    <!-- 评论表单 -->
    <div class="comment-form glass">
      <div class="form-row">
        <input
          v-model="form.name"
          type="text"
          placeholder="昵称"
          class="form-input"
          maxlength="20"
        />
        <input
          v-model="form.email"
          type="email"
          placeholder="邮箱（可选）"
          class="form-input"
        />
      </div>
      <textarea
        v-model="form.content"
        placeholder="写下你的想法..."
        class="form-textarea"
        rows="4"
        maxlength="500"
      ></textarea>
      <div class="form-footer">
        <span class="char-count">{{ form.content.length }}/500</span>
        <button class="btn" @click="submitComment" :disabled="!canSubmit">
          发表评论
        </button>
      </div>
    </div>

    <!-- 评论列表 -->
    <div class="comment-list" v-if="topLevelComments.length > 0">
      <div
        v-for="comment in topLevelComments"
        :key="comment.id"
        :data-comment-id="comment.id"
        class="comment-item"
      >
        <div class="comment-avatar">
          {{ getAvatarText(comment.name) }}
        </div>
        <div class="comment-body">
          <div class="comment-meta">
            <span class="comment-author">{{ comment.name }}</span>
            <span class="comment-date">{{ formatDate(comment.createdAt) }}</span>
          </div>
          <div class="comment-text">{{ comment.content }}</div>
          <div class="comment-actions">
            <button class="action-btn" @click="toggleReply(comment.id)">
              {{ replyingTo === comment.id ? '取消回复' : '回复' }}
            </button>
            <button
              v-if="canDelete(comment)"
              class="action-btn delete"
              @click="deleteComment(comment.id)"
            >
              删除
            </button>
          </div>

          <!-- 回复表单 -->
          <div v-if="replyingTo === comment.id" class="reply-form">
            <input
              v-model="replyForm.name"
              type="text"
              placeholder="昵称"
              class="form-input small"
              maxlength="20"
            />
            <textarea
              v-model="replyForm.content"
              placeholder="写下你的回复..."
              class="form-textarea small"
              rows="3"
              maxlength="300"
            ></textarea>
            <div class="form-footer">
              <span class="char-count">{{ replyForm.content.length }}/300</span>
              <button
                class="btn small"
                @click="submitReply(comment.id)"
                :disabled="!canSubmitReply"
              >
                发表回复
              </button>
            </div>
          </div>

          <!-- 子评论（回复） -->
          <div v-if="getReplies(comment.id).length > 0" class="replies">
            <div
              v-for="reply in getReplies(comment.id)"
              :key="reply.id"
              class="comment-item is-reply"
            >
              <div class="comment-avatar small">
                {{ getAvatarText(reply.name) }}
              </div>
              <div class="comment-body">
                <div class="comment-meta">
                  <span class="comment-author">{{ reply.name }}</span>
                  <span class="comment-date">{{ formatDate(reply.createdAt) }}</span>
                </div>
                <div class="comment-text">{{ reply.content }}</div>
                <div class="comment-actions">
                  <button
                    v-if="canDelete(reply)"
                    class="action-btn delete"
                    @click="deleteComment(reply.id)"
                  >
                    删除
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="comment-empty">
      <p>还没有评论，来发表第一条吧～</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CommentSection',
  props: {
    postId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      comments: [],
      form: {
        name: '',
        email: '',
        content: '',
      },
      replyForm: {
        name: '',
        content: '',
      },
      replyingTo: null,
    }
  },
  computed: {
    topLevelComments() {
      return this.comments.filter((c) => !c.parentId)
    },
    totalCount() {
      return this.comments.length
    },
    canSubmit() {
      return this.form.name.trim() && this.form.content.trim()
    },
    canSubmitReply() {
      return this.replyForm.name.trim() && this.replyForm.content.trim()
    },
  },
  mounted() {
    this.loadComments()
    // 尝试从 localStorage 恢复昵称
    const savedName = localStorage.getItem('comment_author_name')
    if (savedName) {
      this.form.name = savedName
      this.replyForm.name = savedName
    }
  },
  methods: {
    loadComments() {
      const key = `comments_${this.postId}`
      const stored = localStorage.getItem(key)
      if (stored) {
        try {
          this.comments = JSON.parse(stored)
        } catch (e) {
          this.comments = []
        }
      } else {
        this.comments = []
      }
    },
    saveComments() {
      const key = `comments_${this.postId}`
      localStorage.setItem(key, JSON.stringify(this.comments))
    },
    submitComment() {
      if (!this.canSubmit) return

      const comment = {
        id: Date.now().toString(),
        postId: this.postId,
        name: this.form.name.trim(),
        email: this.form.email.trim(),
        content: this.form.content.trim(),
        createdAt: new Date().toISOString(),
        parentId: null,
      }

      this.comments.push(comment)
      this.saveComments()

      // 保存昵称
      localStorage.setItem('comment_author_name', this.form.name.trim())

      // 清空表单
      this.form.content = ''
      this.form.email = ''

      // 滚动到新评论
      this.$nextTick(() => {
        const element = document.querySelector(`[data-comment-id="${comment.id}"]`)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
        }
      })
    },
    toggleReply(commentId) {
      if (this.replyingTo === commentId) {
        this.replyingTo = null
        this.replyForm.content = ''
      } else {
        this.replyingTo = commentId
        this.replyForm.content = ''
        // 恢复昵称
        const savedName = localStorage.getItem('comment_author_name')
        if (savedName) {
          this.replyForm.name = savedName
        }
      }
    },
    submitReply(parentId) {
      if (!this.canSubmitReply) return

      const reply = {
        id: Date.now().toString(),
        postId: this.postId,
        name: this.replyForm.name.trim(),
        email: '',
        content: this.replyForm.content.trim(),
        createdAt: new Date().toISOString(),
        parentId: parentId,
      }

      this.comments.push(reply)
      this.saveComments()

      // 保存昵称
      localStorage.setItem('comment_author_name', this.replyForm.name.trim())

      // 关闭回复表单
      this.replyingTo = null
      this.replyForm.content = ''
    },
    getReplies(parentId) {
      return this.comments.filter((c) => c.parentId === parentId)
    },
    deleteComment(commentId) {
      if (confirm('确定要删除这条评论吗？')) {
        this.comments = this.comments.filter((c) => c.id !== commentId)
        this.saveComments()
      }
    },
    canDelete(comment) {
      // 简单判断：如果评论者的昵称和当前保存的昵称一致，可以删除
      const savedName = localStorage.getItem('comment_author_name')
      return savedName && comment.name === savedName
    },
    getAvatarText(name) {
      if (!name) return '?'
      return name.charAt(0).toUpperCase()
    },
    formatDate(dateString) {
      const date = new Date(dateString)
      const now = new Date()
      const diff = now - date

      if (diff < 60000) return '刚刚'
      if (diff < 3600000) return `${Math.floor(diff / 60000)} 分钟前`
      if (diff < 86400000) return `${Math.floor(diff / 3600000)} 小时前`
      if (diff < 604800000) return `${Math.floor(diff / 86400000)} 天前`

      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    },
  },
}
</script>

<style scoped>
.comment-section {
  margin-top: 24px;
  width: 100%;
  box-sizing: border-box;
}

.comment-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.comment-title {
  font-size: 20px;
  font-weight: 900;
  color: var(--text);
  margin: 0;
}

.comment-count {
  font-size: 14px;
  color: var(--muted);
}

/* 评论表单 */
.comment-form {
  padding: 18px;
  border: 1px solid var(--border);
  border-radius: 16px;
  margin-bottom: 24px;
  background: var(--panel);
  backdrop-filter: blur(12px);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 12px;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.08);
  color: var(--text);
  font-family: inherit;
  font-size: 14px;
  transition: all 0.2s;
  box-sizing: border-box;
}

/* Placeholder 文字颜色 - 黑夜主题 */
.form-input::placeholder,
.form-textarea::placeholder {
  color: rgba(255, 255, 255, 0.5);
  opacity: 1;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--brand);
  background: rgba(255, 255, 255, 0.12);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
  margin-bottom: 12px;
}

.form-input.small,
.form-textarea.small {
  font-size: 13px;
  padding: 8px 12px;
}

.form-textarea.small {
  min-height: 70px;
  margin-bottom: 10px;
}

.form-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.char-count {
  font-size: 12px;
  color: var(--muted);
}

.btn {
  height: 36px;
  padding: 0 16px;
  border-radius: 10px;
  border: 1px solid rgba(66, 185, 131, 0.35);
  background: rgba(66, 185, 131, 0.18);
  color: var(--text);
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s;
}

.btn:hover:not(:disabled) {
  filter: brightness(1.1);
  transform: translateY(-1px);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn.small {
  height: 32px;
  padding: 0 14px;
  font-size: 13px;
}

/* 评论列表 */
.comment-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.comment-item {
  display: flex;
  gap: 12px;
  padding: 16px;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: var(--panel);
  backdrop-filter: blur(10px);
  transition: all 0.2s;
}

.comment-item:hover {
  border-color: color-mix(in srgb, var(--brand) 40%, transparent);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.comment-item.is-reply {
  margin-left: 48px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.04);
}

.comment-avatar {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--brand), rgba(122, 100, 255, 0.8));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 16px;
}

.comment-avatar.small {
  width: 32px;
  height: 32px;
  font-size: 14px;
}

.comment-body {
  flex: 1;
  min-width: 0;
}

.comment-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.comment-author {
  font-weight: 700;
  color: var(--text);
  font-size: 14px;
}

.comment-date {
  font-size: 12px;
  color: var(--muted);
}

.comment-text {
  color: var(--text);
  line-height: 1.7;
  margin-bottom: 10px;
  white-space: pre-wrap;
  word-break: break-word;
}

.comment-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  background: none;
  border: none;
  color: var(--muted);
  font-size: 12px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s;
}

.action-btn:hover {
  color: var(--brand);
  background: rgba(66, 185, 131, 0.1);
}

.action-btn.delete:hover {
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.1);
}

/* 回复表单 */
.reply-form {
  margin-top: 12px;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.04);
}

.replies {
  margin-top: 16px;
  padding-left: 0;
  border-left: 2px solid var(--border);
  margin-left: 12px;
}

.comment-empty {
  text-align: center;
  padding: 40px 20px;
  color: var(--muted);
}

/* 白天主题适配 */
#app[data-theme='light'] .comment-form,
#app[data-theme='light'] .comment-item {
  background: rgba(255, 255, 255, 0.5);
  border-color: rgba(10, 20, 40, 0.12);
}

#app[data-theme='light'] .comment-item.is-reply,
#app[data-theme='light'] .reply-form {
  background: rgba(255, 255, 255, 0.35);
}

#app[data-theme='light'] .form-input,
#app[data-theme='light'] .form-textarea {
  background: rgba(255, 255, 255, 0.6);
  border-color: rgba(10, 20, 40, 0.15);
  color: rgba(10, 20, 40, 0.92);
}

/* Placeholder 文字颜色 - 白天主题 */
#app[data-theme='light'] .form-input::placeholder,
#app[data-theme='light'] .form-textarea::placeholder {
  color: rgba(10, 20, 40, 0.5);
  opacity: 1;
}

#app[data-theme='light'] .form-input:focus,
#app[data-theme='light'] .form-textarea:focus {
  background: rgba(255, 255, 255, 0.75);
  border-color: var(--brand);
}

#app[data-theme='light'] .comment-text {
  color: rgba(10, 20, 40, 0.88);
}

#app[data-theme='light'] .comment-author {
  color: rgba(10, 20, 40, 0.95);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .comment-section {
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    overflow-x: hidden;
  }

  .comment-form {
    padding: 14px;
    box-sizing: border-box;
    width: 100%;
    max-width: 100%;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .form-input,
  .form-textarea {
    width: 100%;
    box-sizing: border-box;
    max-width: 100%;
  }

  .comment-list {
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
  }

  .comment-item {
    padding: 12px;
    gap: 10px;
    width: 100%;
    box-sizing: border-box;
    max-width: 100%;
  }

  .comment-item.is-reply {
    margin-left: 32px;
    max-width: calc(100% - 32px);
  }

  .comment-body {
    min-width: 0;
    flex: 1;
    overflow-wrap: break-word;
    word-wrap: break-word;
  }

  .comment-text {
    word-wrap: break-word;
    overflow-wrap: break-word;
    max-width: 100%;
  }

  .comment-avatar {
    width: 36px;
    height: 36px;
    font-size: 14px;
    flex-shrink: 0;
  }

  .comment-avatar.small {
    width: 28px;
    height: 28px;
    font-size: 12px;
  }

  .replies {
    margin-left: 8px;
    max-width: calc(100% - 8px);
  }

  .reply-form {
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
  }
}
</style>

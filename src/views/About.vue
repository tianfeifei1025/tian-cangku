<template>
  <div class="about">
    <!-- 关于我 -->
    <div class="card glass">
      <div class="card-title">关于我</div>
      <div class="card-body">
        <div class="avatar"></div>
        <h2 class="name">田飞飞</h2>
        <p class="bio">
          一个热爱前端开发的工程师，喜欢探索新技术、分享学习心得。这个博客记录我的技术思考、项目实践和生活感悟。
        </p>

        <div class="stats">
          <div class="stat">
            <div class="stat-value">{{ stats.posts }}</div>
            <div class="stat-label">文章</div>
          </div>
          <div class="stat">
            <div class="stat-value">{{ stats.tags }}</div>
            <div class="stat-label">标签</div>
          </div>
          <div class="stat">
            <div class="stat-value">{{ stats.views }}</div>
            <div class="stat-label">访问</div>
          </div>
        </div>

        <div class="social-links">
          <a href="https://github.com/yourusername" target="_blank" rel="noopener" class="social-link">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
              <path
                d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.5-1.4-1.3-1.8-1.3-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.6 3.3-1.2 3.3-1.2.6 1.6.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3z"
              />
            </svg>
            GitHub
          </a>
          <a href="https://twitter.com/yourusername" target="_blank" rel="noopener" class="social-link">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
              <path
                d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.59-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 14-7.503 14-14 0-.217-.006-.435-.016-.653.96-.689 1.8-1.56 2.46-2.548l-.047-.02z"
              />
            </svg>
            Twitter
          </a>
        </div>
      </div>
    </div>

    <!-- 技能栈（修复：补齐 card-body 内边距） -->
    <div class="card glass">
      <div class="card-title">技能栈</div>
      <div class="card-body">
        <div class="skills">
          <div class="skill-category">
            <h3>前端</h3>
            <div class="skill-tags">
              <span class="tag">Vue.js</span>
              <span class="tag">React</span>
              <span class="tag">TypeScript</span>
              <span class="tag">SCSS</span>
              <span class="tag">Webpack</span>
            </div>
          </div>

          <div class="skill-category">
            <h3>后端</h3>
            <div class="skill-tags">
              <span class="tag">Node.js</span>
              <span class="tag">Express</span>
              <span class="tag">MongoDB</span>
              <span class="tag">MySQL</span>
            </div>
          </div>

          <div class="skill-category">
            <h3>工具</h3>
            <div class="skill-tags">
              <span class="tag">Git</span>
              <span class="tag">Docker</span>
              <span class="tag">VS Code</span>
              <span class="tag">Figma</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 项目经验（修复：补齐 card-body 内边距） -->
    <div class="card glass">
      <div class="card-title">项目经验</div>
      <div class="card-body">
        <div class="projects">
          <div class="project">
            <h3>个人博客系统</h3>
            <p class="project-desc">
              基于 Vue 2 和 Node.js 开发的个人博客系统，支持 Markdown 写作、标签分类、评论功能等。
            </p>
            <div class="project-meta">
              <span class="project-tech">Vue.js, Node.js, MongoDB</span>
              <router-link to="/project/personal-blog" class="project-link">查看项目 →</router-link>
            </div>
          </div>

          <div class="project">
            <h3>在线商城</h3>
            <p class="project-desc">
              一个完整的电商平台，包含商品展示、购物车、订单管理、支付集成等功能。
            </p>
            <div class="project-meta">
              <span class="project-tech">React, Redux, Express, MySQL</span>
              <router-link to="/project/online-mall" class="project-link">查看项目 →</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AboutPage',
  data() {
    return {
      stats: {
        posts: 12,
        tags: 8,
        views: 2453,
      },
    }
  },
}
</script>

<style scoped>
.about {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.card {
  border: 1px solid var(--border);
  border-radius: 18px;
  overflow: hidden;
  box-shadow: var(--shadow);
}

.card-title {
  padding: 12px 14px;
  font-weight: 700;
  border-bottom: 1px solid var(--border);
  color: var(--text);
}

.card-body {
  padding: 14px;
  color: var(--muted);
}

.avatar {
  width: 120px;
  height: 120px;
  margin: 0 auto 16px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(66, 185, 131, 0.9), rgba(120, 100, 255, 0.9));
  box-shadow: 0 12px 30px rgba(66, 185, 131, 0.22);
  position: relative;
  overflow: hidden;
}

.avatar::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);
  animation: shine 2s infinite;
}

@keyframes shine {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.name {
  font-size: 24px;
  font-weight: 800;
  color: var(--text);
  text-align: center;
  margin-bottom: 10px;
}

.bio {
  line-height: 1.7;
  text-align: center;
  margin: 0 0 18px;
}

.stats {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-bottom: 18px;
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--text);
}

.stat-label {
  font-size: 14px;
  color: var(--muted);
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 18px;
}

.social-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.06);
  color: var(--text);
  text-decoration: none;
  transition: all 0.2s ease;
  border: 1px solid var(--border);
}

.social-link:hover {
  background: rgba(255, 255, 255, 0.12);
  transform: translateY(-2px);
}

.skills {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.skill-category h3 {
  margin: 0 0 10px;
  color: var(--text);
  font-size: 16px;
}

.skill-tags {
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

.projects {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.project {
  padding: 16px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border);
  transition: all 0.2s ease;
}

.project:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.project h3 {
  margin: 0 0 8px;
  color: var(--text);
  font-size: 16px;
}

.project-desc {
  margin: 0 0 12px;
  line-height: 1.6;
  color: var(--muted);
}

.project-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  gap: 10px;
}

.project-tech {
  color: var(--muted);
}

.project-link {
  color: var(--brand);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.project-link:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  /* 手机端：整体内边距更舒适，避免贴边 */
  .card-body {
    padding: 16px;
  }

  .card-title {
    padding: 12px 16px;
  }

  .bio {
    padding: 0 6px;
  }

  .stats {
    gap: 16px;
  }

  .social-links {
    margin-top: 14px;
    gap: 10px;
  }

  .social-link {
    width: 100%;
    justify-content: center;
    box-sizing: border-box;
  }

  .stat-value {
    font-size: 20px;
  }

  .social-links {
    flex-direction: column;
    align-items: stretch;
  }

  .project-meta {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>

<template>
  <div class="nf">
    <div class="card glass">
      <div class="title">404</div>
      <div class="desc">页面不存在或已被移动</div>
      <button class="btn" @click="$router.replace('/')">返回首页</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFoundPage',
}
</script>

<style scoped>
.nf {
  min-height: 50vh;
  display: grid;
  place-items: center;
}

.card {
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 18px;
  width: min(520px, 100%);
  text-align: center;
  box-shadow: var(--shadow);
}

.title {
  font-size: 40px;
  font-weight: 900;
  color: var(--text);
}

.desc {
  margin-top: 6px;
  color: var(--muted);
}

.btn {
  margin-top: 14px;
  height: 36px;
  padding: 0 14px;
  border-radius: 12px;
  border: 1px solid rgba(66, 185, 131, 0.35);
  background: rgba(66, 185, 131, 0.18);
  color: var(--text);
  cursor: pointer;
}
</style>


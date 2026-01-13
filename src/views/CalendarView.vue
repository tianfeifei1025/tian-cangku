<template>
  <div class="calendar-view">
    <div class="calendar-container">
      <AppCalendar :selected-date="selectedDate" :notes-data="notesData" @select-date="handleSelectDate" />
    </div>

    <div class="notes-panel glass">
      <div class="notes-header">
        <div class="notes-title">
          <span v-if="selectedDate">{{ formatDisplayDate(selectedDate) }} 的便签</span>
          <span v-else>选择一个日期查看便签</span>
        </div>
        <button v-if="selectedDate" class="icon-btn small" @click="addNote" title="添加便签">+</button>
      </div>

      <div v-if="selectedDate" class="notes-content">
        <div v-if="currentNotes.length === 0" class="notes-empty">
          <p>这一天还没有便签</p>
          <button class="btn" @click="addNote">添加第一条便签</button>
        </div>

        <div v-else class="notes-list">
          <div v-for="note in currentNotes" :key="note.id" class="note-item" :class="{ completed: note.completed }">
            <div class="note-checkbox" @click="toggleNote(note.id)">
              <span v-if="note.completed" class="check-icon">✓</span>
            </div>
            <div class="note-content">
              <div class="note-text" :class="{ completed: note.completed }">{{ note.content }}</div>
              <div class="note-meta">
                <span class="note-time">{{ formatTime(note.updatedAt) }}</span>
                <div class="note-actions">
                  <button class="action-btn" @click="editNote(note)" title="编辑">✎</button>
                  <button class="action-btn" @click="deleteNote(note.id)" title="删除">×</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 编辑/添加便签弹层 -->
    <div v-if="editingNote !== null" class="modal-mask" @click="cancelEdit"></div>
    <div v-if="editingNote !== null" class="note-modal glass">
      <div class="modal-header">
        <div class="modal-title">{{ editingNote.id ? '编辑便签' : '添加便签' }}</div>
        <button class="icon-btn" @click="cancelEdit" title="关闭">✕</button>
      </div>
      <div class="modal-body">
        <textarea
          v-model="editingNote.content"
          class="note-input"
          placeholder="输入便签内容..."
          rows="4"
          maxlength="500"
        ></textarea>
        <div class="input-footer">
          <span class="char-count">{{ editingNote.content.length }}/500</span>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn ghost" @click="cancelEdit">取消</button>
        <button class="btn" @click="saveNote" :disabled="!editingNote.content.trim()">保存</button>
      </div>
    </div>
  </div>
</template>

<script>
import AppCalendar from '@/components/Calendar.vue'

export default {
  name: 'CalendarView',
  components: {
    AppCalendar,
  },
  data() {
    return {
      selectedDate: null,
      notesData: {},
      editingNote: null,
    }
  },
  computed: {
    currentNotes() {
      if (!this.selectedDate) return []
      return this.notesData[this.selectedDate] || []
    },
  },
  mounted() {
    this.loadNotes()
    // 默认选择今天
    const today = this.formatDate(new Date())
    this.selectedDate = today
  },
  methods: {
    formatDate(date) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },
    formatDisplayDate(dateStr) {
      const date = new Date(dateStr + 'T00:00:00')
      const month = date.getMonth() + 1
      const day = date.getDate()
      const weekdays = ['日', '一', '二', '三', '四', '五', '六']
      const weekday = weekdays[date.getDay()]
      return `${month}月${day}日 星期${weekday}`
    },
    formatTime(isoString) {
      const date = new Date(isoString)
      const now = new Date()
      const diff = now - date
      const minutes = Math.floor(diff / 60000)
      const hours = Math.floor(diff / 3600000)
      const days = Math.floor(diff / 86400000)

      if (minutes < 1) return '刚刚'
      if (minutes < 60) return `${minutes}分钟前`
      if (hours < 24) return `${hours}小时前`
      if (days < 7) return `${days}天前`

      const month = date.getMonth() + 1
      const day = date.getDate()
      const hour = String(date.getHours()).padStart(2, '0')
      const minute = String(date.getMinutes()).padStart(2, '0')
      return `${month}-${day} ${hour}:${minute}`
    },
    loadNotes() {
      try {
        const stored = localStorage.getItem('calendar_notes')
        if (stored) {
          this.notesData = JSON.parse(stored)
        }
      } catch (e) {
        console.error('加载便签数据失败:', e)
        this.notesData = {}
      }
    },
    saveNotes() {
      try {
        localStorage.setItem('calendar_notes', JSON.stringify(this.notesData))
      } catch (e) {
        console.error('保存便签数据失败:', e)
      }
    },
    handleSelectDate(dateStr) {
      this.selectedDate = dateStr
    },
    addNote() {
      this.editingNote = {
        id: null,
        content: '',
        completed: false,
      }
    },
    editNote(note) {
      this.editingNote = {
        id: note.id,
        content: note.content,
        completed: note.completed,
      }
    },
    saveNote() {
      if (!this.editingNote.content.trim()) return

      const now = new Date().toISOString()
      const noteId = this.editingNote.id || this.generateId()

      if (!this.notesData[this.selectedDate]) {
        this.$set(this.notesData, this.selectedDate, [])
      }

      const noteIndex = this.notesData[this.selectedDate].findIndex((n) => n.id === noteId)

      if (noteIndex >= 0) {
        // 编辑现有便签
        this.$set(this.notesData[this.selectedDate], noteIndex, {
          id: noteId,
          content: this.editingNote.content.trim(),
          completed: this.editingNote.completed,
          createdAt: this.notesData[this.selectedDate][noteIndex].createdAt,
          updatedAt: now,
        })
      } else {
        // 添加新便签
        this.notesData[this.selectedDate].push({
          id: noteId,
          content: this.editingNote.content.trim(),
          completed: false,
          createdAt: now,
          updatedAt: now,
        })
      }

      this.saveNotes()
      this.editingNote = null
    },
    deleteNote(noteId) {
      if (!confirm('确定要删除这条便签吗？')) return

      const notes = this.notesData[this.selectedDate]
      if (notes) {
        const index = notes.findIndex((n) => n.id === noteId)
        if (index >= 0) {
          notes.splice(index, 1)
          if (notes.length === 0) {
            this.$delete(this.notesData, this.selectedDate)
          }
          this.saveNotes()
        }
      }
    },
    toggleNote(noteId) {
      const notes = this.notesData[this.selectedDate]
      if (notes) {
        const note = notes.find((n) => n.id === noteId)
        if (note) {
          note.completed = !note.completed
          note.updatedAt = new Date().toISOString()
          this.saveNotes()
        }
      }
    },
    cancelEdit() {
      this.editingNote = null
    },
    generateId() {
      return Date.now().toString(36) + Math.random().toString(36).slice(2)
    },
  },
}
</script>

<style scoped>
.calendar-view {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 20px;
  align-items: start;
}

.calendar-container {
  min-width: 0;
}

.notes-panel {
  border: 1px solid var(--border);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--shadow);
  position: sticky;
  top: 92px;
  max-height: calc(100vh - 120px);
  display: flex;
  flex-direction: column;
}

.notes-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.03);
}

.notes-title {
  font-weight: 700;
  font-size: 16px;
  color: var(--text);
}

.icon-btn.small {
  width: 32px;
  height: 32px;
  font-size: 18px;
}

.notes-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.notes-empty {
  text-align: center;
  padding: 40px 20px;
  color: var(--muted);
}

.notes-empty p {
  margin-bottom: 16px;
  font-size: 14px;
}

.notes-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.note-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.04);
  transition: 0.2s ease;
}

.note-item:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(66, 185, 131, 0.3);
}

.note-item.completed {
  opacity: 0.6;
}

.note-checkbox {
  width: 24px;
  height: 24px;
  border: 2px solid var(--border);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: 0.2s ease;
  background: rgba(255, 255, 255, 0.06);
}

.note-item.completed .note-checkbox {
  background: rgba(66, 185, 131, 0.3);
  border-color: rgba(66, 185, 131, 0.5);
}

.note-checkbox:hover {
  border-color: rgba(66, 185, 131, 0.5);
}

.check-icon {
  color: var(--text);
  font-size: 14px;
  font-weight: 700;
}

.note-content {
  flex: 1;
  min-width: 0;
}

.note-text {
  color: var(--text);
  line-height: 1.6;
  margin-bottom: 8px;
  word-wrap: break-word;
}

.note-text.completed {
  text-decoration: line-through;
  color: var(--muted);
}

.note-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: var(--muted);
}

.note-time {
  flex-shrink: 0;
}

.note-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  color: var(--muted);
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  line-height: 1;
  transition: 0.15s ease;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text);
}

/* 编辑弹层 */
.note-modal {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: min(500px, calc(100% - 32px));
  z-index: 200;
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.03);
}

.modal-title {
  font-weight: 700;
  font-size: 16px;
  color: var(--text);
}

.modal-body {
  padding: 16px;
}

.note-input {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.06);
  color: var(--text);
  font-size: 14px;
  line-height: 1.6;
  font-family: inherit;
  resize: vertical;
  box-sizing: border-box;
}

.note-input:focus {
  outline: none;
  border-color: rgba(66, 185, 131, 0.5);
  background: rgba(255, 255, 255, 0.1);
}

.note-input::placeholder {
  color: var(--muted);
}

.input-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}

.char-count {
  font-size: 12px;
  color: var(--muted);
}

.modal-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 16px;
  border-top: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.03);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 响应式 */
@media (max-width: 980px) {
  .calendar-view {
    grid-template-columns: 1fr;
  }

  .notes-panel {
    position: static;
    max-height: none;
  }
}

@media (max-width: 600px) {
  .calendar-view {
    gap: 16px;
  }

  .notes-header {
    padding: 12px 14px;
  }

  .notes-content {
    padding: 12px;
  }

  .note-item {
    padding: 10px;
  }

  .note-modal {
    width: calc(100% - 16px);
    max-height: 80vh;
    display: flex;
    flex-direction: column;
  }

  .modal-body {
    flex: 1;
    overflow-y: auto;
  }
}
</style>
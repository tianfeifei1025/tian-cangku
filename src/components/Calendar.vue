<template>
  <div class="calendar">
    <div class="calendar-header">
      <button class="nav-btn" @click="prevMonth" title="上一个月">‹</button>
      <div class="month-year">{{ currentMonthYear }}</div>
      <button class="nav-btn" @click="nextMonth" title="下一个月">›</button>
    </div>

    <div class="calendar-weekdays">
      <div v-for="day in weekdays" :key="day" class="weekday">{{ day }}</div>
    </div>

    <div class="calendar-days">
      <div
        v-for="(day, index) in calendarDays"
        :key="index"
        class="day"
        :class="{
          'other-month': !day.isCurrentMonth,
          'today': day.isToday,
          'selected': day.isSelected,
          'has-notes': day.hasNotes,
        }"
        @click="selectDate(day.date)"
      >
        <span class="day-number">{{ day.day }}</span>
        <span v-if="day.hasNotes" class="note-dot"></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppCalendar',
  props: {
    selectedDate: {
      type: String,
      default: null,
    },
    notesData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      currentDate: new Date(),
      weekdays: ['日', '一', '二', '三', '四', '五', '六'],
    }
  },
  computed: {
    currentMonthYear() {
      const year = this.currentDate.getFullYear()
      const month = this.currentDate.getMonth() + 1
      return `${year}年${month}月`
    },
    calendarDays() {
      const year = this.currentDate.getFullYear()
      const month = this.currentDate.getMonth()
      const firstDay = new Date(year, month, 1)
      const lastDay = new Date(year, month + 1, 0)
      const daysInMonth = lastDay.getDate()
      const startDayOfWeek = firstDay.getDay()

      const days = []
      const today = new Date()
      const todayStr = this.formatDate(today)

      // 上个月的日期
      const prevMonth = new Date(year, month - 1, 0)
      const prevMonthDays = prevMonth.getDate()
      for (let i = startDayOfWeek - 1; i >= 0; i--) {
        const date = new Date(year, month - 1, prevMonthDays - i)
        days.push({
          date: this.formatDate(date),
          day: prevMonthDays - i,
          isCurrentMonth: false,
          isToday: false,
          isSelected: this.selectedDate === this.formatDate(date),
          hasNotes: this.hasNotesForDate(this.formatDate(date)),
        })
      }

      // 当前月的日期
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day)
        const dateStr = this.formatDate(date)
        days.push({
          date: dateStr,
          day,
          isCurrentMonth: true,
          isToday: dateStr === todayStr,
          isSelected: this.selectedDate === dateStr,
          hasNotes: this.hasNotesForDate(dateStr),
        })
      }

      // 下个月的日期（填充到42个格子）
      const remainingDays = 42 - days.length
      for (let day = 1; day <= remainingDays; day++) {
        const date = new Date(year, month + 1, day)
        days.push({
          date: this.formatDate(date),
          day,
          isCurrentMonth: false,
          isToday: false,
          isSelected: this.selectedDate === this.formatDate(date),
          hasNotes: this.hasNotesForDate(this.formatDate(date)),
        })
      }

      return days
    },
  },
  methods: {
    formatDate(date) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },
    hasNotesForDate(dateStr) {
      return this.notesData[dateStr] && this.notesData[dateStr].length > 0
    },
    prevMonth() {
      this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1)
    },
    nextMonth() {
      this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1)
    },
    selectDate(dateStr) {
      this.$emit('select-date', dateStr)
    },
  },
}
</script>

<style scoped>
.calendar {
  background: linear-gradient(180deg, var(--panel-strong), var(--panel));
  backdrop-filter: blur(12px);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 16px;
  box-shadow: var(--shadow);
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.month-year {
  font-weight: 700;
  font-size: 18px;
  color: var(--text);
}

.nav-btn {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.06);
  color: var(--text);
  cursor: pointer;
  font-size: 24px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.2s ease;
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.12);
  transform: translateY(-1px);
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 8px;
}

.weekday {
  text-align: center;
  font-size: 13px;
  font-weight: 600;
  color: var(--muted);
  padding: 8px 4px;
}

.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.day {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.15s ease;
  position: relative;
  border: 1px solid transparent;
  background: rgba(255, 255, 255, 0.03);
}

.day:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--border);
}

.day.other-month {
  opacity: 0.35;
}

.day.today {
  background: rgba(66, 185, 131, 0.18);
  border-color: rgba(66, 185, 131, 0.35);
  font-weight: 700;
}

.day.selected {
  background: rgba(66, 185, 131, 0.28);
  border-color: rgba(66, 185, 131, 0.45);
  font-weight: 700;
}

.day.has-notes .day-number {
  position: relative;
}

.note-dot {
  position: absolute;
  bottom: 4px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--brand);
  box-shadow: 0 0 0 2px rgba(66, 185, 131, 0.2);
}

.day-number {
  font-size: 14px;
  color: var(--text);
  line-height: 1;
}

.day.today .day-number,
.day.selected .day-number {
  color: var(--text);
}

@media (max-width: 600px) {
  .calendar {
    padding: 12px;
  }

  .month-year {
    font-size: 16px;
  }

  .nav-btn {
    width: 32px;
    height: 32px;
    font-size: 20px;
  }

  .weekday {
    font-size: 12px;
    padding: 6px 2px;
  }

  .day-number {
    font-size: 13px;
  }

  .note-dot {
    width: 3px;
    height: 3px;
    bottom: 3px;
  }
}
</style>
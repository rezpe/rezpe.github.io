const { createApp } = Vue;

createApp({
    data() {
        return {
            selectedYear: new Date().getFullYear(),
            showSidebar: false,
            selectedEvent: null,
            events: [],
            eventForm: {
                title: '',
                description: '',
                startDate: '',
                endDate: '',
                color: '#3b82f6'
            },
            eventColors: [
                '#3b82f6', // blue
                '#ef4444', // red
                '#10b981', // green
                '#f59e0b', // yellow
                '#8b5cf6', // purple
                '#ec4899', // pink
                '#6366f1', // indigo
                '#14b8a6', // teal
            ],
            months: [],
            resizing: null,
            resizeHandle: null,
            dragging: null,
            dragStartDate: null,
            dragOriginalStart: null,
            dragOriginalEnd: null
        };
    },
    methods: {
        initializeMonths() {
            const monthNames = [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ];

            this.months = monthNames.map((name, index) => {
                const daysInMonth = new Date(this.selectedYear, index + 1, 0).getDate();
                return {
                    name,
                    days: daysInMonth,
                    index
                };
            });
        },
        changeYear() {
            this.initializeMonths();
            this.loadEvents();
        },
        selectDay(monthIndex, day) {
            const dateStr = this.getDateKey(monthIndex, day);
            this.selectedEvent = null;
            this.eventForm = {
                title: '',
                description: '',
                startDate: dateStr,
                endDate: dateStr,
                color: '#3b82f6'
            };
            this.showSidebar = true;
        },
        selectEvent(event) {
            this.selectedEvent = event;
            this.eventForm = {
                title: event.title,
                description: event.description || '',
                startDate: event.startDate,
                endDate: event.endDate,
                color: event.color
            };
            this.showSidebar = true;
        },
        closeSidebar() {
            this.showSidebar = false;
            this.selectedEvent = null;
            this.eventForm = {
                title: '',
                description: '',
                startDate: '',
                endDate: '',
                color: '#3b82f6'
            };
        },
        isToday(monthIndex, day) {
            const today = new Date();
            return today.getFullYear() === this.selectedYear &&
                   today.getMonth() === monthIndex &&
                   today.getDate() === day;
        },
        isWeekend(monthIndex, day) {
            const date = new Date(this.selectedYear, monthIndex, day);
            const dayOfWeek = date.getDay();
            return dayOfWeek === 0 || dayOfWeek === 6;
        },
        getDateKey(monthIndex, day) {
            const month = String(monthIndex + 1).padStart(2, '0');
            const dayStr = String(day).padStart(2, '0');
            return `${this.selectedYear}-${month}-${dayStr}`;
        },
        parseDate(dateStr) {
            const [year, month, day] = dateStr.split('-').map(Number);
            return new Date(year, month - 1, day);
        },
        getMonthEvents(monthIndex) {
            const monthEvents = this.events.filter(event => {
                const start = this.parseDate(event.startDate);
                const end = this.parseDate(event.endDate);
                const monthStart = new Date(this.selectedYear, monthIndex, 1);
                const monthEnd = new Date(this.selectedYear, monthIndex + 1, 0);
                return start <= monthEnd && end >= monthStart;
            });

            // Calculate row for each event to avoid overlaps
            monthEvents.forEach(event => {
                event._row = this.calculateEventRow(event, monthEvents, monthIndex);
            });

            return monthEvents;
        },
        calculateEventRow(event, allEvents, monthIndex) {
            const start = this.parseDate(event.startDate);
            const end = this.parseDate(event.endDate);
            const monthStart = new Date(this.selectedYear, monthIndex, 1);
            const monthEnd = new Date(this.selectedYear, monthIndex + 1, 0);

            const eventStart = start < monthStart ? monthStart : start;
            const eventEnd = end > monthEnd ? monthEnd : end;

            // Check which rows are already occupied by overlapping events
            const occupiedRows = new Set();

            for (const otherEvent of allEvents) {
                if (otherEvent.id === event.id) continue;
                if (otherEvent._row === undefined) continue;

                const otherStart = this.parseDate(otherEvent.startDate);
                const otherEnd = this.parseDate(otherEvent.endDate);
                const otherEventStart = otherStart < monthStart ? monthStart : otherStart;
                const otherEventEnd = otherEnd > monthEnd ? monthEnd : otherEnd;

                // Check if events overlap
                if (eventStart <= otherEventEnd && eventEnd >= otherEventStart) {
                    occupiedRows.add(otherEvent._row);
                }
            }

            // Find the first available row
            let row = 0;
            while (occupiedRows.has(row)) {
                row++;
            }

            return row;
        },
        getEventStyle(event, monthIndex) {
            const start = this.parseDate(event.startDate);
            const end = this.parseDate(event.endDate);
            const monthStart = new Date(this.selectedYear, monthIndex, 1);
            const monthEnd = new Date(this.selectedYear, monthIndex + 1, 0);

            const eventStart = start < monthStart ? monthStart : start;
            const eventEnd = end > monthEnd ? monthEnd : end;

            const startDay = eventStart.getDate();
            const endDay = eventEnd.getDate();

            // Get the actual rendered position of day cells from the current month
            const monthElement = document.querySelectorAll('.month-block')[monthIndex];
            const dayCells = monthElement ? monthElement.querySelectorAll('.day-cell') : [];

            // If we have the actual cells, measure the distance between them
            if (dayCells.length >= 2) {
                const firstCell = dayCells[0];
                const secondCell = dayCells[1];
                const cellSpacing = secondCell.getBoundingClientRect().left - firstCell.getBoundingClientRect().left;
                const cellWidth = firstCell.offsetWidth;

                const leftPosition = (startDay - 1) * cellSpacing;
                const eventWidth = (endDay - startDay) * cellSpacing + cellWidth;

                // Calculate vertical position based on row
                const row = event._row || 0;
                const rowHeight = 18;
                const topOffset = 14;

                return {
                    left: `${leftPosition}px`,
                    width: `${eventWidth}px`,
                    top: `${topOffset + (row * rowHeight)}px`,
                    backgroundColor: event.color
                };
            }

            // Fallback calculation
            const row = event._row || 0;
            const rowHeight = 18;
            const topOffset = 14;

            return {
                left: '0px',
                width: '100px',
                top: `${topOffset + (row * rowHeight)}px`,
                backgroundColor: event.color
            };
        },
        saveEvent() {
            if (!this.eventForm.title.trim()) return;

            if (this.selectedEvent) {
                const index = this.events.findIndex(e => e.id === this.selectedEvent.id);
                if (index !== -1) {
                    this.events[index] = {
                        ...this.selectedEvent,
                        title: this.eventForm.title,
                        description: this.eventForm.description,
                        startDate: this.eventForm.startDate,
                        endDate: this.eventForm.endDate,
                        color: this.eventForm.color
                    };
                }
            } else {
                const newEvent = {
                    id: Date.now() + Math.random(),
                    title: this.eventForm.title,
                    description: this.eventForm.description,
                    startDate: this.eventForm.startDate,
                    endDate: this.eventForm.endDate,
                    color: this.eventForm.color
                };
                this.events.push(newEvent);
            }

            this.saveEvents();
            this.closeSidebar();
        },
        deleteEvent() {
            if (this.selectedEvent) {
                this.events = this.events.filter(e => e.id !== this.selectedEvent.id);
                this.saveEvents();
                this.closeSidebar();
            }
        },
        startResize(e, event, handle = null) {
            e.preventDefault();
            e.stopPropagation();

            if (handle) {
                // Resizing
                this.resizing = event;
                this.resizeHandle = handle;
                document.addEventListener('mousemove', this.handleResize);
                document.addEventListener('mouseup', this.stopResize);
            } else {
                // Dragging to move - find which day we're starting from
                const target = e.target.closest('.day-cell');
                if (!target) {
                    // If not on a day cell, find it from mouse position
                    const allDayCells = document.querySelectorAll('.day-cell');
                    for (const cell of allDayCells) {
                        const rect = cell.getBoundingClientRect();
                        if (e.clientX >= rect.left && e.clientX <= rect.right &&
                            e.clientY >= rect.top && e.clientY <= rect.bottom) {
                            this.dragStartDate = cell.dataset.date;
                            break;
                        }
                    }
                } else {
                    this.dragStartDate = target.dataset.date;
                }

                if (!this.dragStartDate) {
                    this.dragStartDate = event.startDate;
                }

                this.dragging = event;
                this.dragOriginalStart = event.startDate;
                this.dragOriginalEnd = event.endDate;
                document.addEventListener('mousemove', this.handleDrag);
                document.addEventListener('mouseup', this.stopDrag);
            }
        },
        handleResize(e) {
            if (!this.resizing) return;

            // Find which day cell the mouse is over
            let targetDay = null;
            const allDayCells = document.querySelectorAll('.day-cell');
            for (const cell of allDayCells) {
                const rect = cell.getBoundingClientRect();
                if (e.clientX >= rect.left && e.clientX <= rect.right &&
                    e.clientY >= rect.top && e.clientY <= rect.bottom) {
                    targetDay = cell.dataset.date;
                    break;
                }
            }

            if (!targetDay) return;

            const eventIndex = this.events.findIndex(ev => ev.id === this.resizing.id);
            if (eventIndex === -1) return;

            const currentEvent = this.events[eventIndex];

            // Update for visual preview
            if (this.resizeHandle === 'left') {
                if (targetDay <= currentEvent.endDate) {
                    this.events[eventIndex] = {
                        id: currentEvent.id,
                        title: currentEvent.title,
                        description: currentEvent.description,
                        startDate: targetDay,
                        endDate: currentEvent.endDate,
                        color: currentEvent.color
                    };
                }
            } else if (this.resizeHandle === 'right') {
                if (targetDay >= currentEvent.startDate) {
                    this.events[eventIndex] = {
                        id: currentEvent.id,
                        title: currentEvent.title,
                        description: currentEvent.description,
                        startDate: currentEvent.startDate,
                        endDate: targetDay,
                        color: currentEvent.color
                    };
                }
            }
        },
        stopResize() {
            if (this.resizing) {
                // Save to localStorage when resize completes
                this.saveEvents();
            }
            this.resizing = null;
            this.resizeHandle = null;
            document.removeEventListener('mousemove', this.handleResize);
            document.removeEventListener('mouseup', this.stopResize);
        },
        handleDrag(e) {
            if (!this.dragging) return;

            // Find which day cell the mouse is currently over
            let currentDate = null;
            const allDayCells = document.querySelectorAll('.day-cell');
            for (const cell of allDayCells) {
                const rect = cell.getBoundingClientRect();
                if (e.clientX >= rect.left && e.clientX <= rect.right &&
                    e.clientY >= rect.top && e.clientY <= rect.bottom) {
                    currentDate = cell.dataset.date;
                    break;
                }
            }

            if (!currentDate || currentDate === this.dragStartDate) return;

            // Calculate the difference in days
            const startDate = this.parseDate(this.dragStartDate);
            const dropDate = this.parseDate(currentDate);
            const daysDiff = Math.floor((dropDate - startDate) / (1000 * 60 * 60 * 24));

            // Calculate event duration
            const originalStart = this.parseDate(this.dragOriginalStart);
            const originalEnd = this.parseDate(this.dragOriginalEnd);
            const duration = Math.floor((originalEnd - originalStart) / (1000 * 60 * 60 * 24));

            // Calculate new dates
            const newStartDate = new Date(originalStart);
            newStartDate.setDate(originalStart.getDate() + daysDiff);

            const newEndDate = new Date(newStartDate);
            newEndDate.setDate(newStartDate.getDate() + duration);

            // Format dates
            const formatDate = (date) => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            };

            // Update for visual preview
            const eventIndex = this.events.findIndex(ev => ev.id === this.dragging.id);
            if (eventIndex !== -1) {
                this.events[eventIndex] = {
                    id: this.events[eventIndex].id,
                    title: this.events[eventIndex].title,
                    description: this.events[eventIndex].description,
                    startDate: formatDate(newStartDate),
                    endDate: formatDate(newEndDate),
                    color: this.events[eventIndex].color
                };
            }
        },
        stopDrag() {
            if (this.dragging) {
                // Save to localStorage when drag completes
                this.saveEvents();
            }
            this.dragging = null;
            this.dragStartDate = null;
            this.dragOriginalStart = null;
            this.dragOriginalEnd = null;
            document.removeEventListener('mousemove', this.handleDrag);
            document.removeEventListener('mouseup', this.stopDrag);
        },
        saveEvents() {
            const storageKey = `lincal_events_${this.selectedYear}`;
            // Clean events before saving - remove temporary properties like _row
            const cleanEvents = this.events.map(event => ({
                id: event.id,
                title: event.title,
                description: event.description,
                startDate: event.startDate,
                endDate: event.endDate,
                color: event.color
            }));
            localStorage.setItem(storageKey, JSON.stringify(cleanEvents));
        },
        loadEvents() {
            const storageKey = `lincal_events_${this.selectedYear}`;
            const stored = localStorage.getItem(storageKey);
            this.events = stored ? JSON.parse(stored) : [];
        },
        exportData() {
            const data = {
                year: this.selectedYear,
                events: this.events,
                exportDate: new Date().toISOString()
            };

            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `lincal_${this.selectedYear}.json`;
            link.click();
            URL.revokeObjectURL(url);
        },
        importData() {
            this.$refs.fileInput.click();
        },
        handleFileImport(event) {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    if (data.year && data.events) {
                        this.selectedYear = data.year;
                        this.events = data.events;
                        this.initializeMonths();
                        this.saveEvents();
                        alert('Data imported successfully!');
                    } else {
                        alert('Invalid file format');
                    }
                } catch (error) {
                    alert('Error reading file: ' + error.message);
                }
            };
            reader.readAsText(file);
            event.target.value = '';
        },
        resetCalendar() {
            if (confirm('Are you sure you want to reset everything? This will delete all events for the current year and cannot be undone.')) {
                // Clear events from current state
                this.events = [];

                // Clear from localStorage for current year
                const storageKey = `lincal_events_${this.selectedYear}`;
                localStorage.removeItem(storageKey);

                // Close sidebar if open
                this.closeSidebar();
            }
        }
    },
    mounted() {
        this.initializeMonths();
        this.loadEvents();

        // Force a re-render after DOM is fully ready to ensure correct positioning
        this.$nextTick(() => {
            this.$forceUpdate();
        });
    }
}).mount('#app');

const exercises = [
    { name: "Jumping Jacks", icon: "shorts/jumpingjack.mp4", duration: 30 },
    { name: "Rest", icon: "shorts/rest.mp4", duration: 10 }, // rest
    { name: "Wall Sit", icon: "shorts/wallsit.mp4", duration: 30 },
    { name: "Rest", icon: "shorts/rest.mp4", duration: 10 }, // rest
    { name: "Push Up", icon: "shorts/pushup.mp4", duration: 30 },
    { name: "Rest", icon: "shorts/rest.mp4", duration: 10 }, // rest
    { name: "Crunch", icon: "shorts/crunch.mp4", duration: 30 },
    { name: "Rest", icon: "shorts/rest.mp4", duration: 10 }, // rest
    { name: "Step Up", icon: "shorts/chairStepUp.mp4", duration: 30 },
    { name: "Rest", icon: "shorts/rest.mp4", duration: 10 }, // rest
    { name: "Squat", icon: "shorts/squat.mp4", duration: 30 },
    { name: "Rest", icon: "shorts/rest.mp4", duration: 10 }, // rest
    { name: "Tricep Dip", icon: "shorts/tricepdip.mp4", duration: 30 },
    { name: "Rest", icon: "shorts/rest.mp4", duration: 10 }, // rest
    { name: "Plank", icon: "shorts/plank.mp4", duration: 30 },
    { name: "Rest", icon: "shorts/rest.mp4", duration: 10 }, // rest
    { name: "High Knees Running", icon: "shorts/jog.mp4", duration: 30 },
    { name: "Rest", icon: "shorts/rest.mp4", duration: 10 }, // rest
    { name: "Lunge", icon: "shorts/lunge.mp4", duration: 30 },
    { name: "Rest", icon: "shorts/rest.mp4", duration: 10 }, // rest
    { name: "Push Up Rotation", icon: "shorts/pushuprotation.mp4", duration: 30 },
    { name: "Rest", icon: "shorts/rest.mp4", duration: 10 }, // rest
    { name: "Side Plank", icon: "shorts/sideplank.mp4", duration: 30 }
];

const app = Vue.createApp({
    data() {
        return {
            screen: 'home',
            exercises,
            currentExerciseIndex: 0,
            timeRemaining: exercises[0].duration,
            interval: null,
            isPaused: false,
            achievements: JSON.parse(localStorage.getItem('achievements') || '[]'),
        };
    },
    computed: {
        currentExercise() {
            return this.exercises[this.currentExerciseIndex];
        },
        upcomingExercise() {
            let nextIndex = this.currentExerciseIndex + 1;
            
            // If current exercise is Rest, show the next exercise
            if (this.currentExercise.name === "Rest") {
                return nextIndex < this.exercises.length ? 
                    this.exercises[nextIndex] : 
                    { name: "Last exercise" };
            }
            
            // Skip rest exercises to show next actual exercise
            while (nextIndex < this.exercises.length && this.exercises[nextIndex].name === "Rest") {
                nextIndex++;
            }
            
            // Return next exercise or "Last exercise" if no more exercises
            return nextIndex < this.exercises.length ? 
                this.exercises[nextIndex] : 
                { name: "Last exercise" };
        },
        exerciseProgress() {
            const currentDuration = this.currentExercise.duration;
            return (currentDuration - this.timeRemaining) / currentDuration;
        },
        workoutProgress() {
            const totalExercises = this.exercises.length;
            const completed = this.currentExerciseIndex;
            return completed / totalExercises;
        },
        progressWidth() {
            return `${this.workoutProgress * 100}%`;
        },
        progressClass() {
            return this.timeRemaining > 10 ? 'bg-green-500' : 'bg-orange-500';
        },
        completionDate() {
            const date = new Date();
            return date.toISOString().split('T')[0];
        },
        totalWorkouts() {
            return this.achievements.length;
        },
        currentStreak() {
            if (this.achievements.length === 0) return 0;

            const sortedDates = [...this.achievements].sort().reverse();
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            let streak = 0;
            let checkDate = new Date(today);

            // Check if worked out today or yesterday to start streak
            const todayStr = today.toISOString().split('T')[0];
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];

            if (!sortedDates.includes(todayStr) && !sortedDates.includes(yesterdayStr)) {
                return 0;
            }

            // Start from today or yesterday
            if (!sortedDates.includes(todayStr)) {
                checkDate = yesterday;
            }

            // Count consecutive days
            while (true) {
                const dateStr = checkDate.toISOString().split('T')[0];
                if (sortedDates.includes(dateStr)) {
                    streak++;
                    checkDate.setDate(checkDate.getDate() - 1);
                } else {
                    break;
                }
            }

            return streak;
        },
        recentWorkouts() {
            return [...this.achievements].sort().reverse().slice(0, 10);
        },
        heatmapData() {
            const weeks = [];
            const today = new Date();
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

            // Go back 16 weeks (about 4 months)
            const startDate = new Date(today);
            startDate.setDate(startDate.getDate() - (16 * 7));
            // Align to Sunday
            startDate.setDate(startDate.getDate() - startDate.getDay());

            let currentDate = new Date(startDate);
            let lastMonth = -1;

            for (let week = 0; week < 17; week++) {
                const weekData = {
                    monthLabel: '',
                    days: []
                };

                for (let day = 0; day < 7; day++) {
                    if (currentDate <= today) {
                        const dateStr = currentDate.toISOString().split('T')[0];
                        weekData.days.push(dateStr);

                        // Add month label on first day of month or first week
                        if (day === 0 && currentDate.getMonth() !== lastMonth) {
                            weekData.monthLabel = months[currentDate.getMonth()];
                            lastMonth = currentDate.getMonth();
                        }
                    } else {
                        weekData.days.push(null);
                    }
                    currentDate.setDate(currentDate.getDate() + 1);
                }

                weeks.push(weekData);
            }

            return weeks;
        },
    },
    methods: {
        startWorkout() {
            this.screen = 'workout';
            this.currentExerciseIndex = 0;
            this.timeRemaining = this.exercises[0].duration;
            this.startTimer();
        },
        goToAchievements() {
            this.screen = 'achievements';
            this.scrollHeatmapToEnd();
        },
        goBack() {
            this.screen = 'home';
        },
        startTimer() {
            this.clearTimer();
            this.interval = setInterval(this.updateTimer, 1000);
        },
        updateTimer() {
            if (!this.isPaused) {
                if (this.timeRemaining > 0) {
                    this.timeRemaining--;
                } else {
                    this.nextExercise();
                }
            }
        },
        togglePause() {
            this.isPaused = !this.isPaused;
        },
        prevExercise() {
            if (this.currentExerciseIndex > 0) {
                this.currentExerciseIndex--;
                this.resetTimer();
            }
        },
        nextExercise() {
            if (this.currentExerciseIndex < this.exercises.length - 1) {
                this.currentExerciseIndex++;
            } else {
                this.completeWorkout();
            }
            this.resetTimer();
        },
        resetTimer() {
            this.clearTimer();
            this.timeRemaining = this.currentExercise.duration;
            console.log('Timer reset for:', this.currentExercise.name, 'Duration:', this.timeRemaining);
            this.startTimer();
        },
        completeWorkout() {
            this.clearTimer();
            this.achievements.push(new Date().toISOString().split('T')[0]);
            localStorage.setItem('achievements', JSON.stringify(this.achievements));
            this.currentExerciseIndex = 0;
            this.timeRemaining = this.exercises[0].duration;
            this.screen = 'congratulations';
        },
        clearTimer() {
            if (this.interval) {
                clearInterval(this.interval);
                this.interval = null;
            }
        },
        dayClass(day) {
            const date = new Date();
            date.setDate(day);
            const dateString = date.toISOString().split('T')[0];
            return this.achievements.includes(dateString) ? 'bg-green-500' : 'bg-gray-500';
        },
        formatTime(seconds) {
            const minutes = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
        },
        clearAchievements() {
            this.achievements = [];
            localStorage.removeItem('achievements');
        },
        cancelWorkout() {
            this.clearTimer();
            this.currentExerciseIndex = 0;
            this.timeRemaining = this.exercises[0].duration;
            this.screen = 'home';
        },
        getDayClass(dateStr) {
            if (!dateStr) return 'bg-transparent';

            const count = this.achievements.filter(d => d === dateStr).length;

            if (count === 0) return 'bg-card-alt';
            if (count === 1) return 'bg-primary/50';
            return 'bg-primary';
        },
        formatWorkoutDate(dateStr) {
            const date = new Date(dateStr + 'T00:00:00');
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            const dateOnly = new Date(date);
            dateOnly.setHours(0, 0, 0, 0);

            if (dateOnly.getTime() === today.getTime()) {
                return 'Today';
            } else if (dateOnly.getTime() === yesterday.getTime()) {
                return 'Yesterday';
            } else {
                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            }
        },
        scrollHeatmapToEnd() {
            this.$nextTick(() => {
                const heatmap = document.querySelector('.heatmap-scroll');
                if (heatmap) {
                    heatmap.scrollLeft = heatmap.scrollWidth;
                }
            });
        }
    },
    watch: {
        screen(newScreen) {
            if (newScreen === 'achievements') {
                this.scrollHeatmapToEnd();
            }
        }
    }
});

app.mount('#app');

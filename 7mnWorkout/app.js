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
        circumference() {
            return 2 * Math.PI * 45;
        },
        completionDate() {
            const date = new Date();
            return date.toISOString().split('T')[0];
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
        calculateArcPath() {
            // Adjust exerciseProgress to 0.9999 if it's 1 to ensure full circle drawing
            const progress = this.exerciseProgress === 1 ? 0.9999 : this.exerciseProgress;

            const outerRadius = 45;
            const innerRadius = 40;  // Slightly smaller to create border thickness
            const startAngle = -Math.PI / 2;
            const endAngle = startAngle + 2 * Math.PI * progress;
            const largeArcFlag = progress > 0.5 ? 1 : 0;

            // Outer arc
            const outerStartX = 50 + outerRadius * Math.cos(startAngle);
            const outerStartY = 50 + outerRadius * Math.sin(startAngle);
            const outerEndX = 50 + outerRadius * Math.cos(endAngle);
            const outerEndY = 50 + outerRadius * Math.sin(endAngle);

            // Inner arc (in reverse direction)
            const innerStartX = 50 + innerRadius * Math.cos(endAngle);
            const innerStartY = 50 + innerRadius * Math.sin(endAngle);
            const innerEndX = 50 + innerRadius * Math.cos(startAngle);
            const innerEndY = 50 + innerRadius * Math.sin(startAngle);

            return `M ${outerStartX} ${outerStartY}
                    A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${outerEndX} ${outerEndY}
                    L ${innerStartX} ${innerStartY}
                    A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerEndX} ${innerEndY}
                    Z`;
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
        }
    }
});

app.mount('#app');

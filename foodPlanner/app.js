new Vue({
    el: '#app',
    data: {
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        meals: JSON.parse(localStorage.getItem('meals')) || Array(7).fill().map(() => [
            { ingredients: '' }, // Breakfast
            { name: '', ingredients: '' }, // Lunch
            { name: '', ingredients: '' }  // Dinner
        ]),
        groceryList: [],
        recording: false,
        mediaRecorder: null,
        audioChunks: [],
        apiKey: localStorage.getItem('openai_api_key') || '',
        showApiKeyInput: false,
        recordingState: '🎤',
        currentDayIndex: null,
        currentMealIndex: null
    },
    methods: {
        toggleApiKeyInput() {
            this.showApiKeyInput = !this.showApiKeyInput;
        },
        saveApiKey() {
            localStorage.setItem('openai_api_key', this.apiKey);
            alert('API Key saved!');
        },
        toggleRecording(dayIndex, mealIndex) {
            if (this.recording) {
                this.stopRecording();
            } else {
                this.startRecording(dayIndex, mealIndex);
            }
        },
        startRecording(dayIndex, mealIndex) {
            this.currentDayIndex = dayIndex;
            this.currentMealIndex = mealIndex;
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    this.mediaRecorder = new MediaRecorder(stream);
                    this.audioChunks = [];
                    this.mediaRecorder.ondataavailable = event => {
                        this.audioChunks.push(event.data);
                    };
                    this.mediaRecorder.onstop = async () => {
                        this.recordingState = '🧠';
                        const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
                        const transcription = await this.transcribeAudio(audioBlob);
                        const { name, ingredients } = await this.analyzeTranscription(transcription);
                        this.meals[this.currentDayIndex][this.currentMealIndex].name = name;
                        this.meals[this.currentDayIndex][this.currentMealIndex].ingredients = ingredients;
                        this.saveMeals();
                        this.recordingState = '🎤';
                    };
                    this.mediaRecorder.start();
                    this.recording = true;
                    this.recordingState = '🛑';
                })
                .catch(error => console.error('Error accessing microphone:', error));
        },
        stopRecording() {
            this.mediaRecorder.stop();
            this.recording = false;
        },
        async transcribeAudio(audioBlob) {
            const formData = new FormData();
            formData.append('file', audioBlob, 'recording.wav');
            formData.append('model', 'whisper-1');

            const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Transcription failed');
            }

            const result = await response.json();
            return result.text;
        },
        async analyzeTranscription(transcription) {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'gpt-4o-2024-08-06',
                    messages: [
                        { role: 'system', content: 'Extract the dish name and ingredients from the transcription.' },
                        { role: 'user', content: transcription }
                    ],
                    response_format: {
                        type: 'json_schema',
                        json_schema: {
                            name: 'dish_response',
                            schema: {
                                "type": "object",
                                "properties": {
                                    "name": { "type": "string" },
                                    "ingredients": { "type": "string" }
                                },
                                "required": ["name", "ingredients"],
                                "additionalProperties": false
                            },
                            strict: true
                        }
                    }
                })
            });

            if (!response.ok) {
                throw new Error('Analysis failed');
            }

            const result = await response.json();
            const content = result.choices[0].message.content;
            return JSON.parse(content);
        },
        saveMeals() {
            localStorage.setItem('meals', JSON.stringify(this.meals));
        },
        generateGroceryList() {
            const ingredientsSet = new Set();
            this.meals.forEach(day => {
                day.forEach(meal => {
                    meal.ingredients.split(',').forEach(ingredient => {
                        const trimmed = ingredient.trim();
                        if (trimmed) {
                            ingredientsSet.add(trimmed);
                        }
                    });
                });
            });
            this.groceryList = Array.from(ingredientsSet).sort();
        }
    }
});
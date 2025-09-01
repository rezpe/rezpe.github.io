const { createApp } = Vue;

createApp({
            data() {
        return {
            isProcessing: false,
            currentProcessingProject: '',
            
            // Multi-project data structure
            projectListText: '',
            projectNames: [],
            projects: {}, // Each project will have: { nextSteps: [], blockingPoints: [], achievements: [], updates: [] }
            quickUpdateTexts: {}, // Separate text area for each project
            selectedRawUpdatesProject: '', // Track which project's raw updates to show
            showProjectManagement: false, // Toggle for project management section
            
            // AI Configuration
            openaiApiKey: localStorage.getItem('openaiApiKey') || '',
            provider: localStorage.getItem('aiProvider') || 'openai',
            azureEndpoint: localStorage.getItem('azureEndpoint') || '',
            azureDeployment: localStorage.getItem('azureDeployment') || '',
            
            // Temporary settings while editing
            showApiKeyInput: false,
            tempApiKey: '',
            tempProvider: 'openai',
            tempAzureEndpoint: '',
            tempAzureDeployment: ''
        }
    },
    computed: {
        sortedProjectNames() {
            // Sort projects: incomplete projects first, then completed projects
            return [...this.projectNames].sort((a, b) => {
                const aIsDone = this.projects[a]?.isDone || false;
                const bIsDone = this.projects[b]?.isDone || false;
                
                // If one is done and the other isn't, prioritize the incomplete one
                if (aIsDone !== bIsDone) {
                    return aIsDone ? 1 : -1;
                }
                
                // If both have the same completion status, maintain original order
                return this.projectNames.indexOf(a) - this.projectNames.indexOf(b);
            });
        }
    },
    mounted() {
        // Auto-load data from localStorage when the app starts
        this.loadData();
    },
    watch: {
        // Populate temp values when settings panel is opened
        showApiKeyInput(newValue) {
            if (newValue) {
                this.tempApiKey = this.openaiApiKey;
                this.tempProvider = this.provider;
                this.tempAzureEndpoint = this.azureEndpoint;
                this.tempAzureDeployment = this.azureDeployment;
            }
        }
    },
    methods: {
        // Project Management Methods
        updateProjectList() {
            const newProjectNames = this.projectListText
                .split('\n')
                .map(name => name.trim())
                .filter(name => name.length > 0);
            
            // Create new projects for any new names
            newProjectNames.forEach(name => {
                if (!this.projects[name]) {
                    this.projects[name] = {
                        nextSteps: [],
                        blockingPoints: [],
                        achievements: [],
                        updates: [],
                        isDone: false
                    };
                }
                
                // Initialize quick update text if not exists
                if (!this.quickUpdateTexts[name]) {
                    this.quickUpdateTexts[name] = '';
                }
            });
            
            // Remove projects that are no longer in the list
            Object.keys(this.projects).forEach(name => {
                if (!newProjectNames.includes(name)) {
                    delete this.projects[name];
                    delete this.quickUpdateTexts[name];
                    // Clear raw updates selection if the selected project was removed
                    if (this.selectedRawUpdatesProject === name) {
                        this.selectedRawUpdatesProject = '';
                    }
                }
            });
            
            this.projectNames = newProjectNames;
            this.autoSave();
            this.showNotification(`Projects updated: ${newProjectNames.length} project(s) configured`, 'success');
        },

        // Toggle project done status
        toggleProjectDone(projectName) {
            if (this.projects[projectName]) {
                this.projects[projectName].isDone = !this.projects[projectName].isDone;
                this.autoSave();
                const status = this.projects[projectName].isDone ? 'completed' : 'active';
                this.showNotification(`${projectName} marked as ${status}`, 'success');
            }
        },
        
        // Quick Update method
        async submitQuickUpdate(projectName) {
            if (!projectName || !this.projects[projectName]) {
                this.showNotification('Invalid project', 'error');
                return;
            }
            
            const updateText = this.quickUpdateTexts[projectName];
            if (updateText && updateText.trim()) {
                const update = {
                    content: updateText.trim(),
                    timestamp: new Date().toLocaleString()
                };
                this.projects[projectName].updates.unshift(update); // Add to beginning for newest first
                this.quickUpdateTexts[projectName] = '';
                this.autoSave();
                this.showNotification(`Update added to ${projectName}!`, 'success');
                
                // Process with AI if properly configured
                if (this.isAIConfigured()) {
                    await this.processUpdateWithAI(projectName, updateText.trim());
                } else {
                    this.showNotification('Configure AI settings (gear icon) to enable AI processing', 'info');
                }
            }
        },

        // AI Integration
        async processUpdateWithAI(projectName, updateText) {
            if (!this.isAIConfigured()) {
                this.showNotification('AI not properly configured', 'error');
                return;
            }

            if (!projectName || !this.projects[projectName]) {
                this.showNotification('Invalid project for AI processing', 'error');
                return;
            }

            this.isProcessing = true;
            this.currentProcessingProject = projectName;
            this.showNotification(`Processing ${projectName} with AI...`, 'info');

            try {
                const prompt = this.buildPrompt(projectName, updateText);
                const response = await this.callOpenAI(prompt);
                this.parseAndUpdateSections(projectName, response);
                this.autoSave();
                this.showNotification(`AI processing completed for ${projectName}!`, 'success');
            } catch (error) {
                console.error('OpenAI API Error:', error);
                this.showNotification(`AI processing failed for ${projectName}: ` + error.message, 'error');
            } finally {
                this.isProcessing = false;
                this.currentProcessingProject = '';
            }
        },

        buildPrompt(projectName, updateText) {
            const project = this.projects[projectName];
            return `You are helping manage a project status dashboard for "${projectName}". Based on the new update provided, please analyze and update the project sections accordingly.

CURRENT STATE:

Next Steps:
${project.nextSteps.length > 0 ? project.nextSteps.map(step => `- ${step}`).join('\n') : '- None'}

Achievements:
${project.achievements.length > 0 ? project.achievements.map(achievement => `- ${achievement}`).join('\n') : '- None'}

Blocking Points:
${project.blockingPoints.length > 0 ? project.blockingPoints.map(block => `- ${block}`).join('\n') : '- None'}

NEW UPDATE:
${updateText}

Please analyze this update and provide updated Next Steps, Achievements, and Blocking Points that reflect the information in the update. 

INSTRUCTIONS:
- Add new items based on what's mentioned in the update
- Remove or modify existing items if they're completed, resolved, or no longer relevant
- Keep existing items that are still valid
- Be concise and actionable

Respond ONLY with a JSON object in this exact format:
{
  "nextSteps": ["step1", "step2", ...],
  "achievements": ["achievement1", "achievement2", ...],
  "blockingPoints": ["block1", "block2", ...]
}`;
        },

        async callOpenAI(prompt) {
            let url, headers, model;

            if (this.provider === 'azure') {
                // Azure OpenAI configuration
                url = `${this.azureEndpoint}/openai/deployments/${this.azureDeployment}/chat/completions?api-version=2024-02-15-preview`;
                headers = {
                    'Content-Type': 'application/json',
                    'api-key': this.openaiApiKey
                };
                model = this.azureDeployment; // Use deployment name as model for Azure
            } else {
                // Standard OpenAI configuration
                url = 'https://api.openai.com/v1/chat/completions';
                headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.openaiApiKey}`
                };
                model = 'gpt-4';
            }

            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    model: model,
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a helpful project management assistant. Always respond with valid JSON only.'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: 0.3,
                    max_tokens: 1000
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData.error?.message || errorData.message || `${this.provider} API request failed`;
                throw new Error(errorMessage);
            }

            const data = await response.json();
            return data.choices[0].message.content;
        },

        parseAndUpdateSections(projectName, response) {
            try {
                // Clean up the response to ensure it's valid JSON
                let cleanResponse = response.trim();
                if (cleanResponse.startsWith('```json')) {
                    cleanResponse = cleanResponse.replace('```json', '').replace('```', '');
                }
                
                const parsedResponse = JSON.parse(cleanResponse);
                const project = this.projects[projectName];
                
                // Update the sections for the specific project
                if (parsedResponse.nextSteps && Array.isArray(parsedResponse.nextSteps)) {
                    project.nextSteps = parsedResponse.nextSteps;
                }
                if (parsedResponse.achievements && Array.isArray(parsedResponse.achievements)) {
                    project.achievements = parsedResponse.achievements;
                }
                if (parsedResponse.blockingPoints && Array.isArray(parsedResponse.blockingPoints)) {
                    project.blockingPoints = parsedResponse.blockingPoints;
                }
            } catch (error) {
                console.error('Failed to parse AI response:', error);
                this.showNotification(`Failed to parse AI response for ${projectName}`, 'error');
            }
        },

        // API Key Management
        saveApiKey() {
            if (!this.tempApiKey || !this.tempApiKey.trim()) {
                this.showNotification('Please enter a valid API key', 'error');
                return;
            }

            if (this.tempProvider === 'azure') {
                if (!this.tempAzureEndpoint || !this.tempAzureDeployment) {
                    this.showNotification('Please fill in all Azure fields', 'error');
                    return;
                }
            }

            // Save all configuration
            this.openaiApiKey = this.tempApiKey.trim();
            this.provider = this.tempProvider;
            this.azureEndpoint = this.tempAzureEndpoint;
            this.azureDeployment = this.tempAzureDeployment;

            localStorage.setItem('openaiApiKey', this.openaiApiKey);
            localStorage.setItem('aiProvider', this.provider);
            localStorage.setItem('azureEndpoint', this.azureEndpoint);
            localStorage.setItem('azureDeployment', this.azureDeployment);

            // Clear temp values and close panel
            this.tempApiKey = '';
            this.tempAzureEndpoint = '';
            this.tempAzureDeployment = '';
            this.showApiKeyInput = false;
            
            this.showNotification('AI configuration saved successfully!', 'success');
        },

        clearApiKey() {
            this.openaiApiKey = '';
            this.provider = 'openai';
            this.azureEndpoint = '';
            this.azureDeployment = '';
            this.tempApiKey = '';
            this.tempProvider = 'openai';
            this.tempAzureEndpoint = '';
            this.tempAzureDeployment = '';
            
            localStorage.removeItem('openaiApiKey');
            localStorage.removeItem('aiProvider');
            localStorage.removeItem('azureEndpoint');
            localStorage.removeItem('azureDeployment');
            
            this.showNotification('AI configuration cleared', 'success');
        },

        getConfigStatus() {
            if (!this.openaiApiKey) return 'No API Key';
            if (this.provider === 'azure') {
                return this.azureEndpoint && this.azureDeployment ? 'Azure OpenAI Configured' : 'Azure Configuration Incomplete';
            }
            return 'OpenAI Configured';
        },

        isAIConfigured() {
            if (!this.openaiApiKey) return false;
            if (this.provider === 'azure') {
                return this.azureEndpoint && this.azureDeployment;
            }
            return true; // OpenAI just needs the API key
        },

        // Data management methods
        saveData() {
            const data = {
                projectListText: this.projectListText,
                projectNames: this.projectNames,
                projects: this.projects,
                quickUpdateTexts: this.quickUpdateTexts,
                selectedRawUpdatesProject: this.selectedRawUpdatesProject,
                lastSaved: new Date().toISOString()
            };
            localStorage.setItem('multiProjectData', JSON.stringify(data));
            // API key is saved separately for security
        },

        loadData() {
            const savedData = localStorage.getItem('multiProjectData');
            if (savedData) {
                try {
                    const data = JSON.parse(savedData);
                    this.projectListText = data.projectListText || '';
                    this.projectNames = data.projectNames || [];
                    this.projects = data.projects || {};
                    this.quickUpdateTexts = data.quickUpdateTexts || {};
                    this.selectedRawUpdatesProject = data.selectedRawUpdatesProject || '';
                    
                    // Ensure all projects have the isDone field (for backwards compatibility)
                    Object.keys(this.projects).forEach(projectName => {
                        if (this.projects[projectName].isDone === undefined) {
                            this.projects[projectName].isDone = false;
                        }
                    });
                    
                    // API key is loaded separately in data()
                    this.showNotification('Data loaded successfully!', 'success');
                } catch (error) {
                    this.showNotification('Error loading data from localStorage', 'error');
                }
            } else {
                // Check for legacy single-project data
                this.loadLegacyData();
            }
        },

        loadLegacyData() {
            const legacyData = localStorage.getItem('taskStatusData');
            if (legacyData) {
                try {
                    const data = JSON.parse(legacyData);
                    // Convert legacy data to new format
                    const projectName = 'Project Phoenix';
                    this.projectListText = projectName;
                    this.projectNames = [projectName];
                    this.projects = {
                        [projectName]: {
                            nextSteps: data.nextSteps || [],
                            blockingPoints: data.blockingPoints || [],
                            achievements: data.achievements || [],
                            updates: data.updates || [],
                            isDone: false
                        }
                    };
                    this.quickUpdateTexts = { [projectName]: '' };
                    this.showNotification('Legacy data imported successfully!', 'success');
                    this.autoSave(); // Save in new format
                    localStorage.removeItem('taskStatusData'); // Remove legacy data
                } catch (error) {
                    this.showNotification('Error loading legacy data', 'error');
                }
            }
        },

        clearData() {
            if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
                this.projectListText = '';
                this.projectNames = [];
                this.projects = {};
                this.quickUpdateTexts = {};
                this.selectedRawUpdatesProject = '';
                localStorage.removeItem('multiProjectData');
                this.showNotification('All data cleared!', 'success');
            }
        },

        exportData() {
            const data = {
                projectList: this.projectListText,
                projects: this.projects,
                exportedAt: new Date().toISOString()
            };
            
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `multi-project-status-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            this.showNotification('Data exported successfully!', 'success');
        },

        autoSave() {
            // Auto-save data whenever changes are made
            this.saveData();
        },

        showNotification(message, type = 'info') {
            // Create a simple notification system
            const notification = document.createElement('div');
            notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg text-white font-medium z-50 transition-all duration-300 transform translate-x-full`;
            
            // Set color based on type
            switch (type) {
                case 'success':
                    notification.className += ' bg-green-500';
                    break;
                case 'error':
                    notification.className += ' bg-red-500';
                    break;
                default:
                    notification.className += ' bg-blue-500';
            }
            
            notification.textContent = message;
            document.body.appendChild(notification);
            
            // Animate in
            setTimeout(() => {
                notification.classList.remove('translate-x-full');
            }, 100);
            
            // Remove after 3 seconds
            setTimeout(() => {
                notification.classList.add('translate-x-full');
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        document.body.removeChild(notification);
                    }
                }, 300);
            }, 3000);
        }
    }
}).mount('#app'); 
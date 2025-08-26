// screen.js
class ScreenManager {
    constructor() {
        this.screens = {
            'home': document.getElementById('homeScreen'),
            'story': document.getElementById('storyScreen'),
            'end': document.getElementById('endScreen')
        };
        this.currentScreen = 'home';
        this.showScreen(this.currentScreen);
    }

    showScreen(screenName) {
        // Hide all screens
        Object.values(this.screens).forEach(screen => {
            screen.style.display = 'none';
        });
        
        // Show the requested screen
        if (this.screens[screenName]) {
            this.screens[screenName].style.display = 'flex';
            this.currentScreen = screenName;
        } else {
            console.error(`Screen ${screenName} not found`);
        }
    }

    getCurrentScreen() {
        return this.currentScreen;
    }
}

// Initialize screen manager
const screenManager = new ScreenManager();
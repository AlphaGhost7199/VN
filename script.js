// script.js
// Constants
const TYPING_SPEED = 50;
const AUTO_PROGRESS_DELAY = 1000;

// DOM Elements
const elements = {
    homeScreen: document.getElementById('homeScreen'),
    storyScreen: document.getElementById('storyScreen'),
    endScreen: document.getElementById('endScreen'),
    startGameBtn: document.getElementById('startGameBtn'),
    menuIcon: document.getElementById('menuIcon'),
    menuOverlay: document.getElementById('menuOverlay'),
    settingsOverlay: document.getElementById('settingsOverlay'),
    settingsBtn: document.getElementById('settingsBtn'),
    homeBtn: document.getElementById('homeBtn'),
    fullscreenBtn: document.getElementById('fullscreenBtn'),
    characterSpriteContainer: document.getElementById('characterSpriteContainer'),
    leftSprite: document.getElementById('leftCharacterSprite'),
    rightSprite: document.getElementById('rightCharacterSprite'),
    dialogueContainer: document.querySelector('.dialogue-container'),
    typedText: document.getElementById('typedText'),
    dialogueOptions: document.getElementById('dialogueOptions'),
    endOptions: document.getElementById('endOptions'),
    characterName: document.getElementById('characterName'),
    textSpeedInput: document.getElementById('textSpeed'),
    autoSpeedInput: document.getElementById('autoSpeed'),
    sfxVolumeInput: document.getElementById('sfxVolume'),
    bgmVolumeInput: document.getElementById('bgmVolume'),
    effectOverlay: document.getElementById('effectOverlay'),
    overlayContainer: document.getElementById('overlayContainer'),
    overlayTitle: document.getElementById('overlayTitle'),
    overlayFrame: document.getElementById('overlayFrame'),
    closeOverlay: document.getElementById('closeOverlay'),
    toggleBgmBtn: document.getElementById('toggleBgmBtn'),
    toggleSfxBtn: document.getElementById('toggleSfxBtn'),
    storyTitle: document.getElementById('storyTitle')
};

// State
const state = {
    isTyping: false,
    currentDialogue: '',
    currentCharacter: null,
    typingSpeed: TYPING_SPEED,
    autoSpeed: 50,
    currentDialogueIndex: 0,
    typingTimeout: null,
    autoProgressTimeout: null,
    dialogueHistory: [],
    currentChapter: 1,
    currentScene: 1,
    isAutoMode: false,
    isEffectPlaying: false,
    storyData: null,
    characters: null,
    chapterMusic: null
};

// Effects definitions
const EFFECTS = {
    GLITCH: {
        duration: 2000,
        cssClass: 'glitch-effect',
        animate: (element) => {
            element.classList.add('glitch-effect');
            element.innerHTML = `
                <div class="glitch-1">GLITCH</div>
                <div class="glitch-2">GLITCH</div>
                <div class="glitch-3">GLITCH</div>
            `;
        }
    },
    ELECTROCUTED: {
        duration: 1500,
        cssClass: 'electrocuted-effect',
        animate: (element) => {
            element.classList.add('electrocuted-effect');
            element.innerHTML = `<div class="lightning"></div>`;
        }
    }
};

// Initialize the application
function initializeApp() {
    // Get story title from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const storyTitle = urlParams.get('storytitle') || 'cyberpunk1';
    
    // Load story data
    loadStoryData(storyTitle);
}

// Load story data from JSON file
function loadStoryData(storyTitle) {
    fetch(`${storyTitle}.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP ${response.status} for ${storyTitle}.json`);
            }
            return response.json();
        })
        .then(data => {
            state.storyData = data.storyDialogue;
            state.characters = data.characters;
            state.chapterMusic = data.chapterMusic;

            // Set story title
            elements.storyTitle.textContent = data.storyTitle;

            // Set theme if specified
            if (data.theme) {
                document.getElementById('themeStylesheet').href = data.theme;
            }

            // Initialize the rest of the app
            setupEventListeners();
            setupCharacterSprites();
            setupAdditionalElements();
            syncVolumes();
        })
        .catch(error => {
            console.error(`Error loading story data for ${storyTitle}.json:`, error);
            alert(`Could not load story file: ${storyTitle}.json\nCheck filename or JSON format.`);
            loadFallbackData();
        });
}

// Fallback data if JSON loading fails
function loadFallbackData() {
    state.storyData = [
        // Chapter 0: Fallback Mode
        { chapter: 0, scene: 1, character: 'SYSTEM', text: "⚠ Story data missing. Entering <b>Fallback Mode</b>." },
        { chapter: 0, scene: 2, character: 'SYSTEM', text: "This isn’t the real story... Something broke. Please check your data files." },
        { chapter: 0, scene: 3, character: 'DEBUGGER', text: "Yo, player. Don’t panic. I’m just a placeholder NPC. If you’re seeing me, it means the JSON failed to load." },
        { chapter: 0, scene: 4, character: 'DEBUGGER', text: "Go fix that missing data, then restart. Otherwise, you’re stuck here with me in fallback limbo." },
        { chapter: 0, scene: 5, character: 'SYSTEM', text: "[End of fallback data]" }
    ];
    
    state.characters = {
        SYSTEM: {
            name: 'SYSTEM',
            sprite: 'https://placehold.co/400x600/000000/ffffff?text=SYSTEM',
            position: 'center',
            sfx: '',
            description: 'The game system itself, warning you that fallback mode is active.'
        },
        DEBUGGER: {
            name: 'DEBUGGER',
            sprite: 'https://placehold.co/400x600/ff0000/ffffff?text=DEBUGGER',
            position: 'left',
            sfx: '',
            description: 'A placeholder NPC that only appears when story data fails to load. Breaks the 4th wall to explain the issue.'
        }
    };
    
    state.chapterMusic = {
        0: 'https://cdn.pixabay.com/download/audio/2023/02/28/audio_77d2877d6b.mp3?filename=error-alert-145000.mp3'
    };
    
    elements.storyTitle.textContent = 'CYBER RUNNER';
    
    // Initialize the rest of the app
    setupEventListeners();
    setupCharacterSprites();
    setupAdditionalElements();
    syncVolumes();
}

// Set up event listeners
function setupEventListeners() {
    elements.startGameBtn.addEventListener('click', () => {
        screenManager.showScreen('story');
        // Wait a moment for the screen transition before initializing
        setTimeout(initializeStoryScreen, 100);
    });
    
    elements.homeBtn.addEventListener('click', () => screenManager.showScreen('home'));
    elements.menuIcon.addEventListener('click', () => toggleOverlay('menuOverlay'));
    elements.settingsBtn.addEventListener('click', () => toggleOverlay('settingsOverlay'));
    elements.fullscreenBtn.addEventListener('click', toggleFullscreen);
    elements.closeOverlay.addEventListener('click', hideOverlay);
    
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const overlayId = btn.getAttribute('data-close');
            document.getElementById(overlayId).style.display = 'none';
        });
    });
    
    document.addEventListener('keydown', handleKeyPress);
    elements.textSpeedInput.addEventListener('input', handleTextSpeedChange);
    elements.autoSpeedInput.addEventListener('input', handleAutoSpeedChange);
    elements.sfxVolumeInput.addEventListener('input', handleSfxVolumeChange);
    elements.bgmVolumeInput.addEventListener('input', handleBgmVolumeChange);
    
    // Audio toggles
    elements.toggleBgmBtn.addEventListener('click', () => {
        const enabled = audioManager.toggleBgm();
        elements.toggleBgmBtn.textContent = `BGM: ${enabled ? 'On' : 'Off'}`;
    });
    
    elements.toggleSfxBtn.addEventListener('click', () => {
        const enabled = audioManager.toggleSfx();
        elements.toggleSfxBtn.textContent = `SFX: ${enabled ? 'On' : 'Off'}`;
    });
}

// Initialize the story screen
function initializeStoryScreen() {
    state.currentDialogueIndex = 0;
    state.dialogueHistory = [];
    displayNextDialogue();
    
    // Play chapter music if available
    if (state.chapterMusic && state.chapterMusic[state.currentChapter]) {
        audioManager.playBackgroundMusic(state.chapterMusic[state.currentChapter]);
    }
}

// Initialize the end screen
function initializeEndScreen() {
    updateEndScreenButtons();
}

// Set up character sprites
function setupCharacterSprites() {
    // Already exists in HTML, just ensure they're hidden initially
    elements.leftSprite.style.display = 'none';
    elements.rightSprite.style.display = 'none';
}

// Set up additional UI elements
function setupAdditionalElements() {
    const { dialogueOptions } = elements;
    dialogueOptions.innerHTML = '';
    
    const skipNextBtn = document.createElement('button');
    skipNextBtn.textContent = 'Skip';
    skipNextBtn.classList.add('option-btn');
    skipNextBtn.addEventListener('click', handleSkipNextClick);
    
    const backBtn = document.createElement('button');
    backBtn.textContent = 'Back';
    backBtn.classList.add('option-btn');
    backBtn.addEventListener('click', handleBackClick);
    
    const autoToggleBtn = document.createElement('button');
    autoToggleBtn.textContent = 'Auto: Off';
    autoToggleBtn.classList.add('option-btn');
    autoToggleBtn.addEventListener('click', toggleAutoMode);
    
    dialogueOptions.appendChild(skipNextBtn);
    dialogueOptions.appendChild(backBtn);
    dialogueOptions.appendChild(autoToggleBtn);
    
    // Store references
    elements.skipNextBtn = skipNextBtn;
    elements.backBtn = backBtn;
    elements.autoToggleBtn = autoToggleBtn;
}

// Update end screen buttons
function updateEndScreenButtons() {
    const { endOptions } = elements;
    endOptions.innerHTML = '';
    
    const createButton = (text, onClick) => {
        const button = document.createElement('button');
        button.textContent = text;
        button.className = 'option-btn';
        button.addEventListener('click', onClick);
        return button;
    };

    const creditsBtn = createButton('Show Credits', () => showOverlay('Credits', generateCreditsHTML()));
    const characterInfoBtn = createButton('Character Info', () => showOverlay('Character Info', generateCharacterInfoHTML()));
    const backToHomeBtn = createButton('Back to Home', () => screenManager.showScreen('home'));
    const replayBtn = createButton('Replay Story', () => {
        resetStory();
        screenManager.showScreen('story');
    });
    
    endOptions.appendChild(creditsBtn);
    endOptions.appendChild(characterInfoBtn);
    endOptions.appendChild(replayBtn);
    endOptions.appendChild(backToHomeBtn);
}

// Display the next dialogue
function displayNextDialogue() {
    clearTimeout(state.autoProgressTimeout);
    clearTimeout(state.typingTimeout);

    if (state.currentDialogueIndex >= state.storyData.length) {
        handleEndOfStory();
        return;
    }

    const dialogue = state.storyData[state.currentDialogueIndex];
    
    if (dialogue.effect) {
        state.isEffectPlaying = true;
        updateButtonStates();
        playEffect(dialogue.effect, () => {
            state.isEffectPlaying = false;
            state.dialogueHistory.push(state.currentDialogueIndex);
            state.currentDialogueIndex++;
            updateButtonStates();
            displayNextDialogue();
        });
    } else {
        updateCharacter(dialogue.character);
        state.currentDialogue = dialogue.text;
        state.isTyping = true;
        updateChapterAndScene(dialogue.chapter, dialogue.scene);
        typeWriter(dialogue.text, state.typingSpeed);
        state.dialogueHistory.push(state.currentDialogueIndex);
        state.currentDialogueIndex++;
        updateButtonStates();
    }
}

// Play a visual effect
function playEffect(effect, callback) {
    if (EFFECTS[effect]) {
        elements.effectOverlay.className = `effect-overlay ${EFFECTS[effect].cssClass}`;
        elements.effectOverlay.style.display = 'block';
        EFFECTS[effect].animate(elements.effectOverlay);
        
        setTimeout(() => {
            elements.effectOverlay.style.display = 'none';
            elements.effectOverlay.className = 'effect-overlay';
            elements.effectOverlay.innerHTML = '';
            if (callback) callback();
        }, EFFECTS[effect].duration);
    } else {
        console.error(`Effect ${effect} not found`);
        if (callback) callback();
    }
}

// Update character display
function updateCharacter(characterKey) {
    const character = state.characters[characterKey];
    if (!character) {
        console.error(`Character ${characterKey} not found`);
        return;
    }
    
    state.currentCharacter = character;
    
    // Update character name
    elements.characterName.textContent = character.name;
    elements.characterName.setAttribute('data-text', character.name);
    
    // Hide both sprites first
    elements.leftSprite.style.display = 'none';
    elements.rightSprite.style.display = 'none';
    
    // Update character sprite
    const isLeft = character.position === 'left';
    const activeSprite = isLeft ? elements.leftSprite : elements.rightSprite;
    
    // Only show sprite if it has a valid source
    if (character.sprite && character.sprite.trim() !== '') {
        activeSprite.src = character.sprite;
        activeSprite.alt = character.name;
        activeSprite.style.display = 'block';
        
        // Trigger animation
        activeSprite.classList.remove('active');
        // Use requestAnimationFrame to ensure the class removal is processed
        requestAnimationFrame(() => {
            activeSprite.classList.add('active');
        });
    }
}

// Update button states
function updateButtonStates() {
    if (!elements.skipNextBtn || !elements.backBtn || !elements.autoToggleBtn) return;
    
    elements.skipNextBtn.disabled = state.isEffectPlaying;
    elements.backBtn.disabled = state.dialogueHistory.length <= 1 || state.isEffectPlaying;
    elements.autoToggleBtn.disabled = state.isEffectPlaying;
    elements.skipNextBtn.textContent = state.isTyping ? 'Skip' : 'Next';
}

// Type writer effect
function typeWriter(text, speed) {
    let i = 0;
    elements.typedText.innerHTML = '';
    clearTimeout(state.typingTimeout);

    function type() {
        if (i < text.length) {
            elements.typedText.innerHTML = text.slice(0, i + 1);
            i++;
            audioManager.playTypingSound();
            state.typingTimeout = setTimeout(type, speed);
        } else {
            state.isTyping = false;
            audioManager.stopTypingSound();
            updateButtonStates();
            if (state.isAutoMode) {
                state.autoProgressTimeout = setTimeout(displayNextDialogue, calculateAutoDelay());
            }
        }
    }
    type();
}

// Handle skip/next button click
function handleSkipNextClick() {
    if (state.isEffectPlaying) {
        return;
    }
    if (state.isTyping) {
        clearTimeout(state.typingTimeout);
        elements.typedText.innerHTML = state.currentDialogue;
        state.isTyping = false;
        audioManager.stopTypingSound();
        updateButtonStates();
        if (state.isAutoMode) {
            state.autoProgressTimeout = setTimeout(displayNextDialogue, calculateAutoDelay());
        }
    } else {
        displayNextDialogue();
    }
}

// Handle back button click
function handleBackClick() {
    if (state.isEffectPlaying) {
        return;
    }
    if (screenManager.getCurrentScreen() === 'story') {
        if (state.dialogueHistory.length > 1) {
            clearTimeout(state.typingTimeout);
            clearTimeout(state.autoProgressTimeout);
            state.dialogueHistory.pop();
            const lastIndex = state.dialogueHistory.pop();
            state.currentDialogueIndex = lastIndex;
            displayNextDialogue();
        }
    } else if (screenManager.getCurrentScreen() === 'end') {
        screenManager.showScreen('story');
        state.currentDialogueIndex = state.storyData.length - 1;
        displayNextDialogue();
    }
}

// Toggle auto mode
function toggleAutoMode() {
    state.isAutoMode = !state.isAutoMode;
    elements.autoToggleBtn.textContent = state.isAutoMode ? 'Auto: On' : 'Auto: Off';
    if (state.isAutoMode && !state.isTyping) {
        state.autoProgressTimeout = setTimeout(displayNextDialogue, calculateAutoDelay());
    } else {
        clearTimeout(state.autoProgressTimeout);
    }
}

// Calculate auto delay
function calculateAutoDelay() {
    return AUTO_PROGRESS_DELAY * (100 - state.autoSpeed) / 100;
}

// Update chapter and scene
function updateChapterAndScene(chapter, scene) {
    if (chapter !== state.currentChapter) {
        state.currentChapter = chapter;
        if (state.chapterMusic && state.chapterMusic[state.currentChapter]) {
            audioManager.playBackgroundMusic(state.chapterMusic[state.currentChapter]);
        }
    }
    state.currentScene = scene;
}

// Handle end of story
function handleEndOfStory() {
    screenManager.showScreen('end');
    audioManager.stopBackgroundMusic();
    initializeEndScreen();
}

// Reset story
function resetStory() {
    state.currentDialogueIndex = 0;
    state.dialogueHistory = [];
    state.currentChapter = 1;
    state.currentScene = 1;
    state.isAutoMode = false;
    updateButtonStates();
}

// Toggle overlay
function toggleOverlay(overlayId) {
    const overlay = document.getElementById(overlayId);
    overlay.style.display = overlay.style.display === 'flex' ? 'none' : 'flex';
}

// Hide overlay
function hideOverlay() {
    elements.overlayContainer.style.display = 'none';
}

// Show overlay with content
function showOverlay(title, content) {
    elements.overlayTitle.textContent = title;
    elements.overlayFrame.srcdoc = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    padding: 20px;
                    color: #333;
                    line-height: 1.6;
                }
                h2 { color: #00ffff; }
                h3 { color: #ff00ff; margin-top: 20px; }
            </style>
        </head>
        <body>${content}</body>
        </html>`;
    elements.overlayContainer.style.display = 'block';
}

// Generate credits HTML
function generateCreditsHTML() {
    return `
        <h2>Credits</h2>
        <p>Writer: Cyberpunk Storyteller</p>
        <p>Artist: Digital Dreamweaver</p>
        <p>Developer: Code Runner</p>
        <p>Music: Synthwave Producer</p>
    `;
}

// Generate character info HTML
function generateCharacterInfoHTML() {
    return Object.values(state.characters).map(character => `
        <h3>${character.name}</h3>
        <p>${character.description}</p>
    `).join('');
}

// Toggle fullscreen
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
        document.exitFullscreen();
    }
}

// Handle key press
function handleKeyPress(event) {
    switch(event.key) {
        case 'Enter':
        case ' ':
            handleSkipNextClick();
            break;
        case 'Backspace':
            handleBackClick();
            break;
        case 'a':
        case 'A':
            toggleAutoMode();
            break;
        case 'Escape':
            document.querySelectorAll('.overlay').forEach(overlay => {
                overlay.style.display = 'none';
            });
            hideOverlay();
            break;
    }
}

// Handle text speed change
function handleTextSpeedChange(e) {
    state.typingSpeed = 101 - e.target.value;
}

// Handle auto speed change
function handleAutoSpeedChange(e) {
    state.autoSpeed = parseInt(e.target.value);
    if (state.autoSpeed > 0 && !state.isTyping && state.isAutoMode) {
        clearTimeout(state.autoProgressTimeout);
        state.autoProgressTimeout = setTimeout(displayNextDialogue, calculateAutoDelay());
    }
}

// Handle SFX volume change
function handleSfxVolumeChange(e) {
    const volume = e.target.value / 100;
    audioManager.setSfxVolume(volume);
}

// Handle BGM volume change
function handleBgmVolumeChange(e) {
    const volume = e.target.value / 100;
    audioManager.setBgmVolume(volume);
}

// Sync volumes with UI
function syncVolumes() {
    elements.sfxVolumeInput.value = audioManager.sfxVolume * 100;
    elements.bgmVolumeInput.value = audioManager.bgmVolume * 100;
}

// Initialize when DOM is loaded

document.addEventListener('DOMContentLoaded', initializeApp);

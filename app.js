document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const screens = {
        setup: document.getElementById('setup-screen'),
        compare: document.getElementById('compare-screen'),
        results: document.getElementById('results-screen')
    };
    
    const itemInput = document.getElementById('item-input');
    const addBtn = document.getElementById('add-btn');
    const startBtn = document.getElementById('start-btn');
    const itemsList = document.getElementById('items-list');
    const errorMessage = document.getElementById('error-message');
    const choice1Btn = document.getElementById('choice1');
    const choice2Btn = document.getElementById('choice2');
    const progressBar = document.getElementById('progress-bar');
    const resultsDiv = document.getElementById('results');

    // App State
    let items = [];
    let ranker;

    // Event Listeners
    addBtn.addEventListener('click', addItem);
    itemInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addItem();
    });
    startBtn.addEventListener('click', startRanking);
    choice1Btn.addEventListener('click', () => makeChoice(choice1Btn.textContent));
    choice2Btn.addEventListener('click', () => makeChoice(choice2Btn.textContent));

    // Core Functions
    function addItem() {
        const item = itemInput.value.trim();
        
        if (!item) {
            showError("Please enter an item");
            return;
        }
        
        if (items.includes(item)) {
            showError("Item already exists");
            return;
        }
        
        items.push(item);
        itemInput.value = '';
        errorMessage.textContent = '';
        renderItemsList();
        startBtn.disabled = items.length < 2;
    }

    function startRanking() {
        if (items.length >= 2) {
            // Initialize the ranker
            ranker = {
                items: [...items],
                comparisons: [],
                remainingPairs: generateAllPairs(items),
                rankings: {}
            };
            
            // Initialize rankings
            items.forEach(item => {
                ranker.rankings[item] = { wins: 0, losses: 0 };
            });
            
            // Shuffle pairs
            shuffleArray(ranker.remainingPairs);
            
            // Show first comparison
            showScreen('compare');
            showNextPair();
        }
    }

    function makeChoice(winner) {
        const [item1, item2] = ranker.currentPair;
        
        // Update rankings
        if (winner === item1) {
            ranker.rankings[item1].wins++;
            ranker.rankings[item2].losses++;
        } else {
            ranker.rankings[item2].wins++;
            ranker.rankings[item1].losses++;
        }
        
        // Store comparison
        ranker.comparisons.push({
            pair: [item1, item2],
            choice: winner,
            timestamp: new Date()
        });
        
        // Show next pair or results
        showNextPair();
    }

    function showNextPair() {
        if (ranker.remainingPairs.length > 0) {
            ranker.currentPair = ranker.remainingPairs.pop();
            choice1Btn.textContent = ranker.currentPair[0];
            choice2Btn.textContent = ranker.currentPair[1];
            updateProgress();
        } else {
            showResults();
        }
    }

    function showResults() {
        // Calculate final rankings
        const rankings = items.slice().sort((a, b) => {
            const scoreA = ranker.rankings[a].wins - ranker.rankings[a].losses;
            const scoreB = ranker.rankings[b].wins - ranker.rankings[b].losses;
            return scoreB - scoreA;
        });
        
        // Display results
        resultsDiv.innerHTML = rankings.map((item, index) => 
            `<div class="item">${index + 1}. ${item}</div>`
        ).join('');
        
        showScreen('results');
    }

    // Helper Functions
    function generateAllPairs(items) {
        const pairs = [];
        for (let i = 0; i < items.length; i++) {
            for (let j = i + 1; j < items.length; j++) {
                pairs.push([items[i], items[j]]);
            }
        }
        return pairs;
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function updateProgress() {
        const totalPairs = (items.length * (items.length - 1)) / 2;
        const completed = totalPairs - ranker.remainingPairs.length;
        const percent = Math.round((completed / totalPairs) * 100);
        progressBar.textContent = `${percent}%`;
        progressBar.style.width = `${percent}%`;
    }

    function renderItemsList() {
        itemsList.innerHTML = items.map((item, index) => `
            <div class="item">
                <span>${index + 1}. ${item}</span>
                <button onclick="removeItem(${index})">×</button>
            </div>
        `).join('');
    }

    function showError(message) {
        errorMessage.textContent = message;
    }

    function showScreen(screenName) {
        Object.values(screens).forEach(screen => screen.classList.remove('active'));
        screens[screenName].classList.add('active');
    }

    // Global function for item removal
    window.removeItem = function(index) {
        items.splice(index, 1);
        renderItemsList();
        startBtn.disabled = items.length < 2;
    };
});
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const setupScreen = document.getElementById('setup-screen');
    const compareScreen = document.getElementById('compare-screen');
    const resultsScreen = document.getElementById('results-screen');
    const itemInput = document.getElementById('item-input');
    const addBtn = document.getElementById('add-btn');
    const startBtn = document.getElementById('start-btn');
    const itemsList = document.getElementById('items-list');
    const errorMessage = document.getElementById('error-message');
    const choice1Btn = document.getElementById('choice1');
    const choice2Btn = document.getElementById('choice2');
    const progressBar = document.getElementById('progress-bar');
    const resultsDiv = document.getElementById('results');
    const newRankingBtn = document.getElementById('new-ranking-btn');

    // App State
    let items = [];
    let comparisons = [];
    let remainingPairs = [];
    let rankings = {};
    let currentPair = null;

    // Event Listeners
    addBtn.addEventListener('click', addItem);
    itemInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addItem();
    });
    startBtn.addEventListener('click', startRanking);
    choice1Btn.addEventListener('click', () => makeChoice(choice1Btn.textContent));
    choice2Btn.addEventListener('click', () => makeChoice(choice2Btn.textContent));
    newRankingBtn.addEventListener('click', resetApp);

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
        if (items.length < 2) return;
        
        // Initialize rankings
        rankings = {};
        items.forEach(item => {
            rankings[item] = { wins: 0, losses: 0 };
        });
        
        // Generate all possible pairs
        remainingPairs = [];
        for (let i = 0; i < items.length; i++) {
            for (let j = i + 1; j < items.length; j++) {
                remainingPairs.push([items[i], items[j]]);
            }
        }
        
        // Shuffle pairs for randomness
        shuffleArray(remainingPairs);
        
        // Hide setup, show comparison screen
        setupScreen.style.display = 'none';
        compareScreen.style.display = 'block';
        
        // Show first pair
        showNextPair();
    }

    function makeChoice(selectedItem) {
        // Update rankings
        const [item1, item2] = currentPair;
        if (selectedItem === item1) {
            rankings[item1].wins++;
            rankings[item2].losses++;
        } else {
            rankings[item2].wins++;
            rankings[item1].losses++;
        }
        
        // Store comparison
        comparisons.push({
            pair: currentPair,
            choice: selectedItem,
            timestamp: new Date()
        });
        
        // Show next pair or results
        showNextPair();
    }

    function showNextPair() {
        if (remainingPairs.length > 0) {
            currentPair = remainingPairs.pop();
            choice1Btn.textContent = currentPair[0];
            choice2Btn.textContent = currentPair[1];
            updateProgress();
        } else {
            showResults();
        }
    }

    function showResults() {
        // Calculate final rankings
        const sortedItems = items.slice().sort((a, b) => {
            const scoreA = rankings[a].wins - rankings[a].losses;
            const scoreB = rankings[b].wins - rankings[b].losses;
            return scoreB - scoreA;
        });
        
        // Display results
        resultsDiv.innerHTML = sortedItems.map((item, index) => 
            `<div class="result-item">${index + 1}. ${item}</div>`
        ).join('');
        
        compareScreen.style.display = 'none';
        resultsScreen.style.display = 'block';
    }

    function resetApp() {
        items = [];
        comparisons = [];
        remainingPairs = [];
        rankings = {};
        currentPair = null;
        
        itemInput.value = '';
        errorMessage.textContent = '';
        itemsList.innerHTML = '';
        startBtn.disabled = true;
        progressBar.style.width = '0%';
        progressBar.textContent = '0%';
        
        resultsScreen.style.display = 'none';
        setupScreen.style.display = 'block';
    }

    // Helper Functions
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

    function updateProgress() {
        const totalComparisons = (items.length * (items.length - 1)) / 2;
        const completed = totalComparisons - remainingPairs.length;
        const percent = Math.round((completed / totalComparisons) * 100);
        progressBar.style.width = `${percent}%`;
        progressBar.textContent = `${percent}%`;
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Global function for item removal
    window.removeItem = function(index) {
        items.splice(index, 1);
        renderItemsList();
        startBtn.disabled = items.length < 2;
    };
});
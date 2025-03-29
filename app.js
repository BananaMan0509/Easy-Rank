// DOM Elements
const setupDiv = document.getElementById('setup');
const comparisonDiv = document.getElementById('comparison');
const resultsDiv = document.getElementById('results');
const itemInput = document.getElementById('item-input');
const addBtn = document.getElementById('add-btn');
const startBtn = document.getElementById('start-btn');
const itemsList = document.getElementById('items-list');
const choice1Btn = document.getElementById('choice1');
const choice2Btn = document.getElementById('choice2');
const progressBar = document.getElementById('progress');

// State
let items = [];
let ranker;

// Add item to list
addBtn.addEventListener('click', () => {
    const item = itemInput.value.trim();
    if (item && !items.includes(item)) {
        items.push(item);
        renderItemsList();
        itemInput.value = '';
    }
});

// Start ranking
startBtn.addEventListener('click', () => {
    if (items.length >= 2) {
        setupDiv.style.display = 'none';
        comparisonDiv.style.display = 'block';
        ranker = new PairwiseRanker(items);
        showNextPair();
    } else {
        alert('Please add at least 2 items to rank');
    }
});

// Render items list
function renderItemsList() {
    itemsList.innerHTML = items.map(item => 
        `<div>${item} <button onclick="removeItem('${item}')">×</button></div>`
    ).join('');
}

// Remove item
window.removeItem = function(item) {
    items = items.filter(i => i !== item);
    renderItemsList();
};

// Ranking logic (same as before)
function showNextPair() {
    const pair = ranker.getNextPair();
    if (!pair) {
        showResults();
        return;
    }
    choice1Btn.textContent = pair[0];
    choice2Btn.textContent = pair[1];
    updateProgress();
}

function updateProgress() {
    const progress = ranker.getProgress();
    progressBar.textContent = `${progress.percent}%`;
    progressBar.style.width = `${progress.percent}%`;
}

function showResults() {
    comparisonDiv.style.display = 'none';
    resultsDiv.style.display = 'block';
    const rankings = ranker.getRankings();
    let html = '<h2>Your Ranking Results:</h2>';
    rankings.forEach((item, index) => {
        html += `<div class="rank-item">${index + 1}. ${item}</div>`;
    });
    resultsDiv.innerHTML = html;
}

choice1Btn.addEventListener('click', () => {
    ranker.recordChoice(choice1Btn.textContent);
    showNextPair();
});

choice2Btn.addEventListener('click', () => {
    ranker.recordChoice(choice2Btn.textContent);
    showNextPair();
});
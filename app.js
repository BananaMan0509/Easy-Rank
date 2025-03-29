document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const setupDiv = document.getElementById('setup');
    const comparisonDiv = document.getElementById('comparison');
    const resultsDiv = document.getElementById('results');
    const itemInput = document.getElementById('item-input');
    const addBtn = document.getElementById('add-btn');
    const startBtn = document.getElementById('start-btn');
    const itemsList = document.getElementById('items-list');
    const errorMessage = document.getElementById('error-message');
    const saveBtn = document.getElementById('save-btn');
    const listNameInput = document.getElementById('list-name');
    const savedListsDiv = document.getElementById('saved-lists');
    const choice1Btn = document.getElementById('choice1');
    const choice2Btn = document.getElementById('choice2');
    const progressBar = document.getElementById('progress');

    // State
    let items = [];
    let ranker;
    let currentListId = null;

    // Initialize
    loadSavedLists();

    // Add item on button click or Enter key
    addBtn.addEventListener('click', addItem);
    itemInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addItem();
    });

    // Start ranking
    startBtn.addEventListener('click', startRanking);

    // Save list
    saveBtn.addEventListener('click', saveList);

    // Core functions
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
            setupDiv.style.display = 'none';
            comparisonDiv.style.display = 'block';
            ranker = new PairwiseRanker(items);
            showNextPair();
        }
    }

    function saveList() {
        const name = listNameInput.value.trim();
        if (!name) {
            showError("Please name your list");
            return;
        }
        
        const lists = JSON.parse(localStorage.getItem('rankingLists') || '{}');
        const id = currentListId || Date.now().toString();
        
        lists[id] = {
            name: name,
            items: [...items],
            createdAt: lists[id]?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        localStorage.setItem('rankingLists', JSON.stringify(lists));
        listNameInput.value = '';
        currentListId = null;
        loadSavedLists();
    }

    // Ranking logic
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
        resultsDiv.innerHTML = `
            <h2>Your Ranking Results:</h2>
            ${rankings.map((item, i) => `<div class="item">${i+1}. ${item}</div>`).join('')}
            <button onclick="location.reload()">Start New Ranking</button>
        `;
    }

    // UI Helpers
    function renderItemsList() {
        itemsList.innerHTML = items.map((item, i) => `
            <div class="item">
                <span>${i+1}. ${item}</span>
                <button onclick="removeItem(${i})">×</button>
            </div>
        `).join('');
    }

    function showError(message) {
        errorMessage.textContent = message;
    }

    function loadSavedLists() {
        const lists = JSON.parse(localStorage.getItem('rankingLists') || '{}');
        savedListsDiv.innerHTML = Object.entries(lists).map(([id, list]) => `
            <div class="item">
                <span>${list.name} (${list.items.length} items)</span>
                <div>
                    <button onclick="loadList('${id}')">Load</button>
                    <button onclick="deleteList('${id}')">Delete</button>
                </div>
            </div>
        `).join('');
    }

    // Global functions
    window.removeItem = function(index) {
        items.splice(index, 1);
        renderItemsList();
        startBtn.disabled = items.length < 2;
    };

    window.loadList = function(id) {
        const lists = JSON.parse(localStorage.getItem('rankingLists') || '{}');
        if (lists[id]) {
            items = [...lists[id].items];
            currentListId = id;
            listNameInput.value = lists[id].name;
            renderItemsList();
            startBtn.disabled = items.length < 2;
        }
    };

    window.deleteList = function(id) {
        const lists = JSON.parse(localStorage.getItem('rankingLists') || '{}');
        delete lists[id];
        localStorage.setItem('rankingLists', JSON.stringify(lists));
        loadSavedLists();
        if (currentListId === id) {
            items = [];
            currentListId = null;
            listNameInput.value = '';
            renderItemsList();
            startBtn.disabled = true;
        }
    };

    // Initialize ranking buttons
    choice1Btn.addEventListener('click', () => {
        ranker.recordChoice(choice1Btn.textContent);
        showNextPair();
    });

    choice2Btn.addEventListener('click', () => {
        ranker.recordChoice(choice2Btn.textContent);
        showNextPair();
    });
});
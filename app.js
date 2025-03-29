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
const saveBtn = document.getElementById('save-btn');
const listNameInput = document.getElementById('list-name');
const savedListsDiv = document.getElementById('saved-lists');

// State
let items = [];
let ranker;
let currentListId = null;

// Initialize
loadSavedLists();

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

// Save list
saveBtn.addEventListener('click', () => {
    const name = listNameInput.value.trim();
    if (name && items.length > 0) {
        const lists = JSON.parse(localStorage.getItem('rankingLists') || {};
        const id = currentListId || Date.now().toString();
        
        lists[id] = {
            name: name,
            items: items,
            createdAt: currentListId ? lists[id]?.createdAt || new Date().toISOString() : new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        localStorage.setItem('rankingLists', JSON.stringify(lists));
        listNameInput.value = '';
        currentListId = null;
        loadSavedLists();
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

// Load saved lists
function loadSavedLists() {
    const lists = JSON.parse(localStorage.getItem('rankingLists')) || {};
    savedListsDiv.innerHTML = '';
    
    Object.entries(lists).forEach(([id, list]) => {
        const listElement = document.createElement('div');
        listElement.className = 'saved-list';
        listElement.innerHTML = `
            <strong>${list.name}</strong> (${list.items.length} items)
            <button onclick="loadList('${id}')">Load</button>
            <button onclick="deleteList('${id}')">Delete</button>
        `;
        savedListsDiv.appendChild(listElement);
    });
}

// Load a specific list
window.loadList = function(id) {
    const lists = JSON.parse(localStorage.getItem('rankingLists')) || {};
    if (lists[id]) {
        items = [...lists[id].items];
        currentListId = id;
        listNameInput.value = lists[id].name;
        renderItemsList();
    }
};

// Delete a list
window.deleteList = function(id) {
    const lists = JSON.parse(localStorage.getItem('rankingLists')) || {};
    delete lists[id];
    localStorage.setItem('rankingLists', JSON.stringify(lists));
    loadSavedLists();
    if (currentListId === id) {
        items = [];
        currentListId = null;
        listNameInput.value = '';
        renderItemsList();
    }
};

// ... (keep existing ranking logic functions: showNextPair, updateProgress, showResults) ...

// Initialize ranking buttons
choice1Btn.addEventListener('click', () => {
    ranker.recordChoice(choice1Btn.textContent);
    showNextPair();
});

choice2Btn.addEventListener('click', () => {
    ranker.recordChoice(choice2Btn.textContent);
    showNextPair();
});
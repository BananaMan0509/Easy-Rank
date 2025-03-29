document.addEventListener('DOMContentLoaded', function() {
    // Debugging check
    console.log("Script loaded successfully!");
    
    const itemInput = document.getElementById('item-input');
    const addBtn = document.getElementById('add-btn');
    const startBtn = document.getElementById('start-btn');
    const itemsList = document.getElementById('items-list');
    const errorMessage = document.getElementById('error-message');
    
    let items = [];
    
    // Debug: Verify element selection
    console.log({
        itemInput,
        addBtn,
        startBtn,
        itemsList,
        errorMessage
    });
    
    // Add item function
    addBtn.addEventListener('click', function() {
        console.log("Add button clicked!"); // Debug
        
        const item = itemInput.value.trim();
        console.log("Input value:", item); // Debug
        
        if (!item) {
            showError("Please enter an item");
            return;
        }
        
        if (items.includes(item)) {
            showError("Item already exists");
            return;
        }
        
        // Add item to array
        items.push(item);
        console.log("Current items:", items); // Debug
        
        // Clear input and error
        itemInput.value = '';
        errorMessage.textContent = '';
        
        // Update UI
        renderItemsList();
        
        // Enable start button if enough items
        if (items.length >= 2) {
            startBtn.disabled = false;
        }
    });
    
    // Start ranking function
    startBtn.addEventListener('click', function() {
        if (items.length >= 2) {
            alert("Ready to start ranking with: " + items.join(", "));
            // Here you would initialize the ranking logic
        }
    });
    
    // Helper functions
    function renderItemsList() {
        itemsList.innerHTML = '';
        items.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'item';
            itemElement.innerHTML = `
                <span>${index + 1}. ${item}</span>
                <button onclick="removeItem(${index})">×</button>
            `;
            itemsList.appendChild(itemElement);
        });
    }
    
    function showError(message) {
        errorMessage.textContent = message;
        console.error(message); // Debug
    }
    
    // Make removeItem available globally
    window.removeItem = function(index) {
        items.splice(index, 1);
        renderItemsList();
        
        // Disable start button if less than 2 items
        if (items.length < 2) {
            startBtn.disabled = true;
        }
    };
});
// =====================================
// GS PASHUKHADYA - MAIN SCRIPT
// =====================================

// Google Sheets Configuration
const SHEET_ID = "1ytiWI21vypwci3TQ5DFMbgPPza5xfaW7TV5Ge_pEXoc";
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

// Data Storage
let data = {
    parties: [],
    products: [],
    transactions: [],
    stockLedger: []
};

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    // Set today's date in transaction form
    document.getElementById('transDate').valueAsDate = new Date();
    
    // Load initial data
    loadAllData();
    
    // Setup event listeners
    setupEventListeners();
});

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    document.getElementById('partyForm').addEventListener('submit', addParty);
    document.getElementById('productForm').addEventListener('submit', addProduct);
    document.getElementById('transactionForm').addEventListener('submit', addTransaction);
    document.getElementById('partySearch').addEventListener('keyup', filterParties);
    document.getElementById('productSearch').addEventListener('keyup', filterProducts);
}

// ===== NAVIGATION =====
function showDashboard() {
    hideAllSections();
    document.getElementById('dashboard').classList.remove('hidden');
    updateDashboard();
}

function showParties() {
    hideAllSections();
    document.getElementById('parties').classList.remove('hidden');
    displayParties();
}

function showProducts() {
    hideAllSections();
    document.getElementById('products').classList.remove('hidden');
    displayProducts();
}

function showTransactions() {
    hideAllSections();
    document.getElementById('transactions').classList.remove('hidden');
    populateTransactionSelects();
    displayTransactions();
}

function showLedger() {
    hideAllSections();
    document.getElementById('ledger').classList.remove('hidden');
    populateLedgerSelect();
}

function hideAllSections() {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.add('hidden'));
}

// ===== DATA MANAGEMENT =====

// Load all data from Google Sheets
async function loadAllData() {
    try {
        console.log("Loading data from Google Sheets...");
        
        // For now, we'll use local storage or initialize with empty data
        // In production, you'll need to implement OAuth and use Google Sheets API
        
        loadDataFromLocalStorage();
        updateAllDisplays();
        
    } catch (error) {
        console.error("Error loading data:", error);
        showMessage("Error loading data. Please refresh the page.", "error");
    }
}

function loadDataFromLocalStorage() {
    const savedData = localStorage.getItem('gsData');
    if (savedData) {
        data = JSON.parse(savedData);
    } else {
        // Initialize with empty data
        data = {
            parties: [],
            products: [],
            transactions: [],
            stockLedger: []
        };
    }
}

function saveDataToLocalStorage() {
    localStorage.setItem('gsData', JSON.stringify(data));
}

function updateAllDisplays() {
    displayParties();
    displayProducts();
    displayTransactions();
    updateDashboard();
}

// ===== DASHBOARD =====
function updateDashboard() {
    // Update statistics
    document.getElementById('totalParties').textContent = data.parties.length;
    document.getElementById('totalProducts').textContent = data.products.length;
    
    // Calculate total stock value
    let totalStockValue = 0;
    data.products.forEach(product => {
        totalStockValue += (product.currentStock || 0) * (product.rate || 0);
    });
    document.getElementById('totalStockValue').textContent = '₹' + formatNumber(totalStockValue);
    
    // Calculate total receivables (debit balance from parties)
    let totalReceivables = 0;
    data.parties.forEach(party => {
        const balance = (party.debit || 0) - (party.credit || 0);
        if (balance > 0) {
            totalReceivables += balance;
        }
    });
    document.getElementById('totalReceivables').textContent = '₹' + formatNumber(totalReceivables);
    
    // Display recent transactions
    const recentTransactions = data.transactions.slice(-5).reverse();
    const tbody = document.getElementById('recentTransactions');
    tbody.innerHTML = '';
    
    recentTransactions.forEach(trans => {
        const party = data.parties.find(p => p.id == trans.partyID);
        const product = data.products.find(p => p.id == trans.productID);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${trans.date}</td>
            <td>${party ? party.name : 'N/A'}</td>
            <td>${product ? product.name : 'N/A'}</td>
            <td>${trans.qty}</td>
            <td>₹${formatNumber(trans.qty * trans.rate)}</td>
            <td><span class="badge ${trans.type.toLowerCase()}">${trans.type}</span></td>
        `;
        tbody.appendChild(row);
    });
}

// ===== PARTIES =====
function addParty(e) {
    e.preventDefault();
    
    const name = document.getElementById('partyName').value;
    const phone = document.getElementById('partyPhone').value;
    const address = document.getElementById('partyAddress').value;
    const openingBalance = parseFloat(document.getElementById('partyOpeningBalance').value) || 0;
    
    if (!name.trim()) {
        showMessage("Please enter party name", "error");
        return;
    }
    
    const newParty = {
        id: Date.now(),
        name: name,
        phone: phone,
        address: address,
        openingBalance: openingBalance,
        debit: openingBalance > 0 ? openingBalance : 0,
        credit: openingBalance < 0 ? Math.abs(openingBalance) : 0
    };
    
    data.parties.push(newParty);
    saveDataToLocalStorage();
    
    showMessage("Party added successfully!", "success");
    document.getElementById('partyForm').reset();
    displayParties();
    populateTransactionSelects();
}

function displayParties() {
    const tbody = document.getElementById('partiesList');
    tbody.innerHTML = '';
    
    data.parties.forEach(party => {
        const balance = party.debit - party.credit;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${party.id}</td>
            <td>${party.name}</td>
            <td>${party.phone || '-'}</td>
            <td>${party.address || '-'}</td>
            <td>₹${formatNumber(party.openingBalance)}</td>
            <td>₹${formatNumber(party.debit)}</td>
            <td>₹${formatNumber(party.credit)}</td>
            <td class="${balance >= 0 ? 'debit' : 'credit'}">₹${formatNumber(Math.abs(balance))}</td>
            <td>
                <button class="btn-small btn-view" onclick="viewPartyLedger(${party.id})">View</button>
                <button class="btn-small btn-delete" onclick="deleteParty(${party.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function filterParties() {
    const searchTerm = document.getElementById('partySearch').value.toLowerCase();
    const filtered = data.parties.filter(party => 
        party.name.toLowerCase().includes(searchTerm) ||
        party.phone.toLowerCase().includes(searchTerm)
    );
    
    const tbody = document.getElementById('partiesList');
    tbody.innerHTML = '';
    
    filtered.forEach(party => {
        const balance = party.debit - party.credit;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${party.id}</td>
            <td>${party.name}</td>
            <td>${party.phone || '-'}</td>
            <td>${party.address || '-'}</td>
            <td>₹${formatNumber(party.openingBalance)}</td>
            <td>₹${formatNumber(party.debit)}</td>
            <td>₹${formatNumber(party.credit)}</td>
            <td class="${balance >= 0 ? 'debit' : 'credit'}">₹${formatNumber(Math.abs(balance))}</td>
            <td>
                <button class="btn-small btn-view" onclick="viewPartyLedger(${party.id})">View</button>
                <button class="btn-small btn-delete" onclick="deleteParty(${party.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function deleteParty(partyID) {
    if (confirm("Are you sure you want to delete this party?")) {
        data.parties = data.parties.filter(p => p.id !== partyID);
        saveDataToLocalStorage();
        displayParties();
        showMessage("Party deleted successfully!", "success");
    }
}

function viewPartyLedger(partyID) {
    document.getElementById('ledgerPartyID').value = partyID;
    hideAllSections();
    document.getElementById('ledger').classList.remove('hidden');
    showPartyLedger();
}

// ===== PRODUCTS =====
function addProduct(e) {
    e.preventDefault();
    
    const name = document.getElementById('productName').value;
    const category = document.getElementById('productCategory').value;
    const rate = parseFloat(document.getElementById('productRate').value);
    const stock = parseFloat(document.getElementById('productStock').value) || 0;
    
    if (!name.trim() || !rate) {
        showMessage("Please fill in required fields", "error");
        return;
    }
    
    const newProduct = {
        id: Date.now(),
        name: name,
        category: category,
        rate: rate,
        currentStock: stock
    };
    
    data.products.push(newProduct);
    saveDataToLocalStorage();
    
    showMessage("Product added successfully!", "success");
    document.getElementById('productForm').reset();
    displayProducts();
    populateTransactionSelects();
}

function displayProducts() {
    const tbody = document.getElementById('productsList');
    tbody.innerHTML = '';
    
    data.products.forEach(product => {
        const stockValue = product.currentStock * product.rate;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.category || '-'}</td>
            <td>₹${formatNumber(product.rate)}</td>
            <td>${product.currentStock} units</td>
            <td>₹${formatNumber(stockValue)}</td>
            <td>
                <button class="btn-small btn-delete" onclick="deleteProduct(${product.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function filterProducts() {
    const searchTerm = document.getElementById('productSearch').value.toLowerCase();
    const filtered = data.products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
    
    const tbody = document.getElementById('productsList');
    tbody.innerHTML = '';
    
    filtered.forEach(product => {
        const stockValue = product.currentStock * product.rate;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.category || '-'}</td>
            <td>₹${formatNumber(product.rate)}</td>
            <td>${product.currentStock} units</td>
            <td>₹${formatNumber(stockValue)}</td>
            <td>
                <button class="btn-small btn-delete" onclick="deleteProduct(${product.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function deleteProduct(productID) {
    if (confirm("Are you sure you want to delete this product?")) {
        data.products = data.products.filter(p => p.id !== productID);
        saveDataToLocalStorage();
        displayProducts();
        populateTransactionSelects();
        showMessage("Product deleted successfully!", "success");
    }
}

// ===== TRANSACTIONS =====
function addTransaction(e) {
    e.preventDefault();
    
    const date = document.getElementById('transDate').value;
    const type = document.getElementById('transType').value;
    const partyID = parseInt(document.getElementById('transPartyID').value);
    const productID = parseInt(document.getElementById('transProductID').value);
    const qty = parseFloat(document.getElementById('transQty').value);
    const rate = parseFloat(document.getElementById('transRate').value);
    const remarks = document.getElementById('transRemarks').value;
    
    if (!date || !partyID || !productID || !qty || !rate) {
        showMessage("Please fill in all required fields", "error");
        return;
    }
    
    const amount = qty * rate;
    
    const newTransaction = {
        id: Date.now(),
        date: date,
        type: type,
        partyID: partyID,
        productID: productID,
        qty: qty,
        rate: rate,
        amount: amount,
        remarks: remarks
    };
    
    data.transactions.push(newTransaction);
    
    // Update party balances
    const party = data.parties.find(p => p.id === partyID);
    if (party) {
        if (type === 'Sale') {
            party.debit += amount;
        } else if (type === 'Purchase') {
            party.credit += amount;
        } else if (type === 'Payment') {
            party.credit += amount;
        }
    }
    
    // Update product stock
    const product = data.products.find(p => p.id === productID);
    if (product) {
        if (type === 'Sale') {
            product.currentStock -= qty;
        } else if (type === 'Purchase') {
            product.currentStock += qty;
        }
    }
    
    saveDataToLocalStorage();
    
    showMessage("Transaction added successfully!", "success");
    document.getElementById('transactionForm').reset();
    document.getElementById('transDate').valueAsDate = new Date();
    displayTransactions();
    updateDashboard();
    populateTransactionSelects();
}

function displayTransactions() {
    const tbody = document.getElementById('transactionsList');
    tbody.innerHTML = '';
    
    data.transactions.forEach(trans => {
        const party = data.parties.find(p => p.id == trans.partyID);
        const product = data.products.find(p => p.id == trans.productID);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${trans.id}</td>
            <td>${trans.date}</td>
            <td>${party ? party.name : 'N/A'}</td>
            <td>${product ? product.name : 'N/A'}</td>
            <td>${trans.qty}</td>
            <td>₹${formatNumber(trans.rate)}</td>
            <td>₹${formatNumber(trans.amount)}</td>
            <td><span class="badge ${trans.type.toLowerCase()}">${trans.type}</span></td>
            <td>${trans.remarks || '-'}</td>
        `;
        tbody.appendChild(row);
    });
}

function populateTransactionSelects() {
    // Populate parties
    const partySelect = document.getElementById('transPartyID');
    partySelect.innerHTML = '<option value="">Choose Party...</option>';
    data.parties.forEach(party => {
        const option = document.createElement('option');
        option.value = party.id;
        option.textContent = party.name;
        partySelect.appendChild(option);
    });
    
    // Populate products
    const productSelect = document.getElementById('transProductID');
    productSelect.innerHTML = '<option value="">Choose Product...</option>';
    data.products.forEach(product => {
        const option = document.createElement('option');
        option.value = product.id;
        option.textContent = product.name + ' (₹' + formatNumber(product.rate) + ')';
        productSelect.appendChild(option);
    });
    
    // Update rate when product is selected
    productSelect.addEventListener('change', function() {
        const productID = parseInt(this.value);
        if (productID) {
            const product = data.products.find(p => p.id === productID);
            if (product) {
                document.getElementById('transRate').value = product.rate;
            }
        }
    });
}

// ===== LEDGER =====
function populateLedgerSelect() {
    const ledgerSelect = document.getElementById('ledgerPartyID');
    ledgerSelect.innerHTML = '<option value="">Choose Party...</option>';
    data.parties.forEach(party => {
        const option = document.createElement('option');
        option.value = party.id;
        option.textContent = party.name;
        ledgerSelect.appendChild(option);
    });
}

function showPartyLedger() {
    const partyID = parseInt(document.getElementById('ledgerPartyID').value);
    
    if (!partyID) {
        showMessage("Please select a party", "error");
        return;
    }
    
    const party = data.parties.find(p => p.id === partyID);
    if (!party) return;
    
    document.getElementById('ledgerPartyName').textContent = party.name + ' - Party Ledger';
    
    const tbody = document.getElementById('ledgerBody');
    tbody.innerHTML = '';
    
    let balance = party.openingBalance;
    
    // Opening balance entry
    const openingRow = document.createElement('tr');
    openingRow.innerHTML = `
        <td>${new Date().toISOString().split('T')[0]}</td>
        <td>Opening Balance</td>
        <td class="debit">${party.openingBalance > 0 ? '₹' + formatNumber(party.openingBalance) : ''}</td>
        <td class="credit">${party.openingBalance < 0 ? '₹' + formatNumber(Math.abs(party.openingBalance)) : ''}</td>
        <td class="balance">₹${formatNumber(balance)}</td>
    `;
    tbody.appendChild(openingRow);
    
    // Transaction entries sorted by date
    const partyTransactions = data.transactions
        .filter(t => t.partyID === partyID)
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    partyTransactions.forEach(trans => {
        const row = document.createElement('tr');
        const isDebit = trans.type === 'Sale';
        const amount = trans.amount;
        
        if (isDebit) {
            balance += amount;
        } else {
            balance -= amount;
        }
        
        row.innerHTML = `
            <td>${trans.date}</td>
            <td>${trans.type}</td>
            <td class="debit">${isDebit ? '₹' + formatNumber(amount) : ''}</td>
            <td class="credit">${!isDebit ? '₹' + formatNumber(amount) : ''}</td>
            <td class="balance">₹${formatNumber(balance)}</td>
        `;
        tbody.appendChild(row);
    });
}

// ===== HELPER FUNCTIONS =====
function formatNumber(num) {
    return new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(num);
}

function showMessage(message, type = 'info') {
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    messageDiv.style.position = 'fixed';
    messageDiv.style.top = '100px';
    messageDiv.style.right = '20px';
    messageDiv.style.zIndex = '1000';
    messageDiv.style.minWidth = '300px';
    
    document.body.appendChild(messageDiv);
    
    // Remove after 4 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 4000);
}

// ===== GOOGLE SHEETS API SETUP (FOR FUTURE USE) =====
/*
To use Google Sheets API, follow these steps:
1. Go to Google Cloud Console (console.cloud.google.com)
2. Create a new project
3. Enable Google Sheets API
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized redirect URIs
6. Replace CLIENT_ID with your credentials
7. Uncomment the API functions below
*/

const CLIENT_ID = 'YOUR_CLIENT_ID_HERE.apps.googleusercontent.com';
// const API_KEY = 'YOUR_API_KEY_HERE';

/*
function handleAuthClick() {
    gapi.auth2.getAuthInstance().signIn();
}

function handleSignoutClick() {
    gapi.auth2.getAuthInstance().signOut();
}

async function appendToSheet(range, values) {
    try {
        const response = await gapi.client.sheets.spreadsheets.values.append({
            spreadsheetId: SHEET_ID,
            range: range,
            valueInputOption: 'USER_ENTERED',
            values: [values],
        });
        return response.result;
    } catch (error) {
        console.error('Error appending to sheet:', error);
    }
}

async function readFromSheet(range) {
    try {
        const response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: range,
        });
        return response.result.values || [];
    } catch (error) {
        console.error('Error reading from sheet:', error);
    }
}
*/

console.log("GS Pashukhadya App Initialized");
console.log("Sheet ID:", SHEET_ID);

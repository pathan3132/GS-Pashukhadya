// =====================================
// GS PASHUKHADYA - GOOGLE SHEETS CONFIG
// =====================================
// Yeh file Google Sheets API ke saath connect karne ke liye hai
// Uncomment karo jab aap production me deploy karo

// ===== CONFIGURATION =====
// Google Cloud Console se ye values lena
const CONFIG = {
    CLIENT_ID: 'YOUR_CLIENT_ID.apps.googleusercontent.com', // Replace with your Client ID
    SHEET_ID: '1ytiWI21vypwci3TQ5DFMbgPPza5xfaW7TV5Ge_pEXoc', // Your sheet ID
    RANGES: {
        PARTIES: 'Parties!A2:G',
        PRODUCTS: 'Products!A2:E',
        TRANSACTIONS: 'Transactions!A2:I',
        STOCK_LEDGER: 'StockLedger!A2:E'
    }
};

// ===== GOOGLE SHEETS API SETUP =====
/*
STEP-BY-STEP GOOGLE SHEETS INTEGRATION:

1. Google Cloud Setup:
   - Go to console.cloud.google.com
   - Create new project
   - Enable Sheets API
   - Enable Drive API
   - Create OAuth 2.0 Web credentials
   
2. Set Redirect URIs:
   - http://localhost:3000 (for local development)
   - https://yourdomain.com (for production)
   
3. Get Credentials:
   - Copy Client ID
   - Copy API Key (optional for public sheets)
   
4. Update this file:
   - Replace CLIENT_ID with your actual Client ID
   - Keep SHEET_ID same
   
5. Uncomment code at bottom of this file
*/

// ===== INITIALIZE SHEETS API =====
function initSheetsAPI() {
    gapi.load('client:auth2', () => {
        gapi.client.init({
            apiKey: '', // Optional - leave empty for OAuth only
            clientId: CONFIG.CLIENT_ID,
            discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
            scope: 'https://www.googleapis.com/auth/spreadsheets'
        }).then(() => {
            console.log('Google Sheets API Initialized');
            
            // Check if already signed in
            if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
                loadAllDataFromSheets();
            }
        });
    });
}

// ===== AUTHENTICATION =====
async function signInWithGoogle() {
    try {
        const auth = gapi.auth2.getAuthInstance();
        await auth.signIn();
        console.log('Signed in successfully');
        loadAllDataFromSheets();
    } catch (error) {
        console.error('Sign in failed:', error);
        alert('Google Sign-in failed. Please check console for details.');
    }
}

function signOutFromGoogle() {
    const auth = gapi.auth2.getAuthInstance();
    auth.signOut();
    console.log('Signed out');
}

// ===== READ FROM GOOGLE SHEETS =====
async function readSheetData(range) {
    try {
        const response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: CONFIG.SHEET_ID,
            range: range
        });
        return response.result.values || [];
    } catch (error) {
        console.error('Error reading from sheet:', error);
        return [];
    }
}

// ===== WRITE TO GOOGLE SHEETS =====
async function appendToSheet(range, values) {
    try {
        const response = await gapi.client.sheets.spreadsheets.values.append({
            spreadsheetId: CONFIG.SHEET_ID,
            range: range,
            valueInputOption: 'USER_ENTERED',
            values: [values]
        });
        console.log('Data appended successfully');
        return response.result;
    } catch (error) {
        console.error('Error appending to sheet:', error);
        alert('Error saving to Google Sheets. Please check console.');
    }
}

// ===== UPDATE EXISTING ROW =====
async function updateSheetRow(range, values) {
    try {
        const response = await gapi.client.sheets.spreadsheets.values.update({
            spreadsheetId: CONFIG.SHEET_ID,
            range: range,
            valueInputOption: 'USER_ENTERED',
            values: [values]
        });
        console.log('Data updated successfully');
        return response.result;
    } catch (error) {
        console.error('Error updating sheet:', error);
    }
}

// ===== LOAD ALL DATA FROM SHEETS =====
async function loadAllDataFromSheets() {
    try {
        console.log('Loading data from Google Sheets...');
        
        // Load parties
        const partiesData = await readSheetData(CONFIG.RANGES.PARTIES);
        data.parties = partiesData.map(row => ({
            id: parseInt(row[0]) || Date.now(),
            name: row[1] || '',
            phone: row[2] || '',
            address: row[3] || '',
            openingBalance: parseFloat(row[4]) || 0,
            debit: parseFloat(row[5]) || 0,
            credit: parseFloat(row[6]) || 0
        }));
        
        // Load products
        const productsData = await readSheetData(CONFIG.RANGES.PRODUCTS);
        data.products = productsData.map(row => ({
            id: parseInt(row[0]) || Date.now(),
            name: row[1] || '',
            category: row[2] || '',
            rate: parseFloat(row[3]) || 0,
            currentStock: parseFloat(row[4]) || 0
        }));
        
        // Load transactions
        const transactionsData = await readSheetData(CONFIG.RANGES.TRANSACTIONS);
        data.transactions = transactionsData.map(row => ({
            id: parseInt(row[0]) || Date.now(),
            date: row[1] || '',
            partyID: parseInt(row[2]) || 0,
            productID: parseInt(row[3]) || 0,
            qty: parseFloat(row[4]) || 0,
            rate: parseFloat(row[5]) || 0,
            amount: parseFloat(row[6]) || 0,
            type: row[7] || 'Sale',
            remarks: row[8] || ''
        }));
        
        console.log('Data loaded from Google Sheets successfully');
        updateAllDisplays();
        
    } catch (error) {
        console.error('Error loading data from sheets:', error);
        alert('Error loading data from Google Sheets. Using local data.');
        loadDataFromLocalStorage();
    }
}

// ===== SAVE PARTY TO SHEETS =====
async function savePartyToSheets(party) {
    const values = [
        party.id,
        party.name,
        party.phone,
        party.address,
        party.openingBalance,
        party.debit,
        party.credit
    ];
    await appendToSheet(CONFIG.RANGES.PARTIES, values);
}

// ===== SAVE PRODUCT TO SHEETS =====
async function saveProductToSheets(product) {
    const values = [
        product.id,
        product.name,
        product.category,
        product.rate,
        product.currentStock
    ];
    await appendToSheet(CONFIG.RANGES.PRODUCTS, values);
}

// ===== SAVE TRANSACTION TO SHEETS =====
async function saveTransactionToSheets(transaction) {
    const values = [
        transaction.id,
        transaction.date,
        transaction.partyID,
        transaction.productID,
        transaction.qty,
        transaction.rate,
        transaction.amount,
        transaction.type,
        transaction.remarks
    ];
    await appendToSheet(CONFIG.RANGES.TRANSACTIONS, values);
}

// ===== SYNC FUNCTIONS (Modify Existing script.js Functions) =====
/*
Jab aap Google Sheets use karna start karo, 
script.js ke functions ko modify karo:

Original:
function addParty(e) {
    e.preventDefault();
    // ... existing code ...
    data.parties.push(newParty);
    saveDataToLocalStorage();
    // ...
}

Modified version:
async function addParty(e) {
    e.preventDefault();
    // ... existing code ...
    data.parties.push(newParty);
    
    // Save to both local storage and Google Sheets
    saveDataToLocalStorage();
    await savePartyToSheets(newParty);
    
    // ...
}

Do same for addProduct aur addTransaction functions.
*/

// ===== EXPORT DATA FUNCTIONS =====
function exportToJSON() {
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'gs-pashukhadya-backup.json';
    link.click();
}

function exportToCSV() {
    // Export parties as CSV
    let csv = 'ID,Name,Phone,Address,OpeningBalance,Debit,Credit\n';
    data.parties.forEach(party => {
        csv += `${party.id},${party.name},${party.phone},${party.address},${party.openingBalance},${party.debit},${party.credit}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'parties.csv';
    link.click();
}

// ===== SETUP INSTRUCTION =====
/*
TO USE THIS FILE:

1. Include this script in index.html BEFORE script.js:
   <script src="google-sheets-config.js"></script>
   <script src="script.js"></script>

2. In index.html navbar, add sign-in button:
   <button onclick="signInWithGoogle()" id="signInBtn">Sign in with Google</button>
   <button onclick="signOutFromGoogle()" id="signOutBtn">Sign out</button>

3. Uncomment initialization code at bottom of this file

4. Update CONFIG.CLIENT_ID with your actual Client ID

5. Modify addParty, addProduct, addTransaction functions in script.js 
   to call savePartyToSheets, saveProductToSheets, saveTransactionToSheets

6. Test on localhost first, then deploy
*/

// ===== UNCOMMENT TO ENABLE GOOGLE SHEETS INTEGRATION =====
/*
// Initialize when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSheetsAPI);
} else {
    initSheetsAPI();
}

// Show/hide sign-in button based on auth status
gapi.auth2.getAuthInstance().isSignedIn.listen(isSignedIn => {
    document.getElementById('signInBtn').style.display = isSignedIn ? 'none' : 'block';
    document.getElementById('signOutBtn').style.display = isSignedIn ? 'block' : 'none';
});
*/

console.log('Google Sheets Config Ready');
console.log('To enable Google Sheets integration:');
console.log('1. Update CONFIG.CLIENT_ID with your Client ID');
console.log('2. Uncomment initialization code at bottom of this file');
console.log('3. Include this file in index.html before script.js');

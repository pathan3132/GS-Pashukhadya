# 🐄 GS PASHUKHADYA - Setup Guide

## Project Overview
Yeh ek complete inventory management aur party ledger system hai GS Pashukhadya ke liye jo:
- Parties ka data manage kare (credit/debit)
- Products aur stock track kare
- Transactions record kare
- Party-wise ledger dikhaye

---

## 📁 Files Description

### 1. `index.html`
- Main HTML file with all forms aur sections
- Dashboard, Parties, Products, Transactions, Ledger sections
- Responsive design with navigation bar

### 2. `styles.css`
- Beautiful green theme (Pashukhadya ke liye perfect)
- Mobile responsive design
- Professional look aur feel

### 3. `script.js`
- All JavaScript logic
- LocalStorage me data save (currently)
- Google Sheets API integration ke liye ready (commented code available)

---

## 🚀 Quick Start (Without Google Sheets)

### Step 1: Files Setup
```
Your Project Folder/
├── index.html
├── styles.css
├── script.js
└── SETUP_GUIDE.md
```

### Step 2: VS Code Me Open Karo
1. VS Code kholo
2. File → Open Folder → Aapke project folder ko select karo
3. Right-click on `index.html` → "Open with Live Server"
4. Ya `index.html` ko double-click karke browser me kholo

### Step 3: Start Using
- Dashboard dekho - sab stats automatically update honge
- Party add karo
- Products add karo
- Transactions record karo
- Ledger check karo

**Data automatically save hoga browser ke LocalStorage me** ✅

---

## 📊 Google Sheets Integration (Optional but Recommended)

Agar aap Google Sheets se data pull karna aur push karna chahte ho, to ye steps follow karo:

### Step 1: Google Cloud Setup
1. [Google Cloud Console](https://console.cloud.google.com) open karo
2. **New Project** create karo → Name: "GS Pashukhadya"
3. Enable APIs:
   - Search "Google Sheets API" → Enable
   - Search "Google Drive API" → Enable

### Step 2: OAuth Credentials
1. Left sidebar me "Credentials" go to
2. **Create Credentials** → OAuth 2.0 Client ID
3. Application Type: Web application
4. Name: "GS Pashukhadya App"
5. Authorized redirect URIs add karo:
   - `http://localhost:3000` (local testing ke liye)
   - `https://your-domain.com` (production ke liye)
6. **Create** → Copy **Client ID**

### Step 3: API Key
1. Credentials me "Create Credentials" → API Key
2. Copy ye API key

### Step 4: script.js me Update Karo
```javascript
const CLIENT_ID = 'YOUR_CLIENT_ID.apps.googleusercontent.com';
const API_KEY = 'YOUR_API_KEY';
```

---

## 📋 Google Sheet Structure

Aapke Google Sheet me ye tabs create karo:

### Tab 1: Parties
```
Columns: ID | Name | Phone | Address | OpeningBalance | Debit | Credit
Example:
1629874545 | Sharma Dairy | 9876543210 | Mumbai | 5000 | 5000 | 0
```

### Tab 2: Products
```
Columns: ProductID | Name | Category | Rate | CurrentStock
Example:
1629874501 | Bufallo Feed | Feed | 450 | 100
1629874502 | Vitamin Mix | Supplement | 250 | 50
```

### Tab 3: Transactions
```
Columns: TransID | Date | PartyID | ProductID | Qty | Rate | Amount | Type | Remarks
Example:
1629874600 | 2024-01-15 | 1629874545 | 1629874501 | 10 | 450 | 4500 | Sale | Regular sale
```

### Tab 4: StockLedger
```
Columns: Date | ProductID | Type | Qty | Remarks
Example:
2024-01-15 | 1629874501 | Out | 10 | Sold to Sharma
```

---

## ✨ Features Explained

### 1. Dashboard 📊
- Total Parties count
- Total Products count
- Total Stock Value (inventory worth)
- Total Receivables (kitna dena baaki hai)
- Recent transactions list

### 2. Party Management 👥
- Naya party add karo
- Party ka phone aur address save karo
- Opening balance record karo
- Party-wise Debit/Credit track karo
- Final balance automatically calculate hota hai
- Search karke party find karo

### 3. Product Management 📦
- Naya product add karo (Feed, Supplement, etc.)
- Product ka rate set karo
- Initial stock enter karo
- Stock value automatic calculate hota hai (Qty × Rate)
- Products ko search karo

### 4. Transactions 📝
- Sale record karo (customer ko product dena)
- Purchase record karo (supplier se lena)
- Payment record karo (party se paisa lena/dena)
- Automatically:
  - Party ka balance update hota hai
  - Product ka stock update hota hai
  - Amount calculate hota hai

### 5. Ledger 📖
- Kisi bhi party ka complete ledger dekho
- Opening balance se start
- Sab transactions date-wise sorted
- Running balance calculate hota hai
- Debit/Credit clearly distinguish hota hai

---

## 💾 Data Storage Options

### Option 1: LocalStorage (Current)
- ✅ No setup required
- ✅ Instant data save
- ❌ Data sirf us browser me
- ❌ Device change karo to data nahi ayega
- **Best for**: Testing aur small usage

### Option 2: Google Sheets (Recommended)
- ✅ Cloud me data
- ✅ Multiple devices se access
- ✅ Automatic backup
- ❌ OAuth setup chahiye
- **Best for**: Production/professional use

### Option 3: Database (Future)
- Backend database (Firebase, MySQL, etc.)
- Multi-user support
- Advanced analytics

---

## 🎨 Customization

### Colors Change Karna
`styles.css` me `--primary-color` aur `--secondary-color` change karo:
```css
:root {
    --primary-color: #2c5f2d;  /* Dark green */
    --secondary-color: #97bc62;  /* Light green */
    --accent-color: #e8f4e8;
}
```

### Company Name Change Karna
`index.html` me "GS Pashukhadya" ko search karke change karo

### Add Karo Naya Field
1. HTML me form field add karo
2. JavaScript me add functionality likho
3. CSS me style add karo

---

## 🔧 Troubleshooting

### Data Nahi Save Ho Raha?
- Browser console kholo (F12)
- Check karo koi error to nahi
- localStorage clear karo aur refresh karo

### Google Sheets Nahi Connect Ho Raha?
- Client ID aur API Key correct hai check karo
- OAuth consent screen configure karo
- Browser console me error dekho

### Features Nahi Dikh Rahe?
- Refresh karo (Ctrl+R)
- Cache clear karo
- Different browser try karo

---

## 📱 Mobile Access

Yeh app mobile-friendly hai! 
- Any device se browser me khol sakte ho
- Touch-friendly buttons
- Responsive design

---

## 🚀 Deployment (AWS/Netlify/Vercel)

### Simple Deploy (Netlify):
1. [Netlify](https://netlify.com) pe sign up karo
2. Drag aur drop ye files
3. Done! Public link mil jayega

### VS Code Extensions:
- Install "Live Server" extension
- Right-click index.html → Open with Live Server
- Localhost link generate hoga

---

## 📞 Support Features

### Common Tasks:
- **New Sale Record Karna**: Transactions → Type: Sale
- **Stock Check Karna**: Products section
- **Party Kitna Dena Baaki Hai**: Parties section → Balance dekho
- **Complete Party History**: Ledger section

---

## 🔐 Security Tips

1. **LocalStorage Use Karte Ho To**:
   - Sensitive data encrypt karo
   - Regular backups export karo

2. **Google Sheets Use Karte Ho To**:
   - OAuth credentials safe rakho
   - API Key restrict karo

3. **Production Me**:
   - Backend server use karo
   - Database proper security ke saath
   - SSL certificate lagao

---

## 📈 Future Enhancements

- [ ] SMS/Email notifications
- [ ] Multi-user login
- [ ] Advanced reports (Excel export)
- [ ] GST calculations
- [ ] Mobile app version
- [ ] Dashboard graphs/charts

---

## 📝 Notes

- Data by default LocalStorage me save hota hai
- Google Sheets API optional hai advanced use ke liye
- UI responsive aur user-friendly hai
- Hindi labels add karne ke liye easily translate kar sakte ho

---

**Happy Tracking! 🐄 GS Pashukhadya App Chalega 100% Smooth 💪**

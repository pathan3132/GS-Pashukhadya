# 🐄 GS PASHUKHADYA - QUICK GUIDE (HINDI)

## शुरू करने के लिए - 5 मिनट में Setup

### फाइलें तैयार करो:
1. `index.html` 
2. `styles.css`
3. `script.js`
4. VS Code में खोल दो
5. Right-click → "Open with Live Server"

**बस हो गया!** ✅ अब app चल गया है।

---

## एप्लिकेशन के Main Parts

### 1️⃣ Dashboard (होम)
- कुल Parties की संख्या
- कुल Products की संख्या  
- कुल Stock की कीमत
- कुल देने वाली रकम (Receivables)
- Last 5 transactions दिखाता है

### 2️⃣ Parties (ग्राहक/विक्रेताओं का डेटा)
**क्या कर सकते हो:**
- नया party add करो (नाम, फोन, address)
- Opening balance दे सकते हो
- Party list में सब details देख सकते हो:
  - कितना debit है (हमें देना है)
  - कितना credit है (हमें पाना है)
  - Final balance क्या है

**Example:**
```
Party: Sharma Dairy
Phone: 9876543210
Opening Balance: 5,000 रुपये
(यानी शुरुआत में उन्हें 5000 रुपये का सामान दे रहे हो)
```

### 3️⃣ Products (सामान/स्टॉक)
**क्या कर सकते हो:**
- नया product add करो (नाम, category, rate, stock)
- Category example: Feed, Supplement, Medicine
- Rate: एक unit की कीमत
- Current Stock: कितना स्टॉक है अभी
- Stock Value automatic calculate होती है (Qty × Rate)

**Example:**
```
Product: Buffalo Feed 
Rate: 450 रुपये per unit
Current Stock: 100 units
Stock Value: 45,000 रुपये (100 × 450)
```

### 4️⃣ Transactions (बिक्री, खरीद, payment)
**3 तरह के transactions:**

**A) Sale (बिक्री):**
- जब customer को सामान दो
- Party का debit बढ़ता है
- Product का stock घटता है
```
Example: Sharma को 10 units Buffalo Feed दिए @ 450/unit
Amount: 4,500 रुपये
→ Sharma का balance में +4,500 जुड़ेगा
→ Stock में से 10 units हट जाएगा
```

**B) Purchase (खरीद):**
- जब supplier से सामान खरीदो
- Party का credit बढ़ता है
- Product का stock बढ़ता है
```
Example: XYZ Supplier से 50 units @ 400/unit खरीदे
Amount: 20,000 रुपये
→ Supplier का balance में -20,000 जाएगा
→ Stock में 50 units बढ़ेंगे
```

**C) Payment (भुगतान):**
- जब कोई देनदार पैसे दे
- Party का credit बढ़ता है
- Stock नहीं बदलता

### 5️⃣ Ledger (विस्तृत खाता)
- किसी भी party का पूरा ledger देख सकते हो
- Opening Balance से शुरू होता है
- हर transaction के साथ चलता balance दिखता है
- Debit (लाल) = हमें देना है
- Credit (हरा) = हमें पाना है

**Example - Sharma का Ledger:**
```
Date      | Description | Debit   | Credit | Balance
15-Jan    | Opening     | 5,000   |        | 5,000
20-Jan    | Sale        | 4,500   |        | 9,500
25-Jan    | Payment     |         | 3,000  | 6,500
(मतलब Sharma को शुरुआत में 5000, फिर 4500 और सामान, फिर उसने 3000 वापस कर दिए)
```

---

## 💡 रोज़मर्रा के काम कैसे करो?

### काम 1: सुबह की शुरुआत में
1. Dashboard खोल कर देखो कितना चल रहा है
2. Stock कितना बचा है check करो (Products section)

### काम 2: जब कोई ग्राहक आए
1. Transactions section खोल
2. Type: "Sale" select करो
3. Party name चुन
4. Product चुन (automatically rate भर जाएगा)
5. Quantity डाल
6. Submit करो
→ **Automatically हो जाएगा:**
- ग्राहक का balance update
- Stock में से subtract
- Bill की amount calculate

### काम 3: Supplier से खरीद
1. Transactions → Type: "Purchase"
2. Supplier select करो
3. Product चुन
4. Quantity और rate
5. Submit
→ Stock बढ़ जाएगा

### काम 4: ग्राहक payment देता है
1. Transactions → Type: "Payment"
2. ग्राहक select करो
3. Amount डाल (Qty में 1 रखो)
4. Submit
→ उसका balance घट जाएगा

### काम 5: किसी ग्राहक का खाता देखना
1. Ledger section खोल
2. Party select करो
3. पूरा history दिख जाएगा

---

## 📊 Data का Flow (समझने के लिए)

```
┌─────────────────────────────────┐
│        Your Web App             │
│  (index.html + css + js)        │
└──────────────┬──────────────────┘
               │
        ┌──────▼──────┐
        │ LocalStorage │  ← अभी यहाँ save हो रहा है
        │  (Browser)   │
        └──────┬──────┘
               │
        (Later)
        ┌──────▼──────────────┐
        │  Google Sheets API  │  ← Cloud में sync करने के लिए
        │  (Optional)         │
        └─────────────────────┘
```

**अभी:** Data सिर्फ browser में save हो रहा है (LocalStorage)
**बाद में:** Google Sheets से sync कर सकते हो

---

## ⚠️ Important Notes

### Data कहाँ है?
- अभी LocalStorage में save हो रहा है
- Browser close करो तो भी data रहेगा
- अगर browser cache clear करो तो data खत्म हो जाएगा
- **Backup रखना:** Export करके JSON/CSV download कर ले

### Multi-Device Access के लिए
Google Sheets setup करने के लिए `SETUP_GUIDE.md` देख
(थोड़ा advanced है पर सबसे अच्छा solution है)

### Mobile से Use करना
Smartphone में same URL open करो
App fully responsive है, सब कुछ काम करेगा

---

## 🔧 Common Problems & Solutions

### Problem 1: Data गायब हो गया
❌ **ग़लत:** Browser cache clear कर दिया होगा
✅ **हल:** 
- LocalStorage backup ढूंढ
- या fresh start करो
- Google Sheets use करो (permanent)

### Problem 2: Stock negative हो रहा है
❌ **ग़लत:** शायद sale बहुत ज्यादा दे रहे हो
✅ **हल:**
- Products section में current stock check करो
- Sale करने से पहले stock verify करो

### Problem 3: Party का balance गलत दिख रहा है
❌ **ग़लत:** Opening balance गलत enter किया होगा
✅ **हल:**
- Party delete करो
- फिर से सही opening balance के साथ add करो

### Problem 4: Browser में app load नहीं हो रहा
❌ **ग़लत:** Probably file path गलत है
✅ **हल:**
- `index.html` को browser में drag-drop करो
- या Live Server से open करो
- Console में (F12) error check करो

---

## 📱 Features की List

✅ Party Management
- Add party
- Track debit/credit
- View balance
- Delete party
- Search party

✅ Product Management  
- Add product
- Track stock
- Calculate stock value
- Delete product
- Search product

✅ Transactions
- Record Sale
- Record Purchase
- Record Payment
- View all transactions
- Auto calculations

✅ Ledger
- Party-wise ledger
- Date-wise sorting
- Running balance
- Debit/Credit view

✅ Dashboard
- Quick statistics
- Recent activity
- Stock value
- Receivables

---

## 🎯 Tips & Tricks

### Tip 1: Opening Balance सही सेट करो
जब party को पहली बार add करो तो opening balance सही डाल
(यानी पहले कितना transaction हो चुका है)

### Tip 2: Rate हमेशा सही रखो
जब product add करो तो rate सही डाल
Sale करते समय automatically fill हो जाएगा

### Tip 3: Daily Backup
हर हफ्ते Dashboard से data को export करके save कर दे

### Tip 4: Mobile Use
Smartphone से भी same link से access कर सकते हो
डेटा sync रहेगा (अगर same device हो)

---

## 🚀 आगे क्या?

### Phase 1 (अभी): ✅ चल रहा है
- Basic party management
- Stock tracking
- Transaction recording
- LocalStorage में data

### Phase 2 (अगला): Optional
- Google Sheets integration
- Cloud backup
- Multi-device access
- Advanced reports

### Phase 3 (भविष्य): Future
- SMS notifications
- Mobile app
- Advanced analytics
- GST calculations

---

## 📞 Quick Reference

| काम करना है | क्या करो |
|-----------|---------|
| Naya party add करना | Parties → Form fill → Submit |
| Naya product add करना | Products → Form fill → Submit |
| Sale record करना | Transactions → Type: Sale → Fill → Submit |
| Purchase करना | Transactions → Type: Purchase → Fill → Submit |
| Payment लेना | Transactions → Type: Payment → Fill → Submit |
| Party का ledger देखना | Ledger → Party select → View |
| Stock check करना | Products section |
| Dashboard देखना | Home पर click करो |

---

## 💾 Data Backup Kaise Nikale?

```javascript
// Browser console में (F12 दबाओ, Console tab खोल):
// Save करने के लिए:
localStorage.setItem('backup', JSON.stringify(data));

// Load करने के लिए:
data = JSON.parse(localStorage.getItem('backup'));
```

---

## ✨ Final Tips

1. **Regular Backup रखो** - हर हफ्ते एक backup निकाल
2. **Phone number सही रखो** - बाद में contact करने में काम आएगा
3. **Opening balance सही सेट करो** - Starting point important है
4. **Daily check करो** - कम से कम Dashboard तो देख लिया करो
5. **Google Sheets use करो** - अगर multi-device चाहिए तो

---

**Good Luck! आपका Business grow हो! 🐄💪**

*किसी भी सवाल के लिए code comments पढ़ो या SETUP_GUIDE.md देख*

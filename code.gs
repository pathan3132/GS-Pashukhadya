
// ⚠️ Yahan apne combined Sale+Purchase sheet ka EXACT tab name daalo
// (jaisa Google Sheet ke neeche tab par likha hai). Agar tab ka naam
// alag hai to bas is ek line ko update karo, baaki kuch change nahi karna.
const ENTRIES_SHEET_NAME = "Sale Purchase Entries";

function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet();

  const masters = sheet.getSheetByName("Masters").getDataRange().getValues();
  // Ab Sale aur Purchase ek hi sheet me hain — columns:
  // Date | Type | Vch/Bill No | Particulars | Item Details | Qty | Unit | Price | Amount
  // Type = "Sale" ya "Purchase" se pehchana jaata hai. Har entry ke neeche
  // "DHOODWALE : ..." wali row uska receiver info hoti hai (alag transaction nahi) —
  // is sheet se raw ke raw bhej dete hain, splitting/merging logic frontend (index.html) me hoti hai.
  const entries = sheet.getSheetByName(ENTRIES_SHEET_NAME).getDataRange().getValues();
  const receipts = sheet.getSheetByName("Receipts Entry").getDataRange().getValues();
  const payments = sheet.getSheetByName("Payment Entries").getDataRange().getValues();

  const data = {
    masters: masters,
    entries: entries,
    receipts: receipts,
    payments: payments
  };

  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
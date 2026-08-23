
function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet();
  
  const masters = sheet.getSheetByName("Masters").getDataRange().getValues();
  const sales = sheet.getSheetByName("Sale Entries").getDataRange().getValues();
  const purchase = sheet.getSheetByName("Purchase Entries").getDataRange().getValues();
  const receipts = sheet.getSheetByName("Receipts Entry").getDataRange().getValues();
  const payments = sheet.getSheetByName("Payment Entries").getDataRange().getValues();
  
  const data = {
    masters: masters,
    sales: sales,
    purchase: purchase,
    receipts: receipts,
    payments: payments
  };
  
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
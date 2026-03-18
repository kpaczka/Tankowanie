// ============================================================
//  BACKEND — Apps Script (Google Sheets + Drive)
//  Wdróż jako webapp: wykonaj jako "Ja", dostęp "Wszyscy"
//  Skopiuj URL wdrożenia do index.html => SCRIPT_URL
// ============================================================

const SPREADSHEET_ID = '1mzC4ishKrla72nH6_GuTnRCHfDvRkcG4fxWPGzyHXkI';
const FOLDER_ID      = '1Oyc4Btz9TJv0AGa9Dm39MH-nUF22tdk9';
const SHEET_NAME     = 'Tankowania';

function doPost(e) {
  try {
    var dane = JSON.parse(e.postData.contents);
    var wynik = zapiszTankowanie(dane);
    return ContentService
      .createTextOutput(JSON.stringify(wynik))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({sukces: false, blad: err.message}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({status: 'ok'}))
    .setMimeType(ContentService.MimeType.JSON);
}

function zapiszTankowanie(dane) {
  var folder = DriveApp.getFolderById(FOLDER_ID);
  var blob = Utilities.newBlob(
    Utilities.base64Decode(dane.zdjecieBase64),
    dane.zdjecieMime,
    dane.zdjecieNazwa
  );
  var plik = folder.createFile(blob);
  var linkZdjecia = plik.getUrl();

  var ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['Data zapisu','Nr rejestracyjny','Data tankowania','Stan licznika (km)','Zdjecie licznika']);
    sheet.getRange(1,1,1,5).setFontWeight('bold');
  }
  sheet.appendRow([new Date(), dane.rejestracja, dane.dataTankowania, dane.licznik, linkZdjecia]);
  return { sukces: true };
}

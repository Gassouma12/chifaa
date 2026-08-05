const fs = require('fs');

const path = 'C:/Users/aboul/OneDrive/Bureau/finalchifaa/data/menaHealthData.json';
const outPath = 'C:/Users/aboul/OneDrive/Bureau/finalchifaa/data/menaHealthData_ar.json';

const countryTranslations = {
    "Algeria": "الجزائر",
    "Egypt": "مصر",
    "Saudi Arabia": "السعودية",
    "Morocco": "المغرب",
    "UAE": "الإمارات",
    "Bahrain": "البحرين",
    "Comoros": "جزر القمر",
    "Djibouti": "جيبوتي",
    "Iraq": "العراق",
    "Jordan": "الأردن",
    "Kuwait": "الكويت",
    "Lebanon": "لبنان",
    "Libya": "ليبيا",
    "Mauritania": "موريتانيا",
    "Oman": "عُمان",
    "Palestine": "فلسطين",
    "Qatar": "قطر",
    "Somalia": "الصومال",
    "Sudan": "السودان",
    "Syria": "سوريا",
    "Tunisia": "تونس",
    "Yemen": "اليمن",
    "Unknown": "غير معروف"
};

const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const translateValue = (val) => {
    if (!val) return val;
    val = val.replace("Data unavailable", "البيانات غير متوفرة");
    return val;
};

const translated = data.map(item => {
    item.country = countryTranslations[item.country] || item.country;
    
    Object.keys(item.womensHealth || {}).forEach(k => {
        item.womensHealth[k] = translateValue(item.womensHealth[k]);
    });
    Object.keys(item.chronicDisease || {}).forEach(k => {
        item.chronicDisease[k] = translateValue(item.chronicDisease[k]);
    });
    Object.keys(item.cervicalCancer || {}).forEach(k => {
        item.cervicalCancer[k] = translateValue(item.cervicalCancer[k]);
    });
    
    return item;
});

fs.writeFileSync(outPath, JSON.stringify(translated, null, 2), 'utf8');
console.log('Created menaHealthData_ar.json');

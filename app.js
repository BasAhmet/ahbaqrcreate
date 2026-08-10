// Form şablonları
const forms = {
    text: `<input type="text" id="textData" placeholder="https:// veya metin girin" class="w-full border p-2 rounded">`,
    wifi: `
        <input type="text" id="wifiSsid" placeholder="Ağ Adı (SSID)" class="w-full border p-2 rounded mb-2">
        <input type="text" id="wifiPass" placeholder="Şifre" class="w-full border p-2 rounded mb-2">
        <select id="wifiType" class="w-full border p-2 rounded">
            <option value="WPA">WPA/WPA2</option>
            <option value="WEP">WEP</option>
            <option value="nopass">Şifresiz</option>
        </select>`,
    vcard: `
        <input type="text" id="vcName" placeholder="Ad Soyad" class="w-full border p-2 rounded mb-2">
        <input type="text" id="vcPhone" placeholder="Telefon Numarası" class="w-full border p-2 rounded mb-2">
        <input type="email" id="vcEmail" placeholder="E-Posta" class="w-full border p-2 rounded mb-2">
        <input type="text" id="vcCompany" placeholder="Şirket/Kurum" class="w-full border p-2 rounded">`,
    email: `
        <input type="email" id="emAddress" placeholder="Alıcı E-Posta" class="w-full border p-2 rounded mb-2">
        <input type="text" id="emSubject" placeholder="Konu" class="w-full border p-2 rounded mb-2">
        <textarea id="emBody" placeholder="Mesajınız" class="w-full border p-2 rounded h-20"></textarea>`
};

// Sayfa yüklendiğinde varsayılan formu getir
document.getElementById('formContainer').innerHTML = forms.text;

let currentLogo = null;

// Logo yükleme işlemi
document.getElementById('logoInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            currentLogo = event.target.result;
        };
        reader.readAsDataURL(file);
    } else {
        currentLogo = null;
    }
});

// Veri türü değiştiğinde formu güncelle
function changeForm() {
    const type = document.getElementById('dataType').value;
    document.getElementById('formContainer').innerHTML = forms[type];
}

// qr-code-styling kütüphanesini başlat (Başlangıç renkleri HTML'deki varsayılanlarla aynı)
const qrCode = new QRCodeStyling({
    width: 300,
    height: 300,
    margin: 20,
    type: "canvas", 
    data: "https://ornek.com",
    image: "",
    dotsOptions: {
        type: "rounded",
        gradient: {
            type: "linear",
            rotation: Math.PI / 2,
            colorStops: [
                { offset: 0, color: "#ff0000" }, // Üst Renk
                { offset: 1, color: "#0000ff" }  // Alt Renk
            ]
        }
    },
    cornersSquareOptions: {
        color: "#000000",
        type: "square"
    },
    cornersDotOptions: {
        color: "#000000",
        type: "square"
    },
    backgroundOptions: {
        color: "#ffffff",
    },
    imageOptions: {
        crossOrigin: "anonymous",
        margin: 10
    }
});

// İlk QR kodu ekrana çiz
qrCode.append(document.getElementById("canvas"));

// Formatlayıcılar: Girdiği veriyi QR formatına çevirir
function getFormattedData() {
    const type = document.getElementById('dataType').value;
    
    if (type === 'text') return document.getElementById('textData').value;
    
    if (type === 'wifi') {
        const ssid = document.getElementById('wifiSsid').value;
        const pass = document.getElementById('wifiPass').value;
        const enc = document.getElementById('wifiType').value;
        return `WIFI:S:${ssid};T:${enc};P:${pass};;`;
    }
    
    if (type === 'vcard') {
        const name = document.getElementById('vcName').value;
        const phone = document.getElementById('vcPhone').value;
        const email = document.getElementById('vcEmail').value;
        const company = document.getElementById('vcCompany').value;
        return `BEGIN:VCARD\nVERSION:3.0\nN:${name}\nTEL:${phone}\nEMAIL:${email}\nORG:${company}\nEND:VCARD`;
    }

    if (type === 'email') {
        const to = document.getElementById('emAddress').value;
        const sub = document.getElementById('emSubject').value;
        const body = document.getElementById('emBody').value;
        return `mailto:${to}?subject=${encodeURIComponent(sub)}&body=${encodeURIComponent(body)}`;
    }
}

// QR Kodu güncelle
function generateQR() {
    const data = getFormattedData();
    if (!data || data.trim() === "") {
        alert("Lütfen geçerli bir veri girin.");
        return;
    }

    // Seçilen renkleri HTML'den çekiyoruz
    const color1 = document.getElementById('gradColor1').value;
    const color2 = document.getElementById('gradColor2').value;

    qrCode.update({
        data: data,
        image: currentLogo || "",
        dotsOptions: {
            gradient: {
                type: "linear",
                rotation: Math.PI / 2,
                colorStops: [
                    { offset: 0, color: color1 }, // Kullanıcının seçtiği Renk 1
                    { offset: 1, color: color2 }  // Kullanıcının seçtiği Renk 2
                ]
            }
        },
        cornersSquareOptions: { color: "#000000" },
        cornersDotOptions: { color: "#000000" },
        backgroundOptions: {
            color: document.getElementById('bgColor').value
        }
    });
}

// İndirme işlemi
function downloadQR(extension) {
    qrCode.download({ name: "qr-kod", extension: extension });
}

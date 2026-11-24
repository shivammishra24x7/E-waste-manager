const CATS = ["All", "Paper", "Plastic", "Metal", "E-waste", "Rubber", "Other"];

// Dataset including E-Waste, Copper, PCBs, Batteries etc.
const D = [
    ["Paper", "Newspaper (अखबार)", 14, "📰"],
    ["Paper", "Cardboard (गत्ता)", 8, "📦"],
    ["Paper", "Books / Copies (किताबें)", 12, "📚"],
    ["Plastic", "Hard Plastic (कठोर प्लास्टिक)", 12, "🪣"],
    ["Plastic", "PET Bottles (प्लास्टिक बोतल)", 15, "🧴"],
    ["Plastic", "Mixed Plastic (मिश्रित प्लास्टिक)", 6, "🛍"],
    ["Metal", "Iron (लोहा)", 25, "🔩"],
    ["Metal", "Tin (टिन)", 20, "🥫"],
    ["Metal", "Aluminium (एल्युमिनियम)", 180, "🧪"],
    ["Metal", "Steel (स्टील)", 50, "🍴"],
    ["Metal", "Brass (पीतल)", 500, "🔔"],
    ["Metal", "Copper (तांबा)", 900, "🏺"],
    ["Metal", "Copper Wire (तांबे का तार)", 250, "🪢"],
    ["Metal", "Aluminium Wire (एल्युमिनियम तार)", 20, "⛓"],
    ["E-waste", "Old Mobile (पुराना फोन)", 150, "📱", "/pc"],
    ["E-waste", "Laptop (लैपटॉप)", 1500, "💻", "/pc"],
    ["E-waste", "CPU / Desktop (सीपीयू)", 300, "🖥", "/pc"],
    ["E-waste", "LED / LCD TV (टीवी)", 600, "📺", "/pc"],
    ["E-waste", "Inverter Battery (इनवर्टर बैटरी)", 90, "🔋", "/kg"],
    ["E-waste", "Mobile Charger / Cables (चार्जर/केबल)", 30, "🔌"],
    ["E-waste", "Circuit Boards (सर्किट बोर्ड/PCB)", 250, "🧩"],
    ["E-waste", "Router / Modem (राउटर)", 50, "📡", "/pc"],
    ["Rubber", "Tyres (टायर)", 8, "🛞"],
    ["Rubber", "Rubber Tubes (ट्यूब)", 15, "⭕"],
    ["Other", "Glass Bottles (कांच की बोतलें)", 2, "🍾", "/pc"],
    ["Other", "Old Clothes (पुराने कपड़े)", 10, "👕"]
];

const CITY = {
    Jaipur: ["Malviya Nagar", "Vaishali Nagar", "Mansarovar", "C-Scheme", "Raja Park", "Tonk Road", "Civil Lines", "Sodala", "Jagatpura", "Model Town", "Sitapura E-Waste Hub"],
    Delhi: ["Lajpat Nagar", "Rohini", "Dwarka", "Karol Bagh", "Nehru Place", "Saket"],
    Mumbai: ["Andheri", "Bandra", "Dadar", "Borivali", "Thane"],
    Bikaner: ["Gangashahar", "Station Road", "Jaipur Road", "Pawanpuri"]
};

const MULT = { Jaipur: 1, Delhi: 1.08, Mumbai: 1.12, Bikaner: 0.95 };

let cat = "All", city = "Jaipur", loc = "";
const $ = (i) => document.getElementById(i);

// Initialize City and Category Dropdowns
$("city").innerHTML = Object.keys(CITY).map(c => `<option>${c}</option>`).join("");
$("cat2").innerHTML = CATS.slice(1).map(c => `<option>${c}</option>`).join("");

function renderTabs() {
    $("tabs").innerHTML = CATS.map(c => `<button class="${c === cat ? "on" : ""}" data-c="${c}">${c}</button>`).join("");
}

function renderGrid() {
    const q = $("q").value.trim().toLowerCase();
    const m = MULT[city];
    const filtered = D.filter(d => (cat === "All" || d[0] === cat) && d[1].toLowerCase().includes(q));

    $("grid").innerHTML = filtered.length ? filtered.map(d => {
        const price = Math.round(d[2] * m);
        const unit = d[4] || "/kg";
        return `
            <div class="it">
                <div class="ic-wrap">
                    <div class="ic">${d[3]}</div>
                    <div>
                        <b>${d[1]}</b>
                        <span class="p">₹${price.toLocaleString("en-IN")} <small>${unit}</small></span>
                    </div>
                </div>
                <button class="audio-btn" onclick="speakRate('${d[1]}', '${price}', '${unit}')" title="बोलकर सुनें">
                    <i class="fa-solid fa-volume-high"></i>
                </button>
            </div>
        `;
    }).join("") : `<div style="grid-column:1/-1; text-align:center; color:var(--muted); padding:30px;">कोई सामान नहीं मिला। दूसरा शब्द या श्रेणी चुनें।</div>`;
}

function renderChips() {
    $("lh").textContent = `${city} के प्रमुख क्षेत्रों में स्क्रैप भाव`;
    $("chips").innerHTML = CITY[city].map(l => `<button class="${l === loc ? "on" : ""}">${l}</button>`).join("");
}

// Text-to-Speech Voice Assist for Low Literacy Support
function speakRate(item, price, unit) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const text = `${item} का आज का भाव ${price} रुपये ${unit === '/kg' ? 'प्रति किलो' : 'प्रति नग'} है।`;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'hi-IN';
        window.speechSynthesis.speak(utterance);
    } else {
        alert(`${item}: ₹${price} ${unit}`);
    }
}

// Event Listeners
$("tabs").onclick = (e) => {
    if (e.target.dataset.c) {
        cat = e.target.dataset.c;
        renderTabs();
        renderGrid();
    }
};

$("q").oninput = renderGrid;

$("city").onchange = function() {
    city = this.value;
    loc = "";
    renderChips();
    renderGrid();
};

$("chips").onclick = (e) => {
    if (e.target.tagName === "BUTTON") {
        loc = e.target.textContent;
        $("loc").value = loc;
        renderChips();
        $("sell").scrollIntoView();
    }
};

$("tg").onclick = function() {
    const h = document.documentElement;
    const n = h.dataset.theme === "dark" ? "light" : "dark";
    h.dataset.theme = n;
    this.textContent = n === "dark" ? "☀" : "☾";
};

$("f").onsubmit = function(e) {
    e.preventDefault();
    $("ok").style.display = "block";
    this.reset();
};

// Initial Render
renderTabs();
renderChips();
renderGrid();

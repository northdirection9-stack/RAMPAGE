// ================= DATA =================
const battleLog = [
    {
        id: "01",
        src: "./assets/videos/kill1.mp4",
        weapon: "AK-74M",
        dist: "5m",
        infantry: 3,
        transport: 0,
        area: "Forest DRG"
    },
    {
        id: "02",
        src: "./assets/videos/kill2.mp4",
        weapon: "SVD",
        dist: "420m",
        infantry: 0,
        transport: 0,
        area: "HILL_302"
    },
    {
        id: "03",
        src: "./assets/videos/kill3.mp4",
        weapon: "RPG-7V",
        dist: "120m",
        infantry: 0,
        transport: 0,
        area: "SECTOR_F2"
    }
];

// ================= STATE =================
let audio = new Audio("./assets/sound/track1.mp3");

// ================= INITIALIZATION =================
const startScreen = document.getElementById("start-screen");

startScreen.addEventListener("click", () => {
    startScreen.style.opacity = "0";
    setTimeout(() => startScreen.remove(), 500);
    
    // Запуск звука
    audio.loop = true;
    audio.volume = 0.5;
    audio.play().catch(e => console.log("Audio Error:", e));
    
    initSystem();
});

function initSystem() {
    render();
    calculateTotals();
    initObserver();
    initDataStream();
    
    // Громкость
    document.getElementById("volume").addEventListener("input", (e) => {
        audio.volume = e.target.value;
    });
}

// ================= CALCULATE TOTALS =================
function calculateTotals() {
    const totalInf = battleLog.reduce((sum, item) => sum + item.infantry, 0);
    const totalVeh = battleLog.reduce((sum, item) => sum + item.transport, 0);
    
    document.getElementById("total-inf").textContent = totalInf;
    document.getElementById("total-veh").textContent = totalVeh;
}

// ================= UI RENDER =================
function render() {
    const feed = document.getElementById("feed");
    feed.innerHTML = ''; 

    battleLog.forEach(item => {
        const div = document.createElement("div");
        div.className = "card";
        div.innerHTML = `
            <div class="relative group">
                <div class="absolute top-2 left-2 z-10 bg-red-600 text-[8px] px-1 animate-pulse">LIVE_FEED</div>
                <video playsinline loop muted>
                    <source src="${item.src}" type="video/mp4">
                </video>
            </div>
            <div class="mt-4 flex justify-between items-end border-t border-white/10 pt-4">
                <div class="text-[10px] font-mono">
                    <span class="text-gray-500">ID:</span> ${item.id}<br>
                    <span class="text-gray-500">LOC:</span> ${item.area}
                </div>
                <div class="text-right text-[10px] font-mono">
                    <span class="text-gray-500">WEAPON:</span> <span class="text-[var(--accent)]">${item.weapon}</span><br>
                    <span class="text-gray-500">UNITS:</span> INF+${item.infantry} / VEH+${item.transport}
                </div>
            </div>
        `;
        feed.appendChild(div);
    });
}

// ================= OBSERVER =================
function initObserver() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.play().catch(() => {});
            } else {
                entry.target.pause();
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll("video").forEach(v => observer.observe(v));
}

// ================= AI FEATURE: DATA STREAM =================
function initDataStream() {
    const stream = document.getElementById("data-stream");
    setInterval(() => {
        const hex = Math.floor(Math.random()*0xFFFFFF).toString(16).toUpperCase();
        const line = document.createElement("div");
        line.textContent = `> DECRYPTING_0x${hex}... OK`;
        stream.prepend(line);
        if (stream.children.length > 15) stream.lastChild.remove();
    }, 400);
}
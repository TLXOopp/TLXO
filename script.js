let ClinicalData = {};
let currentKey = ""; 
let currentLang = "en";
let isTyping = false;


async function loadData() {
    try {
        const res = await fetch('data.json');
        ClinicalData = await res.json();
        console.log("Engine v3.2 Initialized.");
    } catch (e) {
        console.error("Critical: data.json not found.");
    }
}
loadData();


window.toggleLanguage = function() {
    if (isTyping || !currentKey) return;

    currentLang = (currentLang === "en") ? "ko" : "en";
    const data = ClinicalData[currentKey][currentLang];
    const transBtn = document.getElementById('transBtn');
    
    document.getElementById('typeText').textContent = data.explanation;
    document.getElementById('logicVal').textContent = data.logic;
    document.getElementById('actionVal').textContent = data.neural_reset;
    
    
    transBtn.textContent = (currentLang === "en") ? "Translate to 한국어" : "Translate to English";
    document.getElementById('logicLabel').textContent = (currentLang === "en") ? "Scientific Logic:" : "과학적 근거:";
    document.getElementById('actionLabel').textContent = (currentLang === "en") ? "Reset Protocol:" : "리셋 프로토콜:";
};


function runAnalysis() {
    const input = document.getElementById('userInput');
    const query = input.value.toLowerCase().trim();
    if (!query || isTyping) return;

    const match = Object.keys(ClinicalData).find(key => query.includes(key.toLowerCase()));

    if (match) {
        currentKey = match;
        currentLang = "en"; 
        const data = ClinicalData[match].en;
        
        document.getElementById('welcome').style.display = 'none';
        const display = document.getElementById('displayArea');
        
        
        display.innerHTML = `
            <div class="result-wrapper">
                <div class="explanation-box">
                    <span id="typeText"></span><span class="cursor"></span>
                </div>
                <button id="transBtn" class="translate-btn" onclick="toggleLanguage()">Translate to 한국어</button>
                
                <div class="result-card" id="resCard">
                    <div class="card-label">NEURAL ANALYSIS SUMMARY</div>
                    <div class="data-row">
                        <span class="data-label" id="logicLabel">Scientific Logic:</span>
                        <span id="logicVal">${data.logic}</span>
                    </div>
                    <div class="data-row">
                        <span class="data-label" id="actionLabel">Reset Protocol:</span>
                        <div class="protocol-box" id="actionVal">${data.neural_reset}</div>
                    </div>
                </div>
            </div>
        `;

        
        typeWriter(data.explanation, 'typeText');
        setTimeout(() => document.getElementById('resCard').classList.add('visible'), 400);
    }
    input.value = '';
}

function typeWriter(text, elementId, speed = 25) {
    let i = 0;
    const element = document.getElementById(elementId);
    element.textContent = "";
    isTyping = true;
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else { isTyping = false; }
    }
    type();
}

document.getElementById('sendBtn').addEventListener('click', runAnalysis);
document.getElementById('userInput').addEventListener('keypress', (e) => { if (e.key === 'Enter') runAnalysis(); });


window.toggleLanguage = function() {
    if (isTyping || !currentKey) return;

    
    currentLang = (currentLang === "en") ? "ko" : "en";
    const data = ClinicalData[currentKey][currentLang];
    const transBtn = document.getElementById('transBtn');
    
    
    document.getElementById('typeText').textContent = data.explanation;
    document.getElementById('logicVal').textContent = data.logic;
    document.getElementById('actionVal').textContent = data.neural_reset;
    
    
    if (currentLang === "en") {
        transBtn.textContent = "Translate to 한국어";
        document.getElementById('logicLabel').textContent = "Scientific Logic:";
        document.getElementById('actionLabel').textContent = "Reset Protocol:";
    } else {
        transBtn.textContent = "Translate to English";
        document.getElementById('logicLabel').textContent = "과학적 근거:";
        document.getElementById('actionLabel').textContent = "리셋 프로토콜:";
    }
};


function runAnalysis() {
    const inputField = document.getElementById('userInput');
    const query = inputField.value.toLowerCase().trim();
    if (!query || isTyping) return;

    
    const match = Object.keys(ClinicalData).find(key => query.includes(key.toLowerCase()));

    if (match) {
        currentKey = match;
        currentLang = "en"; 
        const data = ClinicalData[match].en;
        
        document.getElementById('welcome').style.display = 'none';
        const display = document.getElementById('displayArea');
        
        display.innerHTML = `
            <div class="result-wrapper">
                <div class="explanation-box">
                    <span id="typeText"></span><span class="cursor"></span>
                </div>
                <button id="transBtn" class="translate-btn" onclick="toggleLanguage()">Translate to 한국어</button>
                
                <div class="result-card" id="resCard">
                    <div class="card-label">Neural Analysis Summary</div>
                    <div class="data-row">
                        <span class="data-label" id="logicLabel">Scientific Logic:</span>
                        <span id="logicVal">${data.logic}</span>
                    </div>
                    <div class="data-row">
                        <span class="data-label" id="actionLabel">Reset Protocol:</span>
                        <div class="protocol-box" id="actionVal">${data.neural_reset}</div>
                    </div>
                </div>
            </div>
        `;

        
        typeWriter(data.explanation, 'typeText');
        setTimeout(() => document.getElementById('resCard').classList.add('visible'), 400);
    } else {
        alert("데이터베이스에 없는 증상입니다. 'Anxiety'나 'Focus' 등을 입력해 보세요.");
    }
    inputField.value = '';
}


document.getElementById('sendBtn').addEventListener('click', runAnalysis);
document.getElementById('userInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') runAnalysis();
});
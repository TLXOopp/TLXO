let ClinicalData = {}; // 데이터 패키지가 로드될 빈 객체
let activeContext = "General";
let isTyping = false;
let typeTimeoutId = null;

// [cite: 2026-02-06] 외부 데이터 패키지(JSON) 로드 함수
async function loadDataPackage() {
    try {
        const response = await fetch('data.json');
        ClinicalData = await response.json();
        console.log("Neural data package loaded successfully.");
    } catch (error) {
        console.error("Failed to load data package:", error);
    }
}

loadDataPackage(); // 앱 시작 시 데이터 로드

function typeEffect(textNode, cursorNode, text, speed, callback) {
    let i = 0;
    textNode.textContent = "";
    cursorNode.style.display = "inline-block";
    function typing() {
        if (i < text.length) {
            textNode.textContent += text.charAt(i);
            i++;
            document.getElementById('displayArea').scrollTop = document.getElementById('displayArea').scrollHeight;
            typeTimeoutId = setTimeout(typing, speed);
        } else {
            isTyping = false;
            cursorNode.style.display = "none";
            if (callback) callback();
        }
    }
    typing();
}

document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
        document.querySelector('.chip.active').classList.remove('active');
        chip.classList.add('active');
        activeContext = chip.getAttribute('data-context');
    });
});

document.getElementById('sendBtn').addEventListener('click', () => {
    if (isTyping) { clearTimeout(typeTimeoutId); isTyping = false; }
    const inputStr = document.getElementById('userInput').value.toLowerCase().trim();
    const display = document.getElementById('displayArea');
    if (inputStr === "") return;

    let matchFound = false;
    for (let key in ClinicalData) {
        if (inputStr.includes(key)) {
            matchFound = true;
            isTyping = true;
            const dataSet = ClinicalData[key][activeContext] || ClinicalData[key]["General"];
            display.innerHTML = `<div class="diagnosis-text"><span id="typeText"></span><span id="typeCursor" class="cursor"></span></div>`;
            typeEffect(document.getElementById('typeText'), document.getElementById('typeCursor'), ClinicalData[key].diagnosis, 25, () => {
                const reportCard = document.createElement('div');
                reportCard.className = 'result-card';
                reportCard.innerHTML = `
                    <div class="result-title">NEURAL ANALYSIS SUMMARY</div>
                    <div class="data-row"><span>Pattern:</span> <span class="data-value">${key.toUpperCase()}</span></div>
                    <div class="data-row"><span>Mechanism:</span> <span class="data-value">${dataSet.mechanism}</span></div>
                    <div class="data-row"><span>Biomarker:</span> <span class="data-value" style="color:#ff6b6b;">${dataSet.metric}</span></div>
                    <div class="protocol-section"><div class="protocol-value">${dataSet.action}</div></div>
                `;
                display.appendChild(reportCard);
                setTimeout(() => { reportCard.classList.add('visible'); display.scrollTop = display.scrollHeight; }, 100);
            });
            break;
        }
    }
    if (!matchFound) display.innerHTML = `<div style="color:#ff6b6b; text-align:center;">No match. Check data.json.</div>`;
    document.getElementById('userInput').value = ''; 
});

document.getElementById('userInput').addEventListener('keypress', (e) => { if (e.key === 'Enter') document.getElementById('sendBtn').click(); });
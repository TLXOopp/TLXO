const ClinicalData = {
    "anxiety": {
        "diagnosis": "Based on the biological indicators, your amygdala is currently in a state of hyper-arousal, signaling a mismatch between environmental stimuli and your internal security baseline.",
        "General": { mechanism: "Amygdala hyper-responsivity", metric: "Cortisol baseline +40%", action: "Perform 3 sets of physiological sighs (2 inhales, 1 extended exhale)." },
        "Work": { mechanism: "Cognitive resources depletion", metric: "Noradrenaline surge", action: "Switch to panoramic vision for 2 minutes to inhibit the stress response." }
    },
    "burnout": {
        "diagnosis": "The neural system shows markers of chronic receptor saturation. Your dopamine circuitry is likely down-regulating to protect the prefrontal cortex from further exhaustion.",
        "General": { mechanism: "Dopamine system fatigue", metric: "D2 receptor availability -30%", action: "Immediate cessation of non-essential digital stimuli for 24-48 hours." }
    }
};

let activeContext = "General";
let isTyping = false;
let typeTimeoutId = null;

function typeEffect(textNode, cursorNode, text, speed, callback) {
    let i = 0;
    textNode.textContent = "";
    cursorNode.style.display = "inline-block";
    
    function typing() {
        if (i < text.length) {
            textNode.textContent += text.charAt(i);
            i++;
            // 자동 스크롤 하단 고정 기능 추가
            const displayArea = document.getElementById('displayArea');
            displayArea.scrollTop = displayArea.scrollHeight;
            
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
    if (isTyping) {
        clearTimeout(typeTimeoutId);
        isTyping = false;
    }

    const inputStr = document.getElementById('userInput').value.toLowerCase().trim();
    const display = document.getElementById('displayArea');
    
    if (inputStr === "") return;

    let matchFound = false;
    
    for (let key in ClinicalData) {
        if (inputStr.includes(key)) {
            matchFound = true;
            isTyping = true;
            
            const dataSet = ClinicalData[key][activeContext] || ClinicalData[key]["General"];
            const diagnosisText = ClinicalData[key].diagnosis;
            
            // 기존 웰컴 텍스트 삭제 및 결과창 주입
            display.innerHTML = `
                <div class="diagnosis-text">
                    <span id="typeText"></span><span id="typeCursor" class="cursor"></span>
                </div>
            `;
            
            const textNode = document.getElementById('typeText');
            const cursorNode = document.getElementById('typeCursor');
            
            typeEffect(textNode, cursorNode, diagnosisText, 25, () => {
                const reportCard = document.createElement('div');
                reportCard.className = 'result-card';
                reportCard.innerHTML = `
                    <div class="result-title">NEURAL ANALYSIS SUMMARY</div>
                    <div class="data-row"><span>Detected Pattern:</span> <span class="data-value">${key.toUpperCase()}</span></div>
                    <div class="data-row"><span>Mechanism:</span> <span class="data-value">${dataSet.mechanism}</span></div>
                    <div class="data-row"><span>Biomarker Estimation:</span> <span class="data-value" style="color:#ff6b6b;">${dataSet.metric}</span></div>
                    <div class="protocol-section">
                        <div class="protocol-label">Recommended Protocol:</div>
                        <div class="protocol-value">${dataSet.action}</div>
                    </div>
                `;
                display.appendChild(reportCard);
                setTimeout(() => {
                    reportCard.classList.add('visible');
                    display.scrollTop = display.scrollHeight; // 카드 등장 후 스크롤 하단 조정
                }, 100);
            });
            break;
        }
    }

    if (!matchFound) {
        display.innerHTML = `<div class="diagnosis-text" style="color:#ff6b6b; text-align:center;">Error: No baseline data matched.</div>`;
    }
    
    document.getElementById('userInput').value = ''; 
});

document.getElementById('userInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') document.getElementById('sendBtn').click();
});
// 수치 기반 생물학적 분석 데이터베이스
const ClinicalData = {
    "anxiety": {
        "diagnosis": "Your current neural patterns indicate a defensive state of the amygdala, often triggered by perceived threats in your environment.",
        "General": { mechanism: "Amygdala over-activation", metric: "Cortisol baseline +40%", action: "Physiological sigh (2 inhales, 1 exhale) for 3 minutes." },
        "Work": { mechanism: "Prefrontal cortex overload", metric: "Noradrenaline surge > 150pg/mL", action: "Visual field expansion (panoramic vision) to lower arousal." },
        "Social": { mechanism: "Attachment circuitry alert", metric: "Oxytocin depletion", action: "Low-stakes predictable social interaction." }
    },
    "burnout": {
        "diagnosis": "The system detects a significant down-regulation of dopamine receptors, suggesting a state of chronic exhaustion in the executive function circuits.",
        "General": { mechanism: "Dopamine pathway fatigue", metric: "Receptor availability -30%", action: "Absolute abstinence from high-dopamine triggers for 48 hours." },
        "Work": { mechanism: "Chronic stress adaptation failure", metric: "HPA axis dysregulation", action: "Strict disengagement from occupational stimuli post 18:00." }
    }
};

let activeContext = "General";

document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
        document.querySelector('.chip.active').classList.remove('active');
        chip.classList.add('active');
        activeContext = chip.getAttribute('data-context');
    });
});

document.getElementById('sendBtn').addEventListener('click', () => {
    const inputStr = document.getElementById('userInput').value.toLowerCase().trim();
    const display = document.getElementById('displayArea');
    
    if (inputStr === "") return;

    let matchFound = false;
    
    for (let key in ClinicalData) {
        if (inputStr.includes(key)) {
            matchFound = true;
            // 예외 처리: 특정 context 데이터가 없을 경우 General 데이터로 대체
            const dataSet = ClinicalData[key][activeContext] || ClinicalData[key]["General"];
            const diagnosisText = ClinicalData[key].diagnosis;
            
            display.innerHTML = `
                <div class="diagnosis-text">
                    ${diagnosisText}
                </div>
                <div class="result-card">
                    <div class="result-title">System Analysis Summary</div>
                    <div class="data-row"><span>Input Pattern:</span> <span class="data-value">${key.toUpperCase()}</span></div>
                    <div class="data-row"><span>Context Vector:</span> <span class="data-value">${activeContext.toUpperCase()}</span></div>
                    <div class="data-row"><span>Neural Mechanism:</span> <span class="data-value">${dataSet.mechanism}</span></div>
                    <div class="data-row"><span>Estimated Biomarker:</span> <span class="data-value" style="color:#ff6b6b;">${dataSet.metric}</span></div>
                    <div class="protocol-section">
                        <div class="protocol-label">Recommended Protocol:</div>
                        <div class="protocol-value">${dataSet.action}</div>
                    </div>
                </div>
            `;
            break;
        }
    }

    if (!matchFound) {
        display.innerHTML = `
            <div class="diagnosis-text" style="color:#ff6b6b; font-size: 1.1rem; text-align: center;">
                Error: Insufficient data points. Please provide specific behavioral or emotional keywords.
            </div>
        `;
    }
    
    document.getElementById('userInput').value = ''; 
});

// 엔터 키 입력 지원 추가
document.getElementById('userInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        document.getElementById('sendBtn').click();
    }
});
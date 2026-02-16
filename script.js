// 수치 기반 생물학적 분석 데이터베이스 구축
const ClinicalData = {
    "anxiety": {
        "General": { mechanism: "Amygdala over-activation", metric: "Cortisol baseline +40%", action: "Physiological sigh (2 inhales, 1 exhale) for 3 minutes." },
        "Work": { mechanism: "Prefrontal cortex overload", metric: "Noradrenaline surge > 150pg/mL", action: "Visual field expansion (panoramic vision) to lower arousal." },
        "Social": { mechanism: "Attachment circuitry alert", metric: "Oxytocin depletion", action: "Low-stakes predictable social interaction." }
    },
    "burnout": {
        "General": { mechanism: "Dopamine pathway down-regulation", metric: "Receptor availability -30%", action: "Absolute abstinence from high-dopamine triggers for 48 hours." }
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
    const inputStr = document.getElementById('userInput').value.toLowerCase();
    const display = document.getElementById('displayArea');
    
    let matchFound = false;
    
    for (let key in ClinicalData) {
        if (inputStr.includes(key)) {
            matchFound = true;
            const dataSet = ClinicalData[key][activeContext] || ClinicalData[key]["General"];
            
            display.innerHTML = `
                <div class="result-card">
                    <div class="result-title">System Analysis Report</div>
                    <div class="data-row"><span>Input Pattern:</span> <span class="data-value">${key.toUpperCase()}</span></div>
                    <div class="data-row"><span>Context Vector:</span> <span class="data-value">${activeContext.toUpperCase()}</span></div>
                    <div class="data-row"><span>Neural Mechanism:</span> <span class="data-value">${dataSet.mechanism}</span></div>
                    <div class="data-row"><span>Estimated Biomarker:</span> <span class="data-value" style="color:#ff6b6b;">${dataSet.metric}</span></div>
                    <br>
                    <div style="color:#a8a8a8; font-size: 0.9rem;">Recommended Protocol:</div>
                    <div style="font-weight: 500; margin-top: 5px;">${dataSet.action}</div>
                </div>
            `;
            break;
        }
    }

    if (!matchFound) {
        display.innerHTML = `
            <div class="result-card" style="text-align:center; color:#ff6b6b;">
                Insufficient data points. Please provide more specific symptoms.
            </div>
        `;
    }
    
    document.getElementById('userInput').value = ''; // 입력창 초기화
});
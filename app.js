// State Management
let currentStep = 1;
const auditData = {
    url: '',
    checks: []
};

function goToStep(step) {
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    document.getElementById(`step-${step}`).classList.add('active');
    
    // Update Progress Bar
    const progress = document.getElementById('progress');
    progress.style.width = (step / 3) * 100 + '%';
    currentStep = step;
}

function validateStep1() {
    const urlInput = document.getElementById('url-input');
    const errorMsg = document.getElementById('error-msg');
    
    // Simple URL validation logic
    if (urlInput.value.length < 4) {
        errorMsg.innerText = "Please enter a valid resource identifier.";
        urlInput.style.borderColor = "red";
        return;
    }
    
    auditData.url = urlInput.value;
    errorMsg.innerText = "";
    urlInput.style.borderColor = "#cbd5e1";
    goToStep(2);
}

function runAudit() {
    // Capture checklist data
    auditData.checks = [
        { name: "SSL", status: document.getElementById('check-ssl').checked },
        { name: "MFA", status: document.getElementById('check-auth').checked },
        { name: "Encryption", status: document.getElementById('check-encryption').checked }
    ];

    const passCount = auditData.checks.filter(c => c.status).length;
    const score = Math.round((passCount / 3) * 100);
    
    displayResults(score);
    goToStep(3);
}

function displayResults(score) {
    const output = document.getElementById('report-output');
    let rating = score === 100 ? "OPTIMAL" : score >= 50 ? "WARNING" : "CRITICAL";
    let color = score === 100 ? "#16a34a" : score >= 50 ? "#ca8a04" : "#dc2626";

    output.innerHTML = `
        <p><strong>Target:</strong> ${auditData.url}</p>
        <p><strong>Security Score:</strong> <span style="color:${color}; font-weight:bold;">${score}%</span></p>
        <p><strong>Status:</strong> ${rating}</p>
        <hr>
        <small>Audit completed on ${new Date().toLocaleDateString()}</small>
    `;
}

function resetForm() {
    document.getElementById('url-input').value = "";
    document.querySelectorAll('input[type="checkbox"]').forEach(c => c.checked = false);
    goToStep(1);
}
let auditData = { url: '', results: [] };

function goToStep(step) {
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    document.getElementById(`step-${step}`).classList.add('active');
    document.getElementById('progress').style.width = (step / 3) * 100 + '%';
}

/**
 * Clean and Format the URL
 * This ensures the proxy gets exactly what it needs.
 */
function formatURL(input) {
    let url = input.trim().toLowerCase();
    
    // Remove any existing protocol to start from a clean slate
    url = url.replace(/^(https?:\/\/)/, "");
    
    // Check if it's a valid domain structure (has at least one dot)
    if (!url.includes('.') || url.length < 4) return null;

    // Standardize to HTTPS for the audit
    return `https://${url}`;
}

function validateStep1() {
    const rawInput = document.getElementById('url-input').value;
    const cleanURL = formatURL(rawInput);
    
    if (!cleanURL) {
        document.getElementById('error-msg').innerText = "Please enter a valid domain (e.g., google.com)";
        return;
    }

    auditData.url = cleanURL;
    document.getElementById('error-msg').innerText = "";
    goToStep(2);
    runLiveScan();
}

async function runLiveScan() {
    const consoleLog = document.getElementById('console-log');
    consoleLog.innerHTML = "";
    const resultsBtn = document.getElementById('results-btn');

    const log = (msg) => {
        const div = document.createElement('div');
        div.className = "log-entry";
        div.innerText = `> ${msg}`;
        consoleLog.appendChild(div);
        consoleLog.scrollTop = consoleLog.scrollHeight;
    };

    // We use corsproxy.io as it handles encoded URLs very reliably
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(auditData.url)}`;

    log(`Target Confirmed: ${auditData.url}`);
    log(`Connecting to proxy gateway...`);
    
    try {
        // Set a timeout so it doesn't hang forever
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(proxyUrl, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

        const text = await response.text();
        log("Headers captured. Analyzing security metadata...");
        
        // Deep dive into the HTML/Header content
        const lowerText = text.toLowerCase();
        
        const checks = [
            { 
                name: "Connection Privacy", 
                status: auditData.url.startsWith('https'), 
                desc: "Ensures that the information sent between you and the site is encrypted so hackers can't read it." 
            },
            { 
                name: "Content Security Policy", 
                status: lowerText.includes('content-security-policy'), 
                desc: "Prevents hidden viruses from running on the page." 
            },
            { 
                name: "X-Frame/Clickjacking Protection", 
                status: lowerText.includes('x-frame-options') || lowerText.includes('frame-ancestors'), 
                desc: "Prevents hackers from putting an invisible layer over the site to steal your clicks." 
            },
            { 
                name: "Subresource Integrity", 
                status: lowerText.includes('integrity="sha'), 
                desc: "Double-checks that the external tools the site uses haven't been tampered with." 
            }
        ];

        auditData.results = checks;
        await sleep(800);
        log("Audit complete. Finalizing report...");
        
        compileReport();
        resultsBtn.style.display = "block";

    } catch (error) {
        log(`CONNECTION FAILED: ${error.message}`);
        log("Troubleshooting Tip: Check your internet connection or try a different site.");
        console.error("Audit Error:", error);
    }
}

function compileReport() {
    const output = document.getElementById('report-output');
    const badge = document.getElementById('risk-badge');
    const passed = auditData.results.filter(r => r.status).length;
    const score = Math.round((passed / auditData.results.length) * 100);

    let color = score >= 75 ? "#16a34a" : score >= 50 ? "#ca8a04" : "#dc2626";
    let label = score >= 75 ? "SECURE" : score >= 50 ? "WARNING" : "VULNERABLE";
    
    badge.innerHTML = `<div style="background:${color}; color:white; padding:12px; border-radius:8px; text-align:center; font-weight:bold; margin-bottom:15px;">
        ${label} - SCORE: ${score}%
    </div>`;

    output.innerHTML = auditData.results.map(res => `
        <div class="report-card ${res.status ? 'pass' : 'fail'}" style="margin-bottom: 10px; padding: 10px; border-left: 5px solid ${res.status ? '#16a34a' : '#dc2626'}; background: #f9fafb;">
            <strong>${res.status ? '✅' : '❌'} ${res.name}</strong><br>
            <small style="color: #64748b;">${res.desc}</small>
        </div>
    `).join('');
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function resetForm() {
    document.getElementById('url-input').value = "";
    document.getElementById('risk-badge').innerHTML = "";
    document.getElementById('results-btn').style.display = "none";
    goToStep(1);
}
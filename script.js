// Application State
const appState = {
    threats: [],
    scans: [],
    logs: [],
    notifications: [],
    reports: [],
    networkHosts: [],
    intelFeed: [],
    settings: {
        theme: 'dark',
        notifications: true,
        soundAlerts: true,
        autoScanInterval: 30,
        deepScan: false
    },
    stats: {
        threatCount: 0,
        safeCount: 0,
        scanCount: 0,
        riskScore: 0
    },
    chart: null,
    pieChart: null
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    initializeDashboard();
    initializeDetector();
    initializeNetworkScanner();
    initializeThreatIntelligence();
    initializeReports();
    initializeAnalysis();
    initializeLogs();
    initializeNotifications();
    initializeSettings();
    startRealTimeUpdates();
    loadSampleData();
    loadSettings();
});

// Navigation
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            
            // Update active states
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            sections.forEach(s => s.classList.remove('active'));
            document.getElementById(targetId).classList.add('active');
            
            // Close mobile menu
            navMenu.classList.remove('active');
        });
    });

    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Dashboard Functions
function initializeDashboard() {
    updateStats();
    initializeChart();
    initializePieChart();
    initializeMiniCharts();
    updateRecentThreats();
    initializeQuickActions();
    initializeMapControls();
}

function initializeMapControls() {
    const mapControls = document.querySelectorAll('.map-control-btn');
    mapControls.forEach(btn => {
        btn.addEventListener('click', () => {
            mapControls.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const view = btn.dataset.view;
            // In a real app, this would change the map view
            showNotification(`Map view changed to ${view}`, 'info');
        });
    });
}

function initializeQuickActions() {
    document.querySelectorAll('.action-card').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            const navLink = document.querySelector(`[href="#${action}"]`);
            if (navLink) {
                navLink.click();
            }
        });
    });
}

function updateStats() {
    // Animate numbers
    animateValue('threat-count', appState.stats.threatCount, 0, 1000);
    animateValue('safe-count', appState.stats.safeCount, 0, 1000);
    animateValue('scan-count', appState.stats.scanCount, 0, 1000);
    
    const riskScoreEl = document.getElementById('risk-score');
    if (riskScoreEl) {
        animateValue('risk-score', appState.stats.riskScore, 0, 1000, '%');
    }

    // Update risk meter
    const meterFill = document.getElementById('risk-meter-fill');
    if (meterFill) {
        const rotation = (appState.stats.riskScore / 100) * 360;
        meterFill.style.transform = `rotate(${rotation}deg)`;
    }
}

function animateValue(id, end, start = 0, duration = 1000, suffix = '') {
    const element = document.getElementById(id);
    if (!element) return;

    const startValue = parseInt(element.textContent.replace(/[^0-9]/g, '')) || start;
    const range = end - startValue;
    const increment = range / (duration / 16);
    let current = startValue;

    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.round(current) + suffix;
    }, 16);
}

function initializeChart() {
    const ctx = document.getElementById('threatChart');
    if (!ctx) return;

    appState.chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: generateTimeLabels(24),
            datasets: [{
                label: 'Threats Detected',
                data: generateSampleChartData(24),
                borderColor: '#ff4444',
                backgroundColor: 'rgba(255, 68, 68, 0.1)',
                tension: 0.4,
                fill: true,
                borderWidth: 3,
                pointRadius: 4,
                pointHoverRadius: 6
            }, {
                label: 'Safe Scans',
                data: generateSampleChartData(24),
                borderColor: '#00ff88',
                backgroundColor: 'rgba(0, 255, 136, 0.1)',
                tension: 0.4,
                fill: true,
                borderWidth: 3,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#a0aec0',
                        usePointStyle: true,
                        padding: 15
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(20, 27, 45, 0.95)',
                    titleColor: '#ffffff',
                    bodyColor: '#a0aec0',
                    borderColor: '#1e293b',
                    borderWidth: 1,
                    padding: 12
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#a0aec0'
                    },
                    grid: {
                        color: 'rgba(30, 41, 59, 0.5)'
                    }
                },
                y: {
                    ticks: {
                        color: '#a0aec0'
                    },
                    grid: {
                        color: 'rgba(30, 41, 59, 0.5)'
                    }
                }
            }
        }
    });

    // Chart period buttons
    document.querySelectorAll('.chart-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.chart-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const period = btn.dataset.period;
            updateChartPeriod(period);
        });
    });
}

function initializePieChart() {
    const ctx = document.getElementById('threatPieChart');
    if (!ctx) return;

    appState.pieChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Malware', 'Phishing', 'DDoS', 'Ransomware', 'SQL Injection', 'XSS'],
            datasets: [{
                data: [25, 20, 15, 15, 12, 13],
                backgroundColor: [
                    '#ff4444',
                    '#ffaa00',
                    '#ff6666',
                    '#cc0000',
                    '#ff8800',
                    '#ffbb33'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#a0aec0',
                        padding: 10,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(20, 27, 45, 0.95)',
                    titleColor: '#ffffff',
                    bodyColor: '#a0aec0',
                    borderColor: '#1e293b',
                    borderWidth: 1
                }
            }
        }
    });
}

function initializeMiniCharts() {
    // Mini charts for stat cards
    const miniCharts = ['threat-mini-chart', 'safe-mini-chart', 'scan-mini-chart'];
    miniCharts.forEach((id, index) => {
        const ctx = document.getElementById(id);
        if (!ctx) return;

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array.from({length: 7}, (_, i) => ''),
                datasets: [{
                    data: generateSampleChartData(7),
                    borderColor: index === 1 ? '#00ff88' : '#00d4ff',
                    backgroundColor: 'transparent',
                    tension: 0.4,
                    borderWidth: 2,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                },
                scales: {
                    x: { display: false },
                    y: { display: false }
                }
            }
        });
    });
}

function updateChartPeriod(period) {
    if (!appState.chart) return;
    
    let labels, dataPoints;
    if (period === '24h') {
        labels = generateTimeLabels(24);
        dataPoints = 24;
    } else if (period === '7d') {
        labels = Array.from({length: 7}, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            return date.toLocaleDateString('en-US', { weekday: 'short' });
        });
        dataPoints = 7;
    } else if (period === '30d') {
        labels = Array.from({length: 30}, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (29 - i));
            return date.getDate();
        });
        dataPoints = 30;
    } else {
        return; // Invalid period
    }

    appState.chart.data.labels = labels;
    appState.chart.data.datasets[0].data = generateSampleChartData(dataPoints);
    appState.chart.data.datasets[1].data = generateSampleChartData(dataPoints);
    appState.chart.update();
}

function generateTimeLabels(hours) {
    const labels = [];
    const now = new Date();
    for (let i = hours - 1; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 60 * 1000);
        labels.push(time.getHours().toString().padStart(2, '0') + ':00');
    }
    return labels;
}

function generateSampleChartData(count) {
    return Array.from({ length: count }, () => Math.floor(Math.random() * 20));
}

function updateRecentThreats() {
    const container = document.getElementById('recent-threats-list');
    if (!container) return;

    const recentThreats = appState.threats.slice(-5).reverse();
    
    if (recentThreats.length === 0) {
        container.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 2rem;">No recent threats detected</p>';
        return;
    }

    container.innerHTML = recentThreats.map(threat => `
        <div class="threat-item">
            <div class="threat-info">
                <h4>${threat.type}</h4>
                <p>${threat.source} • ${formatTime(threat.timestamp)}</p>
            </div>
            <span class="threat-severity ${threat.severity}">${threat.severity.toUpperCase()}</span>
        </div>
    `).join('');

    updateThreatTimeline();
    updateGeographicMap();
}

// Geographic Map Functions
function updateGeographicMap() {
    const container = document.getElementById('threat-markers');
    if (!container) return;

    // Clear existing markers
    container.innerHTML = '';

    // Sample geographic threat data with coordinates
    const geographicThreats = [
        { lat: 40.7128, lng: -74.0060, severity: 'critical', type: 'Malware', country: 'USA', count: 5 },
        { lat: 51.5074, lng: -0.1278, severity: 'high', type: 'Phishing', country: 'UK', count: 3 },
        { lat: 35.6762, lng: 139.6503, severity: 'high', type: 'DDoS', country: 'Japan', count: 4 },
        { lat: 52.5200, lng: 13.4050, severity: 'medium', type: 'Ransomware', country: 'Germany', count: 2 },
        { lat: -33.8688, lng: 151.2093, severity: 'medium', type: 'XSS', country: 'Australia', count: 2 },
        { lat: 55.7558, lng: 37.6173, severity: 'critical', type: 'SQL Injection', country: 'Russia', count: 6 },
        { lat: 39.9042, lng: 116.4074, severity: 'high', type: 'Malware', country: 'China', count: 4 },
        { lat: -22.9068, lng: -43.1729, severity: 'low', type: 'Phishing', country: 'Brazil', count: 1 },
        { lat: 28.6139, lng: 77.2090, severity: 'medium', type: 'DDoS', country: 'India', count: 3 },
        { lat: 48.8566, lng: 2.3522, severity: 'high', type: 'Ransomware', country: 'France', count: 3 }
    ];

    // Convert lat/lng to map coordinates (simplified projection)
    geographicThreats.forEach(threat => {
        const x = ((threat.lng + 180) / 360) * 100;
        const y = ((90 - threat.lat) / 180) * 100;
        
        const marker = document.createElement('div');
        marker.className = `threat-marker ${threat.severity}`;
        marker.style.left = `${x}%`;
        marker.style.top = `${y}%`;
        marker.title = `${threat.type} - ${threat.count} threats in ${threat.country}`;
        
        // Add tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'threat-marker-tooltip';
        tooltip.innerHTML = `
            <strong>${threat.country}</strong><br>
            ${threat.type}: ${threat.count} threats<br>
            <span class="threat-severity ${threat.severity}">${threat.severity.toUpperCase()}</span>
        `;
        marker.appendChild(tooltip);
        
        // Add click handler
        marker.addEventListener('click', () => {
            showNotification(`Viewing threats from ${threat.country}: ${threat.count} ${threat.type} threats`, 'info');
        });
        
        container.appendChild(marker);
    });

    // Update map statistics
    updateMapStatistics(geographicThreats);
}

function updateMapStatistics(threats) {
    const totalThreats = threats.reduce((sum, t) => sum + t.count, 0);
    const countries = new Set(threats.map(t => t.country)).size;
    const regions = Math.ceil(countries / 3); // Simplified region calculation
    
    document.getElementById('map-threat-count').textContent = totalThreats;
    document.getElementById('map-countries-count').textContent = countries;
    document.getElementById('map-regions-count').textContent = regions;

    // Update legend counts
    const severityCounts = {
        critical: threats.filter(t => t.severity === 'critical').reduce((sum, t) => sum + t.count, 0),
        high: threats.filter(t => t.severity === 'high').reduce((sum, t) => sum + t.count, 0),
        medium: threats.filter(t => t.severity === 'medium').reduce((sum, t) => sum + t.count, 0),
        low: threats.filter(t => t.severity === 'low').reduce((sum, t) => sum + t.count, 0)
    };

    document.getElementById('legend-critical').textContent = `(${severityCounts.critical})`;
    document.getElementById('legend-high').textContent = `(${severityCounts.high})`;
    document.getElementById('legend-medium').textContent = `(${severityCounts.medium})`;
    document.getElementById('legend-low').textContent = `(${severityCounts.low})`;
}

function getSeverityColor(severity) {
    const colors = {
        critical: 'var(--danger-color)',
        high: 'var(--warning-color)',
        medium: '#ffaa00',
        low: 'var(--primary-color)'
    };
    return colors[severity] || colors.low;
}

// Threat Detector Functions
function initializeDetector() {
    const scanBtn = document.getElementById('scan-btn');
    const urlInput = document.getElementById('url-input');
    const fileInput = document.getElementById('file-input');
    const textInput = document.getElementById('text-input');
    const fileName = document.getElementById('file-name');

    scanBtn.addEventListener('click', handleScan);

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            fileName.textContent = e.target.files[0].name;
        } else {
            fileName.textContent = '';
        }
    });

    // Allow Enter key to trigger scan
    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleScan();
    });

    initializeBulkScan();
}

async function handleScan() {
    const urlInput = document.getElementById('url-input').value.trim();
    const fileInput = document.getElementById('file-input').files[0];
    const textInput = document.getElementById('text-input').value.trim();
    const scanStatus = document.getElementById('scan-status');
    const scanResults = document.getElementById('scan-results');
    const loadingOverlay = document.getElementById('loading-overlay');

    // Validate input
    if (!urlInput && !fileInput && !textInput) {
        showNotification('Please provide URL, file, or text to scan', 'warning');
        return;
    }

    // Show loading
    loadingOverlay.classList.add('active');
    scanStatus.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Scanning for threats...</span>';

    try {
        let scanResult;
        
        if (urlInput) {
            scanResult = await scanURL(urlInput);
        } else if (fileInput) {
            scanResult = await scanFile(fileInput);
        } else if (textInput) {
            scanResult = await scanText(textInput);
        }

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        displayScanResults(scanResult);
        updateStatsAfterScan(scanResult);
        addLog('info', `Scan completed: ${scanResult.type} - ${scanResult.status}`);

    } catch (error) {
        scanStatus.innerHTML = `<i class="fas fa-exclamation-circle"></i> <span>Error: ${error.message}</span>`;
        addLog('error', `Scan failed: ${error.message}`);
    } finally {
        loadingOverlay.classList.remove('active');
    }
}

async function scanURL(url) {
    // Simulate AI threat detection
    const threats = detectThreatsInURL(url);
    
    return {
        type: 'URL Scan',
        target: url,
        status: threats.length > 0 ? 'threat' : 'safe',
        threats: threats,
        timestamp: new Date()
    };
}

async function scanFile(file) {
    // Simulate file analysis
    const threats = detectThreatsInFile(file);
    
    return {
        type: 'File Scan',
        target: file.name,
        status: threats.length > 0 ? 'threat' : 'safe',
        threats: threats,
        timestamp: new Date()
    };
}

async function scanText(text) {
    // Simulate text/code analysis
    const threats = detectThreatsInText(text);
    
    return {
        type: 'Text Analysis',
        target: 'Code/Text Input',
        status: threats.length > 0 ? 'threat' : 'safe',
        threats: threats,
        timestamp: new Date()
    };
}

function detectThreatsInURL(url) {
    const threats = [];
    const suspiciousPatterns = [
        { pattern: /\.(exe|bat|cmd|scr)$/i, type: 'Malware', severity: 'critical' },
        { pattern: /bit\.ly|tinyurl|goo\.gl/i, type: 'Phishing', severity: 'high' },
        { pattern: /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/, type: 'Suspicious IP', severity: 'medium' },
        { pattern: /javascript:|onclick=|onerror=/i, type: 'XSS Attack', severity: 'high' },
        { pattern: /union.*select|drop.*table/i, type: 'SQL Injection', severity: 'critical' }
    ];

    suspiciousPatterns.forEach(({ pattern, type, severity }) => {
        if (pattern.test(url)) {
            threats.push({
                type,
                severity,
                description: `Detected ${type.toLowerCase()} pattern in URL`,
                recommendation: getRecommendation(type)
            });
        }
    });

    return threats;
}

function detectThreatsInFile(file) {
    const threats = [];
    const extension = file.name.split('.').pop().toLowerCase();
    
    const dangerousExtensions = ['exe', 'bat', 'cmd', 'scr', 'vbs', 'js'];
    if (dangerousExtensions.includes(extension)) {
        threats.push({
            type: 'Malware',
            severity: 'high',
            description: `File extension .${extension} is potentially dangerous`,
            recommendation: 'Scan file with antivirus before opening'
        });
    }

    // Simulate file size check
    if (file.size > 100 * 1024 * 1024) { // 100MB
        threats.push({
            type: 'Suspicious File Size',
            severity: 'medium',
            description: 'File size exceeds normal limits',
            recommendation: 'Verify file source and contents'
        });
    }

    return threats;
}

function detectThreatsInText(text) {
    const threats = [];
    
    const threatPatterns = [
        { pattern: /eval\(|exec\(|system\(/i, type: 'Code Injection', severity: 'critical' },
        { pattern: /<script|javascript:|onerror=/i, type: 'XSS Attack', severity: 'high' },
        { pattern: /union.*select|drop.*table|delete.*from/i, type: 'SQL Injection', severity: 'critical' },
        { pattern: /password\s*=\s*["'][^"']+["']/i, type: 'Hardcoded Credentials', severity: 'high' },
        { pattern: /api[_-]?key\s*=\s*["'][^"']+["']/i, type: 'Exposed API Key', severity: 'high' },
        { pattern: /\.env|config\.json.*password/i, type: 'Sensitive Data Exposure', severity: 'medium' }
    ];

    threatPatterns.forEach(({ pattern, type, severity }) => {
        if (pattern.test(text)) {
            threats.push({
                type,
                severity,
                description: `Detected ${type.toLowerCase()} pattern in code/text`,
                recommendation: getRecommendation(type)
            });
        }
    });

    return threats;
}

function getRecommendation(type) {
    const recommendations = {
        'Malware': 'Do not download or execute this file. Scan with antivirus software.',
        'Phishing': 'Do not click this link. Verify the source before accessing.',
        'XSS Attack': 'Sanitize user input and use Content Security Policy headers.',
        'SQL Injection': 'Use parameterized queries and input validation.',
        'Code Injection': 'Avoid using eval() or similar functions. Use safer alternatives.',
        'Hardcoded Credentials': 'Move credentials to environment variables or secure vault.',
        'Exposed API Key': 'Rotate the API key immediately and use environment variables.',
        'Suspicious IP': 'Verify the IP address source and check against threat intelligence databases.'
    };
    return recommendations[type] || 'Review and verify the detected threat.';
}

function displayScanResults(result) {
    const scanStatus = document.getElementById('scan-status');
    const scanResults = document.getElementById('scan-results');

    if (result.status === 'safe') {
        scanStatus.innerHTML = '<i class="fas fa-check-circle"></i> <span style="color: var(--success-color);">No threats detected. Target appears safe.</span>';
        scanResults.innerHTML = `
            <div class="result-item safe">
                <div class="result-header">
                    <div class="result-title" style="color: var(--success-color);">✓ Safe</div>
                </div>
                <div class="result-details">
                    <p><strong>Target:</strong> ${result.target}</p>
                    <p><strong>Scan Type:</strong> ${result.type}</p>
                    <p><strong>Time:</strong> ${formatTime(result.timestamp)}</p>
                </div>
            </div>
        `;
    } else {
        scanStatus.innerHTML = '<i class="fas fa-exclamation-triangle"></i> <span style="color: var(--danger-color);">Threats detected! Review results below.</span>';
        scanResults.innerHTML = result.threats.map(threat => `
            <div class="result-item threat">
                <div class="result-header">
                    <div class="result-title" style="color: var(--danger-color);">⚠ ${threat.type}</div>
                    <span class="threat-severity ${threat.severity}">${threat.severity.toUpperCase()}</span>
                </div>
                <div class="result-details">
                    <p><strong>Description:</strong> ${threat.description}</p>
                    <p><strong>Recommendation:</strong> ${threat.recommendation}</p>
                </div>
            </div>
        `).join('');

        // Add to threats list
        result.threats.forEach(threat => {
            appState.threats.push({
                ...threat,
                source: result.target,
                timestamp: result.timestamp
            });
        });
    }
}

function updateStatsAfterScan(result) {
    appState.stats.scanCount++;
    
    if (result.status === 'safe') {
        appState.stats.safeCount++;
    } else {
        appState.stats.threatCount += result.threats.length;
    }

    // Calculate risk score
    const totalScans = appState.stats.scanCount;
    const threatRate = (appState.stats.threatCount / totalScans) * 100;
    appState.stats.riskScore = Math.min(100, Math.round(threatRate * 10));

    updateStats();
    updateRecentThreats();
    updateChart();
}

// Analysis Functions
function initializeAnalysis() {
    updateAnalysisTable();
    
    document.getElementById('threat-type-filter').addEventListener('change', updateAnalysisTable);
    document.getElementById('severity-filter').addEventListener('change', updateAnalysisTable);
    document.getElementById('date-filter').addEventListener('change', updateAnalysisTable);
}

function updateAnalysisTable() {
    const tbody = document.getElementById('analysis-table-body');
    if (!tbody) return;

    const typeFilter = document.getElementById('threat-type-filter').value;
    const severityFilter = document.getElementById('severity-filter').value;
    const dateFilter = document.getElementById('date-filter').value;

    let filteredThreats = [...appState.threats];

    if (typeFilter !== 'all') {
        filteredThreats = filteredThreats.filter(t => t.type.toLowerCase().includes(typeFilter.toLowerCase()));
    }

    if (severityFilter !== 'all') {
        filteredThreats = filteredThreats.filter(t => t.severity === severityFilter);
    }

    if (dateFilter) {
        const filterDate = new Date(dateFilter);
        filteredThreats = filteredThreats.filter(t => {
            const threatDate = new Date(t.timestamp);
            return threatDate.toDateString() === filterDate.toDateString();
        });
    }

    if (filteredThreats.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-secondary);">No threats found matching filters</td></tr>';
        return;
    }

    tbody.innerHTML = filteredThreats.reverse().map(threat => `
        <tr>
            <td>${formatTime(threat.timestamp)}</td>
            <td>${threat.type}</td>
            <td>${threat.source || 'N/A'}</td>
            <td><span class="threat-severity ${threat.severity}">${threat.severity.toUpperCase()}</span></td>
            <td><span class="status-badge active">Active</span></td>
            <td>
                <button class="action-btn" onclick="viewThreatDetails('${threat.type}')">
                    <i class="fas fa-eye"></i> View
                </button>
            </td>
        </tr>
    `).join('');
}

function viewThreatDetails(threatType) {
    const threat = appState.threats.find(t => t.type === threatType);
    if (!threat) return;

    const modal = document.getElementById('alert-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');

    modalTitle.textContent = threat.type;
    modalBody.innerHTML = `
        <div style="margin-bottom: 1rem;">
            <strong>Severity:</strong> <span class="threat-severity ${threat.severity}">${threat.severity.toUpperCase()}</span>
        </div>
        <div style="margin-bottom: 1rem;">
            <strong>Source:</strong> ${threat.source || 'N/A'}
        </div>
        <div style="margin-bottom: 1rem;">
            <strong>Time:</strong> ${formatTime(threat.timestamp)}
        </div>
        <div style="margin-bottom: 1rem;">
            <strong>Description:</strong><br>
            ${threat.description}
        </div>
        <div>
            <strong>Recommendation:</strong><br>
            ${threat.recommendation}
        </div>
    `;

    modal.classList.add('active');
}

// Logs Functions
function initializeLogs() {
    document.getElementById('clear-logs-btn').addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all logs?')) {
            appState.logs = [];
            updateLogsView();
        }
    });

    document.getElementById('export-logs-btn').addEventListener('click', exportLogs);
    document.getElementById('log-search').addEventListener('input', updateLogsView);

    // Add initial log
    addLog('info', 'System initialized');
}

function addLog(level, message) {
    const logEntry = {
        timestamp: new Date(),
        level,
        message
    };
    appState.logs.push(logEntry);
    updateLogsView();
}

function updateLogsView() {
    const logsView = document.getElementById('logs-view');
    if (!logsView) return;

    const searchTerm = document.getElementById('log-search').value.toLowerCase();
    let filteredLogs = appState.logs;

    if (searchTerm) {
        filteredLogs = filteredLogs.filter(log => 
            log.message.toLowerCase().includes(searchTerm) ||
            log.level.toLowerCase().includes(searchTerm)
        );
    }

    if (filteredLogs.length === 0) {
        logsView.innerHTML = '<p style="text-align: center; padding: 2rem; color: var(--text-secondary);">No logs found</p>';
        return;
    }

    logsView.innerHTML = filteredLogs.reverse().map(log => `
        <div class="log-entry">
            <span class="log-time">${formatTime(log.timestamp)}</span>
            <span class="log-level ${log.level}">[${log.level.toUpperCase()}]</span>
            <span class="log-message">${escapeHtml(log.message)}</span>
        </div>
    `).join('');
}

function exportLogs() {
    const logsText = appState.logs.map(log => 
        `[${formatTime(log.timestamp)}] [${log.level.toUpperCase()}] ${log.message}`
    ).join('\n');

    const blob = new Blob([logsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `security-logs-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    addLog('info', 'Logs exported successfully');
}

// Modal Functions
document.querySelector('.close-modal').addEventListener('click', () => {
    document.getElementById('alert-modal').classList.remove('active');
});

document.getElementById('modal-close-btn').addEventListener('click', () => {
    document.getElementById('alert-modal').classList.remove('active');
});

document.getElementById('modal-action-btn').addEventListener('click', () => {
    addLog('info', 'Action taken on threat');
    document.getElementById('alert-modal').classList.remove('active');
    showNotification('Action taken successfully', 'success');
});

// Utility Functions
function formatTime(date) {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    return date.toLocaleString();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showNotification(message, type = 'info') {
    // Simple notification system
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? 'var(--success-color)' : type === 'warning' ? 'var(--warning-color)' : 'var(--primary-color)'};
        color: white;
        border-radius: 8px;
        box-shadow: var(--shadow-lg);
        z-index: 4000;
        animation: slideInRight 0.3s;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Real-time Updates
function startRealTimeUpdates() {
    // Simulate real-time threat detection
    setInterval(() => {
        if (Math.random() > 0.95) { // 5% chance every interval
            simulateRandomThreat();
        }
    }, 10000); // Check every 10 seconds

    // Update chart periodically
    setInterval(() => {
        updateChart();
    }, 30000); // Update every 30 seconds
}

function simulateRandomThreat() {
    const threatTypes = ['Malware', 'Phishing', 'DDoS', 'Ransomware', 'SQL Injection', 'XSS'];
    const severities = ['low', 'medium', 'high', 'critical'];
    const sources = ['192.168.1.100', 'example.com', 'suspicious-file.exe', 'malicious-url.com'];

    const threat = {
        type: threatTypes[Math.floor(Math.random() * threatTypes.length)],
        severity: severities[Math.floor(Math.random() * severities.length)],
        source: sources[Math.floor(Math.random() * sources.length)],
        timestamp: new Date(),
        description: 'Automated threat detection system alert',
        recommendation: 'Review and investigate immediately'
    };

    appState.threats.push(threat);
    appState.stats.threatCount++;
    updateStats();
    updateRecentThreats();
    updateAnalysisTable();
    addLog('warning', `Threat detected: ${threat.type} from ${threat.source}`);
    
    showNotification(`New threat detected: ${threat.type}`, 'warning');
}

function updateChart() {
    if (!appState.chart) return;

    const newData = generateSampleChartData(24);
    appState.chart.data.datasets[0].data = newData;
    appState.chart.data.datasets[1].data = generateSampleChartData(24);
    appState.chart.update('none');
}

// Sample Data Loading
function loadSampleData() {
    // Add some sample threats
    const sampleThreats = [
        {
            type: 'Phishing',
            severity: 'high',
            source: 'suspicious-email.com',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            description: 'Phishing attempt detected in email',
            recommendation: 'Do not click links or download attachments'
        },
        {
            type: 'Malware',
            severity: 'critical',
            source: '192.168.1.50',
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
            description: 'Malware signature detected',
            recommendation: 'Isolate system and run antivirus scan'
        }
    ];

    appState.threats.push(...sampleThreats);
    appState.stats.threatCount = sampleThreats.length;
    appState.stats.scanCount = 15;
    appState.stats.safeCount = 13;
    appState.stats.riskScore = 15;

    updateStats();
    updateRecentThreats();
    updateAnalysisTable();
    addLog('info', 'Sample data loaded');
}

// Settings Functions
function initializeSettings() {
    const settingsBtn = document.getElementById('settings-btn');
    const settingsPanel = document.getElementById('settings-panel');
    const closeSettings = document.querySelector('.close-settings');
    const saveBtn = document.getElementById('save-settings-btn');
    const resetBtn = document.getElementById('reset-settings-btn');
    const themeBtns = document.querySelectorAll('.theme-btn');

    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            settingsPanel.classList.add('active');
        });
    }

    if (closeSettings) {
        closeSettings.addEventListener('click', () => {
            settingsPanel.classList.remove('active');
        });
    }

    // Close settings when clicking outside
    settingsPanel.addEventListener('click', (e) => {
        if (e.target === settingsPanel) {
            settingsPanel.classList.remove('active');
        }
    });

    if (saveBtn) {
        saveBtn.addEventListener('click', saveSettings);
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', resetSettings);
    }

    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            themeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const theme = btn.dataset.theme;
            applyTheme(theme);
        });
    });
}

function loadSettings() {
    const saved = localStorage.getItem('cybershield-settings');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            appState.settings = { ...appState.settings, ...parsed };
        } catch (e) {
            console.error('Error loading settings:', e);
        }
    }

    // Apply settings to UI
    const enableNotifications = document.getElementById('enable-notifications');
    const soundAlerts = document.getElementById('sound-alerts');
    const autoScanInterval = document.getElementById('auto-scan-interval');
    const deepScan = document.getElementById('deep-scan');

    if (enableNotifications) enableNotifications.checked = appState.settings.notifications;
    if (soundAlerts) soundAlerts.checked = appState.settings.soundAlerts;
    if (autoScanInterval) autoScanInterval.value = appState.settings.autoScanInterval;
    if (deepScan) deepScan.checked = appState.settings.deepScan;
    
    // Set active theme button
    const activeThemeBtn = document.querySelector(`.theme-btn[data-theme="${appState.settings.theme}"]`);
    if (activeThemeBtn) {
        document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
        activeThemeBtn.classList.add('active');
    }
    
    applyTheme(appState.settings.theme);
}

function saveSettings() {
    const enableNotifications = document.getElementById('enable-notifications');
    const soundAlerts = document.getElementById('sound-alerts');
    const autoScanInterval = document.getElementById('auto-scan-interval');
    const deepScan = document.getElementById('deep-scan');

    appState.settings.notifications = enableNotifications ? enableNotifications.checked : true;
    appState.settings.soundAlerts = soundAlerts ? soundAlerts.checked : true;
    appState.settings.autoScanInterval = autoScanInterval ? parseInt(autoScanInterval.value) : 30;
    appState.settings.deepScan = deepScan ? deepScan.checked : false;

    // Save API keys if provided
    const virustotalApi = document.getElementById('virustotal-api');
    const abuseipdbApi = document.getElementById('abuseipdb-api');
    
    if (virustotalApi && virustotalApi.value) {
        appState.settings.virustotalApi = virustotalApi.value;
    }
    if (abuseipdbApi && abuseipdbApi.value) {
        appState.settings.abuseipdbApi = abuseipdbApi.value;
    }

    localStorage.setItem('cybershield-settings', JSON.stringify(appState.settings));
    showNotification('Settings saved successfully', 'success');
    addLog('info', 'Settings updated');
}

function resetSettings() {
    if (confirm('Are you sure you want to reset all settings to defaults?')) {
        appState.settings = {
            theme: 'dark',
            notifications: true,
            soundAlerts: true,
            autoScanInterval: 30,
            deepScan: false
        };
        localStorage.removeItem('cybershield-settings');
        loadSettings();
        showNotification('Settings reset to defaults', 'success');
        addLog('info', 'Settings reset to defaults');
    }
}

function applyTheme(theme) {
    appState.settings.theme = theme;
    
    if (theme === 'light') {
        document.documentElement.style.setProperty('--bg-dark', '#f5f5f5');
        document.documentElement.style.setProperty('--bg-darker', '#ffffff');
        document.documentElement.style.setProperty('--bg-card', '#ffffff');
        document.documentElement.style.setProperty('--text-primary', '#1a1a1a');
        document.documentElement.style.setProperty('--text-secondary', '#666666');
        document.documentElement.style.setProperty('--border-color', '#e0e0e0');
    } else {
        document.documentElement.style.setProperty('--bg-dark', '#0a0e27');
        document.documentElement.style.setProperty('--bg-darker', '#050811');
        document.documentElement.style.setProperty('--bg-card', '#141b2d');
        document.documentElement.style.setProperty('--text-primary', '#ffffff');
        document.documentElement.style.setProperty('--text-secondary', '#a0aec0');
        document.documentElement.style.setProperty('--border-color', '#1e293b');
    }
    
    // Save theme preference
    const currentSettings = JSON.parse(localStorage.getItem('cybershield-settings') || '{}');
    currentSettings.theme = theme;
    localStorage.setItem('cybershield-settings', JSON.stringify(currentSettings));
}

// Add CSS for notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);


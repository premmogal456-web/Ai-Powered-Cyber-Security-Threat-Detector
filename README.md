# AI-Powered Cybersecurity Threat Detector

A modern, responsive web application for detecting and analyzing cybersecurity threats in real-time. Built with vanilla JavaScript, HTML5, and CSS3.

## Features

- 🛡️ **Real-time Threat Detection**: Scan URLs, files, and code/text for potential security threats
- 📊 **Interactive Dashboard**: Visualize threat statistics and activity with charts
- 🔍 **Advanced Analysis**: Filter and analyze threats by type, severity, and date
- 📝 **Security Logs**: Comprehensive logging system with search and export functionality
- 🎨 **Modern UI**: Beautiful dark theme with responsive design
- ⚡ **Real-time Updates**: Automatic threat detection and monitoring

## Threat Detection Capabilities

The system can detect various types of threats:

- **Malware**: Executable files and suspicious file types
- **Phishing**: Suspicious URLs and shortened links
- **SQL Injection**: Database attack patterns
- **XSS Attacks**: Cross-site scripting vulnerabilities
- **Code Injection**: Dangerous code execution patterns
- **Hardcoded Credentials**: Exposed passwords and API keys
- **Suspicious IPs**: Potentially malicious IP addresses

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Edge, Safari)
- Node.js (optional, for running a local server)

### Installation

1. Clone or download this repository
2. Open `index.html` in your web browser, or
3. Run a local server:

```bash
npm install
npm start
```

The application will open at `http://localhost:8080`

## Usage

### Dashboard
- View real-time threat statistics
- Monitor threat activity with interactive charts
- Review recent threats

### Threat Detector
- **URL Scan**: Enter a URL or IP address to scan
- **File Upload**: Upload files for malware detection
- **Text Analysis**: Paste code or text to detect vulnerabilities

### Analysis
- Filter threats by type and severity
- View detailed threat information
- Take actions on detected threats

### Logs
- View all security events
- Search through logs
- Export logs for analysis

## Project Structure

```
.
├── index.html          # Main HTML structure
├── styles.css          # All styling and responsive design
├── script.js           # Application logic and threat detection
├── package.json        # Project dependencies
└── README.md          # This file
```

## Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **JavaScript (ES6+)**: Application logic and threat detection algorithms
- **Chart.js**: Data visualization
- **Font Awesome**: Icons

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Edge (latest)
- Safari (latest)

## Security Note

This is a frontend demonstration application. For production use, integrate with a backend API for:
- Actual AI/ML threat detection models
- Secure file scanning
- Database storage
- User authentication
- API rate limiting

## License

MIT License - feel free to use this project for learning and development purposes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.


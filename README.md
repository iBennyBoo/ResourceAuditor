# Front-End Resource Auditor
### What is this?
This project is a live, browser-based diagnostic tool for digital privacy & literacy. Specifically, it is a Single-Page Application built to bridge the gap between complex web security headers and everyday user understanding. It performs real-time scans of public-facing web resources to evaluate their security posture using live header analysis.

### Why?
In the current digital landscape, the Privacy Divide is widening by the day. Most users know they should stay safe on the internet, but don't understand the mechanisms that protect them. I designed this tool to respect the sandbox limits of the browser while making sure the user understands what is going on. By focusing on Front-Channel Security, the auditor evaluates the external posture (the defenses it presents) of a site.

### Challenges Faced
This was my first time using corsproxy.io, so it took me a while to get a grasp on it. Browser security naturally prevents JavaScript from reading headers of other websites. To solve this, I implemented a CORS Proxy integration. This allows the application to remain entirely front-end, while still providing the dynamic functionality of a back-end scanner.

### How to Run Locally
1.) Clone the repository: git clone https://github.com/your-username/security-auditor.git
2.) Open the folder in VS Code.
3.) Open with Live Server.
4.) Enter a domain to begin the scan.

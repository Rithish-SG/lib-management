# Campus Central Library Management System 📚⚡
### Web Technology Lab - Experiment 10: Performance Optimization & Progressive Web App (PWA)

A comprehensive, production-grade Library Management Web Application built with React, Vite, Redux Toolkit, and REST APIs. Features advanced performance optimizations, code splitting, offline Progressive Web App capabilities, WCAG 2.1 accessibility, and security hardening.

---

## 🚀 Live Demo & Deployment
- **Live URL**: Hosted on GitHub Pages via automated GitHub Actions workflow (`.github/workflows/deploy.yml`).
- **PWA Ready**: Can be installed to desktop or mobile home screens with offline caching support.

---

## 🌟 Key Features & Syllabus Mapping (Experiment 10)

| Requirement | Feature | Implementation Details |
| :--- | :--- | :--- |
| **10.a** | **Lazy Loading** | Secondary routes (`BookDetailsPage`, `BorrowRequestPage`, `MemberDashboardLayout`, `BorrowedBooks`, `Profile`, `Recommendations`) load dynamically on-demand via `React.lazy()` and `<Suspense>`. |
| **10.b** | **Code Splitting** | Custom Rollup `manualChunks` in `vite.config.js` divides the bundle into cached chunks (`vendor-react`, `vendor-redux`, `vendor-axios`, plus per-route dynamic modules). |
| **10.c** | **Image & Data Optimization** | Native `loading="lazy"`, `decoding="async"`, and animated CSS shimmer skeleton placeholders. |
| **10.d** | **Progressive Web App (PWA)** | Configured `manifest.json` and Service Worker (`sw.js`) with offline caching strategy and install prompt. |
| **10.e** | **WCAG Accessibility (A11y)** | "Skip to main content" link, accessible landmarks (`role="banner"`, `main id="main-content"`), semantic ARIA attributes, and visible `:focus-visible` focus rings. |
| **10.f** | **Security Hardening** | `sanitizeInput()` utility escaping HTML entities against Cross-Site Scripting (XSS), Content Security Policy (CSP), and password complexity validation. |

---

## 🛠️ Tech Stack
- **Frontend**: React 18/19, Vite, React Router v7
- **State Management**: Redux Toolkit, React-Redux, Context API
- **HTTP Client**: Axios with Request & Response Interceptors
- **Styling**: Modern Responsive CSS3 (CSS Variables, Flexbox, Grid)
- **Offline / PWA**: Service Workers Cache API, Web App Manifest
- **Testing**: Vitest, React Testing Library, `@testing-library/jest-dom`

---

## 💻 Getting Started Locally

### 1. Clone the repository
```bash
git clone https://github.com/Rithish-SG/<repo-name>.git
cd <repo-name>
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production (with Code Splitting)
```bash
npm run build
```
Preview the production build:
```bash
npm run preview
```

---

## 🌐 Deploying to GitHub Pages

### Method 1: Automatic Deployment (Recommended)
This repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`).
1. Push your code to the `main` branch.
2. In your GitHub repository:
   - Navigate to **Settings** &rarr; **Pages**.
   - Under **Build and deployment** &rarr; **Source**, select **GitHub Actions**.
3. Every push to `main` will automatically build and deploy to:
   ```
   https://Rithish-SG.github.io/<repo-name>/
   ```

### Method 2: Manual Deployment
```bash
npm run deploy
```

---

## 👨‍💻 Author
- **Developer**: Rithish-SG ([@Rithish-SG](https://github.com/Rithish-SG))
- **Email**: rithishsg25@gmail.com
- **Project**: College Web Technology Practical Laboratory

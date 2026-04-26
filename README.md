# ScholarFlow - Academic Productivity Suite

An all-in-one academic researcher assistant powered by Google Gemini, designed with a modern design

**online:**

## ✨ Key Features

### 🌑 Modern & Elite Design
- Completely redesigned premium black-and-white "Elite" interface.
- Glassmorphism cards and sophisticated hover effects.
- Consistent typography and visual hierarchy across all pages.

### 🤖 Advanced AI Integration
- **Academic Partner (Chat)**: Your ubiquitous assistant, accessible from the bottom-right corner with **LaTeX math formula support**.
- **AI Scorecard**: Analyze the academic tone and readability of your texts.
- **PDF Analysis**: Upload your articles and dive deep with intelligent summaries and Q&A.
- **Gemini 2.5 Flash**: Latest AI model for improved accuracy and performance.

### 🛠️ Essential Tools
- **Research Planner**: Set your goals and track your progress.
- **Reading List**: Manage your sources with "todo", "reading", and "done" statuses.
- **Citation Manager**: Quickly generate bibliographies in APA and other formats and save them to your library.
- **Focus Mode (Pomodoro)**: Deep work sessions accompanied by nature sounds (Rain, Ocean, White Noise).

### 💾 Data Security & Backup
- **Full Backup**: Export all your notes, API keys, and data as a JSON with a single click from the Settings page.
- **Account Transfer**: Instantly restore your account by uploading your backup from the login screen.

## 🚀 Getting Started

This project is built with React + Vite.

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Build**:
   ```bash
   npm run build
   ```
   
3. **Start the Server (Production)**:
   We use **PM2** for robust process management and memory safety.
   
   ```bash
   # Install PM2 globally if not already installed
   npm install -g pm2
   
   # Start with the secure configuration
   pm2 start ecosystem.config.cjs
   
   # Save for startup
   pm2 save
   pm2 startup
   ```
   
   > **Note:** If you experience crashes after 1-2 hours, please refer to [FIX_GUIDE.md](./FIX_GUIDE.md) to enable Swap space on your server.

4. **Gemini API Key**:
   To activate AI features, get your key from [Google AI Studio](https://aistudio.google.com/) and enter it in the **Settings** section within the app.

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite
- **Styling**: Vanilla CSS + Tailwind CSS (Elite Theme)
- **Icons**: Lucide React
- **AI**: Google Generative AI (Gemini 2.5 Flash)
- **Math Rendering**: KaTeX + remark-math + rehype-katex
- **Data**: LocalStorage (Encrypted/Secure Backup Support)
- **Deployment**: PM2 (Process Manager)

## 🎯 Recent Updates

- ✅ **Fixed Server Crashes:** Added robust PM2 configuration and Swap guide (`FIX_GUIDE.md`)
- ✅ Added LaTeX/KaTeX support for mathematical formulas
- ✅ Updated to Gemini 2.5 Flash model
- ✅ Improved error handling with ErrorBoundary
- ✅ Added comprehensive logging system
- ✅ All 10 features tested and verified (100% working)

---
*Designed for your academic success.*

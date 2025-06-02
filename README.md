# 🧘‍♂️ Attention Please — A Mindful Desktop Productivity Companion

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **Not just a side project — a daily-use product with purpose.**

**Attention Please** is a cross-platform desktop productivity and digital wellness application built using **Electron**, **React**, and **TypeScript**. Designed to support deep focus and healthier screen habits, it lives in your system tray and gently nudges you toward mindful, balanced computing — without getting in your way.

---

## 🚀 Key Features

### 🕒 Productivity Timers
- Customizable **Pomodoro cycles** for focused work and breaks
- **Eye care reminders** using the 20-20-20 rule *(Every 20 minutes, look 20 feet away for 20 seconds)*
- **Animated visual timers** with progress tracking
- System tray integration with **non-intrusive notifications**

### 🔒 Focus Mode
- **App blocking** with a customizable whitelist
- Detects when users switch to **distracting or blocked apps**
- Sends **real-time alerts** for focus violations

### 💧 Wellness Reminders
- Gentle **hydration reminders** at user-defined intervals
- **Posture checks** to prevent slouching and strain
- All reminders run quietly in the **background via tray alerts**

### 👤 User Management
- Secure **JWT-based authentication**
- **Email-based password reset**
- **Multi-user support** with isolated preferences
- **Cross-device syncing** of user settings

---

## 🧱 Tech Stack

| Layer         | Technologies |
|---------------|--------------|
| **Frontend**  | React 18, TypeScript, Tailwind CSS, Framer Motion, React Hook Form, Zod |
| **Backend**   | Node.js, Express, MongoDB with Mongoose |
| **Desktop**   | Electron, System Tray API, Native OS Notifications |
| **State/Data**| React Context, React Query, Local Storage |

---

## 🏗️ Architecture & Design

- **Modular Architecture** – clean separation of UI, services, and core logic
- **Event-Driven Background Tasks** – timers, reminders, and focus checks run silently
- **Design Patterns Used**:
  - `Singleton` – tray services & background task management
  - `Observer` – real-time state updates and user alerts
- **Modern UI/UX**:
  - Responsive design with dark/light themes
  - Accessible, intuitive user interactions

---

## ⚡ Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/Thushar-011/Attention-Please.git

# 2. Navigate into the project folder
cd Attention-Please

# 3. Install all dependencies
npm install

# 4. Run in development mode
npm run dev

# 5. Launch the Electron desktop app
npm run electron

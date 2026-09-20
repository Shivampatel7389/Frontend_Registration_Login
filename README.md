# RegLog Frontend — Framer-Inspired Authentication Web App

A high-performance, responsive React web application featuring modern **[Framer](https://www.framer.com/)-inspired aesthetics**, secure HttpOnly cookie authentication, and seamless integration with the Spring Boot backend.

---

## ✨ Design Aesthetics & Highlights

- **Framer Obsidian Canvas & Aurora Lighting**: Deep obsidian background (`#06070a`) layered with atmospheric radial aurora lighting (electric blue `#0066FF`, violet `#8B5CF6`, and cyan `#00F0FF`).
- **Glassmorphism Panels**: Translucent dark surfaces (`backdrop-filter: blur(28px)`) with fine specular top-rim glow and micro-borders.
- **Dynamic Micro-Interactions**: Translucent input fields with glowing electric blue focus halos, button hover sheen sweeps, and animated pill badges.
- **Modern Typography**: Powered by Google Fonts `Inter` and `Plus Jakarta Sans`.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + Vite 8
- **Routing**: React Router DOM v7
- **Styling**: Vanilla CSS Design System with CSS Variables & Glassmorphism
- **Icons**: Lucide React
- **Linter**: Oxlint

---

## 🧭 Pages & Routes

| Route | Page | Description | Auth State |
| :--- | :--- | :--- | :---: |
| `/login` | **Login** | User Name & Password authentication with electric blue focus glow | Public |
| `/signup` | **Signup** | Multi-field registration (Name, Email, Phone, Password) with instant validation | Public |
| `/home` | **Dashboard** | Protected cockpit featuring active session verified badge & metric cards | Protected |
| `/*` | **Redirect** | Automatically routes unauthenticated users to `/login` | — |

---

## 🔒 Security Integration

- **HttpOnly Cookie Support**: Credentials (`credentials: 'include'`) automatically attach secure session cookies on all API requests.
- **CORS Compatible**: Configured to work out of the box with the Spring Boot backend on `http://localhost:8080`.
- **Protected Routing**: `<ProtectedRoute>` wrapper guarantees that unauthorized users cannot view the dashboard.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
The application will start on: **`http://localhost:5173`**.

### 3. Build for Production
```bash
npm run build
```
Build output is generated into the `dist/` directory.

### 4. Run Linter
```bash
npm run lint
```

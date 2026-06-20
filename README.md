Carrot's Hub 🥕

A comprehensive nutrition tracking web application that helps users monitor their diet and hydration, explore the nutritional value of foods, and build healthier eating habits through recipes and practical tools.
 
🔗 **Live app:** [morkovka.web.app](https://morkovka.web.app/)

---
 
## ✨ Features
 
- **Calorie & nutrition tracking** — log daily meals and monitor macronutrients (calories, proteins, fats, carbohydrates)
- **Water intake tracker** — set hydration goals and track daily water consumption
- **Food database** — search foods and get detailed nutritional breakdowns powered by the Edamam API
- **Recipe explorer** — browse healthy recipes with full nutritional information
- **User authentication** — secure sign-up and login via Firebase Authentication
- **Persistent data** — all logs stored in Firebase Realtime Database
 
<img width="1441" height="719" alt="Снимок экрана 2026-06-20 в 20 32 33" src="https://github.com/user-attachments/assets/e278453c-d8d6-41d0-841d-c9c367cc28a6" />

<img width="620" height="774" alt="Снимок экрана 2026-06-20 в 20 39 04" src="https://github.com/user-attachments/assets/5662272d-1cca-410c-9a61-974eda958d74" />

<img width="620" height="774" alt="Снимок экрана 2026-06-20 в 20 38 39" src="https://github.com/user-attachments/assets/f5fc92a3-7a39-400f-b7c0-c75b009bd97d" />

<img width="620" height="774" alt="Снимок экрана 2026-06-20 в 20 38 44" src="https://github.com/user-attachments/assets/5909dc78-1b40-4aec-af32-ca8d822c890f" />



  
---

## 🛠 Tech Stack
 
| Layer | Technologies |
|---|---|
| Language | TypeScript |
| Framework | Angular 18 |
| UI / Styles | Taiga UI + LESS |
| State management | Angular Signals + Services |
| Backend | Firebase (Auth, Realtime Database, Analytics, Hosting) |
| External API | Edamam Nutrition API |
| Monorepo | Nx |
| Code quality | ESLint, Stylelint, Prettier, Husky |
| CI/CD | GitLab CI → Firebase Hosting |
 
---
 
## 🏗 Architecture
 
The project is structured as an **Nx monorepo** with a single Angular application. Key architectural decisions:
 
- **Feature-based folder structure** — each domain (diary, recipes, water tracker, profile) is an isolated feature module
- **Lazy loading** — all feature routes are lazily loaded to minimize initial bundle size
- **Firebase as BaaS** — no custom backend; Firebase handles authentication, data persistence, and hosting
- **Reactive forms + Signals** — forms use Angular's reactive approach; shared state is managed via Angular Signals
- 
```
carrotsHub/
├── apps/
│   └── carrotsHub/
│       └── src/
│           ├── app/
│           │   ├── core/          # Guards, interceptors, app-level services
│           │   ├── features/      # diary, recipes, water, profile, auth
│           │   └── shared/        # Reusable components, pipes, directives
│           └── environments/
├── .husky/                        # Git hooks
├── .gitlab-ci.yml                 # CI/CD pipeline
└── nx.json
```
 
---
## 🚀 Getting Started
 
### Prerequisites
 
- Node.js 18+
- npm 9+
### Installation
 
```bash
# Clone the repository
git clone https://github.com/SplitCode/carrotsHub.git
cd carrotsHub
 
# Install dependencies
npm install
```
 
### Running locally
 
```bash
# Start the development server
npx nx serve carrotsHub
```
 
Open [http://localhost:4200](http://localhost:4200) in your browser.
 
### Building for production
 
```bash
npx nx build carrotsHub --configuration=production
```
 
---
 
## 🔑 Test Accounts
 
You can explore the app without registering using these test credentials:
 
| Account | Email | Password | Notes |
|---|---|---|---|
| Empty account | admin@test.ru | admin1 | No pre-filled data |
| Pre-filled account | admin2@test.ru | admin2 | Has sample diary entries and goals |
 
---
 
## 🔧 Available Scripts
 
```bash
# Lint TypeScript
npx nx lint carrotsHub
 
# Lint styles
npx nx run carrotsHub:stylelint
 
# Run tests
npx nx test carrotsHub
 
# Check all (lint + test)
npx nx run-many --target=lint,test
```
 
---
 
## 🌐 Deployments
 
| Environment | URL |
|---|---|
| Production | [morkovka.web.app](https://morkovka.web.app/) |
| Staging | [carrot-s-hub.web.app](https://carrot-s-hub.web.app/) |
 
Deployments are automated via GitLab CI on push to the `master` branch.
 
---
 
## 📄 License
 
This project is for educational and portfolio purposes.

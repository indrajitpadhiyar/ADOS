# ADOS — Multi-Platform Advertising Analytics Dashboard

<p align="center">
  <img src="frontend/public/ados2.png" alt="ADOS Logo" width="220" />
</p>

<p align="center">
  <strong>Enterprise-Grade Multi-Platform Advertising Analytics & Autonomous Intelligence</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-v20+-green.svg" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-v5.2-blue.svg" alt="Express" />
  <img src="https://img.shields.io/badge/React-v19-61dafb.svg" alt="React" />
  <img src="https://img.shields.io/badge/Vite-v8-646cff.svg" alt="Vite" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248.svg" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Google%20Ads-API%20v18-4285F4.svg" alt="Google Ads" />
  <img src="https://img.shields.io/badge/Meta%20Ads-Marketing%20API-0081FB.svg" alt="Meta Ads" />
  <img src="https://img.shields.io/badge/Security-AES--256--GCM-success.svg" alt="Security" />
  <img src="https://img.shields.io/badge/License-ISC-lightgrey.svg" alt="License" />
</p>

---

## 📖 Overview

**ADOS** is a high-performance, full-stack multi-platform advertising analytics dashboard engineered for marketing teams, agencies, and businesses. It unifies campaign data from **Google Ads** and **Meta Ads (Facebook & Instagram)** into a single, clean, real-time analytics interface.

Built with a **Clean Layered Architecture (Controller-Service-Repository)** on Express 5 and modern **React 19 + Tailwind CSS**, ADOS delivers robust multi-user isolation, official OAuth 2.0 flows, server-side token encryption at rest (AES-256-GCM), and normalized cross-platform metrics calculation (Spend, CPC, CTR, CPM, ROAS, and Conversion Rates).

---

## 🚀 Key Features

### 📊 Unified Multi-Platform Analytics Dashboard
- **Consolidated Overview**: Single pane of glass tracking advertising spend, impressions, clicks, conversions, and revenue across Google Ads and Meta Ads.
- **Header Top KPI Cards**:
  - **Google Ads Spend Card**: Platform logo, real-time connection status indicator, period spend, and percentage change.
  - **Meta Ads Spend Card**: Platform logo, real-time connection status indicator, period spend, and percentage change.
  - **Total Performance Card**: Aggregated cross-platform spend with tooltips and relative growth benchmarks.
  - **Total Conversions Card**: Consolidated conversion events count and trends.
- **7 Granular Secondary Metrics**: Total Impressions, Clicks, Average CPC, Click-Through Rate (CTR), Cost Per Mille (CPM), Conversion Rate, and Return On Ad Spend (ROAS).
- **Interactive SVG Spline Line Chart**: Triple-series time visualization for Spend, Clicks, and Conversions with smooth bezier curves and responsive hover tooltips.
- **Platform Performance Donut Chart**: Proportional spend visualization (e.g. 59.9% Google Ads vs. 40.1% Meta Ads) with centered totals and platform legends.
- **Top Campaigns Table**: Campaign performance table displaying name, platform badges, status (`Active`/`Paused`), spend, impressions, clicks, CTR, conversions, and ROAS.
- **Honest Connection States**: Clear empty and disconnected states prompting account connections rather than fabricated placeholder metrics.

### 🔗 Ad Accounts Hub & Official OAuth 2.0
- **Google Ads OAuth Integration**:
  - Official authorization code flow with offline access (`https://www.googleapis.com/auth/adwords` scope).
  - Multi-user account selector pulling accessible Google Ads customer IDs via the official Google Ads API.
  - Multi-user account isolation with zero cross-tenant data exposure.
- **Meta Ads OAuth Integration**:
  - Official Meta authorization flow requesting `ads_read` and `read_insights` permissions.
  - Automatic 60-day long-lived access token exchange via Meta Graph API.
  - Accessible ad accounts discovery (`/me/adaccounts`) and account selector.
- **Safe Disconnect & Reconnect**: Invalidate tokens, remove stored credentials, and re-link expired authorizations with confirmation modals.

### 🔐 Enterprise Security & Token Encryption
- **AES-256-GCM Token Encryption**: Provider refresh and access tokens are encrypted at rest with server-side secret keys.
- **Zero Client Token Exposure**: OAuth client secrets, refresh tokens, and developer tokens never touch the client browser.
- **Zero-Trust Session Strategy**: Short-lived JWT Access Tokens (15m) paired with rotating Refresh Tokens (7d) stored in `HttpOnly`, `SameSite=Strict`, `Secure` cookies.
- **Brute-Force & Lockout Protection**: 30-minute progressive lockout on 5 consecutive failed attempts.
- **NoSQL Injection & XSS Defense**: Strict in-place parameter sanitization and Helmet security headers.

---

## 🏛️ System Architecture

```mermaid
graph TD
    subgraph Client [Frontend - React 19 + Vite]
        UI[Overview Dashboard]
        AdHub[Ad Accounts Hub]
        CampTbl[Campaigns Table]
        RepView[Reports & CSV Export]
        Layout[Search, Date Picker, User Pill]
    end

    subgraph Security_Gate [API Security Layer]    
        Helmet[Helmet Security Headers]
        CORS[Strict Origin CORS]
        Sanitize[NoSQL Injection Sanitizer]
        AuthMW[JWT Cookie Auth Middleware]
        Zod[Zod Schema Validator]
    end

    subgraph App_Core [Backend - Express 5 Core]
        AnalyticsCtrl[Analytics Controller]
        AnalyticsSvc[Unified Aggregation Engine]
        GoogleAdsSvc[Google Ads API Service]
        MetaAdsSvc[Meta Graph API Service]
        CryptoUtil[AES-256-GCM Encryptor]
    end

    subgraph Providers [Official Ad Platforms]
        GoogleAPI[Google Ads API v18 / GAQL]
        MetaAPI[Meta Marketing Graph API]
    end

    subgraph Persistence [Database Layer]
        MongoAtlas[(MongoDB Atlas Database)]
        UserColl[(Users Collection)]
        GoogleColl[(GoogleAdsAccounts Collection)]
        MetaColl[(MetaAdsAccounts Collection)]
    end

    Client -->|HTTP / Cookies| Security_Gate
    Security_Gate --> App_Core
    App_Core --> GoogleAdsSvc
    App_Core --> MetaAdsSvc
    GoogleAdsSvc -->|OAuth & GAQL| GoogleAPI
    MetaAdsSvc -->|OAuth & Insights| MetaAPI
    App_Core --> CryptoUtil
    CryptoUtil --> Persistence
```

---

## 📂 Project Structure

```
ADOS/
├── backend/
│   ├── .env.example                  # Environment configuration template
│   ├── .gitignore                    # Secret & dependency protection
│   ├── package.json                  # Backend dependencies & scripts
│   ├── server.js                     # Bootstrap entrypoint & graceful teardown
│   └── src/
│       ├── app.js                    # Express app configuration & middleware pipeline
│       ├── config/
│       │   ├── env.js                # Fail-fast Zod environment validation
│       │   └── db.js                 # Resilient MongoDB connection pooling
│       ├── controllers/
│       │   ├── analytics.controller.js # Multi-platform aggregated analytics
│       │   ├── auth.controller.js    # Authentication & cookie management
│       │   ├── googleAds.controller.js # Google Ads OAuth & account selection
│       │   └── metaAds.controller.js   # Meta Ads OAuth & account selection
│       ├── middlewares/
│       │   ├── auth.middleware.js    # JWT bearer & cookie verification
│       │   ├── error.middleware.js   # Production error masking
│       │   ├── mongoSanitize.middleware.js # Express 5 operator sanitizer
│       │   ├── rateLimiter.middleware.js # Auth, reset, and API rate limiters
│       │   └── validate.middleware.js # Zod schema validation
│       ├── models/
│       │   ├── User.model.js         # User schema, bcrypt hooks, lockout
│       │   ├── GoogleAdsAccount.model.js # Encrypted Google tokens & selected accounts
│       │   └── MetaAdsAccount.model.js   # Encrypted Meta tokens & selected accounts
│       ├── routes/
│       │   ├── index.js              # Versioned API router (/api/v1) & health probe
│       │   ├── analytics.routes.js   # Unified analytics endpoints (/overview, /campaigns)
│       │   ├── auth.routes.js        # Auth endpoint routing & rate limit attachment
│       │   ├── googleAds.routes.js   # Google Ads OAuth & management routes
│       │   └── metaAds.routes.js     # Meta Ads OAuth & management routes
│       ├── services/
│       │   ├── analytics.service.js  # Cross-platform normalization & metric calculation
│       │   ├── auth.service.js       # Core business logic & token family rotation
│       │   ├── GoogleAdsService.js   # Google Ads API client & GAQL metrics queries
│       │   └── metaAds.service.js    # Meta Graph API client & insights retrieval
│       └── utils/
│           ├── ApiError.js           # Operational error abstraction
│           ├── ApiResponse.js        # Unified JSON response wrapper
│           ├── crypto.util.js        # AES-256-GCM token encryption / decryption
│           └── starterData.util.js   # User initialization utility
│
└── frontend/
    ├── index.html                    # HTML5 entrypoint
    ├── package.json                  # Frontend dependencies & scripts
    ├── vite.config.js                # Vite build configuration
    ├── public/
    │   ├── ados.png                  # ADOS Brand Logo
    │   └── ados2.png                 # ADOS High-Res Visual Asset
    └── src/
        ├── App.jsx                   # Application router & protected route guards
        ├── index.css                 # Global CSS & Tailwind styling
        ├── main.jsx                  # React DOM root mounting
        ├── assets/
        │   └── platform_logo/
        │       ├── google.png        # Official Google Ads logo asset
        │       └── meta.png          # Official Meta Ads logo asset
        ├── components/
        │   ├── PlatformLogo.jsx      # Multi-platform badge and logo renderer
        │   ├── layout/
        │   │   ├── DashboardLayout.jsx  # Header bar with search, date range, user pill
        │   │   └── DashboardSidebar.jsx # Sidebar matching UI design with promo card
        │   └── sections/
        │       ├── DashboardOverviewSection.jsx # KPI cards, spline chart, donut chart, table
        │       ├── AdAccountsSection.jsx        # Google & Meta OAuth cards & account picker
        │       ├── CampaignsSection.jsx         # Read-only campaign analytics table
        │       ├── ReportsSection.jsx           # CSV export & spend breakdowns
        │       └── SettingsSection.jsx          # Profile & token security status
        ├── pages/
        │   ├── DashboardPage.jsx     # Main Overview dashboard page
        │   ├── AdAccountsPage.jsx    # Dedicated Connected Accounts page
        │   ├── CampaignsPage.jsx     # Dedicated Campaigns analytics page
        │   ├── ReportsPage.jsx       # Dedicated Reports page
        │   ├── SettingsPage.jsx      # Settings & profile page
        │   ├── AuthPage.jsx          # Login & signup split view
        │   └── HomePage.jsx          # Landing page
        └── services/
            └── api.js                # Centralized Axios API service layer
```

---

## 🛠️ Technology Stack

| Layer                | Technologies                                                                                                 |
| :------------------- | :----------------------------------------------------------------------------------------------------------- |
| **Frontend Core**    | React 19, JavaScript (ESModules), HTML5                                                                      |
| **Styling & Motion** | Tailwind CSS v4, Lucide Icons, Framer Motion                                                                 |
| **Visual Charts**    | Custom SVG Bezier Spline Charts, Donut Area Visualizations                                                    |
| **Backend Runtime**  | Node.js (v20+ Recommended), Express v5.2                                                                     |
| **Database**         | MongoDB Atlas, Mongoose v9                                                                                   |
| **Ad Integrations**  | Google Ads API (`google-ads-api`), Meta Graph Marketing API                                                  |
| **Security & Auth**  | AES-256-GCM Crypto, JWT (`jsonwebtoken`), `bcryptjs`, `helmet`, `cors`, `cookie-parser`, `express-rate-limit`, `zod` |
| **Build & Tooling**  | Vite v8, npm                                                                                                 |

---

## ⚙️ Environment Variables

Create a `.env` file in the `backend/` directory based on [`.env.example`](file:///d:/ADOS/backend/.env.example):

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGO_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/ados_db?retryWrites=true&w=majority

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# JWT & Cookie Security Secrets
JWT_ACCESS_SECRET=your_jwt_access_secret_key_here_minimum_16_chars
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here_minimum_16_chars
JWT_REFRESH_EXPIRES_IN=7d
COOKIE_SECRET=your_cookie_encryption_secret_here

# Token Security (32-byte hex string for AES-256-GCM token encryption at rest)
TOKEN_ENCRYPTION_KEY=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef

# Google Ads API & OAuth (Server-Side Only)
GOOGLE_ADS_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com
GOOGLE_ADS_CLIENT_SECRET=your-google-oauth-client-secret
GOOGLE_ADS_REDIRECT_URI=http://localhost:5000/api/v1/google-ads/callback
GOOGLE_ADS_DEVELOPER_TOKEN=your-google-ads-developer-token

# Meta Marketing API & OAuth (Server-Side Only)
META_APP_ID=your-meta-app-id
META_APP_SECRET=your-meta-app-secret
META_REDIRECT_URI=http://localhost:5000/api/v1/meta-ads/callback
```

---

## 📡 API Reference (`/api/v1`)

### Analytics Endpoints (`/analytics`)

| Method | Endpoint | Access | Description |
| :----- | :------- | :----- | :---------- |
| `GET`  | `/analytics/overview` | Protected | Aggregated KPI totals, spline time-series points, spend split, and top campaigns |
| `GET`  | `/analytics/campaigns` | Protected | Paginated, filtered campaign analytics across all connected platforms |

### Google Ads OAuth & Management (`/google-ads`)

| Method | Endpoint | Access | Description |
| :----- | :------- | :----- | :---------- |
| `GET`  | `/google-ads/status` | Protected | Current user's Google Ads connection and sync status |
| `GET`  | `/google-ads/connect` | Protected | Generates Google authorization URL and initiates OAuth flow |
| `GET`  | `/google-ads/callback` | Public | Handles OAuth redirect, exchanges tokens, and discovers accessible accounts |
| `GET`  | `/google-ads/accounts` | Protected | Lists accessible customer IDs for the authenticated user |
| `POST` | `/google-ads/select-account` | Protected | Persists selected Google Ads account for dashboard synchronization |
| `POST` | `/google-ads/disconnect` | Protected | Removes stored Google tokens and marks connection disconnected |

### Meta Ads OAuth & Management (`/meta-ads`)

| Method | Endpoint | Access | Description |
| :----- | :------- | :----- | :---------- |
| `GET`  | `/meta-ads/status` | Protected | Current user's Meta Ads connection and sync status |
| `GET`  | `/meta-ads/connect` | Protected | Generates Meta authorization URL with `ads_read` & `read_insights` |
| `GET`  | `/meta-ads/callback` | Public | Handles Meta OAuth redirect and exchanges for 60-day long-lived token |
| `GET`  | `/meta-ads/accounts` | Protected | Lists accessible Meta ad accounts (`act_<id>`) for user selection |
| `POST` | `/meta-ads/select-account` | Protected | Persists selected Meta Ad account for dashboard synchronization |
| `GET`  | `/meta-ads/campaigns` | Protected | Fetches campaign-level metrics directly from Meta Graph Marketing API |
| `POST` | `/meta-ads/disconnect` | Protected | Removes stored Meta tokens and marks connection disconnected |

### Authentication (`/auth`)

| Method | Endpoint | Access | Description |
| :----- | :------- | :----- | :---------- |
| `POST` | `/auth/register` | Public | Register new user account |
| `POST` | `/auth/login` | Public | Authenticate user & set secure cookies |
| `POST` | `/auth/refresh` | Public | Rotate access and refresh tokens |
| `POST` | `/auth/logout` | Protected | Invalidate session and clear cookies |
| `GET`  | `/auth/me` | Protected | Retrieve authenticated user profile |

---

## 🚦 Getting Started

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/drumilthakor/ADOS.git
cd ADOS

# Install Backend dependencies
cd backend
npm install

# Install Frontend dependencies
cd ../frontend
npm install
```

### 2. Start Development Servers

#### Terminal 1 — Backend API
```bash
cd backend
npm run dev
```
> The API server starts on `http://localhost:5000` with MongoDB connection pooling.

#### Terminal 2 — Frontend Client
```bash
cd frontend
npm run dev
```
> The client will be live on `http://localhost:5173`.

---

## 🛡️ Production Build & Verification

```bash
# Build Frontend
cd frontend
npm run build

# Verify Backend
cd ../backend
node -e "import('./src/config/env.js').then(() => import('./src/routes/index.js')).then(() => process.exit(0))"
```

---

## 📄 License

ISC License. Built for enterprise advertising intelligence and analytics.

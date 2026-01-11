# 🏃‍♂️ Sprint Mate - Frontend

Sprint Mate, yazılım geliştiricileri için bir eşleştirme ve işbirliği platformudur. Bu proje, kullanıcıların birbirleriyle eşleşip birlikte projeler üzerinde çalışabilecekleri modern bir web uygulamasının frontend kısmını içerir.

## 📋 İçindekiler

- [Özellikler](#özellikler)
- [Teknolojiler](#teknolojiler)
- [Kurulum](#kurulum)
- [Kullanım](#kullanım)
- [Proje Yapısı](#proje-yapısı)
- [API Entegrasyonu](#api-entegrasyonu)
- [Geliştirme](#geliştirme)

## ✨ Özellikler

### Kimlik Doğrulama
- 🔐 GitHub OAuth2 ile giriş
- 🎭 Rol seçimi (Frontend Developer / Backend Developer)
- 🍪 Session-based authentication (JSESSIONID cookies)
- 🚪 Otomatik logout ve oturum yönetimi
- 🛡️ Protected routes ile sayfa güvenliği

### Dashboard
- 💻 IDE benzeri modern arayüz
- 🔍 Developer eşleştirme sistemi
- 📊 Real-time eşleşme durumu takibi
- 🎯 Proje detayları görüntüleme
- 📝 Terminal panel ile canlı log takibi

### UI/UX
- 🎨 VS Code temalı modern tasarım
- 🌙 Koyu tema (Dark mode)
- ⚡ Hızlı ve responsive arayüz
- 🎭 Animasyonlu geçişler ve loading states
- 💫 Binary background efekti

## 🚀 Teknolojiler

### Core
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server

### State Management & Routing
- **React Router DOM v6** - Client-side routing
- **React Context API** - Global state management

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **React Hot Toast** - Toast notifications
- **Material Symbols** - Google icon library

### HTTP & API
- **Axios** - HTTP client with credentials support

### Development Tools
- **ESLint** - Code linting
- **TypeScript ESLint** - TS-specific linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 📦 Kurulum

### Gereksinimler
- Node.js 18.x veya üzeri
- npm veya yarn
- Backend API çalışır durumda olmalı (Spring Boot)

### Adımlar

1. Repository'yi klonlayın:
```bash
git clone https://github.com/mahmutsyilmz/sprint-mate-frontend.git
cd sprint-mate-frontend
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Environment variables'ı ayarlayın (opsiyonel):
```bash
# .env.local dosyası oluşturun (varsayılan değerler zaten kodda mevcut)
VITE_API_BASE_URL=http://localhost:8080/api
VITE_BACKEND_URL=http://localhost:8080
```

4. Development server'ı başlatın:
```bash
npm run dev
```

5. Uygulamayı tarayıcıda açın:
```
http://localhost:5173
```

## 🎯 Kullanım

### Giriş Yapma (GitHub OAuth)
1. Login sayfasında **"Login with GitHub"** butonuna tıklayın
2. GitHub hesabınızla giriş yapın ve uygulamaya yetki verin
3. Başarılı girişten sonra rol seçimi sayfasına yönlendirileceksiniz

### Rol Seçimi
1. **Frontend Developer** veya **Backend Developer** rolünü seçin
2. Seçiminiz kaydedildikten sonra Dashboard'a yönlendirileceksiniz

### Dashboard Kullanımı
1. **Find Match** butonu ile eşleşme kuyruğuna katılın
2. Terminal panelinde eşleşme durumunu takip edin
3. Eşleşme bulunduğunda partner ve proje detayları görüntülenir
4. **Leave Match** ile eşleşmeden ayrılabilirsiniz

## 📁 Proje Yapısı

```
sprint-mate-frontend/
├── public/                  # Static files
├── src/
│   ├── assets/             # Images, icons, etc.
│   ├── components/         # Reusable components
│   │   ├── BinaryBackground.tsx  # Animated binary code background
│   │   ├── IdeLayout.tsx         # VS Code style layout wrapper
│   │   ├── ProtectedRoute.tsx    # Auth-protected route wrapper
│   │   ├── TerminalPanel.tsx     # Terminal-style log panel
│   │   └── index.ts              # Barrel exports
│   ├── contexts/           # React contexts
│   │   ├── AuthContext.tsx       # Authentication state & logic
│   │   └── index.ts
│   ├── pages/              # Page components
│   │   ├── Dashboard.tsx         # Main dashboard page
│   │   ├── Login.tsx             # GitHub OAuth login page
│   │   ├── RoleSelect.tsx        # Role selection page
│   │   └── index.ts
│   ├── services/           # API services
│   │   ├── api.ts                # Axios instance configuration
│   │   ├── authService.ts        # OAuth redirect handlers
│   │   ├── matchService.ts       # Match API calls
│   │   ├── userService.ts        # User API calls
│   │   └── index.ts
│   ├── types.ts            # TypeScript type definitions
│   ├── App.tsx             # Root component with routes
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles & Tailwind
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🔌 API Entegrasyonu

### Authentication Flow (OAuth2)

Bu uygulama **GitHub OAuth2** kullanır. JWT token yerine **session cookies** (JSESSIONID) ile authentication yapılır.

```
1. Kullanıcı "Login with GitHub" butonuna tıklar
2. Browser → Backend: /oauth2/authorization/github
3. Backend → GitHub: OAuth authorization request
4. GitHub → Kullanıcı: Login & consent sayfası
5. GitHub → Backend: Authorization code
6. Backend → GitHub: Access token exchange
7. Backend → Browser: Session cookie (JSESSIONID) + redirect
8. Browser → Frontend: Authenticated session
```

### Base URL Configuration
```typescript
// API calls (with /api prefix)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// OAuth redirects (without /api prefix)
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
```

### Endpoints

#### OAuth2
- `GET /oauth2/authorization/github` - GitHub OAuth başlat (browser redirect)
- `GET /logout` - Oturumu sonlandır (browser redirect)

#### User
- `GET /api/users/me` - Mevcut kullanıcı bilgileri
- `PATCH /api/users/me/role` - Rol güncelleme

#### Match
- `POST /api/matches/find` - Eşleşme başlat / kuyruğa katıl
- `DELETE /api/matches/queue` - Kuyruktan çık
- `POST /api/matches/{id}/complete` - Eşleşmeyi tamamla

### Session Authentication
Tüm API çağrıları için axios `withCredentials: true` kullanır:
```typescript
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true, // JSESSIONID cookie'si otomatik gönderilir
});
```

## 🛠️ Geliştirme

### Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Kod Standartları

- **TypeScript** kullanımı zorunludur
- **ESLint** kurallarına uyulmalıdır
- **Component** isimlendirmeleri PascalCase olmalıdır
- **Hook** isimlendirmeleri `use` prefix ile başlamalıdır
- **Type** ve **Interface** tanımları `types.ts` dosyasında toplanmalıdır

### Protected Routes

Sayfa güvenliği için `ProtectedRoute` wrapper kullanılır:

```typescript
// Sadece authenticated kullanıcılar için
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>

// Authenticated + rol seçmiş kullanıcılar için
<ProtectedRoute requireRole>
  <Dashboard />
</ProtectedRoute>

// Sadece rol seçmemiş kullanıcılar için
<RoleSelectRoute>
  <RoleSelect />
</RoleSelectRoute>
```

### State Management

Context API kullanımı:
```typescript
// Auth context hook
const { user, isAuthenticated, isLoading, logout, refreshUser } = useAuth();

// Loading durumunda
if (isLoading) return <LoadingScreen />;

// Authenticated değilse
if (!isAuthenticated) return <Navigate to="/login" />;
```

## 🎨 Styling

Tailwind CSS utility classes kullanılmaktadır:

```typescript
<div className="bg-ide-bg text-white p-4 rounded-lg shadow-xl">
  {/* Content */}
</div>
```

### Custom Colors (VS Code Theme)
```css
--ide-bg: #1e1e1e        /* Editor background */
--ide-sidebar: #252526   /* Sidebar background */
--ide-panel: #252526     /* Panel background */
--ide-border: #3e3e42    /* Borders */
--ide-blue: #007acc      /* Status bar */
--primary: #4ade80       /* Green accent (green-400) */
--syntax-blue: #569cd6   /* Code syntax blue */
--syntax-purple: #c586c0 /* Code syntax purple */
--syntax-yellow: #dcdcaa /* Code syntax yellow */
--syntax-gray: #858585   /* Comments */
```

## 📝 Environment Variables

```bash
# .env.local

# Backend API URL (with /api prefix)
VITE_API_BASE_URL=http://localhost:8080/api

# Backend base URL (for OAuth redirects, without /api)
VITE_BACKEND_URL=http://localhost:8080
```

> **Not:** Environment variables opsiyoneldir. Varsayılan değerler localhost:8080 olarak ayarlıdır.

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 👨‍💻 Geliştirici

**Mahmut Sami Yılmaz**
- GitHub: [@mahmutsyilmz](https://github.com/mahmutsyilmz)

## 🔗 İlgili Projeler

- [Sprint Mate Backend](https://github.com/mahmutsyilmz/sprint-mate-backend) - Spring Boot OAuth2 backend API

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!

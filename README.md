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
- 🔐 Kullanıcı girişi (Login)
- 📝 Kullanıcı kaydı
- 🎭 Rol seçimi (Frontend Developer / Backend Developer)
- 🔑 JWT tabanlı oturum yönetimi
- 🚪 Otomatik logout ve token yönetimi

### Dashboard
- 💻 IDE benzeri modern arayüz
- 🔍 Developer eşleştirme sistemi
- 📊 Real-time eşleşme durumu takibi
- 🎯 Proje detayları görüntüleme
- 📝 Terminal panel ile canlı log takibi

### UI/UX
- 🎨 Modern ve temiz tasarım
- 🌙 Koyu tema (Dark mode)
- ⚡ Hızlı ve responsive arayüz
- 🎭 Animasyonlu geçişler
- 💫 Binary background efekti

## 🚀 Teknolojiler

### Core
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server

### State Management & Routing
- **React Router DOM** - Client-side routing
- **React Context API** - State management

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **React Hot Toast** - Toast notifications
- **Material Symbols** - Icon library

### HTTP & API
- **Axios** - HTTP client
- **JWT Decode** - Token parsing

### Development Tools
- **ESLint** - Code linting
- **TypeScript ESLint** - TS-specific linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 📦 Kurulum

### Gereksinimler
- Node.js 18.x veya üzeri
- npm veya yarn

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

3. Environment variables'ı ayarlayın:
```bash
# .env.local dosyası oluşturun
VITE_API_BASE_URL=http://localhost:8080/api
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

### Giriş Yapma
1. Login sayfasında email ve şifrenizi girin
2. "Sign In" butonuna tıklayın
3. Başarılı girişten sonra rol seçimi sayfasına yönlendirileceksiniz

### Rol Seçimi
1. Frontend Developer veya Backend Developer rolünü seçin
2. "Continue to Dashboard" butonuna tıklayın
3. Dashboard'a yönlendirileceksiniz

### Dashboard Kullanımı
1. **Find Match** butonu ile eşleşme başlatın
2. Terminal panelinde eşleşme durumunu takip edin
3. Eşleşme bulunduğunda proje detayları görüntülenir
4. **View Details** ile proje hakkında detaylı bilgi alın
5. **Leave Match** ile eşleşmeden ayrılabilirsiniz

## 📁 Proje Yapısı

```
sprint-mate-frontend/
├── public/                  # Static files
├── src/
│   ├── assets/             # Images, icons, etc.
│   ├── components/         # Reusable components
│   │   ├── BinaryBackground.tsx
│   │   ├── IdeLayout.tsx
│   │   ├── TerminalPanel.tsx
│   │   └── index.ts
│   ├── contexts/           # React contexts
│   │   ├── AuthContext.tsx
│   │   └── index.ts
│   ├── pages/              # Page components
│   │   ├── Dashboard.tsx
│   │   ├── Login.tsx
│   │   ├── RoleSelect.tsx
│   │   └── index.ts
│   ├── services/           # API services
│   │   ├── api.ts          # Axios instance
│   │   ├── authService.ts  # Auth API calls
│   │   ├── matchService.ts # Match API calls
│   │   ├── userService.ts  # User API calls
│   │   └── index.ts
│   ├── types.ts            # TypeScript type definitions
│   ├── App.tsx             # Root component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🔌 API Entegrasyonu

### Base URL
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
```

### Endpoints

#### Authentication
- `POST /auth/login` - Kullanıcı girişi
- `POST /auth/register` - Kullanıcı kaydı

#### User
- `GET /users/me` - Mevcut kullanıcı bilgileri
- `POST /users/select-role` - Rol seçimi

#### Match
- `POST /matches/find` - Eşleşme başlat
- `GET /matches/status` - Eşleşme durumu
- `DELETE /matches/leave` - Eşleşmeden ayrıl

### Authentication Header
Tüm korumalı endpoint'ler için:
```typescript
Authorization: Bearer {jwt_token}
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

### Component Geliştirme

```typescript
// Örnek component yapısı
import { useState } from 'react';

interface MyComponentProps {
  title: string;
  onAction: () => void;
}

export function MyComponent({ title, onAction }: MyComponentProps) {
  const [state, setState] = useState<string>('');
  
  return (
    <div>
      <h1>{title}</h1>
      {/* Component content */}
    </div>
  );
}
```

### State Management

Context API kullanımı:
```typescript
// Context kullanımı
const { user, login, logout } = useAuth();

// Context sağlama
<AuthProvider>
  <App />
</AuthProvider>
```

## 🎨 Styling

Tailwind CSS utility classes kullanılmaktadır:

```typescript
<div className="bg-ide-bg text-white p-4 rounded-lg shadow-xl">
  {/* Content */}
</div>
```

### Custom Colors
```css
--ide-bg: #1e1e1e
--ide-sidebar: #252526
--ide-border: #3e3e42
--primary: #4ade80 (green-400)
--syntax-blue: #569cd6
--syntax-gray: #858585
```

## 📝 Environment Variables

```.env
# API Configuration
VITE_API_BASE_URL=http://localhost:8080/api

# Optional: Enable development features
VITE_DEV_MODE=true
```

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

- [Sprint Mate Backend](https://github.com/mahmutsyilmz/sprint-mate-backend) - Spring Boot backend API

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!

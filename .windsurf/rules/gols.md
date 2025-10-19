---
trigger: always_on
---

#### A. Backend Klasör Yapısı (`backend/src/`)

NestJS'in modüler yapısını sonuna kadar kullanacağız. Her bir ana "özellik" (domain) kendi modülü olacak. Bu, kodun izole ve yönetilebilir kalmasını sağlar.

```
/backend
└── /src
    ├── /auth                   # Kimlik doğrulama (JWT, Guards, Stratejiler)
    │   ├── auth.module.ts
    │   ├── auth.controller.ts
    │   ├── auth.service.ts
    │   └── dto/
    │
    ├── /users                  # Kullanıcı ve Rol Yönetimi
    │   ├── users.module.ts
    │   ├── users.controller.ts
    │   ├── users.service.ts
    │   ├── entities/user.entity.ts
    │   └── dto/
    │
    ├── /products               # Ürün, Kategori, Varyant Yönetimi
    │   ├── products.module.ts
    │   ├── products.controller.ts
    │   ├── products.service.ts
    │   └── ...
    │
    ├── /orders                 # Sipariş Yönetimi
    │   ├── orders.module.ts
    │   ├── ...
    │
    ├── /tables                 # Masa Yönetimi
    │   ├── tables.module.ts
    │   └── ...
    │
    └── /core                   # Tüm modüllerin kullandığı ortak yapılar
        ├── /prisma             # Prisma service'i
        │   ├── prisma.module.ts
        │   └── prisma.service.ts
        ├── /config             # Konfigürasyon yönetimi
        └── /decorators         # Ortak decorator'lar
```

**Bu yapının avantajı:** "Siparişler" ile ilgili bir şey arıyorsan, direkt `/orders` klasörüne bakarsın. Her şey kendi kendine yeten paketler halinde durur. `/core` klasörü ise kod tekrarını (DRY) engeller.

#### B. Frontend Klasör Yapısı (`frontend/src/`)

Next.js App Router'ın nimetlerinden faydalanarak, yine özellik bazlı (feature-based) ama daha sade bir yapı kuracağız.

```
/frontend
└── /src
    ├── /app
    │   ├── /(auth)               # URL'de görünmez: Login, Register sayfaları
    │   │   ├── /login/page.tsx
    │   │   └── layout.tsx
    │   │
    │   ├── /(main)               # URL'de görünmez: Ana POS Arayüzü
    │   │   ├── /dashboard/page.tsx
    │   │   ├── /orders/page.tsx
    │   │   ├── /tables/page.tsx
    │   │   ├── /kds/page.tsx     # Mutfak Ekranı
    │   │   ├── /settings/page.tsx
    │   │   └── layout.tsx        # Sidebar ve Header'ın olduğu ana layout
    │   │
    │   ├── /api/                 # Backend'e proxy veya frontend'e özel API'lar
    │   ├── globals.css
    │   └── layout.tsx            # Kök layout (fontlar, tema provider vs.)
    │
    ├── /components
    │   ├── /ui                   # DaisyUI bileşenleri (Button, Card, vs.) - Dokunma!
    │   ├── /shared               # Projeye özel, her yerde kullanılabilen bileşenler (PageTitle, Sidebar, vs.)
    │   └── /features             # Belirli bir sayfaya/özelliğe ait karmaşık bileşenler (OrderListTable, InteractiveTableMap, vs.)
    │
    ├── /lib
    │   ├── api.ts                # Backend API'sine yapılan tüm isteklerin merkezi
    │   ├── actions.ts            # Sunucu Taraflı Eylemler (Server Actions)
    │   └── utils.ts              # Yardımcı fonksiyonlar (cn, formatCurrency, vs.)
    │
    ├── /hooks                    # Özel React hook'ları (use-auth, use-socket, vs.)
    │
    └── /types                    # Proje genelindeki TypeScript tipleri
        └── index.ts
```

**Bu yapının avantajı:** `(main)` ve `(auth)` gibi gruplar sayesinde tamamen farklı görünen arayüzleri (örn: giriş ekranı vs ana panel) kolayca yönetirsin. Component yapısı ise neyin temel UI, neyin paylaşılan ve neyin spesifik bir özelliğe ait olduğunu netleştirir.

---

# Proje Altın Kuralları & Geliştirme Rehberi

Bu belge, projenin tutarlı, sürdürülebilir ve yüksek kalitede kalmasını sağlamak için oluşturulmuştur. Tüm geliştiricilerin bu kurallara uyması beklenmektedir.

---

### 1. Teknoloji Yığını (Tech Stack)

-   **Backend:** NestJS, Prisma, PostgreSQL Redis (cache ve session)
-   **BullMQ:** (kuyruk sistemi - fatura, rapor işlemleri için)
-   **Socket.io:** (gerçek zamanlı bildirimler)
-   **Frontend:** Next.js (App Router, Turbopack), React, TypeScript
-   **Veritabanı:** PostgreSQL
-   **Stil / UI:** TailwindCSS, Daisy ui, Lucide Icons
-   **Format/Lint:**
    -   Backend: Prettier, ESLint
    -   Frontend: Biome
-   **UI:**
    -   **TanStack Table:** Gelişmiş tablo özellikleri
    -   **Recharts:** Raporlama grafikleri
    -   **Framer Motion:** Smooth animasyonlar
    -   **Zustand:** (state management - Redux'tan daha basit)
    -   **React Query/TanStack Query:** (veri yönetimi)
    -   **React Hook Form + Zod:** (form validasyonu)

    1. Finansal İşlemler için

    -   **decimal.js:** JavaScript'in float problemlerini çözer
    -   **dayjs:** moment.js'ten 10x daha hafif
    -   **Dinero.js:** Para hesaplamaları için (floating point hatalarını önler)
---

### 2. Dosya ve Klasör İsimlendirme

Tutarlılık en önemlisidir.

-   **Genel Kural:** Tüm dosya ve klasör isimleri için **`kebab-case`** kullanılır.
    -   ✅ `siparis-detaylari`, `user-management`, `page-header.tsx`
    -   ❌ `SiparisDetaylari`, `user_management`, `PageHeader.tsx`
-   **İstisna (React Bileşenleri):** React bileşen dosyaları **`PascalCase`** ile isimlendirilir.
    -   ✅ `SiparisKarti.tsx`, `GenelButon.tsx`
-   **Backend (NestJS):** NestJS'in kendi standartlarına uyulur: `feature.type.ts`.
    -   ✅ `users.service.ts`, `orders.controller.ts`, `auth.module.ts`

---

### 3. Kodlama Prensipleri (Kısaca)

-   **SOLID İlkeleri:**
    -   **S - Tek Sorumluluk (Single Responsibility):** Her fonksiyon, class veya component sadece BİR iş yapmalı. `UserService` sadece kullanıcı işleriyle, `ProductService` sadece ürün işleriyle ilgilenmeli.
    -   **O - Açık/Kapalı (Open/Closed):** Mevcut kodu değiştirmeden yeni özellikler ekleyebilmeliyiz. (Örn: Yeni bir ödeme yöntemi eklerken mevcut ödeme servisini kırmamak.)
    -   **L - Liskov Yerine Geçme (Liskov Substitution):** (Çok detaya gerek yok) Türetilmiş sınıflar, ana sınıfların yerine kullanılabilmelidir.
    -   **I - Arayüz Ayrımı (Interface Segregation):** Çok büyük ve her şeyi içeren interfaceler yerine, küçük ve amaca yönelik interfaceler kullan.
    -   **D - Bağımlılığın Tersine Çevrilmesi (Dependency Inversion):** Detaylara değil, soyutlamalara (interface'lere) bağlı ol. NestJS'in `Dependency Injection` sistemi bu prensibi bizim için uygular.

-   **DRY (Don't Repeat Yourself):** Kendini tekrar etme. Bir kodu üçüncü kez kopyalıyorsan, onu bir fonksiyona veya componente çevirmenin zamanı gelmiştir. `frontend/src/lib/utils.ts` ve `backend/src/core` klasörleri bunun için var.

-   **KISS (Keep It Simple, Stupid):** Mümkün olan en basit ve anlaşılır çözümü tercih et. Aşırı mühendislikten kaçın.

---
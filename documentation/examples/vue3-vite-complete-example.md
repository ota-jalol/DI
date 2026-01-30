# Vue 3 + Vite bilan DI Container - To'liq Misol / Complete Example with Vue 3 + Vite

Bu qo'llanma Vue 3 va Vite ishlatib, DI Container bilan to'liq ishlaydigan ilova yaratishni ko'rsatadi.

This guide shows how to create a complete working application using Vue 3, Vite, and DI Container.

## Loyiha yaratish / Create Project

### 1-qadam: Vite loyiha yaratish / Step 1: Create Vite Project

```bash
# Vue 3 + TypeScript loyiha yaratish / Create Vue 3 + TypeScript project
npm create vite@latest my-vue-di-app -- --template vue-ts

cd my-vue-di-app
```

### 2-qadam: DI paketlarini o'rnatish / Step 2: Install DI Packages

```bash
# DI va compiler paketlari / DI and compiler packages
npm install @wessberg/di
npm install @wessberg/di-compiler ts-patch --save-dev

# ts-patch ni faollashtirish / Enable ts-patch
npx ts-patch install
```

## Loyiha strukturasi / Project Structure

```
my-vue-di-app/
├── src/
│   ├── di/
│   │   ├── container.ts          # DI container setup
│   │   └── plugin.ts             # Vue plugin
│   ├── services/
│   │   ├── ApiClient.ts          # HTTP client service
│   │   └── UserService.ts        # User service
│   ├── components/
│   │   └── UserList.vue          # Example component
│   ├── App.vue
│   └── main.ts
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## Konfiguratsiya fayllari / Configuration Files

### package.json

```json
{
  "name": "my-vue-di-app",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "preview": "vite preview",
    "postinstall": "ts-patch install -s"
  },
  "dependencies": {
    "vue": "^3.4.0",
    "@wessberg/di": "^3.0.2"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.0",
    "@wessberg/di-compiler": "^3.0.1",
    "ts-patch": "^3.0.2",
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "vue-tsc": "^1.8.27"
  }
}
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    /* DI-Compiler */
    "plugins": [
      {
        "transform": "@wessberg/di-compiler"
      }
    ]
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### tsconfig.node.json

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

### vite.config.ts

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000
  }
})
```

**Eslatma / Note**: Vite ESBuild ishlatadi, lekin DI-Compiler uchun ts-patch yetarli. Vite build vaqtida TypeScript ni to'g'ri ishlaydi.

Vite uses ESBuild, but ts-patch is sufficient for DI-Compiler. Vite processes TypeScript correctly at build time.

### .env

```env
VITE_API_BASE_URL=https://jsonplaceholder.typicode.com
VITE_API_KEY=
```

### .env.local (yaratish / create - git'ga qo'shilmaydi / not committed to git)

```env
VITE_API_KEY=your-secret-api-key
```

## Kod fayllari / Code Files

### src/di/container.ts

```typescript
import { DIContainer } from '@wessberg/di';

// Types
export interface ApiConfig {
  baseUrl: string;
  apiKey: string;
  timeout: number;
}

// Services
import { ApiClient } from '../services/ApiClient';
import { UserService } from '../services/UserService';

// Container yaratish / Create container
export const container = new DIContainer();

// Konfiguratsiya / Configuration
const apiConfig: ApiConfig = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api.example.com',
  apiKey: import.meta.env.VITE_API_KEY || '',
  timeout: 5000
};

// Production da ogohlantirish / Warning in production
if (import.meta.env.PROD && !apiConfig.apiKey) {
  console.warn('⚠️ API key is missing in production');
}

// ApiConfig ni ro'yxatdan o'tkazish / Register ApiConfig
container.registerSingleton<ApiConfig>(() => apiConfig, {
  identifier: 'ApiConfig'
});

// ApiClient ni ro'yxatdan o'tkazish / Register ApiClient
container.registerSingleton<ApiClient>(
  () => new ApiClient(apiConfig),
  { identifier: 'ApiClient' }
);

// UserService ni ro'yxatdan o'tkazish / Register UserService
container.registerSingleton<UserService>(
  () => new UserService(container.get<ApiClient>({ identifier: 'ApiClient' })),
  { identifier: 'UserService' }
);
```

### src/di/plugin.ts

```typescript
import type { App } from 'vue';
import { container } from './container';
import type { DIContainer } from '@wessberg/di';

// Vue global properties uchun type / Type for Vue global properties
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $container: DIContainer;
  }
}

// Vue plugin
export const DIPlugin = {
  install(app: App) {
    // Global property sifatida / As global property
    app.config.globalProperties.$container = container;
    
    // Provide/inject uchun / For provide/inject
    app.provide('container', container);
  }
};
```

### src/services/ApiClient.ts

```typescript
import type { ApiConfig } from '../di/container';

export class ApiClient {
  constructor(private config: ApiConfig) {
    console.log('✅ ApiClient initialized:', this.config.baseUrl);
  }

  async get<T>(endpoint: string): Promise<T> {
    const url = `${this.config.baseUrl}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`;
    }

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers,
        signal: AbortSignal.timeout(this.config.timeout)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    const url = `${this.config.baseUrl}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(this.config.timeout)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }
}
```

### src/services/UserService.ts

```typescript
import type { ApiClient } from './ApiClient';

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone?: string;
  website?: string;
}

export class UserService {
  constructor(private apiClient: ApiClient) {
    console.log('✅ UserService initialized');
  }

  async getUsers(): Promise<User[]> {
    console.log('📡 Fetching users...');
    return this.apiClient.get<User[]>('/users');
  }

  async getUserById(id: number): Promise<User> {
    console.log(`📡 Fetching user ${id}...`);
    return this.apiClient.get<User>(`/users/${id}`);
  }

  async createUser(user: Omit<User, 'id'>): Promise<User> {
    console.log('📡 Creating user...');
    return this.apiClient.post<User>('/users', user);
  }
}
```

### src/main.ts

```typescript
import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { DIPlugin } from './di/plugin';

const app = createApp(App);

// DI plugin ni o'rnatish / Install DI plugin
app.use(DIPlugin);

app.mount('#app');

console.log('✅ Vue app mounted with DI Container');
```

### src/App.vue

```vue
<script setup lang="ts">
import { ref } from 'vue';
import UserList from './components/UserList.vue';

const showUsers = ref(true);
</script>

<template>
  <div id="app">
    <header>
      <h1>🚀 Vue 3 + Vite + DI Container</h1>
      <p>Dependency Injection Container bilan ishlash / Working with Dependency Injection Container</p>
    </header>

    <main>
      <div class="controls">
        <button @click="showUsers = !showUsers">
          {{ showUsers ? '❌ Yashirish' : '✅ Ko\'rsatish' }} / {{ showUsers ? 'Hide' : 'Show' }}
        </button>
      </div>

      <UserList v-if="showUsers" />
    </main>

    <footer>
      <p>Made with ❤️ using Vue 3 + Vite + @wessberg/di</p>
    </footer>
  </div>
</template>

<style scoped>
#app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

header {
  text-align: center;
  margin-bottom: 2rem;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

main {
  background: #f5f5f5;
  padding: 2rem;
  border-radius: 8px;
}

.controls {
  margin-bottom: 1rem;
  text-align: center;
}

button {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

button:hover {
  background: #35495e;
}

footer {
  text-align: center;
  margin-top: 2rem;
  color: #666;
}
</style>
```

### src/components/UserList.vue

```vue
<script setup lang="ts">
import { ref, onMounted, inject } from 'vue';
import type { DIContainer } from '@wessberg/di';
import type { UserService, User } from '../services/UserService';

// Container ni inject qilish / Inject container
const container = inject<DIContainer>('container');

if (!container) {
  throw new Error('DI Container topilmadi! / DI Container not found!');
}

// UserService ni olish / Get UserService
const userService = container.get<UserService>({ identifier: 'UserService' });

// State
const users = ref<User[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

// Ma'lumotlarni yuklash / Load data
onMounted(async () => {
  loading.value = true;
  error.value = null;

  try {
    users.value = await userService.getUsers();
    console.log('✅ Users loaded:', users.value.length);
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Xato yuz berdi / An error occurred';
    console.error('❌ Error loading users:', err);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="user-list">
    <h2>👥 Foydalanuvchilar / Users</h2>

    <div v-if="loading" class="loading">
      ⏳ Yuklanmoqda... / Loading...
    </div>

    <div v-else-if="error" class="error">
      ❌ Xato / Error: {{ error }}
    </div>

    <div v-else-if="users.length === 0" class="empty">
      📭 Foydalanuvchilar topilmadi / No users found
    </div>

    <div v-else class="users-grid">
      <div v-for="user in users" :key="user.id" class="user-card">
        <h3>{{ user.name }}</h3>
        <p><strong>Username:</strong> {{ user.username }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p v-if="user.phone"><strong>Phone:</strong> {{ user.phone }}</p>
        <p v-if="user.website"><strong>Website:</strong> {{ user.website }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-list {
  padding: 1rem;
}

h2 {
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

.loading,
.error,
.empty {
  padding: 2rem;
  text-align: center;
  font-size: 1.2rem;
}

.error {
  color: #e74c3c;
  background: #fdecea;
  border-radius: 4px;
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.user-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.user-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.user-card h3 {
  margin: 0 0 1rem 0;
  color: #42b883;
}

.user-card p {
  margin: 0.5rem 0;
  color: #555;
}

.user-card strong {
  color: #2c3e50;
}
</style>
```

### src/style.css

```css
:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #242424;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  margin: 0;
  display: flex;
  place-items: center;
  min-width: 320px;
  min-height: 100vh;
}

#app {
  max-width: 1280px;
  margin: 0 auto;
  text-align: center;
}
```

## Ishga tushirish / Running

### Development server

```bash
npm run dev
```

Browser'da ochish / Open in browser: http://localhost:3000

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## Muhim nuqtalar / Key Points

### 1. ts-patch muhim / ts-patch is important

ts-patch DI-Compiler ni to'g'ri ishlashiga imkon beradi. Vite ESBuild ishlatsa ham, TypeScript transformation kerak.

ts-patch enables DI-Compiler to work correctly. Even though Vite uses ESBuild, TypeScript transformation is needed.

### 2. Vite environment variables

Vite `import.meta.env` ishlatadi. `.env` faylida `VITE_` prefiksi bilan boshlanishi kerak.

Vite uses `import.meta.env`. Variables in `.env` must start with `VITE_` prefix.

### 3. Type declarations

`src/di/plugin.ts` da Vue global properties uchun type declaration mavjud.

Type declaration for Vue global properties is in `src/di/plugin.ts`.

### 4. inject vs globalProperties

Composition API da `inject` ishlatish tavsiya etiladi. Options API da `this.$container` ishlatiladi.

Using `inject` is recommended in Composition API. In Options API, use `this.$container`.

## Composable yaratish / Create Composable

Agar xizmatlarni oson ishlatish uchun composable yaratmoqchi bo'lsangiz:

If you want to create a composable for easier service usage:

### src/composables/useDI.ts

```typescript
import { inject } from 'vue';
import type { DIContainer } from '@wessberg/di';

export function useDI() {
  const container = inject<DIContainer>('container');
  
  if (!container) {
    throw new Error('DI Container topilmadi! / DI Container not found!');
  }
  
  return {
    container,
    getService<T>(identifier: string): T {
      return container.get<T>({ identifier });
    }
  };
}

// Maxsus composable'lar / Specific composables
export function useUserService() {
  const { getService } = useDI();
  return getService<UserService>('UserService');
}

export function useApiClient() {
  const { getService } = useDI();
  return getService<ApiClient>('ApiClient');
}
```

### Component'da ishlatish / Usage in Component

```vue
<script setup lang="ts">
import { useUserService } from '../composables/useDI';

// Juda oddiy! / Very simple!
const userService = useUserService();

// ...
</script>
```

## Options API misoli / Options API Example

Agar Options API ishlatmoqchi bo'lsangiz:

If you want to use Options API:

```vue
<script lang="ts">
import { defineComponent } from 'vue';
import type { UserService, User } from '../services/UserService';

export default defineComponent({
  name: 'UserListOptions',
  
  data() {
    return {
      users: [] as User[],
      loading: false,
      error: null as string | null
    };
  },
  
  computed: {
    userService(): UserService {
      // this.$container global property orqali
      // Via this.$container global property
      return this.$container.get<UserService>({ identifier: 'UserService' });
    }
  },
  
  async mounted() {
    this.loading = true;
    
    try {
      this.users = await this.userService.getUsers();
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Error occurred';
    } finally {
      this.loading = false;
    }
  }
});
</script>

<template>
  <!-- Same template as above -->
</template>
```

## Pinia bilan / With Pinia

Agar Pinia store ishlatayotgan bo'lsangiz:

If you're using Pinia store:

```typescript
// src/stores/userStore.ts
import { defineStore } from 'pinia';
import { container } from '../di/container';
import type { UserService, User } from '../services/UserService';

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [] as User[],
    loading: false,
    error: null as string | null
  }),
  
  actions: {
    async fetchUsers() {
      // DI container dan xizmatni olish
      // Get service from DI container
      const userService = container.get<UserService>({ identifier: 'UserService' });
      
      this.loading = true;
      this.error = null;
      
      try {
        this.users = await userService.getUsers();
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Error occurred';
        throw err;
      } finally {
        this.loading = false;
      }
    }
  }
});
```

## Xatoliklarni tuzatish / Troubleshooting

### Xato: "2 arguments required, but only 0 present"

**Sabab / Cause**: DI-Compiler ishlamayapti.

**Yechim / Solution**:
1. `npx ts-patch install` ni qayta ishga tushiring
2. `tsconfig.json` da `plugins` borligini tekshiring
3. Development server'ni qayta ishga tushiring: `npm run dev`

### Xato: "Cannot find module '@wessberg/di-compiler'"

**Yechim / Solution**:
```bash
npm install @wessberg/di-compiler --save-dev
npx ts-patch install
```

### Container topilmadi / Container not found

Agar component'da "Container not found" xatosi ko'rsangiz:

If you see "Container not found" error in component:

**Yechim / Solution**:
1. `main.ts` da `app.use(DIPlugin)` qo'shilganligini tekshiring
2. Plugin import qilinganligini tekshiring

## Qo'shimcha resurslar / Additional Resources

- [Vue.js Integration Guide](./vue-integration.md) - Batafsil Vue integratsiya hujjati
- [DI-Compiler Setup](./di-compiler-setup.md) - DI-Compiler sozlash
- [Quick Answer](./vue-quick-answer.md) - Tez javoblar

## Xulosa / Conclusion

Bu to'liq ishlaydigan Vue 3 + Vite + DI Container misoli! Loyihani yaratib, yuqoridagi fayllarni qo'shing va `npm run dev` bilan ishga tushiring.

This is a complete working Vue 3 + Vite + DI Container example! Create the project, add the files above, and run with `npm run dev`.

**Muhim / Important**:
- ✅ ts-patch TypeScript 5.0+ bilan ishlaydi
- ✅ Vite tez va samarali
- ✅ DI Container barcha xizmatlarni boshqaradi
- ✅ Type-safe va to'liq TypeScript qo'llab-quvvatlash

---

**Savollar? / Questions?** [GitHub Issues](https://github.com/wessberg/di/issues)

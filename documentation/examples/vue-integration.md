# Vue.js bilan DI Container ishlatish / Using DI Container with Vue.js

Ha, DI Container Vue.js ilovalariga **JUDA YAXSHI** bog'lanadi! Bu yerda Vue 3 bilan ishlatish uchun misollar keltirilgan.

Yes, the DI Container works **GREAT** with Vue.js applications! Here are examples for using it with Vue 3.

## Tez javob / Quick Answer

**DI Container Vue.js ga to'liq mos keladi!** Uni Vue ilovasida global qilib o'rnatish yoki provide/inject pattern bilan ishlatish mumkin.

**The DI Container is fully compatible with Vue.js!** You can use it globally in your Vue app or with the provide/inject pattern.

## Usul 1 / Method 1: Global Container (Vue 3)

Vue ilovasida global DI container o'rnatish:

Set up a global DI container in your Vue app:

### 1. Container ni yaratish / Create Container

```typescript
// src/di/container.ts
import {DIContainer} from "@wessberg/di";
import type {ApiConfig} from "./types";
import {ApiClient} from "./services/ApiClient";
import {UserService} from "./services/UserService";

// Container ni yaratish / Create the container
export const container = new DIContainer();

// Konfiguratsiyani ro'yxatdan o'tkazish / Register configuration
const apiConfig: ApiConfig = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || "https://api.example.com",
  apiKey: import.meta.env.VITE_API_KEY || "",
  timeout: 5000
};

// Production da API key mavjudligini tekshirish / Check for API key in production
if (import.meta.env.PROD && !apiConfig.apiKey) {
  console.warn("Warning: API key is missing in production environment");
}

container.registerSingleton<ApiConfig>(() => apiConfig, {
  identifier: "ApiConfig"
});

// Xizmatlarni ro'yxatdan o'tkazish / Register services
container.registerSingleton<ApiClient>(
  () => new ApiClient(apiConfig),
  {identifier: "ApiClient"}
);

container.registerSingleton<UserService>(
  () => new UserService(container.get<ApiClient>({identifier: "ApiClient"})),
  {identifier: "UserService"}
);
```

### 2. Vue Plugin yaratish / Create Vue Plugin

```typescript
// src/di/plugin.ts
import type {App} from "vue";
import {container} from "./container";

// DIContainer uchun Vue plugin
// Vue plugin for DIContainer
export const DIPlugin = {
  install(app: App) {
    // Global property sifatida qo'shish
    // Add as global property
    app.config.globalProperties.$container = container;
    
    // Provide/inject uchun
    // For provide/inject
    app.provide("container", container);
  }
};
```

### 3. Vue ilovasida ishlatish / Use in Vue App

```typescript
// src/main.ts
import {createApp} from "vue";
import App from "./App.vue";
import {DIPlugin} from "./di/plugin";

const app = createApp(App);

// DI plugin ni o'rnatish / Install DI plugin
app.use(DIPlugin);

app.mount("#app");
```

## Usul 2 / Method 2: Composition API bilan / With Composition API

Composition API da inject yordamida ishlatish:

Use with Composition API using inject:

```vue
<!-- src/components/UserList.vue -->
<script setup lang="ts">
import {inject, ref, onMounted} from "vue";
import type {DIContainer} from "@wessberg/di";
import type {UserService} from "../services/UserService";

// Container ni olish / Get the container
const container = inject<DIContainer>("container");

// Xizmatni olish / Get the service
const userService = container?.get<UserService>({identifier: "UserService"});

// State
const users = ref([]);
const loading = ref(false);

// Ma'lumotlarni yuklash / Load data
onMounted(async () => {
  if (!userService) return;
  
  loading.value = true;
  try {
    users.value = await userService.getUsers();
  } catch (error) {
    console.error("Error loading users:", error);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="user-list">
    <h2>Foydalanuvchilar / Users</h2>
    
    <div v-if="loading">Yuklanmoqda... / Loading...</div>
    
    <ul v-else>
      <li v-for="user in users" :key="user.id">
        {{ user.name }}
      </li>
    </ul>
  </div>
</template>
```

## Usul 3 / Method 3: Options API bilan / With Options API

Options API da global properties yordamida:

Use with Options API via global properties:

```vue
<!-- src/components/UserProfile.vue -->
<script lang="ts">
import {defineComponent} from "vue";
import type {UserService} from "../services/UserService";

export default defineComponent({
  name: "UserProfile",
  
  data() {
    return {
      user: null,
      loading: false
    };
  },
  
  computed: {
    userService(): UserService {
      // this.$container global property orqali
      // Via this.$container global property
      return this.$container.get<UserService>({identifier: "UserService"});
    }
  },
  
  async mounted() {
    this.loading = true;
    try {
      this.user = await this.userService.getCurrentUser();
    } catch (error) {
      console.error("Error loading user:", error);
    } finally {
      this.loading = false;
    }
  }
});
</script>

<template>
  <div class="user-profile">
    <div v-if="loading">Yuklanmoqda... / Loading...</div>
    <div v-else-if="user">
      <h3>{{ user.name }}</h3>
      <p>{{ user.email }}</p>
    </div>
  </div>
</template>
```

## Usul 4 / Method 4: Composable yaratish / Create Composable

Qayta foydalanish uchun composable:

Create a reusable composable:

```typescript
// src/composables/useService.ts
import {inject} from "vue";
import type {DIContainer} from "@wessberg/di";
import type {ApiClient} from "../services/ApiClient";
import type {UserService} from "../services/UserService";

export function useService<T>(identifier: string): T {
  const container = inject<DIContainer>("container");
  
  if (!container) {
    throw new Error("DI Container topilmadi / DI Container not found");
  }
  
  return container.get<T>({identifier});
}

// Maxsus composable'lar / Specific composables
export function useApiClient() {
  return useService<ApiClient>("ApiClient");
}

export function useUserService() {
  return useService<UserService>("UserService");
}
```

### Composable dan foydalanish / Using the Composable

```vue
<script setup lang="ts">
import {ref, onMounted} from "vue";
import {useUserService} from "../composables/useService";

const userService = useUserService();
const users = ref([]);

onMounted(async () => {
  users.value = await userService.getUsers();
});
</script>

<template>
  <div>
    <h2>Foydalanuvchilar / Users</h2>
    <ul>
      <li v-for="user in users" :key="user.id">{{ user.name }}</li>
    </ul>
  </div>
</template>
```

## Usul 5 / Method 5: Pinia Store bilan / With Pinia Store

Pinia store ichida DI container ishlatish:

Use DI container inside Pinia store:

```typescript
// src/stores/userStore.ts
import {defineStore} from "pinia";
import {container} from "../di/container";
import type {UserService} from "../services/UserService";

export const useUserStore = defineStore("user", {
  state: () => ({
    users: [],
    loading: false,
    error: null
  }),
  
  actions: {
    async fetchUsers() {
      // DI container dan xizmatni olish
      // Get service from DI container
      const userService = container.get<UserService>({identifier: "UserService"});
      
      this.loading = true;
      this.error = null;
      
      try {
        this.users = await userService.getUsers();
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
        this.error = errorMessage;
        throw err;
      } finally {
        this.loading = false;
      }
    }
  }
});
```

## To'liq misol: Real Vue 3 ilovasi / Complete Example: Real Vue 3 App

```typescript
// src/services/ApiClient.ts
export interface ApiConfig {
  baseUrl: string;
  apiKey: string;
  timeout: number;
}

export class ApiClient {
  constructor(private config: ApiConfig) {}
  
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
      headers: {
        "Authorization": `Bearer ${this.config.apiKey}`,
        "Content-Type": "application/json"
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }
  
  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.config.apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }
}
```

```typescript
// src/services/UserService.ts
import type {ApiClient} from "./ApiClient";

export interface User {
  id: number;
  name: string;
  email: string;
}

export class UserService {
  constructor(private apiClient: ApiClient) {}
  
  async getUsers(): Promise<User[]> {
    return this.apiClient.get<User[]>("/users");
  }
  
  async getUserById(id: number): Promise<User> {
    return this.apiClient.get<User>(`/users/${id}`);
  }
  
  async createUser(user: Omit<User, "id">): Promise<User> {
    return this.apiClient.post<User>("/users", user);
  }
}
```

## TypeScript uchun global types / Global Types for TypeScript

```typescript
// src/types/vue.d.ts
import type {DIContainer} from "@wessberg/di";

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $container: DIContainer;
  }
}

export {};
```

## Muhim nuqtalar / Important Points

1. **Singleton Pattern**: DI container Singleton pattern bilan juda yaxshi ishlaydi, Vue ilovalarida bitta container instance ishlatiladi.

2. **Reactivity**: Vue ning reactivity tizimi DI container bilan muammosiz ishlaydi.

3. **Testing**: Test qilishda DI container orqali oson mock xizmatlar yaratish mumkin.

4. **Performance**: Container lazy loading va singleton pattern tufayli samarali ishlaydi.

5. **DI-Compiler**: Bu kutubxona to'g'ri ishlashi uchun [DI-Compiler](https://github.com/wessberg/di-compiler) kerak, lekin bu Vue integratsiyasiga ta'sir qilmaydi.

---

## Xulosa / Conclusion

**Ha, DI Container Vue.js ga MUKAMMAL bog'lanadi!** Yuqoridagi misollardan ko'rinib turibdiki, Vue 3 ning barcha xususiyatlari (Composition API, Options API, Provide/Inject, Pinia) bilan ishlash mumkin.

**Yes, the DI Container works PERFECTLY with Vue.js!** As shown in the examples above, it works with all Vue 3 features (Composition API, Options API, Provide/Inject, Pinia).

Container ishlatish Vue ilovangizda:
- ✅ Yaxshi arxitektura yaratadi / Creates better architecture
- ✅ Testlashni osonlashtiradi / Makes testing easier
- ✅ Kodni qayta foydalanish imkonini beradi / Enables code reuse
- ✅ Dependency management ni yaxshilaydi / Improves dependency management

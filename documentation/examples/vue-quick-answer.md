# Yo'q! Container Vue.js ga BOG'LANADI!

## Savol
> "shunda container vue app ga bog'lanmaydi shundaymi"

## Javob

**YO'Q!** Container Vue.js ilovasiga **TO'LIQ bog'lanadi** va juda yaxshi ishlaydi! 

**NO!** The Container **FULLY connects** to Vue.js applications and works great!

## Qisqa javob / Quick Answer

Container ni Vue.js da ishlatish uchun:

To use the container in Vue.js:

```typescript
// 1. Container yaratish / Create container
import {DIContainer} from "@wessberg/di";

export const container = new DIContainer();

// 2. Xizmatlarni ro'yxatdan o'tkazish / Register services
container.registerSingleton<ApiClient>(
  () => new ApiClient(config),
  {identifier: "ApiClient"}
);

// 3. Vue plugin yaratish / Create Vue plugin
export const DIPlugin = {
  install(app) {
    app.provide("container", container);
  }
};

// 4. main.ts da ishlatish / Use in main.ts
import {createApp} from "vue";
import {DIPlugin} from "./di/plugin";

const app = createApp(App);
app.use(DIPlugin);

// 5. Component da ishlatish / Use in component
<script setup>
import {inject} from "vue";

const container = inject("container");
const apiClient = container.get({identifier: "ApiClient"});
</script>
```

## To'liq misol / Complete Example

### main.ts
```typescript
import {createApp} from "vue";
import {DIContainer} from "@wessberg/di";
import App from "./App.vue";

// Container yaratish / Create container
const container = new DIContainer();

// Konfiguratsiya / Configuration
const apiConfig = {
  baseUrl: "https://api.example.com",
  apiKey: "your-key"
};

// Xizmatlarni ro'yxatdan o'tkazish / Register services
container.registerSingleton<ApiClient>(
  () => new ApiClient(apiConfig),
  {identifier: "ApiClient"}
);

// Vue ilovasini yaratish / Create Vue app
const app = createApp(App);

// Container ni provide qilish / Provide container
app.provide("container", container);

app.mount("#app");
```

### Component.vue
```vue
<script setup lang="ts">
import {inject, ref, onMounted} from "vue";
import type {DIContainer} from "@wessberg/di";
import type {ApiClient} from "./services/ApiClient";

// Container ni olish / Get container
const container = inject<DIContainer>("container");

if (!container) {
  throw new Error("DI Container not found. Make sure DIPlugin is installed.");
}

// Xizmatni olish / Get service
const apiClient = container.get<ApiClient>({identifier: "ApiClient"});

// Ma'lumotlarni yuklash / Load data
const users = ref([]);

onMounted(async () => {
  users.value = await apiClient.getUsers();
});
</script>

<template>
  <div>
    <h2>Foydalanuvchilar</h2>
    <ul>
      <li v-for="user in users" :key="user.id">
        {{ user.name }}
      </li>
    </ul>
  </div>
</template>
```

## Composable bilan / With Composable

```typescript
// composables/useService.ts
import {inject} from "vue";
import type {DIContainer} from "@wessberg/di";

export function useService<T>(identifier: string): T {
  const container = inject<DIContainer>("container");
  
  if (!container) {
    throw new Error("DI Container topilmadi / DI Container not found");
  }
  
  return container.get<T>({identifier});
}

// Maxsus composable / Specific composable
export function useApiClient() {
  return useService<ApiClient>("ApiClient");
}
```

```vue
<script setup>
import {useApiClient} from "./composables/useService";

// Juda oddiy! / Very simple!
const apiClient = useApiClient();
</script>
```

## Pinia Store bilan / With Pinia Store

```typescript
// stores/userStore.ts
import {defineStore} from "pinia";
import {container} from "../di/container";
import type {ApiClient} from "../services/ApiClient";

export const useUserStore = defineStore("user", {
  state: () => ({
    users: []
  }),
  
  actions: {
    async fetchUsers() {
      const apiClient = container.get<ApiClient>({identifier: "ApiClient"});
      this.users = await apiClient.getUsers();
    }
  }
});
```

## Afzalliklari / Advantages

Container ni Vue.js da ishlatish:

Using the container in Vue.js:

- ✅ **Yaxshi arxitektura** / **Better architecture** - Bog'liqliklarni boshqarish oson
- ✅ **Test qilish oson** / **Easy testing** - Mock xizmatlar yaratish oson
- ✅ **Qayta foydalanish** / **Reusability** - Xizmatlarni qayta ishlatish mumkin
- ✅ **TypeScript support** - To'liq type safety
- ✅ **Performance** - Lazy loading va singleton pattern

## To'liq hujjatlar / Full Documentation

Ko'proq misollar uchun qarang:

For more examples, see:

- [Vue.js Integration Guide](./vue-integration.md) - To'liq Vue.js integratsiya hujjatlari
- [ApiClient Config Guide](./api-client-config.md) - Konfiguratsiyani qanday yuborish

## Xulosa / Conclusion

**Container Vue.js ga MUKAMMAL bog'lanadi!** Yuqoridagi misollar ko'rsatib turganidek, Vue 3 ning barcha xususiyatlari bilan ishlaydi:

**The Container works PERFECTLY with Vue.js!** As shown in the examples above, it works with all Vue 3 features:

- Composition API ✅
- Options API ✅
- Provide/Inject ✅
- Pinia Stores ✅
- Composables ✅
- TypeScript ✅

Demak, savol noto'g'ri - container Vue.js ga **bog'lanadi** va juda yaxshi ishlaydi! 🎉

So the question is wrong - the container **does connect** to Vue.js and works great! 🎉

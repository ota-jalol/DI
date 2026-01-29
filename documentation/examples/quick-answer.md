# ApiClient konfiguratsiyasini yuborish - To'liq misol

# Passing Configuration to ApiClient - Complete Example

Bu fayl `ApiClient` ga konfiguratsiyani qanday yuborishni to'liq ishlaydigan misolda ko'rsatadi.

This file shows a complete working example of how to pass configuration to ApiClient.

## Eng oddiy usul: Factory funksiyasi / Simplest Method: Factory Function

```typescript
import {DIContainer} from "@wessberg/di";

// 1. Konfiguratsiya interfeysini aniqlash / Define configuration interface
interface ApiConfig {
  baseUrl: string;
  apiKey: string;
  timeout: number;
}

// 2. ApiClient klassini yaratish / Create ApiClient class
class ApiClient {
  constructor(private config: ApiConfig) {}
  
  async get(endpoint: string) {
    const url = `${this.config.baseUrl}${endpoint}`;
    console.log(`Calling: ${url}`);
    console.log(`Using API Key: ${this.config.apiKey}`);
    console.log(`Timeout: ${this.config.timeout}ms`);
    // API chaqiruvini amalga oshirish / Make actual API call
  }
}

// 3. Konfiguratsiya obyektini yaratish / Create configuration object
const myApiConfig: ApiConfig = {
  baseUrl: "https://api.example.com",
  apiKey: "your-secret-api-key",
  timeout: 5000
};

// 4. DI konteynerini yaratish / Create DI container
const container = new DIContainer();

// 5. ApiClient ni factory funksiyasi bilan ro'yxatdan o'tkazish
// Register ApiClient with factory function
container.registerSingleton<ApiClient>(
  () => new ApiClient(myApiConfig),
  {identifier: "ApiClient"}
);

// 6. ApiClient dan foydalanish / Use ApiClient
const apiClient = container.get<ApiClient>({identifier: "ApiClient"});
await apiClient.get("/users");

// Singleton - har safar bir xil instance qaytadi
// Singleton - returns the same instance every time
const apiClient2 = container.get<ApiClient>({identifier: "ApiClient"});
console.log(apiClient === apiClient2); // true
```

## Javob / Answer to the Original Question

Agar sizda quyidagi kod bo'lsa:

If you have this code:

```typescript
this.container.registerSingleton<ApiClient>();
```

Va ApiClient ga config yuborish kerak bo'lsa, quyidagi usullardan birini ishlating:

And need to pass config to ApiClient, use one of these methods:

### Usul 1 / Method 1: Factory funksiyasi (Tavsiya etiladi)

```typescript
const config = {
  baseUrl: "https://api.example.com",
  apiKey: "your-key",
  timeout: 5000
};

// ApiClient ni factory funksiyasi bilan registratsiya qilish
this.container.registerSingleton<ApiClient>(
  () => new ApiClient(config),
  {identifier: "ApiClient"}
);
```

### Usul 2 / Method 2: Config ni alohida service sifatida

```typescript
import {CONSTRUCTOR_ARGUMENTS_SYMBOL} from "@wessberg/di";

// ApiClient klassida dependency ni e'lon qilish
class ApiClient {
  static get [CONSTRUCTOR_ARGUMENTS_SYMBOL]() {
    return ["ApiConfig"];
  }

  constructor(private config: ApiConfig) {}
}

// Avval config ni registratsiya qilish
this.container.registerSingleton<ApiConfig>(
  () => config,
  {identifier: "ApiConfig"}
);

// Keyin ApiClient ni registratsiya qilish
this.container.registerSingleton<ApiClient>(
  undefined,
  {identifier: "ApiClient", implementation: ApiClient}
);
```

## Muhim nuqtalar / Key Points

1. **Factory funksiyasi eng oson** / **Factory function is easiest**: Ko'p hollarda factory funksiyasi eng sodda va aniq yechim.

2. **CONSTRUCTOR_ARGUMENTS_SYMBOL** faqat 2-usul uchun kerak / **CONSTRUCTOR_ARGUMENTS_SYMBOL** only needed for Method 2: Factory funksiyasi bilan bu kerak emas.

3. **Singleton davranishi** / **Singleton behavior**: `registerSingleton` dan foydalansangiz, bitta instance yaratiladi va har safar shu instance qaytadi.

4. **DI-Compiler kerak** / **DI-Compiler required**: Bu kutubxona to'g'ri ishlashi uchun [DI-Compiler](https://github.com/wessberg/di-compiler) o'rnatilgan bo'lishi kerak.

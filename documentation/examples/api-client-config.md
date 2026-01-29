# ApiClient bilan konfiguratsiya ishlatish / Using Configuration with ApiClient

Bu misol `ApiClient` konstruktoriga konfiguratsiyani qanday yuborish mumkinligini ko'rsatadi.

This example shows how to pass configuration to the ApiClient constructor.

## Usul 1 / Method 1: Factory funksiyasi / Factory Function

Eng oddiy usul - factory funksiyasidan foydalanish:

The simplest way is to use a factory function:

```typescript
import {DIContainer} from "@wessberg/di";

interface ApiConfig {
  baseUrl: string;
  apiKey: string;
  timeout: number;
}

class ApiClient {
  constructor(private config: ApiConfig) {}
  
  async get(endpoint: string) {
    // Use this.config.baseUrl, this.config.apiKey, etc.
    console.log(`Calling ${this.config.baseUrl}${endpoint}`);
  }
}

// Konfiguratsiya obyekti / Configuration object
const myApiConfig: ApiConfig = {
  baseUrl: "https://api.example.com",
  apiKey: "your-api-key",
  timeout: 5000
};

const container = new DIContainer();

// Factory funksiyasi yordamida registratsiya qilish
// Register using a factory function
container.registerSingleton<ApiClient>(() => new ApiClient(myApiConfig));

// Endi ApiClient ni olish mumkin
// Now you can get the ApiClient
const apiClient = container.get<ApiClient>();
```

## Usul 2 / Method 2: Konfiguratsiyani alohida xizmat sifatida / Configuration as Separate Service

Konfiguratsiyani ham xizmat sifatida ro'yxatdan o'tkazish mumkin:

You can also register the configuration itself as a service:

```typescript
import {DIContainer} from "@wessberg/di";
import {CONSTRUCTOR_ARGUMENTS_SYMBOL} from "@wessberg/di";

interface ApiConfig {
  baseUrl: string;
  apiKey: string;
  timeout: number;
}

class ApiClient {
  // DI-Compiler uchun konstruktor argumentlarini ko'rsatish
  // Specify constructor arguments for DI-Compiler
  static get [CONSTRUCTOR_ARGUMENTS_SYMBOL]() {
    return ["ApiConfig"];
  }

  constructor(private config: ApiConfig) {}
  
  async get(endpoint: string) {
    console.log(`Calling ${this.config.baseUrl}${endpoint}`);
  }
}

const myApiConfig: ApiConfig = {
  baseUrl: "https://api.example.com",
  apiKey: "your-api-key",
  timeout: 5000
};

const container = new DIContainer();

// Avval konfiguratsiyani registratsiya qilish
// First register the configuration
container.registerSingleton<ApiConfig>(() => myApiConfig, {
  identifier: "ApiConfig"
});

// Keyin ApiClient ni registratsiya qilish
// Then register the ApiClient
container.registerSingleton<ApiClient>(undefined, {
  identifier: "ApiClient",
  implementation: ApiClient
});

// ApiClient avtomatik ravishda ApiConfig ni oladi
// ApiClient will automatically receive ApiConfig
const apiClient = container.get<ApiClient>({identifier: "ApiClient"});
```

## Usul 3 / Method 3: Interfeys va implementatsiya / Interface and Implementation

Interfeys bilan ishlashda:

When working with interfaces:

```typescript
import {DIContainer} from "@wessberg/di";
import {CONSTRUCTOR_ARGUMENTS_SYMBOL} from "@wessberg/di";

interface IApiConfig {
  baseUrl: string;
  apiKey: string;
  timeout: number;
}

interface IApiClient {
  get(endpoint: string): Promise<void>;
}

class ApiClient implements IApiClient {
  static get [CONSTRUCTOR_ARGUMENTS_SYMBOL]() {
    return ["IApiConfig"];
  }

  constructor(private config: IApiConfig) {}
  
  async get(endpoint: string) {
    console.log(`Calling ${this.config.baseUrl}${endpoint}`);
  }
}

const myApiConfig: IApiConfig = {
  baseUrl: "https://api.example.com",
  apiKey: "your-api-key",
  timeout: 5000
};

const container = new DIContainer();

// Konfiguratsiyani registratsiya qilish
// Register the configuration
container.registerSingleton<IApiConfig>(() => myApiConfig, {
  identifier: "IApiConfig"
});

// ApiClient ni interfeys orqali registratsiya qilish
// Register ApiClient through interface
container.registerSingleton<IApiClient, ApiClient>(undefined, {
  identifier: "IApiClient",
  implementation: ApiClient
});

// Foydalanish
// Usage
const apiClient = container.get<IApiClient>({identifier: "IApiClient"});
```

## Muhim eslatmalar / Important Notes

1. **DI-Compiler zarur** / **DI-Compiler required**: Bu kutubxona to'g'ri ishlashi uchun [DI-Compiler](https://github.com/wessberg/di-compiler) dan foydalanish kerak.

2. **Factory funksiyalari** / **Factory functions**: Factory funksiyasi yordamida registratsiya qilsangiz, `CONSTRUCTOR_ARGUMENTS_SYMBOL` kerak emas.

3. **Dependency injection** / **Dependency injection**: Agar konfiguratsiyani alohida xizmat sifatida ro'yxatdan o'tkazsangiz, u avtomatik ravishda inject qilinadi.

4. **Singleton vs Transient**: 
   - `registerSingleton` - Faqat bitta instance yaratiladi
   - `registerTransient` - Har safar yangi instance yaratiladi

# DI-Compiler ni o'rnatish va sozlash / Installing and Configuring DI-Compiler

DI Container to'g'ri ishlashi uchun **DI-Compiler zarur**! Bu qo'llanma DI-Compiler ni qanday o'rnatish va sozlashni ko'rsatadi.

DI Container requires **DI-Compiler to work properly**! This guide shows how to install and configure DI-Compiler.

## Nega kerak? / Why is it needed?

DI Container interfeys va klasslar o'rtasidagi bog'lanishni compile vaqtida aniqlaydi. Bu ishni DI-Compiler bajaradi.

The DI Container identifies the relationship between interfaces and classes at compile time. DI-Compiler performs this task.

## 1. O'rnatish / Installation

### npm

```bash
npm install @wessberg/di
npm install @wessberg/di-compiler typescript --save-dev
```

### yarn

```bash
yarn add @wessberg/di
yarn add @wessberg/di-compiler typescript --dev
```

### pnpm

```bash
pnpm add @wessberg/di
pnpm add @wessberg/di-compiler typescript --save-dev
```

## 2. Sozlash / Configuration

DI-Compiler ni turli xil build tool'lar bilan ishlatish mumkin. Quyida eng mashhur usullar keltirilgan.

DI-Compiler can be used with various build tools. Below are the most popular methods.

**⚠️ TypeScript 5.0+ Eslatma / Note**: TypeScript 5.0 va undan yuqori versiyalar uchun **ts-patch tavsiya etiladi**. ttypescript eski versiyalar bilan muammo qiladi.

For TypeScript 5.0+, **ts-patch is recommended**. ttypescript has compatibility issues with newer versions.

### Usul 1 / Method 1: ts-patch bilan / With ts-patch (TAVSIYA ETILADI / RECOMMENDED)

ts-patch TypeScript ni to'g'ridan-to'g'ri patch qiladi va barcha TypeScript versiyalari bilan ishlaydi.

ts-patch directly patches TypeScript and works with all TypeScript versions.

#### 1.1. ts-patch ni o'rnatish / Install ts-patch

```bash
npm install ts-patch --save-dev
```

#### 1.2. ts-patch ni faollashtirish / Enable ts-patch

```bash
npx ts-patch install
```

#### 1.3. tsconfig.json sozlash / Configure tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "plugins": [
      {
        "transform": "@wessberg/di-compiler"
      }
    ]
  }
}
```

#### 1.4. package.json da script'lar / Scripts in package.json

```json
{
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  }
}
```

#### 1.5. Build qilish / Build

```bash
npm run build
```

**Afzallik / Advantage**: TypeScript 5.0+ bilan ishlaydi, oddiy `tsc` ishlatish mumkin.

Works with TypeScript 5.0+, can use regular `tsc`.

### Usul 2 / Method 2: ttypescript bilan / With ttypescript (faqat TypeScript 4.x uchun / for TypeScript 4.x only)

**⚠️ Ogohlantirish / Warning**: ttypescript TypeScript 5.0+ bilan ishlamaydi. ts-patch ishlatishni tavsiya qilamiz.

ttypescript doesn't work with TypeScript 5.0+. We recommend using ts-patch.

#### 2.1. ttypescript ni o'rnatish / Install ttypescript

```bash
npm install ttypescript typescript@4.9.5 --save-dev
```

#### 2.2. tsconfig.json ni sozlash / Configure tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "plugins": [
      {
        "transform": "@wessberg/di-compiler"
      }
    ]
  }
}
```

#### 2.3. package.json da script'lar / Scripts in package.json

```json
{
  "scripts": {
    "build": "ttsc",
    "dev": "ttsc --watch"
  }
}
```

#### 2.4. Ishlatish / Usage

```bash
npm run build
```

### Usul 3 / Method 3: Webpack bilan / With Webpack

Webpack + ts-loader yoki awesome-typescript-loader bilan ishlatish.

Using with Webpack + ts-loader or awesome-typescript-loader.

#### 3.1. Kerakli paketlar / Required packages

```bash
npm install webpack webpack-cli ts-loader ts-patch --save-dev
```

#### 3.2. ts-patch ni faollashtirish / Enable ts-patch

```bash
npx ts-patch install
```

#### 3.3. webpack.config.js

```javascript
const path = require('path');

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};
```

**Eslatma / Note**: ts-patch dan foydalansangiz, `compiler: 'ttypescript'` kerak emas. Oddiy ts-loader ishlaydi.

When using ts-patch, you don't need `compiler: 'ttypescript'`. Regular ts-loader works.

#### 3.4. tsconfig.json

```json
{
  "compilerOptions": {
    "plugins": [
      {
        "transform": "@wessberg/di-compiler"
      }
    ]
  }
}
```

### Usul 4 / Method 4: Rollup bilan / With Rollup

Rollup + @rollup/plugin-typescript bilan ishlatish.

Using with Rollup + @rollup/plugin-typescript.

#### 4.1. Kerakli paketlar / Required packages

```bash
npm install rollup @rollup/plugin-typescript ts-patch --save-dev
npx ts-patch install
```

#### 4.2. rollup.config.js

```javascript
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/bundle.js',
    format: 'esm'
  },
  plugins: [
    typescript({
      // ts-patch bilan oddiy TypeScript ishlaydi
      // Regular TypeScript works with ts-patch
    })
  ]
};
```

#### 4.3. tsconfig.json

```json
{
  "compilerOptions": {
    "plugins": [
      {
        "transform": "@wessberg/di-compiler"
      }
    ]
  }
}
```

### Usul 5 / Method 5: Vite bilan / With Vite

Vite + vite-plugin-checker bilan ishlatish.

Using with Vite + vite-plugin-checker.

#### 5.1. Kerakli paketlar / Required packages

```bash
npm install vite @vitejs/plugin-vue ts-patch --save-dev
npx ts-patch install
```

#### 5.2. vite.config.ts

```typescript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  esbuild: false,
  build: {
    rollupOptions: {
      // ts-patch bilan TypeScript ishlaydi
      // TypeScript works with ts-patch
    }
  }
});
```

**Eslatma / Note**: Vite ESBuild ishlatadi, lekin DI-Compiler uchun TypeScript compiler kerak. ts-patch o'rnatib, Rollup'ning typescript plugin'idan foydalaning.

Vite uses ESBuild, but DI-Compiler requires TypeScript compiler. Install ts-patch and use Rollup's typescript plugin.

### Usul 6 / Method 6: ts-node bilan / With ts-node

Development vaqtida to'g'ridan-to'g'ri ishlatish / Running directly during development.

#### 6.1. ts-node ni o'rnatish / Install ts-node

```bash
npm install ts-node ts-patch --save-dev
npx ts-patch install
```

#### 6.2. tsconfig.json

```json
{
  "compilerOptions": {
    "plugins": [
      {
        "transform": "@wessberg/di-compiler"
      }
    ]
  }
}
```

**Eslatma / Note**: ts-patch bilan `ts-node` oddiy ravishda ishlaydi, qo'shimcha konfiguratsiya kerak emas.

With ts-patch, `ts-node` works normally without additional configuration.

#### 6.3. Ishlatish / Usage

```bash
npx ts-node src/index.ts
```

## 3. To'liq misol / Complete Example

### Loyiha strukturasi / Project structure

```
my-project/
├── src/
│   ├── services/
│   │   ├── ApiClient.ts
│   │   └── UserService.ts
│   └── index.ts
├── package.json
└── tsconfig.json
```

### package.json

```json
{
  "name": "my-di-project",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "start": "node dist/index.js",
    "postinstall": "ts-patch install -s"
  },
  "dependencies": {
    "@wessberg/di": "^3.0.2"
  },
  "devDependencies": {
    "@wessberg/di-compiler": "^3.0.1",
    "ts-patch": "^3.0.2",
    "typescript": "^5.0.0"
  }
}
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "plugins": [
      {
        "transform": "@wessberg/di-compiler"
      }
    ]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### src/services/ApiClient.ts

```typescript
export interface ApiConfig {
  baseUrl: string;
  apiKey: string;
}

export class ApiClient {
  constructor(private config: ApiConfig) {}

  async get(endpoint: string) {
    const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`
      }
    });
    return response.json();
  }
}
```

### src/services/UserService.ts

```typescript
import {CONSTRUCTOR_ARGUMENTS_SYMBOL} from '@wessberg/di';
import {ApiClient} from './ApiClient';

export class UserService {
  static get [CONSTRUCTOR_ARGUMENTS_SYMBOL]() {
    return ['ApiClient'];
  }

  constructor(private apiClient: ApiClient) {}

  async getUsers() {
    return this.apiClient.get('/users');
  }
}
```

### src/index.ts

```typescript
import {DIContainer} from '@wessberg/di';
import {ApiClient, ApiConfig} from './services/ApiClient';
import {UserService} from './services/UserService';

// Container yaratish / Create container
const container = new DIContainer();

// Konfiguratsiya / Configuration
const apiConfig: ApiConfig = {
  baseUrl: 'https://api.example.com',
  apiKey: 'your-api-key'
};

// Xizmatlarni ro'yxatdan o'tkazish / Register services
container.registerSingleton<ApiClient>(
  () => new ApiClient(apiConfig),
  {identifier: 'ApiClient'}
);

container.registerSingleton<UserService>(undefined, {
  identifier: 'UserService',
  implementation: UserService
});

// Ishlatish / Usage
async function main() {
  const userService = container.get<UserService>({identifier: 'UserService'});
  const users = await userService.getUsers();
  console.log('Users:', users);
}

main().catch(console.error);
```

### Build va ishga tushirish / Build and run

```bash
# O'rnatish / Install
npm install

# Build qilish / Build
npm run build

# Ishga tushirish / Run
npm start
```

## 4. Muammolarni hal qilish / Troubleshooting

### ⚠️ Xato: "Cannot set property createProgram" (ttypescript bilan / with ttypescript)

**To'liq xato / Full error**:
```
TypeError: Cannot set property createProgram of #<Object> which has only a getter
```

**Sabab / Cause**: Bu ttypescript ning TypeScript 5.0+ bilan mos kelmasligi muammosi. TypeScript 5.0+ da module export'lar frozen (muzlatilgan) bo'lib, ttypescript ularni patch qila olmaydi.

This is a compatibility issue between ttypescript and TypeScript 5.0+. In TypeScript 5.0+, module exports are frozen, preventing ttypescript from patching them.

**Yechim / Solution**: **ts-patch** ishlatishga o'ting (TAVSIYA ETILADI / RECOMMENDED):

#### Variant 1: ts-patch ishlatish / Use ts-patch

```bash
# ttypescript ni o'chirish / Uninstall ttypescript
npm uninstall ttypescript

# ts-patch ni o'rnatish / Install ts-patch
npm install ts-patch --save-dev

# ts-patch ni faollashtirish / Enable ts-patch
npx ts-patch install

# Endi oddiy tsc ishlatishingiz mumkin / Now you can use regular tsc
npx tsc

# Watch mode
npx tsc --watch
```

**package.json**:
```json
{
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  }
}
```

#### Variant 2: TypeScript versiyasini pasaytirish (tavsiya etilmaydi / not recommended)

```bash
npm install typescript@4.9.5 --save-dev
```

**Eslatma / Note**: TypeScript 5.0+ uchun **ts-patch tavsiya etiladi**. ttypescript ishlab chiqish to'xtatilgan va yangi TypeScript versiyalari bilan ishlamaydi.

**Note**: For TypeScript 5.0+, **ts-patch is recommended**. ttypescript is no longer maintained and doesn't work with newer TypeScript versions.

### Xato: "2 arguments required, but only 0 present"

**Sabab / Cause**: DI-Compiler ishlamayapti.

**Yechim / Solution**: 
1. ts-patch o'rnatilganini va faollashtirilganini tekshiring: `npx ts-patch install`
2. `tsconfig.json` da `plugins` qo'shilganini tasdiqlang
3. Build vaqtida `tsc` ishlatayotganingizni tekshiring (ttsc emas)

### Xato: "Cannot find module '@wessberg/di-compiler'"

**Sabab / Cause**: DI-Compiler o'rnatilmagan.

**Yechim / Solution**:
```bash
npm install @wessberg/di-compiler --save-dev
```

### Xato: "Module not found" runtime vaqtida

**Sabab / Cause**: Build qilingan fayllar yo'q yoki noto'g'ri.

**Yechim / Solution**:
1. `npm run build` ni qaytadan ishga tushiring
2. `outDir` katalogi to'g'ri ekanini tekshiring
3. `package.json` da `main` field to'g'ri ekanini tekshiring

### Interfeys va Class bog'lanishi ishlamayapti

**Sabab / Cause**: CONSTRUCTOR_ARGUMENTS_SYMBOL ishlatilmagan.

**Yechim / Solution**:
```typescript
import {CONSTRUCTOR_ARGUMENTS_SYMBOL} from '@wessberg/di';

class MyService {
  static get [CONSTRUCTOR_ARGUMENTS_SYMBOL]() {
    return ['MyDependency'];
  }

  constructor(private dep: MyDependency) {}
}
```

### Source maps ishlamayapti

**Yechim / Solution**: `tsconfig.json` ga qo'shing:
```json
{
  "compilerOptions": {
    "sourceMap": true,
    "inlineSourceMap": false
  }
}
```

## 5. Foydali maslahatlar / Useful Tips

### 1. preserveValueImports ni yoqish / Enable preserveValueImports

Tree-shaking va performance uchun:

For tree-shaking and performance:

```json
{
  "compilerOptions": {
    "preserveValueImports": true
  }
}
```

### 2. Development va Production sozlamalari / Dev and Prod settings

```json
// tsconfig.json (base)
{
  "compilerOptions": {
    "plugins": [{"transform": "@wessberg/di-compiler"}]
  }
}

// tsconfig.dev.json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "sourceMap": true
  }
}

// tsconfig.prod.json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "removeComments": true,
    "declaration": true
  }
}
```

### 3. Watch mode / Kuzatish rejimi

```bash
# ts-patch bilan / with ts-patch
npx tsc --watch

# ts-node-dev bilan / with ts-node-dev
npx ts-node-dev src/index.ts
```

### 4. IDE Integration (VS Code)

VS Code uchun TypeScript versiyasini o'zgartirish:

To change TypeScript version for VS Code:

1. `Ctrl+Shift+P` (yoki `Cmd+Shift+P` Mac'da)
2. "TypeScript: Select TypeScript Version"
3. "Use Workspace Version" ni tanlang

## 6. Qo'shimcha resurslar / Additional Resources

- **DI-Compiler GitHub**: https://github.com/wessberg/di-compiler
- **DI Container GitHub**: https://github.com/wessberg/DI
- **TypeScript Transformers**: https://github.com/cevek/ttypescript
- **ts-patch**: https://github.com/nonara/ts-patch

## 7. Ko'p so'raladigan savollar / FAQ

### DI-Compiler nima uchun kerak?

TypeScript compile vaqtida interfeys va klasslar o'rtasidagi bog'lanishni o'zgartiradi, bu esa runtime'da to'g'ri dependency injection imkonini beradi.

TypeScript transforms the relationship between interfaces and classes at compile time, enabling proper dependency injection at runtime.

### Qaysi build tool'ni tanlashim kerak?

- **Yangi loyiha**: **ts-patch** (tavsiya etiladi, barcha TypeScript versiyalari bilan ishlaydi)
- **Webpack loyihasi**: Webpack + ts-loader + ts-patch
- **Vite/Vue**: Rollup plugin + ts-patch bilan
- **Node.js server**: ts-node + ts-patch

**Eslatma / Note**: TypeScript 5.0+ ishlatayotgan bo'lsangiz, ts-patch'dan foydalaning.

For TypeScript 5.0+, use ts-patch.

### Production'da ishlayaptimi?

Ha! DI-Compiler faqat build vaqtida kerak. Production'da faqat `@wessberg/di` runtime dependency sifatida kerak.

Yes! DI-Compiler is only needed at build time. In production, only `@wessberg/di` is needed as a runtime dependency.

### ESBuild bilan ishlaydimi?

ESBuild TypeScript transformer'larni qo'llab-quvvatlamaydi. Rollup yoki Webpack ishlatish tavsiya etiladi.

ESBuild doesn't support TypeScript transformers. Use Rollup or Webpack instead.

---

**Yordam kerakmi? / Need help?**

Agar muammo yuzaga kelsa, quyidagi ma'lumotlarni bering:

If you encounter issues, provide the following information:

1. TypeScript versiyasi / TypeScript version: `tsc --version`
2. Build tool / Qurilish vositasi: webpack/rollup/vite/ts-patch/tsc
3. Xato xabari / Error message
4. tsconfig.json fayli / tsconfig.json file

GitHub Issues: https://github.com/wessberg/di-compiler/issues

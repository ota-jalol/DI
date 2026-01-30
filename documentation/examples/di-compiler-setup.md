# DI-Compiler ni o'rnatish va sozlash / Installing and Configuring DI-Compiler

DI Container to'g'ri ishlashi uchun **DI-Compiler zarur**! Bu qo'llanma DI-Compiler ni qanday o'rnatish va sozlashni ko'rsatadi.

DI Container requires **DI-Compiler to work properly**! This guide shows how to install and configure DI-Compiler.

## Nega kerak? / Why is it needed?

DI Container interfeys va klasslar o'rtasidagi bog'lanishni compile vaqtida aniqlaydi. Bu ishni DI-Compiler bajaradi.

The DI Container identifies the relationship between interfaces and classes at compile time. DI-Compiler performs this task.

## 1. O'rnatish / Installation

### npm

```bash
npm install @wessberg/di @wessberg/di-compiler --save
npm install typescript --save-dev
```

### yarn

```bash
yarn add @wessberg/di @wessberg/di-compiler
yarn add typescript --dev
```

### pnpm

```bash
pnpm add @wessberg/di @wessberg/di-compiler
pnpm add typescript --save-dev
```

## 2. Sozlash / Configuration

DI-Compiler ni turli xil build tool'lar bilan ishlatish mumkin. Quyida eng mashhur usullar keltirilgan.

DI-Compiler can be used with various build tools. Below are the most popular methods.

### Usul 1 / Method 1: ttypescript bilan / With ttypescript

Bu eng oddiy va tavsiya etiladigan usul / This is the simplest and recommended method.

#### 1.1. ttypescript ni o'rnatish / Install ttypescript

```bash
npm install ttypescript --save-dev
```

#### 1.2. tsconfig.json ni sozlash / Configure tsconfig.json

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

#### 1.3. package.json da script'lar / Scripts in package.json

```json
{
  "scripts": {
    "build": "ttsc",
    "dev": "ttsc --watch"
  }
}
```

#### 1.4. Ishlatish / Usage

```bash
npm run build
```

### Usul 2 / Method 2: ts-patch bilan / With ts-patch

ts-patch TypeScript ni to'g'ridan-to'g'ri patch qiladi / ts-patch directly patches TypeScript.

#### 2.1. ts-patch ni o'rnatish / Install ts-patch

```bash
npm install ts-patch --save-dev
```

#### 2.2. ts-patch ni faollashtirish / Enable ts-patch

```bash
npx ts-patch install
```

#### 2.3. tsconfig.json sozlash / Configure tsconfig.json

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

#### 2.4. Build qilish / Build

```bash
tsc
```

### Usul 3 / Method 3: Webpack bilan / With Webpack

Webpack + ts-loader yoki awesome-typescript-loader bilan ishlatish.

Using with Webpack + ts-loader or awesome-typescript-loader.

#### 3.1. Kerakli paketlar / Required packages

```bash
npm install webpack webpack-cli ts-loader --save-dev
```

#### 3.2. webpack.config.js

```javascript
const path = require('path');

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          compiler: 'ttypescript'
        },
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

#### 3.3. tsconfig.json

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
npm install rollup @rollup/plugin-typescript ttypescript --save-dev
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
      typescript: require('ttypescript')
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
npm install vite @vitejs/plugin-vue ttypescript --save-dev
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
      // Configure rollup to use ttypescript
    }
  }
});
```

**Eslatma / Note**: Vite ESBuild ishlatadi, lekin DI-Compiler uchun TypeScript compiler kerak. Rollup'ning typescript plugin'idan foydalaning.

Vite uses ESBuild, but DI-Compiler requires TypeScript compiler. Use Rollup's typescript plugin.

#### 5.3. Alternative: vite-plugin-ts-paths

```bash
npm install vite-plugin-ts-paths --save-dev
```

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import tsPaths from 'vite-plugin-ts-paths';

export default defineConfig({
  plugins: [
    tsPaths({
      compiler: 'ttypescript'
    })
  ]
});
```

### Usul 6 / Method 6: ts-node bilan / With ts-node

Development vaqtida to'g'ridan-to'g'ri ishlatish / Running directly during development.

#### 6.1. ts-node ni o'rnatish / Install ts-node

```bash
npm install ts-node ttypescript --save-dev
```

#### 6.2. tsconfig.json

```json
{
  "ts-node": {
    "compiler": "ttypescript"
  },
  "compilerOptions": {
    "plugins": [
      {
        "transform": "@wessberg/di-compiler"
      }
    ]
  }
}
```

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
    "build": "ttsc",
    "dev": "ttsc --watch",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "@wessberg/di": "^3.0.2",
    "@wessberg/di-compiler": "^3.0.1"
  },
  "devDependencies": {
    "ttypescript": "^1.5.15",
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

### Xato: "2 arguments required, but only 0 present"

**Sabab / Cause**: DI-Compiler ishlamayapti.

**Yechim / Solution**: 
1. ttypescript yoki ts-patch to'g'ri o'rnatilganini tekshiring
2. `tsconfig.json` da `plugins` qo'shilganini tasdiqlang
3. Build vaqtida `ttsc` (ttypescript) ishlatayotganingizni tekshiring

### Xato: "Cannot find module '@wessberg/di-compiler'"

**Sabab / Cause**: DI-Compiler o'rnatilmagan.

**Yechim / Solution**:
```bash
npm install @wessberg/di-compiler --save
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
# ttypescript bilan
npx ttsc --watch

# ts-node bilan
npx ts-node-dev --compiler ttypescript src/index.ts
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

- **Yangi loyiha**: ttypescript (eng oson)
- **Webpack loyihasi**: Webpack + ts-loader + ttypescript
- **Vite/Vue**: Rollup plugin bilan
- **Node.js server**: ts-node + ttypescript

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
2. Build tool / Qurilish vositasi: webpack/rollup/vite/ttsc
3. Xato xabari / Error message
4. tsconfig.json fayli / tsconfig.json file

GitHub Issues: https://github.com/wessberg/di-compiler/issues

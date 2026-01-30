# DI-Compiler ni qanday qo'shamiz? / How do I add DI-Compiler?

Bu qo'llanma DI-Compiler ni tezda qo'shish va sozlashni ko'rsatadi.

This guide shows how to quickly add and configure DI-Compiler.

## Qisqa javob / Quick Answer

DI-Compiler **compile vaqtida** ishlaydi va TypeScript kodini o'zgartiradi. Uni qo'shish uchun:

DI-Compiler works **at compile time** and transforms TypeScript code. To add it:

```bash
# 1. O'rnatish / Install
npm install @wessberg/di
npm install @wessberg/di-compiler ttypescript --save-dev

# 2. tsconfig.json da sozlash / Configure in tsconfig.json
# (quyida 2-qadamda batafsil / detailed in Step 2 below)

# 3. Build qilish / Build
npx ttsc
```

## To'liq yo'riqnoma / Complete Guide

### 1-qadam: Paketlarni o'rnatish / Step 1: Install packages

```bash
npm install @wessberg/di
npm install @wessberg/di-compiler ttypescript typescript --save-dev
```

**Tushuntirish / Explanation**:
- `@wessberg/di` - DI Container (runtime dependency)
- `@wessberg/di-compiler` - Compiler transformer (build-time, dev dependency)
- `ttypescript` - TypeScript bilan transformer'larni ishlatish uchun (dev dependency)
- `typescript` - TypeScript compileri (dev dependency)

### 2-qadam: tsconfig.json yaratish yoki o'zgartirish / Step 2: Create or modify tsconfig.json

Loyihangizda `tsconfig.json` faylini yarating yoki o'zgartiring:

Create or modify `tsconfig.json` file in your project:

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

**Muhim qism / Important part**:
```json
"plugins": [
  {
    "transform": "@wessberg/di-compiler"
  }
]
```

### 3-qadam: package.json da script'lar / Step 3: Scripts in package.json

`package.json` faylingizga build script qo'shing:

Add build script to your `package.json`:

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "scripts": {
    "build": "ttsc",
    "dev": "ttsc --watch",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "@wessberg/di": "^3.0.2"
  },
  "devDependencies": {
    "@wessberg/di-compiler": "^3.0.1",
    "ttypescript": "^1.5.15",
    "typescript": "^5.0.0"
  }
}
```

### 4-qadam: Kod yozish / Step 4: Write code

#### src/index.ts

```typescript
import {DIContainer} from '@wessberg/di';

// Interface
interface IApiClient {
  get(url: string): Promise<any>;
}

// Implementation
class ApiClient implements IApiClient {
  async get(url: string) {
    console.log('Fetching:', url);
    return {data: 'test'};
  }
}

// Container yaratish / Create container
const container = new DIContainer();

// Xizmatni ro'yxatdan o'tkazish / Register service
container.registerSingleton<IApiClient, ApiClient>();

// Ishlatish / Use
const apiClient = container.get<IApiClient>();
apiClient.get('/users');
```

### 5-qadam: Build va ishga tushirish / Step 5: Build and run

```bash
# Build qilish / Build
npm run build

# Ishga tushirish / Run
npm start
```

## Konfiguratsiya turlari / Configuration Types

### Variant 1: ttypescript (Tavsiya etiladi / Recommended)

**Afzalligi / Advantage**: Eng oddiy, to'g'ridan-to'g'ri TypeScript o'rniga ishlatiladi.

**O'rnatish / Install**:
```bash
npm install ttypescript --save-dev
```

**Ishlatish / Use**:
```bash
npx ttsc
```

### Variant 2: ts-patch

**Afzalligi / Advantage**: TypeScript'ni to'g'ridan-to'g'ri patch qiladi, keyin `tsc` ishlatishingiz mumkin.

**O'rnatish / Install**:
```bash
npm install ts-patch --save-dev
npx ts-patch install
```

**Ishlatish / Use**:
```bash
npx tsc
```

### Variant 3: Webpack

**Kerakli paketlar / Required packages**:
```bash
npm install webpack webpack-cli ts-loader ttypescript --save-dev
```

**webpack.config.js**:
```javascript
module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          compiler: 'ttypescript'
        }
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  }
};
```

**Ishlatish / Use**:
```bash
npx webpack
```

## Real misol / Real Example

Keling, to'liq ishlaydigan misol yaratamiz:

Let's create a complete working example:

### Loyiha yaratish / Create project

```bash
# Yangi papka yaratish / Create new folder
mkdir my-di-project
cd my-di-project

# package.json yaratish / Initialize package.json
npm init -y

# Paketlarni o'rnatish / Install packages
npm install @wessberg/di
npm install @wessberg/di-compiler ttypescript typescript --save-dev
```

### Fayllarni yaratish / Create files

**tsconfig.json**:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "plugins": [
      {
        "transform": "@wessberg/di-compiler"
      }
    ]
  }
}
```

**package.json**:
```json
{
  "name": "my-di-project",
  "version": "1.0.0",
  "scripts": {
    "build": "ttsc",
    "start": "node dist/index.js"
  }
}
```

**src/services/Logger.ts**:
```typescript
export interface ILogger {
  log(message: string): void;
}

export class ConsoleLogger implements ILogger {
  log(message: string): void {
    console.log('[LOG]', message);
  }
}
```

**src/services/UserService.ts**:
```typescript
import {CONSTRUCTOR_ARGUMENTS_SYMBOL} from '@wessberg/di';
import {ILogger} from './Logger';

export class UserService {
  static get [CONSTRUCTOR_ARGUMENTS_SYMBOL]() {
    return ['ILogger'];
  }

  constructor(private logger: ILogger) {}

  getUsers() {
    this.logger.log('Getting users...');
    return [
      {id: 1, name: 'Ali'},
      {id: 2, name: 'Vali'}
    ];
  }
}
```

**src/index.ts**:
```typescript
import {DIContainer} from '@wessberg/di';
import {ILogger, ConsoleLogger} from './services/Logger';
import {UserService} from './services/UserService';

// Container
const container = new DIContainer();

// Logger ni ro'yxatdan o'tkazish / Register logger
container.registerSingleton<ILogger, ConsoleLogger>();

// UserService ni ro'yxatdan o'tkazish / Register user service
container.registerSingleton<UserService>();

// Ishlatish / Use
const userService = container.get<UserService>();
const users = userService.getUsers();

console.log('Users:', users);
```

### Ishga tushirish / Run

```bash
# Build
npm run build

# Run
npm start
```

**Natija / Output**:
```
[LOG] Getting users...
Users: [ { id: 1, name: 'Ali' }, { id: 2, name: 'Vali' } ]
```

## Muammolar va yechimlar / Problems and Solutions

### ❌ Xato: "2 arguments required, but only 0 present"

**Sabab / Cause**: DI-Compiler ishlamayapti

**Yechim / Solution**:
1. `ttsc` ishlatayotganingizni tekshiring (oddiy `tsc` emas!)
2. `tsconfig.json` da `plugins` qo'shilganini tekshiring
3. Qaytadan build qiling: `npm run build`

### ❌ Xato: "Cannot find module '@wessberg/di-compiler'"

**Yechim / Solution**:
```bash
npm install @wessberg/di-compiler
```

### ❌ Build ishlamayapti

**Tekshiring / Check**:
1. `node_modules` papkasi bormi?
2. `tsconfig.json` to'g'ri joylashganmi?
3. `src` papkasida `.ts` fayllar bormi?

**Yechim / Solution**:
```bash
# Tozalash / Clean
rm -rf node_modules dist
npm install
npm run build
```

## Vue.js / React bilan / With Vue.js / React

### Vue.js

DI-Compiler Vue.js bilan mukammal ishlaydi:

DI-Compiler works perfectly with Vue.js:

```bash
npm install @wessberg/di
npm install @wessberg/di-compiler ttypescript --save-dev
```

**vite.config.ts** da Rollup typescript plugin'ini qo'shing.

Add Rollup typescript plugin in **vite.config.ts**.

[Vue integration hujjatiga qarang / See Vue integration docs](./vue-integration.md)

### React

React bilan xuddi shunday:

Same with React:

```bash
npm install @wessberg/di
npm install @wessberg/di-compiler ttypescript --save-dev
```

Webpack yoki Rollup konfiguratsiyasiga qo'shing.

Add to Webpack or Rollup configuration.

## Keyingi qadamlar / Next Steps

1. ✅ DI-Compiler o'rnatildi / DI-Compiler installed
2. ✅ tsconfig.json sozlandi / tsconfig.json configured
3. 📚 [ApiClient config hujjatini o'qing](./api-client-config.md)
4. 📚 [Vue.js integratsiya hujjatini o'qing](./vue-integration.md)
5. 📚 [To'liq setup hujjatini o'qing](./di-compiler-setup.md)

## Xulosa / Conclusion

DI-Compiler ni qo'shish juda oddiy:

Adding DI-Compiler is very simple:

1. **O'rnatish / Install**: `npm install @wessberg/di-compiler ttypescript`
2. **Sozlash / Configure**: `tsconfig.json` ga plugin qo'shing
3. **Build / Build**: `npx ttsc` ishlatish

**Eslatma / Note**: DI-Compiler faqat **build vaqtida** kerak. Production'da faqat `@wessberg/di` kerak bo'ladi.

**Note**: DI-Compiler is only needed **at build time**. In production, only `@wessberg/di` is needed.

---

**Yordam / Help**: [To'liq hujjat](./di-compiler-setup.md) | [GitHub Issues](https://github.com/wessberg/di-compiler/issues)

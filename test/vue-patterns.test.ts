/* eslint-disable @typescript-eslint/no-extraneous-class, max-classes-per-file */
import test from "node:test";
import assert from "node:assert";
import {DIContainer} from "../src/di-container.js";

// Simulating Vue-like patterns for testing

test("DI Container can be used as a global singleton (Vue pattern)", () => {
	interface ApiConfig {
		baseUrl: string;
		apiKey: string;
	}

	class ApiClient {
		constructor(public config: ApiConfig) {}

		getBaseUrl(): string {
			return this.config.baseUrl;
		}
	}

	// Simulate creating a global container instance (like in Vue plugin)
	const globalContainer = new DIContainer();

	const config: ApiConfig = {
		baseUrl: "https://api.example.com",
		apiKey: "test-key"
	};

	globalContainer.registerSingleton<ApiClient>(() => new ApiClient(config), {
		identifier: "ApiClient"
	});

	// Simulate accessing from different "components"
	const apiClientInComponent1 = globalContainer.get<ApiClient>({identifier: "ApiClient"});
	const apiClientInComponent2 = globalContainer.get<ApiClient>({identifier: "ApiClient"});

	// Should be the same instance (singleton)
	assert.strictEqual(apiClientInComponent1, apiClientInComponent2);
	assert.strictEqual(apiClientInComponent1.getBaseUrl(), "https://api.example.com");
});

test("Services can be injected into Vue-like service classes", () => {
	interface ApiConfig {
		baseUrl: string;
		apiKey: string;
	}

	class ApiClient {
		constructor(public config: ApiConfig) {}

		async get(endpoint: string): Promise<any> {
			return {data: `GET ${this.config.baseUrl}${endpoint}`};
		}
	}

	interface User {
		id: number;
		name: string;
	}

	class UserService {
		constructor(private apiClient: ApiClient) {}

		async getUsers(): Promise<User[]> {
			await this.apiClient.get("/users");
			return [{id: 1, name: "Test User"}];
		}

		getApiClient(): ApiClient {
			return this.apiClient;
		}
	}

	// Simulate Vue app setup
	const container = new DIContainer();

	const config: ApiConfig = {
		baseUrl: "https://api.example.com",
		apiKey: "test-key"
	};

	// Register dependencies
	container.registerSingleton<ApiClient>(() => new ApiClient(config), {
		identifier: "ApiClient"
	});

	container.registerSingleton<UserService>(
		() => new UserService(container.get<ApiClient>({identifier: "ApiClient"})),
		{identifier: "UserService"}
	);

	// Simulate using in a component
	const userService = container.get<UserService>({identifier: "UserService"});
	const apiClient = container.get<ApiClient>({identifier: "ApiClient"});

	// UserService should have received the same ApiClient instance
	assert.strictEqual(userService.getApiClient(), apiClient);
});

test("Container can provide different configurations for different environments (Vue env pattern)", () => {
	interface ApiConfig {
		baseUrl: string;
		apiKey: string;
		environment: string;
	}

	class ApiClient {
		constructor(public config: ApiConfig) {}
	}

	// Simulate development environment
	const devContainer = new DIContainer();
	const devConfig: ApiConfig = {
		baseUrl: "http://localhost:3000",
		apiKey: "dev-key",
		environment: "development"
	};

	devContainer.registerSingleton<ApiClient>(() => new ApiClient(devConfig), {
		identifier: "ApiClient"
	});

	const devClient = devContainer.get<ApiClient>({identifier: "ApiClient"});
	assert.strictEqual(devClient.config.environment, "development");
	assert.strictEqual(devClient.config.baseUrl, "http://localhost:3000");

	// Simulate production environment
	const prodContainer = new DIContainer();
	const prodConfig: ApiConfig = {
		baseUrl: "https://api.production.com",
		apiKey: "prod-key",
		environment: "production"
	};

	prodContainer.registerSingleton<ApiClient>(() => new ApiClient(prodConfig), {
		identifier: "ApiClient"
	});

	const prodClient = prodContainer.get<ApiClient>({identifier: "ApiClient"});
	assert.strictEqual(prodClient.config.environment, "production");
	assert.strictEqual(prodClient.config.baseUrl, "https://api.production.com");
});

test("Container can be used in Vue composable pattern", () => {
	interface ApiConfig {
		baseUrl: string;
	}

	class ApiClient {
		constructor(public config: ApiConfig) {}
	}

	class UserService {
		constructor(private apiClient: ApiClient) {}

		getApiClient(): ApiClient {
			return this.apiClient;
		}
	}

	// Setup container (would be done in main.ts)
	const container = new DIContainer();

	container.registerSingleton<ApiClient>(
		() => new ApiClient({baseUrl: "https://api.example.com"}),
		{identifier: "ApiClient"}
	);

	container.registerSingleton<UserService>(
		() => new UserService(container.get<ApiClient>({identifier: "ApiClient"})),
		{identifier: "UserService"}
	);

	// Simulate a composable function
	function useService<T>(identifier: string): T {
		return container.get<T>({identifier});
	}

	// Simulate using in a component
	const userService = useService<UserService>("UserService");
	const apiClient = useService<ApiClient>("ApiClient");

	assert.ok(userService);
	assert.ok(apiClient);
	assert.strictEqual(userService.getApiClient(), apiClient);
});

test("Multiple services can share the same configuration (Vue pattern)", () => {
	interface ApiConfig {
		baseUrl: string;
		apiKey: string;
	}

	class ApiClient {
		constructor(public config: ApiConfig) {}
	}

	class AuthService {
		constructor(public config: ApiConfig) {}
	}

	class DataService {
		constructor(public config: ApiConfig) {}
	}

	const container = new DIContainer();

	const sharedConfig: ApiConfig = {
		baseUrl: "https://api.example.com",
		apiKey: "shared-key"
	};

	// Register config once
	container.registerSingleton<ApiConfig>(() => sharedConfig, {
		identifier: "ApiConfig"
	});

	// Register multiple services that use the config
	container.registerSingleton<ApiClient>(
		() => new ApiClient(container.get<ApiConfig>({identifier: "ApiConfig"})),
		{identifier: "ApiClient"}
	);

	container.registerSingleton<AuthService>(
		() => new AuthService(container.get<ApiConfig>({identifier: "ApiConfig"})),
		{identifier: "AuthService"}
	);

	container.registerSingleton<DataService>(
		() => new DataService(container.get<ApiConfig>({identifier: "ApiConfig"})),
		{identifier: "DataService"}
	);

	const apiClient = container.get<ApiClient>({identifier: "ApiClient"});
	const authService = container.get<AuthService>({identifier: "AuthService"});
	const dataService = container.get<DataService>({identifier: "DataService"});

	// All should share the same config instance
	assert.strictEqual(apiClient.config, sharedConfig);
	assert.strictEqual(authService.config, sharedConfig);
	assert.strictEqual(dataService.config, sharedConfig);
});

test("Container can manage complex service dependencies (Vue store pattern)", () => {
	interface ApiConfig {
		baseUrl: string;
	}

	class ApiClient {
		constructor(public config: ApiConfig) {}

		getConfig(): ApiConfig {
			return this.config;
		}
	}

	class UserRepository {
		constructor(private apiClient: ApiClient) {}

		getApiClient(): ApiClient {
			return this.apiClient;
		}
	}

	class UserStore {
		constructor(private repository: UserRepository) {}

		getRepository(): UserRepository {
			return this.repository;
		}
	}

	const container = new DIContainer();

	const config: ApiConfig = {baseUrl: "https://api.example.com"};

	// Register in order of dependencies
	container.registerSingleton<ApiClient>(() => new ApiClient(config), {
		identifier: "ApiClient"
	});

	container.registerSingleton<UserRepository>(
		() => new UserRepository(container.get<ApiClient>({identifier: "ApiClient"})),
		{identifier: "UserRepository"}
	);

	container.registerSingleton<UserStore>(
		() => new UserStore(container.get<UserRepository>({identifier: "UserRepository"})),
		{identifier: "UserStore"}
	);

	// Get the store (top-level service)
	const store = container.get<UserStore>({identifier: "UserStore"});
	const repository = store.getRepository();
	const apiClient = repository.getApiClient();
	const configFromClient = apiClient.getConfig();

	// Verify the entire chain
	assert.strictEqual(configFromClient, config);
	assert.strictEqual(configFromClient.baseUrl, "https://api.example.com");
});

test("Container supports lazy initialization (Vue performance pattern)", () => {
	let apiClientCreated = false;
	let userServiceCreated = false;

	interface ApiConfig {
		baseUrl: string;
	}

	class ApiClient {
		constructor(public config: ApiConfig) {
			apiClientCreated = true;
		}
	}

	class UserService {
		constructor(_apiClient: ApiClient) {
			userServiceCreated = true;
		}
	}

	const container = new DIContainer();

	container.registerSingleton<ApiClient>(() => new ApiClient({baseUrl: "test"}), {
		identifier: "ApiClient"
	});

	container.registerSingleton<UserService>(
		() => new UserService(container.get<ApiClient>({identifier: "ApiClient"})),
		{identifier: "UserService"}
	);

	// Services should not be created yet
	assert.strictEqual(apiClientCreated, false);
	assert.strictEqual(userServiceCreated, false);

	// Get UserService - should trigger creation of both
	const userService = container.get<UserService>({identifier: "UserService"});

	// Now both should be created
	assert.strictEqual(apiClientCreated, true);
	assert.strictEqual(userServiceCreated, true);
	assert.ok(userService);
});

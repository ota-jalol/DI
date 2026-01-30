/* eslint-disable @typescript-eslint/no-extraneous-class, max-classes-per-file */
import test from "node:test";
import assert from "node:assert";
import {DIContainer} from "../src/di-container.js";
import {CONSTRUCTOR_ARGUMENTS_SYMBOL} from "../src/constant.js";

test("ApiClient can be registered with config using factory function", () => {
	interface ApiConfig {
		baseUrl: string;
		apiKey: string;
		timeout: number;
	}

	class ApiClient {
		constructor(public config: ApiConfig) {}

		getBaseUrl(): string {
			return this.config.baseUrl;
		}
	}

	const myApiConfig: ApiConfig = {
		baseUrl: "https://api.example.com",
		apiKey: "test-key",
		timeout: 5000
	};

	const container = new DIContainer();

	// Register ApiClient with config using factory function
	container.registerSingleton<ApiClient>(() => new ApiClient(myApiConfig), {
		identifier: "ApiClient"
	});

	const apiClient = container.get<ApiClient>({identifier: "ApiClient"});

	assert.strictEqual(apiClient.getBaseUrl(), "https://api.example.com");
	assert.strictEqual(apiClient.config.apiKey, "test-key");
	assert.strictEqual(apiClient.config.timeout, 5000);
});

test("ApiClient can be registered with config as separate service", () => {
	interface ApiConfig {
		baseUrl: string;
		apiKey: string;
		timeout: number;
	}

	class ApiClient {
		static get [CONSTRUCTOR_ARGUMENTS_SYMBOL]() {
			return ["ApiConfig"];
		}

		constructor(public config: ApiConfig) {}

		getBaseUrl(): string {
			return this.config.baseUrl;
		}
	}

	const myApiConfig: ApiConfig = {
		baseUrl: "https://api.example.com",
		apiKey: "test-key",
		timeout: 5000
	};

	const container = new DIContainer();

	// First register the config
	container.registerSingleton<ApiConfig>(() => myApiConfig, {
		identifier: "ApiConfig"
	});

	// Then register ApiClient (it will automatically receive the config)
	container.registerSingleton<ApiClient>(undefined, {
		identifier: "ApiClient",
		implementation: ApiClient
	});

	const apiClient = container.get<ApiClient>({identifier: "ApiClient"});

	assert.strictEqual(apiClient.getBaseUrl(), "https://api.example.com");
	assert.strictEqual(apiClient.config.apiKey, "test-key");
	assert.strictEqual(apiClient.config.timeout, 5000);
});

test("ApiClient with interface can be registered with config", () => {
	interface IApiConfig {
		baseUrl: string;
		apiKey: string;
		timeout: number;
	}

	interface IApiClient {
		getBaseUrl(): string;
	}

	class ApiClient implements IApiClient {
		static get [CONSTRUCTOR_ARGUMENTS_SYMBOL]() {
			return ["IApiConfig"];
		}

		constructor(public config: IApiConfig) {}

		getBaseUrl(): string {
			return this.config.baseUrl;
		}
	}

	const myApiConfig: IApiConfig = {
		baseUrl: "https://api.example.com",
		apiKey: "test-key",
		timeout: 5000
	};

	const container = new DIContainer();

	// Register the config
	container.registerSingleton<IApiConfig>(() => myApiConfig, {
		identifier: "IApiConfig"
	});

	// Register ApiClient through interface
	container.registerSingleton<IApiClient, ApiClient>(undefined, {
		identifier: "IApiClient",
		implementation: ApiClient
	});

	const apiClient = container.get<IApiClient>({identifier: "IApiClient"});

	assert.strictEqual(apiClient.getBaseUrl(), "https://api.example.com");
});

test("ApiClient singleton returns same instance", () => {
	interface ApiConfig {
		baseUrl: string;
		apiKey: string;
		timeout: number;
	}

	class ApiClient {
		constructor(public config: ApiConfig) {}
	}

	const myApiConfig: ApiConfig = {
		baseUrl: "https://api.example.com",
		apiKey: "test-key",
		timeout: 5000
	};

	const container = new DIContainer();

	container.registerSingleton<ApiClient>(() => new ApiClient(myApiConfig), {
		identifier: "ApiClient"
	});

	const apiClient1 = container.get<ApiClient>({identifier: "ApiClient"});
	const apiClient2 = container.get<ApiClient>({identifier: "ApiClient"});

	// Both should be the same instance
	assert.strictEqual(apiClient1, apiClient2);
});

test("Multiple services can depend on the same config", () => {
	interface ApiConfig {
		baseUrl: string;
		apiKey: string;
	}

	class ApiClient {
		static get [CONSTRUCTOR_ARGUMENTS_SYMBOL]() {
			return ["ApiConfig"];
		}

		constructor(public config: ApiConfig) {}
	}

	class DataService {
		static get [CONSTRUCTOR_ARGUMENTS_SYMBOL]() {
			return ["ApiConfig"];
		}

		constructor(public config: ApiConfig) {}
	}

	const myApiConfig: ApiConfig = {
		baseUrl: "https://api.example.com",
		apiKey: "test-key"
	};

	const container = new DIContainer();

	// Register config once
	container.registerSingleton<ApiConfig>(() => myApiConfig, {
		identifier: "ApiConfig"
	});

	// Register multiple services that depend on it
	container.registerSingleton<ApiClient>(undefined, {
		identifier: "ApiClient",
		implementation: ApiClient
	});

	container.registerSingleton<DataService>(undefined, {
		identifier: "DataService",
		implementation: DataService
	});

	const apiClient = container.get<ApiClient>({identifier: "ApiClient"});
	const dataService = container.get<DataService>({identifier: "DataService"});

	// Both should receive the same config
	assert.strictEqual(apiClient.config.baseUrl, "https://api.example.com");
	assert.strictEqual(dataService.config.baseUrl, "https://api.example.com");
	assert.strictEqual(apiClient.config, dataService.config);
});

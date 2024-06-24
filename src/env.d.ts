declare module "bun" {
	interface Env {
		POSTGRES_HOST: string;
		POSTGRES_PORT: string;
		POSTGRES_USER: string;
		POSTGRES_PASS: string;
		POSTGRES_NAME: string;
		PORT: string;
		FILE_NAME_LENGTH: string;
	}
}

export type {};

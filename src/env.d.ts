declare module "bun" {
	interface Env {
		POSTGRES_HOST: string;
		POSTGRES_PORT: number;
		POSTGRES_USER: string;
		POSTGRES_PASS: string;
		POSTGRES_NAME: string;
	}
}

export type {};

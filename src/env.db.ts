declare module "bun" {
  interface Env {
    PG_HOST: string;
    PG_PORT: string;
    PG_USER: string;
    PG_PASS: string;
    PG_DB: string;
  }
}

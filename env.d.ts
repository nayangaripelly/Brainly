declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGO_URI: string;
      USER_JWT_SECRET: string;
    }
  }
}

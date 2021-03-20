import consola, { Consola } from "consola";

export class LoggerService {
  private readonly instance: Consola;

  public constructor() {
    this.instance = consola.create({
      level: this.isProductionEnv() ? 4 : this.isTestEnv() ? 7 : 5,
    });
  }

  public success(message: string, ...args: unknown[]): void {
    this.instance.success(message, ...args);
  }
  public trace(message: string, ...args: unknown[]): void {
    this.instance.trace(message, ...args);
  }
  public info(message: string, ...args: unknown[]): void {
    this.instance.info(message, ...args);
  }
  public error(message: string, ...args: unknown[]): void {
    this.instance.error(message, ...args);
  }

  private isTestEnv(): boolean {
    return process.env.NODE_ENV === "test";
  }

  private isProductionEnv(): boolean {
    return (
      process.env.NODE_ENV === "production" ||
      process.env.NODE_ENV === "staging"
    );
  }
}

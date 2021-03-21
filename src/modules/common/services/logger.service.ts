import consola, { Consola } from "consola";

export class LoggerService {
  private readonly instance: Consola;

  public constructor() {
    this.instance = consola.create({
      level: this.isProductionEnv() ? 4 : this.isTestEnv() ? 7 : 5,
    });
  }

  public success(...args: unknown[]): void {
    this.instance.success(args);
  }
  public trace(...args: unknown[]): void {
    this.instance.trace(args);
  }
  public info(...args: unknown[]): void {
    this.instance.info(args);
  }
  public error(...args: unknown[]): void {
    this.instance.error(args);
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

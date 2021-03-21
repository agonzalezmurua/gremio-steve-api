import consola, { Consola } from "consola";

export class LoggerService {
  private readonly instance: Consola;

  public constructor() {
    this.instance = consola.create({
      level: this.isProductionEnv() ? 4 : this.isTestEnv() ? 7 : 5,
    });
  }

  public success(...args: Parameters<Consola["success"]>): void {
    this.instance.success(...args);
  }
  public trace(...args: Parameters<Consola["trace"]>): void {
    this.instance.trace(...args);
  }
  public info(...args: Parameters<Consola["info"]>): void {
    this.instance.info(...args);
  }
  public error(...args: Parameters<Consola["error"]>): void {
    this.instance.error(...args);
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

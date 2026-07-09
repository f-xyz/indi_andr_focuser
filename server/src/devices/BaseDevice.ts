import { Config } from "../Config";

export abstract class BaseDevice<TConfig = Config> {
  protected config: TConfig;

  public constructor(config: TConfig) {
    this.config = config;
  }

  public abstract open(): void;
  public abstract close(): void;
}
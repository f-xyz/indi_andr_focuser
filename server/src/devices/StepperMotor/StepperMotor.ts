import { BaseDevice } from "../BaseDevice";
import rpio from "rpio";

export type StepperMotorConfig = {
  gpioMotorEnabled: number;
  gpioMotorDir: number;
  gpioMotorStep: number;
};

export abstract class StepperMotor extends BaseDevice<StepperMotorConfig> {
  public abstract open(): void;
  public abstract close(): void;

  public abstract steps(isClockwise: boolean, frequency: number, steps: number): void;
  public abstract roll(isClockwise: boolean, frequency: number): void;
  public abstract stop(): void;

  protected setIsEnabled(isEnabled: boolean) {
    const value = isEnabled ? rpio.LOW : rpio.HIGH;
    rpio.write(this.config.gpioMotorEnabled, value);
  }

  protected setDirection(isClockwise: boolean) {
    const value = isClockwise? rpio.HIGH : rpio.LOW;
    rpio.write(this.config.gpioMotorDir, value);
  }
}
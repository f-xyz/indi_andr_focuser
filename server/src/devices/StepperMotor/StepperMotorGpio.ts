import rpio from 'rpio';
import { StepperMotor } from './StepperMotor';

export class StepperMotorGpio extends StepperMotor {
  protected isRunning: boolean = false;

  public open() {
    rpio.open(this.config.gpioMotorEnabled, rpio.OUTPUT, rpio.HIGH);
    rpio.open(this.config.gpioMotorDir, rpio.OUTPUT, rpio.LOW);
    rpio.open(this.config.gpioMotorStep, rpio.OUTPUT, rpio.LOW);
  }

  public close() {
    rpio.write(this.config.gpioMotorEnabled, rpio.HIGH);
    rpio.close(this.config.gpioMotorEnabled);
    rpio.close(this.config.gpioMotorDir);
    rpio.close(this.config.gpioMotorStep);
  }

  /**
   * Perform exactly N steps.
   */
  public steps(isClockwise: boolean, frequency: number, steps: number) {
    this.stop();
    this.setIsEnabled(true);
    this.setDirection(isClockwise);

    const halfDelayMs = Math.round(1000 / frequency / 2);

    for (let i = 0; i < steps; i++) {
      this.pulse(halfDelayMs);
    }

    this.stop();
  }

  /**
   * Rotate continuously.
   */
  public roll(isClockwise: boolean, frequency: number) {
    this.stop();
    this.setIsEnabled(true);
    this.setDirection(isClockwise);

    const halfDelayMs = Math.round(1000 / frequency / 2);

    this.isRunning = true;
    this.rotate(halfDelayMs);
  }

  /**
   * Stops the motor immediately.
   */
  public stop() {
    this.isRunning = false;
    this.setIsEnabled(false);
  }

  ////////////////////////////////////////

  private rotate(halfDelayMs: number) {
    if (this.isRunning) {
      setImmediate(() => this.rotate(halfDelayMs));
      this.pulse(halfDelayMs);
    }
  }

  private pulse(halfDelayMs: number) {
    rpio.write(this.config.gpioMotorStep, rpio.HIGH);
    rpio.msleep(halfDelayMs);
    rpio.write(this.config.gpioMotorStep, rpio.LOW);
    rpio.msleep(halfDelayMs);
  }
}
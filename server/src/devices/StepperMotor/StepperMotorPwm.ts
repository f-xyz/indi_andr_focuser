import rpio from 'rpio';
import { StepperMotor } from './StepperMotor';

export class StepperMotorPwm extends StepperMotor {
  private PWM_CLOCK = 19.2e6; // 19.2 MHz, standard for modern RPIs.
  private PWM_CLOCK_DIVIDER = 64; // Must be a power of 2, the lower - the higher the precision.
  private pwmRange = 0;

  public open() {
    rpio.open(this.config.gpioMotorEnabled, rpio.OUTPUT, rpio.HIGH);
    rpio.open(this.config.gpioMotorDir, rpio.OUTPUT, rpio.LOW);
    rpio.open(this.config.gpioMotorStep, rpio.PWM, rpio.LOW);
  }

  public close() {
    rpio.write(this.config.gpioMotorEnabled, rpio.HIGH);
    rpio.close(this.config.gpioMotorEnabled);
    rpio.close(this.config.gpioMotorDir);
    rpio.close(this.config.gpioMotorStep);
  }

  /**
   * Perform approximately N steps.
   */
  public steps(isClockwise: boolean, frequency: number, steps: number) {
    this.stop();
    this.setIsEnabled(true);
    this.setDirection(isClockwise);
    this.setFrequency(frequency);
    this.setDutyCycle(0.5);

    const microSeconds = Math.round(steps / frequency * 1e6);
    rpio.usleep(microSeconds);

    this.stop();
  }

  /**
   * Rotate continuously.
   */
  public roll(isClockwise: boolean, frequency: number) {
    this.stop();
    this.setIsEnabled(true);
    this.setDirection(isClockwise);
    this.setFrequency(frequency);
    this.setDutyCycle(0.5);
  }

  /**
   * Stops the motor immediately.
   */
  public stop() {
    this.setDutyCycle(0);
    this.setIsEnabled(false);
  }

  ////////////////////////////////////////

  private setFrequency(frequency: number) {
    this.pwmRange = this.getPwmRange(frequency);
    rpio.pwmSetClockDivider(this.PWM_CLOCK_DIVIDER);
    rpio.pwmSetRange(this.config.gpioMotorStep, this.pwmRange);
  }

  private setDutyCycle(dutyCyclePercent = 0.5) {
    const pmwDutyCycle = Math.round(this.pwmRange * dutyCyclePercent);
    rpio.pwmSetData(this.config.gpioMotorStep, pmwDutyCycle);
  }

  // The Range is inversely proportional to the Frequency:
  // Range = Clock / Divider / Frequency
  private getPwmRange(frequency: number) {
    return Math.round(this.PWM_CLOCK / this.PWM_CLOCK_DIVIDER / frequency);
  }
}
export class Config {
  gpioPowerLed: number = 0; // GPIO 26, Green
  gpioMotorStep: number = 0; // GPIO 13, White, hardware PWM
  gpioMotorDir: number = 0; // GPIO 27, White
  gpioMotorEnabled: number = 0; // GPIO 22, Violet
  gpioButtonCw: number = 0; // GPIO 5, Orange
  gpioButtonCcw: number = 0; // GPIO 6, Orange
  stepperFrequency: number = 0;

  constructor(config: Config) {
    Object.assign(this, config);
  }
}
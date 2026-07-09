import { BaseDevice } from "../BaseDevice";
import rpio from "rpio";

export type OnButtonCallback = (pin: number) => void;
export type ButtonsConfig = { gpioButtonCw: number; gpioButtonCcw: number };

export class Buttons extends BaseDevice<ButtonsConfig> {
  public open() {
    rpio.open(this.config.gpioButtonCw, rpio.INPUT, rpio.PULL_UP);
    rpio.open(this.config.gpioButtonCcw, rpio.INPUT, rpio.PULL_UP);
  }

  public listen(onButton: OnButtonCallback) {
    rpio.poll(this.config.gpioButtonCw, onButton);
    rpio.poll(this.config.gpioButtonCcw, onButton);
  }

  public close() {
    rpio.poll(this.config.gpioButtonCw, null);
    rpio.poll(this.config.gpioButtonCcw, null);

    rpio.close(this.config.gpioButtonCw);
    rpio.close(this.config.gpioButtonCcw);
  }
}
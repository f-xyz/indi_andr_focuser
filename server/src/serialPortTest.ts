#!/usr/bin/env node

import { SerialOverUSB } from "./devices/Communication/SerialOverUSB";

(async function main() {
  console.log("Serial port tester");

  const serial = new SerialOverUSB({});
  serial.open();
  serial.listen(packet => console.log("packet:", packet));

  console.log("Ready");
}());
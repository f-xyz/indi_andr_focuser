Focuser device driver for INDI.org.

# Environment

```sh
sudo apt install build-essential devscripts debhelper fakeroot cdbs software-properties-common cmake
sudo add-apt-repository ppa:mutlaqja/ppa
sudo apt install libindi-dev libnova-dev libz-dev libgsl-dev
```

<https://docs.indilib.org/drivers/basics/project-setup.html>

# Building

```sh
./build.sh
```

# Installing

```sh
sudo ./install.sh
# or:
cd build
sudo make install
```

# Misc.

Testing the Serial over USB connection:
```sh
sudo picocom -b 115200 --echo /dev/ttyACM0
# Command: MoveRel;Dir:0;Ticks:1000

# Or using `screen` (Ctrl+A Ctrl+D to exit):
screen /dev/ttyACM0 115200

# Send command:
MoveRel;Dir:0;Ticks:1000
```

Debugging INDI connections:
```sh
# Starting:
indiserver -v indi_andr_focuser
# Or verbose:
indiserver -vvv indi_andr_focuser 2>&1 | tee indi.log

indi_getprop | grep "Andr Focuser"

# Connecting:
indi_setprop "AndrFocuser.DEVICE_PORT.PORT=/dev/serial/by-id/usb-Linux_6.12.75+rpt-rpi-v8_with_3f980000.usb_Gadget_Serial_v2.4-if00"
indi_setprop "AndrFocuser.CONNECTION.CONNECT=On"
```
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
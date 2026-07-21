#include "indi_andr_focuser.h"
#include "basedevice.h"
#include "config.h"
#include "indiapi.h"
#include "indifocuser.h"
#include "indilogger.h"
#include "libindi/connectionplugins/connectionserial.h"
#include <connectionplugins/connectionserial.h>
#include <cstring>
#include <termios.h>

static std::unique_ptr<AndrFocuser> andrFocuser(new AndrFocuser());

AndrFocuser::AndrFocuser() {
  setDeviceName(getDefaultName());
  setVersion(CDRIVER_VERSION_MAJOR, CDRIVER_VERSION_MINOR);
  setDriverInterface(FOCUSER_INTERFACE);
  setSupportedConnections(CONNECTION_SERIAL);
  SetCapability(FOCUSER_CAN_REL_MOVE);
}

const char *AndrFocuser::getDefaultName() {
  return "Andr Focuser";
}

bool AndrFocuser::initProperties() {
  INDI::Focuser::initProperties();

  serialConnection->setDefaultPort("/dev/ttyACM0");
  serialConnection->setDefaultBaudRate(Connection::Serial::B_115200);
  serialConnection->registerHandshake([this]() { return Handshake(); });

  return true;
}

bool AndrFocuser::Handshake() {
  LOG_INFO("Handshake:");
  LOGF_INFO(" * Port serialConnection.PortFD: %d", serialConnection->getPortFD());
  LOGF_INFO(" * Port this.PortFD: %d", this->PortFD);

  if (serialConnection->getPortFD() < 0) {
    LOGF_ERROR("Handshake failed: invalid port file descriptor (%d), OS error: %s (errno %d)",
      serialConnection->getPortFD(), strerror(errno), errno);
    return false;
  }

  LOG_INFO("Sending Hello...");

  char response[256];
  bool result = SendCommand("Hello\n", response, sizeof(response));
  if (result) {
    LOGF_INFO("Handshake successfull: %s", response);
  } else {
    LOGF_ERROR("Handshake failed: sending Hello failed, OS error: %s (errno %d)",
      strerror(errno), errno);
  }

  return true;
}

IPState AndrFocuser::MoveRelFocuser(FocusDirection dir, uint32_t ticks) {
  LOGF_INFO("MoveRelFocuser: %d %d", dir, ticks);

  char request[32];
  sprintf(request, "MoveRel;Dir:%d;Ticks:%d\n", dir, ticks);
  LOGF_INFO("Request: %s", request);

  char response[256];
  bool result = SendCommand(request, response, sizeof(response));
  LOGF_INFO("Response: %s", response);

  return result ? IPS_OK : IPS_ALERT;
}

bool AndrFocuser::SendCommand(const char *request, char *response, int responseLen) {
  int fd = serialConnection->getPortFD();
  if (fd < 0) {
    LOG_ERROR("SendCommand: device port is not open");
    return false;
  }

  int nBytesWritten = write(fd, request, strlen(request));
  if (nBytesWritten < 0) {
    LOGF_ERROR("SendCommand: write error: %s", strerror(errno));
    return false;
  }

  if (response && responseLen > 0) {
    int nBytesRead = read(fd, response, responseLen - 1);
    if (nBytesRead < 0) {
      LOGF_ERROR("SendCommand: read error: %s", strerror(errno));
      return false;
    }
    response[nBytesRead] = '\0';
  }

  return true;
}

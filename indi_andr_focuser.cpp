#include "indi_andr_focuser.h"
#include "config.h"
#include "indifocuser.h"
#include "libindi/connectionplugins/connectionserial.h"
#include <cstring>

static std::unique_ptr<AndrFocuser> andrFocuser(new AndrFocuser());
const char *AndrFocuser::getDefaultName() { return "Andr Focuser"; }

AndrFocuser::AndrFocuser() {
  setVersion(CDRIVER_VERSION_MAJOR, CDRIVER_VERSION_MINOR);
  SetCapability(FOCUSER_CAN_REL_MOVE);
  setSupportedConnections(CONNECTION_SERIAL);

  serialConnection = new Connection::Serial(this);
  serialConnection->setDefaultPort("/dev/ttyUSB0");
  serialConnection->setDefaultBaudRate(Connection::Serial::B_115200);
  serialConnection->registerHandshake([&]() { return Handshake(); });
  registerConnection(serialConnection);
}

bool AndrFocuser::Handshake() {
  LOG_INFO("Handshake with AndrFocuser server:");
  LOGF_INFO(" * Port this.FD: %d", this->PortFD);
  LOGF_INFO(" * Port serialConnection.FD: %d", serialConnection->getPortFD());

  if (PortFD == -1) {
    LOG_ERROR("Handshake failed: invalid port file descriptor");
    return false;
  }

  LOGF_INFO("Handshake successfull with the %s.", getDeviceName());

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
  int fd = PortFD;
  if (fd < 0) {
    LOG_ERROR("Device port not open");
    return false;
  }

  int nBytesWritten = write(fd, request, strlen(request));
  if (nBytesWritten < 0) {
    LOGF_ERROR("Write error: %s", strerror(errno));
    return false;
  }

  if (response && responseLen > 0) {
    int nBytesRead = read(fd, response, responseLen - 1);
    if (nBytesRead < 0) {
      LOGF_ERROR("Read error: %s", strerror(errno));
      return false;
    }
    response[nBytesRead] = '\0';
  }

  return true;
}

#include <cstring>
#include "libindi/indicom.h"
#include "libindi/connectionplugins/connectiontcp.h"
#include "config.h"
#include "indi_andr_focuser.h"

// Declare an auto pointer to AndrFocuser.
static std::unique_ptr<AndrFocuser> andrFocuser(new AndrFocuser());

AndrFocuser::AndrFocuser()
{
    setVersion(CDRIVER_VERSION_MAJOR, CDRIVER_VERSION_MINOR);
    SetCapability(FOCUSER_CAN_REL_MOVE);
    setSupportedConnections(CONNECTION_TCP);

    tcpConnection = new Connection::TCP(this);
    tcpConnection->setDefaultHost("127.0.0.1");
    tcpConnection->setDefaultPort(12345);
    tcpConnection->registerHandshake([&]() { return Handshake(); });

    registerConnection(tcpConnection);
}

const char *AndrFocuser::getDefaultName()
{
    return "Andr Focuser";
}

bool AndrFocuser::Handshake()
{
    LOG_INFO("Handshake with AndrFocuser server:");
    LOGF_INFO("  Port this.FD: %d", this->PortFD);
    LOGF_INFO("  Port tcpConnection.FD: %d", tcpConnection->getPortFD());

    if (PortFD == -1)
    {
        LOG_ERROR("Invalid port file descriptor during handshake.");
        return false;
    }

    LOGF_INFO("Connected successfuly to %s.", getDeviceName());

    return true;
}

IPState AndrFocuser::MoveRelFocuser(FocusDirection dir, uint32_t ticks)
{
    LOGF_INFO("MoveRelFocuser: %d %d", dir, ticks);

    char command[32];
    sprintf(command, "MoveRel;Dir:%d;Ticks:%d", dir, ticks);

    char response[256];
    bool result = SendCommand(command, response, sizeof(response));

    LOGF_INFO("Response: %s", response);

    return result ? IPS_OK : IPS_ALERT;
}

bool AndrFocuser::SendCommand(const char *request, char *response, int responseLen)
{
    int fd = tcpConnection->getPortFD();
    if (fd < 0)
    {
        LOG_ERROR("TCP socket not open");
        return false;
    }

    int nBytesWritten = write(fd, request, strlen(request));
    if (nBytesWritten < 0)
    {
        LOGF_ERROR("Write error: %s", strerror(errno));
        return false;
    }

    if (response && responseLen > 0)
    {
        int nBytesRead = read(fd, response, responseLen - 1);
        if (nBytesRead < 0)
        {
            LOGF_ERROR("Read error: %s", strerror(errno));
            return false;
        }
        response[nBytesRead] = '\0';
    }

    return true;
}

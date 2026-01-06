#include <cstring>
#include "libindi/indicom.h"
#include "libindi/connectionplugins/connectiontcp.h"
#include "config.h"
#include "indi_andr_focuser.h"

// We declare an auto pointer to AndrFocuser.
static std::unique_ptr<AndrFocuser> andrFocuser(new AndrFocuser());

AndrFocuser::AndrFocuser()
{
    setVersion(CDRIVER_VERSION_MAJOR, CDRIVER_VERSION_MINOR);

    // And here we tell the base class about our focuser's capabilities.
    // Values: FOCUSER_CAN_ABS_MOVE | FOCUSER_CAN_REL_MOVE | FOCUSER_CAN_ABORT
    SetCapability(FOCUSER_CAN_REL_MOVE);

    // Set connection up
    setSupportedConnections(CONNECTION_TCP);
    
    tcpConnection = new Connection::TCP(this);
    tcpConnection->setDefaultHost("127.0.0.1");
    tcpConnection->setDefaultPort(12345);
    tcpConnection->registerHandshake([&]() { return Handshake(); });
    tcpConnection->Connect();

    registerConnection(tcpConnection);
}

const char *AndrFocuser::getDefaultName()
{
    return "Andr Focuser";
}

bool AndrFocuser::initProperties()
{
    // initialize the parent's properties first
    INDI::Focuser::initProperties();

    // TODO: Add any custom properties you need here.

    addAuxControls();

    return true;
}

void AndrFocuser::ISGetProperties(const char *dev)
{
    INDI::Focuser::ISGetProperties(dev);

    // TODO: Call define* for any custom properties.
}

bool AndrFocuser::updateProperties()
{
    INDI::Focuser::updateProperties();

    if (isConnected())
    {
        // TODO: Call define* for any custom properties only visible when connected.
    }
    else
    {
        // TODO: Call deleteProperty for any custom properties only visible when connected.
    }

    return true;
}

bool AndrFocuser::ISNewNumber(const char *dev, const char *name, double values[], char *names[], int n)
{
    // Make sure it is for us.
    if (dev != nullptr && strcmp(dev, getDeviceName()) == 0)
    {
        // TODO: Check to see if this is for any of my custom Number properties.
    }

    // Nobody has claimed this, so let the parent handle it
    return INDI::Focuser::ISNewNumber(dev, name, values, names, n);
}

bool AndrFocuser::ISNewSwitch(const char *dev, const char *name, ISState *states, char *names[], int n)
{
    // Make sure it is for us.
    if (dev != nullptr && strcmp(dev, getDeviceName()) == 0)
    {
        // TODO: Check to see if this is for any of my custom Switch properties.
    }

    // Nobody has claimed this, so let the parent handle it
    return INDI::Focuser::ISNewSwitch(dev, name, states, names, n);
}

bool AndrFocuser::ISNewText(const char *dev, const char *name, char *texts[], char *names[], int n)
{
    // Make sure it is for us.
    if (dev != nullptr && strcmp(dev, getDeviceName()) == 0)
    {
        // TODO: Check to see if this is for any of my custom Text properties.
    }

    // Nobody has claimed this, so let the parent handle it
    return INDI::Focuser::ISNewText(dev, name, texts, names, n);
}

bool AndrFocuser::ISSnoopDevice(XMLEle *root)
{
    // TODO: Check to see if this is for any of my custom Snoops. Fo shizzle.

    return INDI::Focuser::ISSnoopDevice(root);
}

bool AndrFocuser::saveConfigItems(FILE *fp)
{
    INDI::Focuser::saveConfigItems(fp);

    // TODO: Call IUSaveConfig* for any custom properties I want to save.

    return true;
}

bool AndrFocuser::Handshake()
{
    if (isSimulation())
    {
        LOGF_INFO("Connected successfuly to simulated %s.", getDeviceName());
        return true;
    }

    // NOTE: PortFD is set by the base class.

    // TODO: Any initial communciation needed with our focuser, we have an active
    // connection.

    LOG_INFO("Handshake with AndrFocuser server...");
    
    LOGF_INFO("Port this.FD: %d", this->PortFD);
    LOGF_INFO("Port tcpConnection.FD: %d", tcpConnection->getPortFD());
    
    // PortFD = tcpConnection->getPortFD();
    // if (PortFD == -1)
    // {
    //     LOG_ERROR("Invalid port file descriptor during handshake.");
    //     return false;
    // }
    
    // LOGF_INFO("Connected successfuly to %s.", getDeviceName());
    
    // Check if socket is valid
    // int socket_test = 0;
    // if (fcntl(PortFD, F_GETFL, &socket_test) < 0) {
    //     LOGF_ERROR("Socket test failed: %s", strerror(errno));
    //     return false;
    // }
    
    // Wait a bit for connection to be established
    // std::this_thread::sleep_for(std::chrono::milliseconds(100));

    return true;
}

void AndrFocuser::TimerHit()
{
    if (!isConnected())
        return;

    // TODO: Poll your device if necessary. Otherwise delete this method and it's
    // declaration in the header file.

    // LOG_INFO("timer hit");

    // If you don't call SetTimer, we'll never get called again, until we disconnect
    // and reconnect.
    SetTimer(POLLMS);
}

IPState AndrFocuser::MoveFocuser(FocusDirection dir, int speed, uint16_t duration)
{
    // NOTE: This is needed if we don't specify FOCUSER_CAN_ABS_MOVE
    // TODO: Actual code to move the focuser. You can use IEAddTimer to do a
    // callback after "duration" to stop your focuser.
    LOGF_INFO("MoveFocuser: %d %d %d", dir, speed, duration);
    return IPS_OK;
}

IPState AndrFocuser::MoveAbsFocuser(uint32_t targetTicks)
{
    // NOTE: This is needed if we do specify FOCUSER_CAN_ABS_MOVE
    // TODO: Actual code to move the focuser.
    LOGF_INFO("MoveAbsFocuser: %d", targetTicks);
    return IPS_OK;
}

IPState AndrFocuser::MoveRelFocuser(FocusDirection dir, uint32_t ticks)
{
    // NOTE: This is needed if we do specify FOCUSER_CAN_REL_MOVE
    // TODO: Actual code to move the focuser.
    LOGF_INFO("MoveRelFocuser: %d %d", dir, ticks);

    char command[32];
    sprintf(command, "MoveRel;Dir:%d;Ticks:%d", dir, ticks);

    char response[256];
    bool result = SendCommand(command, response, sizeof(response));

    LOGF_INFO("Response: %s", response);

    if (result)
    {
        return IPS_OK;
    }
    else
    {
        return IPS_ALERT;
    }
}

bool AndrFocuser::AbortFocuser()
{
    // NOTE: This is needed if we do specify FOCUSER_CAN_ABORT
    // TODO: Actual code to stop the focuser.
    LOG_INFO("AbortFocuser");
    return true;
}

bool AndrFocuser::SendCommand(const char *request, char *response, int responseLen)
{
    int fd = tcpConnection->getPortFD();
    if (fd < 0)
    {
        LOG_ERROR("TCP socket not open");
        return false;
    }

    // Write and read operations are identical to serial
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

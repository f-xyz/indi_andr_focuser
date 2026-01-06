#pragma once

#include "libindi/indifocuser.h"
#include "libindi/connectionplugins/connectiontcp.h"

class AndrFocuser : public INDI::Focuser
{
public:
    AndrFocuser();
    virtual ~AndrFocuser() = default;

    virtual const char *getDefaultName() override;
    virtual bool initProperties() override;
    virtual bool updateProperties() override;

protected:
    virtual bool Handshake() override;
    virtual IPState MoveRelFocuser(FocusDirection dir, uint32_t ticks);

    // Properties
    // INDI::PropertySwitch PowerSP {2};
    // INDI::PropertyNumber ValueNP {1};

private:
    bool SendCommand(const char *request, char *response, int responseLen);
};
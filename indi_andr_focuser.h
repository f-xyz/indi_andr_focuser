#pragma once

#include "libindi/indifocuser.h"
#include "libindi/connectionplugins/connectiontcp.h"

class AndrFocuser : public INDI::Focuser
{
public:
    AndrFocuser();
    virtual ~AndrFocuser() = default;
    virtual const char *getDefaultName() override;

protected:
    virtual bool Handshake() override;
    virtual IPState MoveRelFocuser(FocusDirection dir, uint32_t ticks);
    bool SendCommand(const char *request, char *response, int responseLen);
};
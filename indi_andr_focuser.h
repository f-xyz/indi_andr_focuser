#pragma once
#include "libindi/indifocuser.h"

class AndrFocuser : public INDI::Focuser {
public:
  AndrFocuser();
  virtual ~AndrFocuser() = default;
  virtual const char *getDefaultName() override;

protected:
  virtual bool initProperties() override;
  virtual bool Handshake() override;
  virtual IPState MoveRelFocuser(FocusDirection dir, uint32_t ticks) override;
  bool SendCommand(const char *request, char *response, int responseLen);
};
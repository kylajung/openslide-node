#ifndef SRC_METHODS_H_
#define SRC_METHODS_H_

#include <napi.h>

Napi::Value Open(const Napi::CallbackInfo& info);
Napi::Value ReadRegionSync(const Napi::CallbackInfo& info);

#endif // SRC_METHODS_H_

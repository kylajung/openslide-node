#include <napi.h>

#include "methods.h"

Napi::Object init(Napi::Env env, Napi::Object exports) {
  exports.Set("open", Napi::Function::New(env, Open));
  exports.Set("readRegion", Napi::Function::New(env, ReadRegion));
  return exports;
}

NODE_API_MODULE(addon, init)
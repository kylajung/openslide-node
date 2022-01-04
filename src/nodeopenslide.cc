#include <napi.h>

#include "async.h"
#include "methods.h"

Napi::Object init(Napi::Env env, Napi::Object exports) {
  exports.Set("open", Napi::Function::New(env, Open));
  exports.Set("readRegionSync", Napi::Function::New(env, ReadRegionSync));
  exports.Set("readRegion", Napi::Function::New(env, ReadRegion));
  return exports;
}

NODE_API_MODULE(addon, init)
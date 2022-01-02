#include <napi.h>
#include <glib.h>
#include <openslide/openslide.h>

#include "methods.h"

auto FreeOsr = [](void* T, void* data){
  openslide_close(static_cast<openslide_t*>(data));
};

Napi::Value Open(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  int length = info.Length();
  
  if (length <= 0 || !info[0].IsString()) {
    Napi::TypeError::New(env, "String expected").ThrowAsJavaScriptException();
    return env.Undefined();
  }
  
  std::string path = info[0].As<Napi::String>().Utf8Value();
  openslide_t *osr = openslide_open(path.c_str());
  if (osr == NULL) {
    // File is not recognized by OpenSlide
    Napi::Error::New(env, "File is not recognized by openslide")
      .ThrowAsJavaScriptException();
    return env.Undefined();
  }
  if (openslide_get_error(osr) != NULL) {
    // File is recognized but an error occurred
    Napi::Error::New(env, "Error occured while opening file")
      .ThrowAsJavaScriptException();
    return env.Undefined();
  }
  Napi::External<openslide_t> ext = Napi::External<openslide_t>::New(env, osr, FreeOsr);
  return ext;
}

auto FreeBuffer = [](void* T, void* data){ 
  g_free(data);
};

Napi::Value ReadRegion(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  openslide_t *osr = info[0].As<Napi::External<openslide_t>>().Data();
  int32_t level = info[3].As<Napi::Number>().Int32Value();
  int64_t x = info[1].As<Napi::Number>().Int64Value();
  int64_t y = info[2].As<Napi::Number>().Int64Value();
  int64_t w = info[4].As<Napi::Number>().Int64Value();
  int64_t h = info[5].As<Napi::Number>().Int64Value();

  uint32_t *buf = static_cast<uint32_t*>(g_malloc(w * h * 4));
  // TODO: add error handling for openslide_read_region
  openslide_read_region(osr, buf, x, y, level, w, h);
  
  Napi::Buffer<uint32_t> data = Napi::Buffer<uint32_t>::New(env, buf,
    w * h * 4, FreeBuffer);
  return data;
}

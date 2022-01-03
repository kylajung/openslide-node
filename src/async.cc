#include <napi.h>
#include <glib.h>
#include <openslide/openslide.h>

#include "async.h"

auto FreeBuffer = [](void* T, void* data){ 
  g_free(data);
};

class ReadRegionWorker : public Napi::AsyncWorker {
 public:
  ReadRegionWorker(Napi::Function& callback, openslide_t *osr, int64_t x, int64_t y, int32_t level, int64_t width, int64_t height) :
    Napi::AsyncWorker(callback), osr(osr), x(x), y(y), level(level), width(width), height(height), buffer_size(height * width * 4), tile(NULL) {}
  ~ReadRegionWorker() {}

  void Execute() { 
    tile = static_cast<uint32_t*>(g_malloc(buffer_size));
    // TODO: add error handling for openslide_read_region
    openslide_read_region(osr, tile, x, y, level, width, height);
  }

  void OnOK() {
    Napi::Env env = Env();
    // TODO: add error handling for openslide_read_region
    Callback().Call({env.Undefined(),
                     Napi::Buffer<uint32_t>::New(env, tile, buffer_size, FreeBuffer)});
              
  }

 private:
  openslide_t *osr;
  int64_t x;
  int64_t y;
  int32_t level;
  int64_t width;
  int64_t height;
  int64_t buffer_size;
  uint32_t *tile;
};

Napi::Value ReadRegionAsync(const Napi::CallbackInfo& info) {
  openslide_t *osr = info[0].As<Napi::External<openslide_t>>().Data();
  int32_t level = info[3].As<Napi::Number>().Int32Value();
  int64_t x = info[1].As<Napi::Number>().Int64Value();
  int64_t y = info[2].As<Napi::Number>().Int64Value();
  int64_t width = info[4].As<Napi::Number>().Int64Value();
  int64_t height = info[5].As<Napi::Number>().Int64Value();
  Napi::Function callback = info[6].As<Napi::Function>();
  ReadRegionWorker* readRegionWorker = new ReadRegionWorker(callback, osr, x, y, level, width, height);
  readRegionWorker->Queue();
  return info.Env().Undefined();
}

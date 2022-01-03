{
  "targets": [
    {
      "target_name": "nodeopenslide",
      "cflags!": [ "-fno-exceptions" ],
      "cflags_cc!": [ "-fno-exceptions" ],
       'conditions': [
        ["OS=='win'", {
          "defines": [
            "_HAS_EXCEPTIONS=1"
          ],
          "msvs_settings": {
            "VCCLCompilerTool": {
              "ExceptionHandling": 1
            },
          },
        }],
        ["OS=='mac'", {
          'cflags+': ['-fvisibility=hidden'],
          'xcode_settings': {
            'GCC_ENABLE_CPP_EXCEPTIONS': 'YES',
            'CLANG_CXX_LIBRARY': 'libc++',
            'MACOSX_DEPLOYMENT_TARGET': '10.9',
            'GCC_SYMBOLS_PRIVATE_EXTERN': 'YES', # -fvisibility=hidden
          },
        }],
      ],
      "sources": [ "src/nodeopenslide.cc", "src/methods.cc", "src/async.cc"],
      "include_dirs": [
        "<!@(node -p \"require('node-addon-api').include\")",
        "/opt/homebrew/Cellar/openslide/3.4.1_5/include",
        "/opt/homebrew/opt/glib/include/glib-2.0",
        "/opt/homebrew/opt/glib/lib/glib-2.0/include"
      ],
      "libraries": [
        "/opt/homebrew/Cellar/openslide/3.4.1_5/lib/libopenslide.0.dylib",
        "/opt/homebrew/opt/glib/lib/libgmodule-2.0.dylib"
      ],
    }
  ]
}

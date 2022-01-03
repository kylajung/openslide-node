const openslide = require("bindings")("nodeopenslide");

module.exports = {
  open: openslide.open,
  readRegion: openslide.readRegion,
  readRegionAsync: openslide.readRegionAsync,
};

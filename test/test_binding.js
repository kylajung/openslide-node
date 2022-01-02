const openslide = require("../lib/binding.js");
const assert = require("assert");

assert(openslide, "The expected function is undefined");

function testBasic()
{
    const wsiPath = "test/wsi/CMU-1-Small-Region.svs";
    const wsi = openslide.open(wsiPath);
    const tile = openslide.readRegion(wsi, 0, 0, 0, 1000, 1000);
}

assert.doesNotThrow(testBasic, undefined, "testBasic threw an expection");

console.log("Tests passed- everything looks OK!");
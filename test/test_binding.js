const openslide = require("../lib/binding.js");
const assert = require("assert");

assert(openslide, "The expected function is undefined");

function testBasic() {
    const wsiPath = "test/wsi/CMU-1-Small-Region.svs";
    const wsi = openslide.open(wsiPath);
    const tile = openslide.readRegion(wsi, 0, 0, 0, 1000, 1000);
}

function testAsync() {
    return new Promise((resolve, reject) => {
        const wsiPath = "test/wsi/CMU-1-Small-Region.svs";
        const wsi = openslide.open(wsiPath);
        openslide.readRegionAsync(wsi, 0, 0, 0, 1000, 1000, (err, tile) => {
            try {
                assert(!err, "error occurred in readRegionAsync");
                assert(tile instanceof Buffer, "tile is not a buffer");
                resolve()
            } catch (err) {
                reject(err);
            }
        });
    })
}

assert.doesNotThrow(testBasic, undefined, "testBasic failed");
testAsync().then(() => {
    console.log("Tests passed- everything looks OK!");
}).catch(err => {
    console.error("testAsync failed")
    console.error(err)
})
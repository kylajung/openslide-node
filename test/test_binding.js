const OpenSlide = require("../dist/index.js");
const assert = require("assert");

assert(OpenSlide, "The expected function is undefined");

const wsiPath = "test/wsi/CMU-1-Small-Region.svs";

function testBasic() {
    const wsi = new OpenSlide(wsiPath);
    const tile = wsi.readRegionSync(0, 0, 0, 1000, 1000);
}

function testAsync() {
    return new Promise((resolve, reject) => {
        const wsi = new OpenSlide(wsiPath);
        wsi.readRegion(0, 0, 0, 1000, 1000, (err, tile) => {
            try {
                assert(!err, "error occurred in readRegionAsync");
                assert(tile instanceof Buffer, "tile is not a buffer");
                resolve();
            } catch (err) {
                reject(err);
            }
        });
    });
}

assert.doesNotThrow(testBasic, undefined, "testBasic failed");
testAsync()
    .then(() => {
        console.log("Tests passed- everything looks OK!");
    })
    .catch((err) => {
        console.error("testAsync failed");
        throw err;
    });

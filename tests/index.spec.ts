import { OpenSlide } from "../lib";

describe("OpenSlide class", () => {
    const wsiPath = "tests/wsi/CMU-1-Small-Region.svs";
    let wsi: OpenSlide;

    beforeAll(() => {
        wsi = new OpenSlide(wsiPath);
    });

    describe("constructor", () => {
        test("should successfully open WSI file", () => {
            expect(() => {
                new OpenSlide(wsiPath);
            }).not.toThrow();
        });
    });

    describe("readRegionSync method", () => {
        test("should succeed to read region", () => {
            expect(() => {
                wsi.readRegionSync(0, 0, 0, 1000, 1000);
            }).not.toThrow();
        });
        test("should reject negative height or width", () => {
            expect(() => {
                wsi.readRegionSync(0, 0, 0, -1000, 1000);
            }).toThrow();
            expect(() => {
                wsi.readRegionSync(0, 0, 0, 1000, -1000);
            }).toThrow();
        });
    });

    describe("readRegion method", () => {
        test("should succeed to read region", (done) => {
            wsi.readRegion(0, 0, 0, 1000, 1000, (err, tile) => {
                expect(err).toBe(null);
                expect(tile).toBeInstanceOf(Buffer);
                done();
            });
        });
        test("should reject negative height or width", (done) => {
            wsi.readRegion(0, 0, 0, -1000, 1000, (err, tile) => {
                // Below is failing in jest env, see https://github.com/nodejs/node-addon-api/issues/743
                // expect(err).toBeInstanceOf(Error);
                expect(tile).toBe(undefined);
                done();
            });
        });
    });
});

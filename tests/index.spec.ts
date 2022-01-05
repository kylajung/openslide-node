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
        test("should success to read region", () => {
            expect(() => {
                wsi.readRegionSync(0, 0, 0, 1000, 1000);
            }).not.toThrow();
        });
    });

    describe("readRegion method", () => {
        test("should success to read region", async () => {
            wsi.readRegion(0, 0, 0, 1000, 1000, (err, tile) => {
                expect(err).toBe(undefined);
                expect(tile).toBeInstanceOf(Buffer);
            });
        });
    });
});

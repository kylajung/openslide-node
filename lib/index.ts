const openslide = require("bindings")("nodeopenslide");

type ReadRegionCallback = (err: Error, tile: Buffer) => void;

/**
 * Class for opening, reading openslide-supported WSI files.
 * An instance of this class reprensents a single WSI file.
 * Note that the underlying file descriptor will be automatically closed when the object is garbage collected.
 */
export class OpenSlide {
    private _osr: any; // object that holds openslide_t passed from addon
    /**
     * open WSI file
     *
     * @param {string} path
     */
    constructor(path: string) {
        this._osr = openslide.open(path);
    }

    /**
     * Read tile from WSI file synchronously.
     *
     * @param x x coordinate of top left position in level 0
     * @param y y coordinate of top left position in level 0
     * @param level level number to read
     * @param width width of tile in specified level
     * @param height height of tile in specified level
     * @returns A buffer representing uncompressed RGBA image. The size of Buffer is width * height * 4 bytes.
     */
    readRegionSync(x: number, y: number, level: number, width: number, height: number): Buffer {
        const tile = openslide.readRegionSync(this._osr, x, y, level, width, height);
        return tile;
    }

    /**
     * Read tile from WSI file
     *
     * @param x x coordinate of top left position in level 0
     * @param y y coordinate of top left position in level 0
     * @param level level number to read
     * @param width width of tile in specified level
     * @param height height of tile in specified level
     * @returns A buffer representing uncompressed RGBA image. The size of Buffer is width * height * 4 bytes.
     */
    readRegion(x: number, y: number, level: number, width: number, height: number, callback: ReadRegionCallback): void;
    readRegion(x: number, y: number, level: number, width: number, height: number): Promise<Buffer>;
    readRegion(x: number, y: number, level: number, width: number, height: number, callback?: ReadRegionCallback): Promise<Buffer> | void {
        if (typeof callback === "function") {
            openslide.readRegion(this._osr, x, y, level, width, height, callback);
        } else {
            return new Promise((resolve, reject) => {
                openslide.readRegion(this._osr, x, y, level, width, height, (err: Error, tile: Buffer) => {
                    if (err) reject(err);
                    else resolve(tile);
                });
            });
        }
    }
}

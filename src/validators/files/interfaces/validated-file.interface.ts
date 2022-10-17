/**
 * fieldname: 'file',
 * originalname: 'cat.png',
 * encoding: '7bit',
 * mimetype: 'image/png',
 * destination: 'uploads/',
 * filename: 'ae2bcc3291957152cda942c302668927',
 * path: 'uploads/ae2bcc3291957152cda942c302668927',
 * size: 7333311
 */
export interface ValidatedFile {
    mimeType: string;
    sizeBytes: number;

    /**
     * When used with formidable, this field is really unreliable.
     * Sometimes it's undefined, sometimes it's null
     */
    originalName?: string;
    /**
     * Defined only when multer is used
     */
    encoding?: string;
    /**
     * Defined only when memory storage of multer is used
     */
    buffer?: Buffer;
    /**
     * Defined when custom storage of multer is used.
     * Defined when formidable is used.
     */
    fileName?: string;
    /**
     * Folder that contains uploaded files.
     * Not defined when memory storage of multer is used
     */
    destination?: string;
    /**
     * Path to the file.
     * Not defined when memory storage of multer is used.
     * This path is relative when multer is used, but should absolute with formidable
     */
    path?: string;
}

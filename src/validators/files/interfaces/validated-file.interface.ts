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
    originalName: string;
    encoding: string;
    mimeType: string;
    sizeBytes: number;

    /**
     * Defined only when memory storage is used
     */
    buffer?: Buffer;
    /**
     * Defined when custom storage instance used
     */
    fileName?: string;
    /**
     * Folder that contains uploaded files
     */
    destination?: string;
    /**
     * Path to the file
     */
    path?: string;
}

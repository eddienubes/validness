export type FileType = 'audio' | 'image';

/**
 * Single file configuration
 */
export interface FileConfiguration {
    /**
     * Maximum size of a file in bytes. If a field contains multiple files - applied to each one of them
     */
    maxSizeBytes?: boolean;

    /**
     * Mimetypes of a file, i.e. image/png more narrow/strict than type
     */
    mimetype?: string | string[];

    /**
     * Allows specifying a particular file type. A more broad configuration than mimetype.
     * I.e. type: 'audio' is the same thing as the mimetype: ['audio/wav', 'audio/mp3'] and so on..
     */
    type?: FileType;
}

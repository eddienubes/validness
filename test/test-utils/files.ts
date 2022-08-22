import path from 'path';

export const getTestFilePath = (fileName: string): string => path.join('test', 'test-data', fileName);

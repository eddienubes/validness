import { getOptionalPackage } from '@src/config/getOptionalPackage';
import type multerType from 'multer';

export const getMulterPackage = (): typeof multerType | null => getOptionalPackage<typeof multerType>('multer');

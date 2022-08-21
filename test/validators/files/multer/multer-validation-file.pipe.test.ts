import { IsFile } from '../../../../src/validators/files/decorators/is-file.decorator';
import { FILE_VALIDATION_METADATA_KEY } from '../../../../src/validators/files/constants';

class Class {
    @IsFile()
    field: Buffer;
}

describe('Multer validation file pipe', () => {
    it('should validate files using multer', () => {
        const obj = new Class();
        obj.field = Buffer.from('something');

        const a = Reflect.getMetadata(FILE_VALIDATION_METADATA_KEY, obj, 'field');

        console.log(a);
    });
});

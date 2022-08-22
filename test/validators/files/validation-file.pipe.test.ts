import { IsFile } from '../../../src/validators/files/decorators/is-file.decorator';
import { createRouteWithPipe } from '../../utils/server-utils';
import request from 'supertest';
import * as fs from 'fs';
import { getTestFilePath } from '../../test-utils/files';
import { validationFilePipe } from '../../../src/validators/files/validation-file.pipe';

export class FileDto {
    @IsFile()
    file: Buffer;
}

describe('Validation file pipe', () => {
    it('should validate files using multer', async () => {
        const app = createRouteWithPipe(validationFilePipe(FileDto));

        const path = getTestFilePath('cat.png');
        console.log(path);

        const file = fs.createReadStream(path);

        const res = await request(app).get('/').field('haha', 'hehe').attach('file', getTestFilePath('cat.png'));
    });
});

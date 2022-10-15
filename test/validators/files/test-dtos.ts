import { IsFile } from '../../../src/validators/files/decorators/is-file.decorator';
import { ValidatedFile } from '../../../src/validators/files/interfaces/validated-file.interface';
import { IsEmail, IsNumberString, IsPhoneNumber } from '@nestjs/class-validator';
import { IsFiles } from '../../../src/validators/files/decorators/is-files.decorator';

export class SingleFileDto {
    @IsFile()
    file: ValidatedFile;

    @IsNumberString()
    number: string;
}

export class MultipleFilesDto {
    @IsFiles()
    photos: ValidatedFile[];

    @IsPhoneNumber()
    phone: string;

    @IsEmail()
    email: string;
}

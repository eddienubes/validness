import { IsFile } from '@src/validators/files/decorators/is-file.decorator';
import { ValidatedFile } from '@src/validators/files/interfaces/validated-file.interface';
import { IsEmail, IsNumberString, IsPhoneNumber } from 'class-validator';
import { IsFiles } from '@src/validators/files/decorators/is-files.decorator';

export class SingleFileDto {
    @IsFile()
    file: ValidatedFile;

    @IsNumberString()
    number: string;
}

export class SingleFileNoTextDto {
    @IsFile()
    file: ValidatedFile;
}

export class SingleFileWithTypeDto {
    @IsFile({ type: 'image' })
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

export class MultipleFieldsWithWeirdSignDto {
    @IsFiles()
    'photos[]': ValidatedFile[];

    @IsPhoneNumber()
    phone: string;

    @IsEmail()
    email: string;
}

export class MultipleFilesMaxAmountDto {
    @IsFiles({ maxAmount: 1 })
    photos: ValidatedFile[];

    @IsPhoneNumber()
    phone: string;

    @IsEmail()
    email: string;
}

export class MultipleFilesMaxSizeDto {
    @IsFiles({ maxSizeBytes: 10000 })
    photos: ValidatedFile[];

    @IsPhoneNumber()
    phone: string;

    @IsEmail()
    email: string;
}

export class MultipleFilesMinSizeDto {
    @IsFiles({ minSizeBytes: 10_000_000 })
    photos: ValidatedFile[];

    @IsPhoneNumber()
    phone: string;

    @IsEmail()
    email: string;
}

export class MultipleFilesTypeDto {
    @IsFiles({ type: 'audio' })
    photos: ValidatedFile[];

    @IsPhoneNumber()
    phone: string;

    @IsEmail()
    email: string;
}

export class MultipleFilesMimeTypeDto {
    @IsFiles({ mimetype: 'audio/mpeg' })
    photos: ValidatedFile[];

    @IsPhoneNumber()
    phone: string;

    @IsEmail()
    email: string;
}

export class MultipleFilesOptionalDto {
    @IsFiles({ optional: true })
    photos: ValidatedFile[];

    @IsPhoneNumber()
    phone: string;

    @IsEmail()
    email: string;
}

export class MultipleFilesOptionalArrayTextDto {
    @IsFiles({ optional: true })
    photos: ValidatedFile[];

    @IsPhoneNumber()
    phone: string;

    @IsNumberString(undefined, { each: true })
    numbers: string[];
}

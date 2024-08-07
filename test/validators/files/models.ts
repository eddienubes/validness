import { Transform } from 'class-transformer';
import { IsFile, IsFiles, ValidatedFile } from '@src/index.js';
import { Allow, IsEmail, IsNumberString, IsPhoneNumber } from 'class-validator';

export class SingleFileDto {
    @IsFile()
    file: ValidatedFile;

    @IsNumberString()
    number: string;
}

export class SingleFileDtoWithContext extends SingleFileDto {
    @IsFile({
        context: {
            i18n: 'file.key.whatever'
        }
    })
    file: ValidatedFile = {} as ValidatedFile;

    @IsNumberString(undefined, {
        context: {
            i18n: 'number.key.whatever'
        }
    })
    number: string = '';
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

export class IsFilesDecoratorWithTransformDto {
    @IsFiles()
    files: ValidatedFile[];

    @Transform(({ value }) => {
        return parseInt(value, 10) + 1;
    })
    @Allow()
    count: number;
}

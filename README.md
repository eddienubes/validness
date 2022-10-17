<div style="width: 100%;">
    <a href="#" style="display: inline"><img src="misc/water.png" width="30" alt="Water png" /></a>
    <h1 style="display: inline; font-size: 2.4rem; text-align: center">Validness</h1>
    <img src="misc/water-pipe.png" width="30" alt="Water png" />
</div>

<p align="center">
    <a href="https/app.travis-ci.com/github/eddienubes/validness" target="_blank"><img src="https://app.travis-ci.com/eddienubes/validness.svg?branch=master" alt="TravisCI" /></a>
    <img src="jest/badges/coverage.svg" alt="coverage" />
    <a href="https://badge.fury.io/js/validness"><img src="https://badge.fury.io/js/validness.svg" alt="npm version" height="18"></a>
    <a href="https://img.shields.io/npm/dw/validness"><img src="https://img.shields.io/npm/dw/validness" alt="npm version" height="18"></a>
</p>

---

🟢 Your favourite library for validating incoming data in [express.js](https://expressjs.com/)
With a creation of a single class and usage of decorators we achieve validation of the following content types (body
parser required):

- application/json
- multipart/form-data (yes, with files and text fields)

---

## ⚙️ Installation:

1. It has some important peer dependencies:

- class-validator
- class-transformer
- reflect-metadata

  _Optional, for multipart/form-data parsing only:_
- multer _(recommended)_
- formidable@v2

```shell
yarn add validness class-validator class-transformer reflect-metadata
npm install validness class-validator class-transformer reflect-metadata
```

Please import reflect-metadata in an entry file of your project in order for this package to work

```typescript
import 'reflect-metadata'
// your code
```

For typescript decorators usage turn this option on in your **tsconfig.json** file.

```json
{
  "compilerOptions": {
    "experimentalDecorators": true
  }
}
```

---

## ✍ Usage:

### Body validation

As stated above we're going to utilise decorators.
Let's create a DTO of a commonly expected data:

_registration.dto.ts_

```typescript
import { IsEmail, IsPhoneNumber } from "class-validator";

export class RegistrationDto {
    @IsPhoneNumber()
    phone: ValidatedFile;

    @IsEmail()
    email: string;
}
```

_registration.controller.ts_

```typescript
import { Router } from "express";
import { validationBodyPipe, DefaultBodyError } from "validness";
import { RegistrationDto } from './registration.dto.ts';
import { StatusCodes } from "http-status-codes";

const router = Router()

// controller
router.post('/', validationBodyPipe(RegistrationDto), async (req, res, next) => {
    const validatedBody = req.body as RegistrationDto;

    await registerUser(validatedBody);

    res.json({ message: 'SUCCESS' })
});

// Error handling
router.use((err, req, res, next) => {
    // validness throws Default error models if customErrorFactory isn't sepcified.
    // Standard models contain everything you need, like status code and errored fields
    if (err instanceof DefaultBodyError) {
        // implement handling logic
        res.status(StatusCodes.BAD_REQUEST).json({ message: 'ERROR' });
    }
});
```

### Query validation

Let's create a query DTO with a use of decorators.
As you might know, query params always contain strings, you can transform them
with [class-transformer](https://github.com/typestack/class-transformer) decorators.

_get-users-query.dto.ts_

```typescript
import { IsEmail, IsNotEmpty, IsNumberString, IsPhoneNumber } from "class-validator";

export class GetUsersQueryDto {
    @IsString()
    @IsNotEmpty()
    query: string;

    @IsNumberString()
    pageIndex: string;

    @IsNumberString()
    perPage: string;
}
```

_users.controller.ts_

```typescript
import { Router } from "express";
import { GetUsersQueryDto } from './get-users-query.dto.ts';
import { validationQueryPipe, DefaultQueryError } from "validness";
import { StatusCodes } from "http-status-codes";

const router = Router()

// controller
router.get('/', validationQueryPipe(GetUsersQueryDto), async (req, res, next) => {
    const validatedQuery = req.query as GetUsersQueryDto;

    await findUsers(validatedQuery);

    res.json({ message: 'SUCCESS' })
});

// Error handling
router.use((err, req, res, next) => {
    // validness throws Default error models if customErrorFactory isn't sepcified.
    // Standard models contain everything you need, like status code and errored fields
    if (err instanceof DefaultQueryError) {
        // implement handling logic
        res.status(StatusCodes.BAD_REQUEST).json({ message: 'ERROR' });
    }
});
```

### Multipart Form Data validation

Install an underlying driver of your choice:

- multer (highly recommended)
- formidable@v2 (Has some nuances)

```shell
yarn add multer
yarn add -D @types/multer

npm install multer
npm install -D @types/multer
```

In the same simple way we create a new DTO.

_sign-up.dto.ts_

```typescript
import { IsEmail, IsNotEmpty, IsNumberString, IsPhoneNumber, IsString } from "class-validator";
import { ValidatedFile, IsFiles, IsFile } from "validness";

export class SignUpDto {
    // form-data text field
    @IsString()
    @IsNotEmpty()
    firstName: string;

    // form-data text field
    @IsString()
    @IsNotEmpty()
    lastName: string;

    // a single file
    @IsFile({ type: 'image' })
    photo: ValidatedFile

    // a multiple files
    @IsFiles({ type: 'image' })
    documents: ValidatedFile[]
}
```

_auth.controller.ts_

```typescript
import { Router } from "express";
import { SignUpDto } from './sign-up.dto.ts';
import { validationFilePipe, DefaultFileError } from "validness";
import { StatusCodes } from "http-status-codes";

const router = Router()

// controller
router.post('/', validationFilePipe(SignUpDto), async (req, res, next) => {
    const validatedBody = req.body as SignUpDto;

    // We do not use any disk storage engines for multer
    // So, validatedBody.photo.buffer is accessbile and stored in memory
    // Consult API section for more details

    await signUp(validatedBody);

    res.json({ message: 'SUCCESS' })
});

// Error handling
router.use((err, req, res, next) => {
    // validness throws Default error models if customErrorFactory isn't sepcified.
    // Standard models contain everything you need, like status code and errored fields
    if (err instanceof DefaultFileError) {
        // implement handling logic
        res.status(StatusCodes.BAD_REQUEST).json({ message: 'ERROR' });
    }
});
```

#### That's it! 😊

---

## 🤔 Nuances I have been talking about:

1. Formidable.

IMO this library does not have a convenient API, therefore some decisions were made while developing mine.

If you decide to change core config of this library (**coreConfig** property), e.g. set max size for files there and not
in
the decorator, than the error thrown by formidable will **NOT** be mapped to DefaultFileError, but rather passed as is.

2. Some options in configuration might not be complete, such as **mimetype** or **type**. If you hardly demand new ones,
   just open an issue and I will expend the list within a day.
   Same algorithm applies to any improvements you consider essential.

---

## 🛠️ Configuration

Each validation pipe has a couple of extra arguments to customise its or underlying libraries' behaviour.
Let's take a look at the **validationFilePipe** and **validationBodyPipe** signatures.

```typescript
// ...
export const validationFilePipe = (
    DtoConstructor: ClassConstructor,
    fileValidationConfig?: Partial<FileValidationConfig>,
    customErrorFactory?: CustomErrorFactory
) => {
}
// ...
export const validationBodyPipe =
    (
        DtoConstructor: ClassConstructor,
        customErrorFactory?: CustomErrorFactory,
        validatorConfig?: ValidatorOptions
    ): RequestHandler => {
    }
// ...
```

If you want to customise config globally for all pipes use
**validness** function and pass object with options there. (Be careful with what you change in **coreConfig**)

```typescript
import { validness } from "validness";

validness({
    // And many other options..
    customErrorFactory: errorFactory,
    queryValidationConfig: {
        enableDebugMessages: true
    }
});
```

---

## 🚀 API

### ValidationConfig
Defaults can be found [HERE](https://github.com/eddienubes/validness/blob/master/src/config/constants.ts)

In think an overall documentation for each property is not required, because they're well commented directly in the library itself.

If you feel a lack of examples - open an issue, I will add as many as you want. Thanks.

---
## ❤️ Contributing
If you wish to contribute in evolving of this package, please submit your issues or even open pull requests. You're always welcome. 🥰

---
## License 
MIT (c) Sole Cold
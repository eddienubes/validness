# Validness 💦

<p align="center">
    <img src="https://github.com/eddienubes/validness/blob/master/misc/water.png?raw=true" alt="water" width="30">
    <img src="https://github.com/eddienubes/validness/blob/master/misc/water2.png?raw=true" alt="water2" width="30">
</p>
<p align="center">
    <img src="https://github.com/eddienubes/validness/actions/workflows/ci.yml/badge.svg" alt="ci-status" />
    <a href="https://www.npmjs.com/package/sagetest"><img src="https://img.shields.io/npm/v/validness?color=729B1B&label=npm"/></a>
    <a href="https://www.npmjs.com/package/sagetest"><img src="https://img.shields.io/npm/dw/validness" alt="npm version" height="18"></a>
    <a href="https://codecov.io/gh/eddienubes/validness" > 
        <img src="https://codecov.io/gh/eddienubes/validness/graph/badge.svg?token=3FU7I90B4Q"/> 
    </a>
</p>

---

🟢 Your favourite library for validating incoming data in [express.js](https://expressjs.com/).

With the creation of a single class and usage of decorators, we achieve validation of the following content types (body
parser required):

- application/json
- multipart/form-data (yes, with files and text fields)

> Also, this library supports both ESM and CJS versions via dynamic exports in package.json.
---

## ⚙️ Installation:

1. It has some important peer dependencies:

- class-validator
- class-transformer
- reflect-metadata

  _Optional, for multipart/form-data parsing only (These are truly optional):_
- multer _(recommended)_
- formidable (yes, we support an ESM version only)

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

As stated above, we're going to use decorators.
Let's create a DTO of commonly expected data:

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
- formidable (Has some nuances)

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

IMO this library does not have a convenient API, therefore, some decisions were made while developing mine.

If you decide to change core config of this library (**coreConfig** property), e.g. set max size for files there and not
in
the decorator, then the error thrown by formidable will **NOT** be mapped to DefaultFileError, but rather passed as is.

2. Some options in configuration might not be complete, such as **mimetype** or **type**. If you hardly demand new ones,
   just open an issue and I will expend the list within a day.
   Same algorithm applies to any improvements you consider essential.

---

## 🛠️ Configuration

Each validation pipe has a couple of extra arguments to customise its or underlying libraries' behaviour.
Let's take a look at the **validationFilePipe** and **validationBodyPipe** signatures.

```typescript
// ...
export const validationFilePipe =
  (DtoConstructor: ClassConstructor, config?: ValidationFileConfig): Router => {
  }
// ...
export const validationBodyPipe =
  (DtoConstructor: ClassConstructor, config?: ValidationBodyConfig): RequestHandler => {
  }
// ...
```

If you want to customise config globally for all pipes, use
**validness** function and pass an object with options there. (Be careful with what you change in **coreConfig**)

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

I think overall documentation for each property is not required because they're well commented in the
code itself.

If you feel a lack of examples - open an issue, I will add as many as you want. Thanks.

---

## ❤️ Contributing

If you wish to contribute to evolving of this package, please submit your issues or even open pull requests. You're
always welcome. 🥰

---

## License

MIT (c) Sole Cold

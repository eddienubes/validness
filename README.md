# Validness
<p align="center">
    <a href="https://app.travis-ci.com/github/eddienubes/validness" target="_blank"><img src="https://app.travis-ci.com/eddienubes/validness.svg?branch=master" alt="TravisCI" /></a>
</p>

---

Library that consists of validators to check incoming Query and Body Dtos at runtime

It has some important peer dependencies:
- @nestjs/class-validator
- @nestjs/class-transformer
- reflect-metadata

Please import reflect-metadata in an entry file of your project in order for package to work
```typescript
import 'reflect-metadata'
```
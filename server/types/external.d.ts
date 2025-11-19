// Temporary shims to satisfy TypeScript in environments where dependencies
// are not yet installed. Once the real packages are installed locally,
// these declarations simply merge as `any` types without affecting runtime.

declare module 'multer' {
  import { RequestHandler } from 'express'

  interface MulterInstance {
    single(fieldname: string): RequestHandler
    array(fieldname: string, maxCount?: number): RequestHandler
  }

  interface Multer {
    (options?: any): MulterInstance
    single(fieldname: string): RequestHandler
    memoryStorage(): any
  }

  const multer: Multer
  export default multer
}

declare module '@aws-sdk/client-s3' {
  export class S3Client {
    constructor(config: any)
    send(command: any): Promise<any>
  }

  export class PutObjectCommand {
    constructor(input: any)
  }
}


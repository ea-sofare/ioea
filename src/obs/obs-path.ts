import { isAbsolute } from 'path';
import { Oops } from '../shared/friendly-except/oops';

export class ObsPath {
  private readonly _realPath: string;
  private readonly _type: ObsPathType;

  constructor(path: string) {
    if (!path) {
      throw Oops.oh('path cannot be null.');
    }

    this._type = ObsPath.isLocal(path) ? ObsPathType.Local : ObsPathType.Cloud;
    this._realPath = ObsPath.toRealFilePath(this._realPath);
  }

  private static isLocal(path: string): boolean {
    // 判断是否为绝对路径，如果是绝对路径则是本地路径，或者是否以 local: 开头
    if (isAbsolute(path) || path.startsWith(ObsPathType.Local)) {
      return true;
    }

    // 以 cloud: 开头为云端路径
    if (path.startsWith(ObsPathType.Cloud)) {
      return false;
    }

    throw Oops.oh('not supported.');
  }

  private static toRealFilePath(path: string): string {
    return path.replace(
      ObsPath.isLocal(path) ? ObsPathType.Local : ObsPathType.Cloud,
      '',
    );
  }

  get realPath(): string {
    return this._realPath;
  }

  get type(): ObsPathType {
    return this._type;
  }
}

export enum ObsPathType {
  Cloud = 'cloud:',
  Local = 'local:',
}

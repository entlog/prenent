export class PackageType {
  public comments: string[] = [];
  public type: string | undefined = undefined;
  public values: string[] = [];
}

export default class PackageModel {
  public comments: string[] = [];
  public types: PackageType[] = [];
  public version: string | undefined;
}

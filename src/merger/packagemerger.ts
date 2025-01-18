import PackageModel, { PackageType } from '../model/packagemodel.js';

export default class PackageMerger {
  private models: PackageModel[] = [];

  public static newInstance(): PackageMerger {
    return new PackageMerger();
  }
  public add(model: PackageModel): PackageMerger {
    this.models.push(model);
    return this;
  }
  public addAll(models: PackageModel[]): PackageMerger {
    models.forEach((m) => this.models.push(m));
    return this;
  }
  public merge(): PackageModel {
    const ret: PackageModel = new PackageModel();
    for (const model of this.models) {
      model.comments.map((c) => ret.comments.push(c));
      for (const type of model.types) {
        if (type instanceof PackageType) {
          let retType = ret.types.find((t) => t instanceof PackageType && t.type === type.type);
          if (retType === undefined) {
            retType = new PackageType();
            retType.type = type.type;
            ret.types.push(retType);
          }
          // Push all comments
          type.comments.map((c) => retType.comments.push(c));

          for (const value of type.values) {
            if (!retType.values.includes(value)) {
              retType.values.push(value);
            }
          }
        } else {
          ret.types.push(type);
        }
      }
    }
    return ret;
  }
}

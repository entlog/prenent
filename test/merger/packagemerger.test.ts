import { expect } from 'chai';
import PackageModel, { PackageType } from '../../src/model/package.js';
import PackageMerger from '../../src/merger/packagemerger.js';

describe('merger', () => {
  /**
   * Test that checks that package xml is interpreted properly
   */
  it('test merge', async () => {
    const model1: PackageModel = new PackageModel();
    model1.comments.push('Global Comment 1');
    model1.version = '15';
    model1.types.push(new PackageType());
    model1.types[0].comments.push('Type 1 Comment');
    model1.types[0].type = 'CustomObject';
    model1.types[0].values.push('Account');

    const model2: PackageModel = new PackageModel();
    model2.comments.push('Global Comment 1');
    model2.version = '16';
    model2.types.push(new PackageType());
    model2.types[0].comments.push('Type 1 Comment');
    model2.types[0].type = 'CustomObject';
    model2.types[0].values.push('Case');

    const resModel: PackageModel = PackageMerger.newInstance().add(model1).add(model2).merge();

    expect(resModel.version).equal('16');
    expect(resModel.types.length).equal(1);
    expect(resModel.types[0].type).equal('CustomObject');
    expect(resModel.types[0].values.length).equal(2);
    expect(resModel.types[0].values.includes('Account')).equal(true);
    expect(resModel.types[0].values.includes('Case')).equal(true);
  });
});

import { expect } from 'chai';
import fs from 'graceful-fs';
import PackageModel from '../../src/model/packagemodel.js';
import PackageParser from '../../src/parser/packageparser.js';

describe('parser', () => {
  /**
   * Test that checks that package xml is interpreted properly
   */
  it('test read', async () => {
    const testFile: string = './test1.xml';
    try {
      fs.writeFileSync(
        testFile,
        '<?xml version="1.0" encoding="UTF-8"?>\
            <!-- sf deploy bla bla bla -->\
            <Package>\
               <!-- Comment for custom objects -->\
               <types>\
                  <members>Account</members>\
                  <members>Contact</members>\
                  <name>CustomObject</name>\
               </types>\
            <version>15</version>\
         </Package>'
      );

      const model: PackageModel = await PackageParser.parseFromFile(testFile);
      expect(model.version).equal('15');
      expect(model.comments.length).equal(1);
      expect(model.types.length).equal(1);
      expect(model.types[0].type).equal('CustomObject');
      expect(model.types[0].values.length).equal(2);
      expect(model.types[0].values[0]).equal('Account');
      expect(model.types[0].values[1]).equal('Contact');
    } finally {
      fs.unlinkSync(testFile);
    }
  });
});

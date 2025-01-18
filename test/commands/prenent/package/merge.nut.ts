import { execCmd, TestSession } from '@salesforce/cli-plugins-testkit';
import { expect } from 'chai';

import fs from 'graceful-fs';
import PackageParser from '../../../../src/parser/packageparser.js';
import PackageModel from '../../../../src/model/packagemodel.js';

describe('prenent package merge NUTs', () => {
  let session: TestSession;

  before(async () => {
    session = await TestSession.create({ devhubAuthStrategy: 'NONE' });
  });

  after(async () => {
    await session?.clean();
  });

  it('should display provided name', async () => {
    const outputFile = 'out.xml';
    const inputFile1 = 'input1.xml';
    const inputFile2 = 'input2.xml';
    try {
      fs.writeFileSync(
        inputFile1,
        '<?xml version="1.0" encoding="UTF-8"?>\
                  <!-- sf deploy bla bla bla -->\
                  <Package>\
                     <!-- Comment for custom objects -->\
                     <types>\
                        <members>Account</members>\
                        <name>CustomObject</name>\
                     </types>\
                  <version>15</version>\
               </Package>'
      );
      fs.writeFileSync(
        inputFile2,
        '<?xml version="1.0" encoding="UTF-8"?>\
                  <!-- sf deploy bla bla bla -->\
                  <Package>\
                     <!-- Comment for custom objects -->\
                     <types>\
                        <members>Contact</members>\
                        <name>CustomObject</name>\
                     </types>\
                  <version>17</version>\
               </Package>'
      );
      const command = `prenent package merge -i ${inputFile1} -o ${outputFile} `;
      // const output = execCmd(command, { ensureExitCode: 0 }).shellOutput.stdout;
      execCmd(command, { ensureExitCode: 0 });
      expect(fs.existsSync(outputFile + '2')).equal(true);

      const outModel: PackageModel = await PackageParser.parseFromFile(outputFile);
      expect(outModel.version).equal('17');
      expect(outModel.types.length).equal(1);
      expect(outModel.types[0].type).equal('CustomObject');
      expect(outModel.types[0].values.includes('Account')).equal(true);
      expect(outModel.types[0].values.includes('Contact')).equal(true);
    } finally {
      [inputFile1, inputFile2, outputFile].map((f) => fs.existsSync(f) && fs.unlinkSync(f));
    }
  });
});

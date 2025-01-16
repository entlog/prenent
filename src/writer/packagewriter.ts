import { Logger } from '@salesforce/core';
import PackageModel from '../model/packagemodel.js';
import fs from 'graceful-fs';

export default class FilePackageWriter {
   private logger: Logger | undefined;
   private pkgModel: PackageModel;
   public constructor(pkgModel: PackageModel) {
      this.pkgModel = pkgModel;
   }

   public async write(file: string): Promise<void> {
      const fd: number = fs.openSync(file, 'w');
      if (!this.logger) {
         this.logger = await Logger.child('Writer');
      }
      try {

         fs.writeSync(fd, '<?xml version="1.0" encoding="UTF-8"?>\n');
         this.logger.info(`Writing model ${this.pkgModel}`);
         this.pkgModel.comments.map(c => fs.writeSync(fd, `<!-- ${c} -->\n`));
         fs.writeSync(fd, '<Package>\n');
         this.pkgModel.types.map(t => {
            t.comments.map(tc => fs.writeSync(fd, `   <!-- ${tc} -->\n`));
            fs.writeSync(fd, '   <types>\n');
            t.values.map(v => fs.writeSync(fd, `      <members>${v}</members>\n`));
            fs.writeSync(fd, `\n      <name>${t.type}</name>\n`);
            fs.writeSync(fd, '   </types>\n\n');
         });
         fs.writeSync(fd, `   <version>${this.pkgModel.version}</version>\n`);
         fs.writeSync(fd, '</Package>\n');

      } finally {
         fs.closeSync(fd);
      }
   }

}
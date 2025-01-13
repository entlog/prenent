import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { Messages } from '@salesforce/core';
// import { SaxesParser } from 'saxes';
// import { SAXParser } from "sax-ts";
// import { Logger } from '@salesforce/core';
import PackageParser from '../../../parser/packageparser.js';

// const logger: Logger = await Logger.child('Stream');

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);
const messages = Messages.loadMessages('prenent', 'prenent.package.merge');

export type PrenentPackageMergeResult = {
   path: string;
};

export default class PrenentPackageMerge extends SfCommand<PrenentPackageMergeResult> {
   public static readonly summary = messages.getMessage('summary');
   public static readonly description = messages.getMessage('description');
   public static readonly examples = messages.getMessages('examples');

   public static readonly flags = {

      input: Flags.file({
         summary: messages.getMessage('flags.input.summary'),
         char: 'i',
         required: true,
         multiple: true,
         exists: true,
      }),
   };

   public async run(): Promise<PrenentPackageMergeResult> {
      const { flags } = await this.parse(PrenentPackageMerge);

      for (let input of flags.input) {
         this.log(`Reading ${input}`);
         const model = await PackageParser.parseFromFile(input);
         this.log(`Obtained model`, model);
      }
      // parser.push('<xml>Hello, <who name="world">world</who>!</xml>')
      //    .done();
      // parser.write('<xml>Hello, <who name="world">world</who>!</xml>').close();
      await ((time: number) => {
         return new Promise((rs, rj) => setTimeout(rs, time));
      })(2000);
      return {
         path: 'src/commands/prenent/package/merge.ts',
      };
   }
}

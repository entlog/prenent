import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { Messages } from '@salesforce/core';
// import { SaxesParser } from 'saxes';
// import { SAXParser } from "sax-ts";
// import { Logger } from '@salesforce/core';
import PackageParser from '../../../parser/packageparser.js';
import PackageMerger from '../../../merger/packagemerger.js';
import FilePackageWriter from '../../../writer/packagewriter.js';

// const logger: Logger = await Logger.child('Stream');

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);
const messages = Messages.loadMessages('@entlog/prenent', 'prenent.package.merge');

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
    output: Flags.file({
      summary: messages.getMessage('flags.output.summary'),
      char: 'o',
      required: true,
      multiple: false,
      exists: false,
    })
  };

  public async run(): Promise<PrenentPackageMergeResult> {
    const { flags } = await this.parse(PrenentPackageMerge);

    const parsers = [];
    for (const input of flags.input) {
      this.log(`Reading ${input}`);
      parsers.push(PackageParser.parseFromFile(input));

    }
    const models = await Promise.all(parsers);
    const mergedModel = PackageMerger.newInstance().addAll(models).merge();
    console.log(`Merged models: ${JSON.stringify(mergedModel)}`);
    new FilePackageWriter(mergedModel).write(flags.output);
    await ((time: number) =>
      new Promise((rs) => { setTimeout(rs, time); })
    )(2000);
    return {
      path: 'src/commands/prenent/package/merge.ts',
    };
  }
}

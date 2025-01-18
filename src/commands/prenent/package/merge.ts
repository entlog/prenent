import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { Messages } from '@salesforce/core';
import PackageParser from '../../../parser/packageparser.js';
import PackageMerger from '../../../merger/packagemerger.js';
import FilePackageWriter from '../../../writer/packagewriter.js';

// const logger: Logger = await Logger.child('Stream');

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);
const messages = Messages.loadMessages('@entlog/prenent', 'prenent.package.merge');

export default class PrenentPackageMerge extends SfCommand<void> {
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
    }),
  };

  public async run(): Promise<void> {
    const { flags } = await this.parse(PrenentPackageMerge);

    const parsers = [];
    for (const input of flags.input) {
      this.log(`Reading ${input}`);
      parsers.push(PackageParser.parseFromFile(input));
    }
    const models = await Promise.all(parsers);
    const mergedModel = PackageMerger.newInstance().addAll(models).merge();
    new FilePackageWriter(mergedModel)
      .write(flags.output)
      .then(() => {
        this.log('Done');
      })
      .catch((e) => {
        this.log(`Problems generating output ${e}`);
      });
  }
}

import { Logger } from "@salesforce/core";
import { SAXParser } from "sax-ts";
import fs from "graceful-fs";

export class PackageType {
   public type: string | undefined = undefined;
   public values: string[] = [];
}

export class PackageModel {
   public items: PackageType[] = [];
}

export default class PackageParser {
   private logger: Logger | undefined;
   private parser: SAXParser;
   private model: PackageModel = new PackageModel();

   private tree: any[] = [];

   private onOpenTag(node: any) {
      this.logger?.info(`Open tag ${node.name}`);
      this.tree.push(node);
   }
   private onText(t: string) {
      this.logger?.info(`On text ${t}`);
   }
   private onCloseTag() {
      const popped: any | undefined = this.tree.pop();
      this.logger?.info(`On Close tag ${popped?.name}`);

   }

   public constructor() {
      this.parser = new SAXParser(true, {});
   }
   public async build(): Promise<PackageParser> {
      this.logger = await Logger.child('Stream')
      this.logger.info('Created logger!!')
      this.parser.onopentag = (node: any) => { this.onOpenTag(node) }
      this.parser.ontext = (t: string) => { this.onText(t) };
      this.parser.onclosetag = () => { this.onCloseTag() };
      return this;
   }

   protected push(text: string): PackageParser {
      this.logger?.info(`Pushed ${text}`)
      this.parser.write(text);
      return this;
   }

   protected done(): PackageModel {
      this.parser.close();
      return this.model;
   }


   public static async parseFromFile(file: string): Promise<PackageModel> {
      const parser = await new PackageParser().build();
      const fd: number = fs.openSync(file, "r");
      const b: Buffer = Buffer.alloc(1024);
      let read: number = fs.readSync(fd, b, 0, 1024, null);
      const decoder = new TextDecoder("UTF-8");
      while (read > 0) {
         parser.push(decoder.decode(b).substring(0, read));
         read = fs.readSync(fd, b, 0, 1024, null);
      }
      parser.done();
      return Promise.resolve(new PackageModel());
   }
}


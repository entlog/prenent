import { Logger } from '@salesforce/core';
import { SAXParser } from 'sax-ts';
import fs from 'graceful-fs';
import PackageModel, { PackageType } from '../model/package.js';

class Node {
  public name: string = '';
}

export default class PackageParser {
  private logger: Logger | undefined;
  private parser: SAXParser;
  private model: PackageModel = new PackageModel();
  private lastComments: string[] = [];

  private tree: Node[] = [];

  private constructor() {
    this.parser = new SAXParser(true, {});
  }

  public static async parseFromFile(file: string): Promise<PackageModel> {
    const fd: number = fs.openSync(file, 'r');
    try {
      const parser = await new PackageParser().build();
      const b: Buffer = Buffer.alloc(1024);
      let read: number = fs.readSync(fd, b, 0, 1024, null);
      const decoder = new TextDecoder('UTF-8');
      while (read > 0) {
        parser.push(decoder.decode(b).substring(0, read));
        read = fs.readSync(fd, b, 0, 1024, null);
      }
      return parser.done();
    } finally {
      fs.closeSync(fd);
    }
  }

  public async build(): Promise<PackageParser> {
    this.logger = await Logger.child('Parser');
    this.logger.info('Created logger!!');
    this.parser.onopentag = (node: Node): void => {
      this.onOpenTag(node);
    };
    this.parser.ontext = (t: string): void => {
      this.onText(t);
    };
    this.parser.onclosetag = (): void => {
      this.onCloseTag();
    };
    this.parser.oncomment = (t: string): void => {
      this.onComment(t);
    };
    return this;
  }

  protected push(text: string): PackageParser {
    this.logger?.info(`Pushed ${text}`);
    this.parser.write(text);
    return this;
  }

  protected done(): PackageModel {
    this.parser.close();
    return this.model;
  }

  private onOpenTag(node: Node): void {
    // this.logger?.info(`Open tag ${node.name}`);
    const nodeName: string = node.name.toLowerCase();
    if (nodeName === 'types') {
      const type = new PackageType();

      type.comments = this.lastComments;
      this.lastComments = [];

      this.model.types.push(type);
    } else if (nodeName === 'package') {
      this.model.comments = this.lastComments;
      this.lastComments = [];
    }
    this.tree.push(node);
  }
  private onComment(t: string): void {
    this.logger?.info(`Comment obtained ${t}`);
    this.lastComments.push(t.trim());
  }

  private onText(t: string): void {
    // this.logger?.info(`On text ${t}`);
    if (this.tree.length === 0) {
      // this.logger?.info(`Ignoring text out of node`);
      return; // Text out of nodes
    }
    const nodeName = this.tree[this.tree.length - 1].name.toLowerCase();
    // this.logger?.info(`Handling text in node ${nodeName}`);
    const currentItem = this.model.types[this.model.types.length - 1];
    if (nodeName === 'name') {
      currentItem.type = t.trim();
      this.logger?.info(`Set type name set to ${currentItem.type}`);
    } else if (nodeName === 'members') {
      currentItem.values.push(t.trim());
    } else if (nodeName === 'version') {
      this.model.version = t.trim();
      this.logger?.info(`Set version to ${this.model.version}`);
    }
  }
  private onCloseTag(): void {
    const popped: Node | undefined = this.tree.pop();
    this.logger?.debug(`On Close tag ${popped?.name}`);
  }
}

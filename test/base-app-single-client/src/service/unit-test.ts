import { Provide } from '@midwayjs/core';
import { HotValue } from '../../../../src/decorator';

@Provide()
export class UnitTestService {
  @HotValue('test_text')
  private testText:string;

  @HotValue('test-ns-data-1',{namespace:'test-ns'})
  private testNSData1: string;

  @HotValue('test-default-data-1',{default:'default-value'})
  private testDefaultData: string;

  @HotValue('test_json',{ format:'json'})
  private testJson:Record<string,string>;

  getTestText() {
    return this.testText;
  }

  getTestJson() {
    return this.testJson;
  }

  getTestNSData1() {
    return this.testNSData1;
  }

  getTestDefaultData() {
    return this.testDefaultData;
  }
}

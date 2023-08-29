import { join } from 'path';
import { close, createLightApp } from '@midwayjs/mock';

import { UnitTestService } from './base-app-single-client/src/service/unit-test';
describe('/test/index.test.ts', () => {
  let app;

  beforeAll(async () => {
    app = await createLightApp(join(__dirname, './base-app-single-client'));
  });

  afterAll(async () => {
    await close(app);
  });

  it('test value', async () => {
    const unitTestService: UnitTestService = await app
      .getApplicationContext()
      .getAsync(UnitTestService);

    const testText = unitTestService.getTestText();
    expect(testText).toBe('测试case');
  });

  it('test json value', async () => {
    const unitTestService: UnitTestService = await app
      .getApplicationContext()
      .getAsync(UnitTestService);

    const testString = unitTestService.getTestJson();
    expect(testString).toEqual({"name":"shixinzhu"});
  });

  it('test namespace value', async () => {
    const unitTestService: UnitTestService = await app
      .getApplicationContext()
      .getAsync(UnitTestService);

    const testData = unitTestService.getTestNSData1();
    expect(testData).toBe('测试-namespace-case');
  });

  it('test default value', async () => {
    const unitTestService: UnitTestService = await app
      .getApplicationContext()
      .getAsync(UnitTestService);

    const testData = unitTestService.getTestDefaultData();
    expect(testData).toBe('default-value');
  });
  
});

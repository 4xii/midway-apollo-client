import { buildFormatter } from '../src/formatter'; 

describe('buildFormatter', () => {
  const logger = {
    error: jest.fn()
  };

  it('should format json correctly', () => {
    const formatter = buildFormatter('json', logger);

    const data = '{ "key": "value" }';
    const result = formatter(data);

    expect(result).toEqual({ "key": "value" });
  });

  it('should format number correctly', () => {
    const formatter = buildFormatter('number', logger);

    const data = '123';
    const result = formatter(data);

    expect(result).toEqual(123);
  });

  it('should format string correctly', () => {
    const formatter = buildFormatter('string', logger);

    const data = 'hello';
    const result = formatter(data);

    expect(result).toEqual('hello');
  });

  it('should format boolean correctly (true)', () => {
    const formatter = buildFormatter('boolean', logger);

    const data = 'true';
    const result = formatter(data);

    expect(result).toEqual(true);
  });

  it('should format boolean correctly (false)', () => {
    const formatter = buildFormatter('boolean', logger);

    const data = 'false';
    const result = formatter(data);

    expect(result).toEqual(false);
  });

  it('should handle unknown format type', () => {
    // @ts-ignore
    const formatter = buildFormatter('unknown', logger);

    const data = 'unknown';
    const result = formatter(data);

    expect(result).toEqual('unknown');
    expect(logger.error).toHaveBeenCalledWith("[midway:apollo] buildFormatter 未匹配到格式化项");
  });

  it('should handle invalid json format', () => {
    const formatter = buildFormatter('json', logger);

    const data = 'invalid-json';
    formatter(data);

    expect(logger.error).toHaveBeenCalledWith("[midway:apollo] JSON格式化" + data + "失败"+"e-->", new SyntaxError('Unexpected token i in JSON at position 0'));
  });

  it('should handle invalid boolean format', () => {
    const formatter = buildFormatter('boolean', logger);

    const data = 'invalid-boolean';
    const result = formatter(data);

    expect(result).toEqual(data);
    expect(logger.error).toHaveBeenCalledWith("[midway:apollo] boolean 格式化" + data + "失败");
  });
});

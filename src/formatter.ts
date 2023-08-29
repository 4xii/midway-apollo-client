
export type IFormatType = 'json' | 'number' | 'string' | 'boolean'

export const safeJSONParse = (data:string,logger) => {
  try {
    const res = JSON.parse(data);
    console.log('res :>> ', res);
    return res
  } catch (error) {
    logger.error("[midway:apollo] JSON格式化"+ data + "失败"+"e-->",error);
  }
}

export const buildFormatter = (formatType: IFormatType,logger) => {
  return (data: string) => {
    switch (formatType) {
      case 'json':
        return safeJSONParse(data,logger)
      case 'number':
        return Number(data);
      case 'string':
        return String(data);
      case 'boolean':
        // 将字符串类型的布尔值转换为对应的布尔类型
        if (data === 'true') {
          return true;
        } else if (data === 'false') {
          return false;
        } else {
          logger.error("[midway:apollo] boolean 格式化"+ data + "失败");
        }
      default:
        logger.error("[midway:apollo] buildFormatter 未匹配到格式化项");
        return data
    }
  };
};

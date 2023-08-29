import { createCustomPropertyDecorator } from '@midwayjs/core';
import { IFormatType } from './formatter';

// 装饰器内部的唯一 id
export const HOT_VALUE = 'apollo:hotValue';
export const GET_VALUE = 'apollo:getValue';


export interface IValueHelper{
  namespace?:string,
  /**
   * 默认值
   */
  default?:unknown,
  /**
   * 格式化类型
   */
  format?:IFormatType
}

export function HotValue(key: string, helper?:IValueHelper): PropertyDecorator {
  return createCustomPropertyDecorator(HOT_VALUE, {
    key,
    helper
  }) ;
}

export function GetValue(key: string,  helper?:IValueHelper): PropertyDecorator {
  return createCustomPropertyDecorator(GET_VALUE, {
    key,
    helper
  });
}

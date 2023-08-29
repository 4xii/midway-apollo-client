#  [携程Apollo](https://www.apolloconfig.com/)配置中心接入组件
  [携程Apollo](https://www.apolloconfig.com/)配置中心midway组件.
  - 本文介绍了如何使用 midway 接入携程Apollo。
  - Apollo 官方文档：https://www.apolloconfig.com/

## 安装依赖

```bash
$ npm i midway-apollo-clint
```

或者在 `package.json` 中增加如下依赖后，重新安装。

```json
{
  "dependencies": {
    "midway-apollo-client": "^1.0.0",
    // ...
  },
}
```

## 引入组件

首先，引入 组件，在 `configuration.ts` 中导入：

```typescript
import { Configuration } from '@midwayjs/core';
import * as apollo from 'midway-apollo-client'
import { join } from 'path'

@Configuration({
  imports: [
    // ...
    apollo		// 导入 apollo 组件
  ],
  importConfigs: [
    join(__dirname, 'config')
  ]
})
export class MainConfiguration {
}
```

## 配置

```typescript
// src/config/config.default
config.apollo = {
    clients:{
      default:{
        appId: 'xxx',
        // 默认default
        clusterName: 'default',
        // 默认 ['application'] 可添加多个namespace
        namespaceList: ['application'],

        metaServerUrl:'xx'
      }
    }
  };
```

## 使用 Apollo 服务

@HotValue() 获取具体的配置字段，封装 getter(热更新)

@GetValue() 直接获取具体的配置字段

```typescript
import { Provide } from '@midwayjs/decorator';
import { HotValue, GetValue } from 'midway-apollo-client';
@Provide()
export class xxxService {

  // aJsonValue 是在apollo配置中心配置的key，按key拿值
  @HotValue('aJsonValue',{format : 'json'})
  private aJsonValue:Record<string,string>;

  @GetValue('aNumberValue',{format : 'number',default:-1})
  private aNumberValue:Record<string,string>;

  getAJsonValue() {
    return this.aJsonValue;
  }

  getANumberValue() {
    return this.aNumberValue;
  }
}

```


## HotValue,GetValue

两个主要的装饰器抽象如下
```ts
type IFormatType = 'json' | 'number' | 'string' | 'boolean'

interface IValueHelper{
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

function HotValue(key: string, helper?:IValueHelper): PropertyDecorator
function GetValue(key: string,  helper?:IValueHelper): PropertyDecorator
```

> 当你需要配置namespace时，则需要在helper中传入对应的namespace名称。
> 
> 如果你配置了default默认值，组件通过你的key和namespace未获取到值（获取到undefined和null）时，则会返回你配置的default。
> 
> 如果你配置了json，你可以通过配置format帮你的json配置以对象的形式返回出来。除之外还支持number和string。需要注意boolean配置，他需要你的配置项为 “true” 或者 “false”才会生效

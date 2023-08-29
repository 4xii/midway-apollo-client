import { MidwayDecoratorService,Configuration,Inject, Init, Logger, IMidwayContainer } from '@midwayjs/core';
import { apollo as defaultApolloConfig } from './config/config.default'
import { ApolloService } from './manager';
import { HOT_VALUE, GET_VALUE, IValueHelper } from './decorator';
import { buildFormatter } from './formatter';

@Configuration({
  namespace: 'apollo',
  importConfigs: [
    {
      default: defaultApolloConfig
    },
  ],
})
export class ApolloConfiguration {
  @Inject()
  decoratorService: MidwayDecoratorService;

  apolloService: ApolloService;

  @Logger('coreLogger')
  logger;
  
  @Init()
  async init() {
    const valueReturnWithHelper = (value:string,helper?:IValueHelper) =>{
      const { format, default: defaultValue } = helper;
    
      if (value === undefined || value === null) {
        return defaultValue;
      }
    
      if (format) {
        
        const formatter = buildFormatter(format,this.logger);
        return formatter(value);
      }
    
      return value;
    }

    // 实现装饰器
    this.decoratorService.registerPropertyHandler(
      HOT_VALUE,
      (propertyName, meta:{
        key:string,
        helper?:IValueHelper
      }) => {
        const { key, helper = {} } = meta;
        const reloadValue = this.apolloService.hotValue(key, helper.namespace || 'application').value;
        return valueReturnWithHelper(reloadValue,helper);
      }
    );

    this.decoratorService.registerPropertyHandler(
      GET_VALUE,
      (propertyName, meta) => {
        const { key, helper = {} } = meta;
        const reloadValue =  this.apolloService.getValue(key,helper.namespace || 'application');
        return valueReturnWithHelper(reloadValue,helper);
      }
    );
  }

  async onReady(container:IMidwayContainer) {
    this.apolloService = await container.getAsync(ApolloService);
  }

  async onStop(container:IMidwayContainer): Promise<void> {
    const factory = await container.getAsync(ApolloService);
    factory.stop();
  }
}

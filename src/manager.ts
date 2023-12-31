import {
  Config,
  Init,
  Inject,
  Scope,
  Logger,
  MidwayCommonError,
  ScopeEnum,
  Provide,
  ServiceFactory,
  delegateTargetAllPrototypeMethod,
} from '@midwayjs/core';
import { CtripApolloClient, Option } from '@lvgithub/ctrip-apollo-client';

@Provide()
@Scope(ScopeEnum.Singleton)
export class ApolloServiceFactory extends ServiceFactory<CtripApolloClient> {
  @Config('apollo')
  apolloConfig;

  @Logger('coreLogger')
  logger;

  @Init()
  async init() {
    await this.initClients(this.apolloConfig);
  }

  protected async createClient(config: Option) {
    try {
      this.logger.info('[midway:apollo] client config ---->',config);
      this.logger.info('[midway:apollo] client is connecting metaServerUrl/configServerUrl',config?.metaServerUrl || config?.configServerUrl);
      const client = new CtripApolloClient(config);
      await client.ready();
      this.logger.info('[midway:apollo] client connect success',config.appId);
      return client;
    } catch (error) {
      this.logger.error('[midway:apollo] client error: %s', error);
      throw error;
    }
  }

  protected destroyClient(client: CtripApolloClient): Promise<void> {
    client.stop();
    return;
  }

  getName() {
    return 'apollo';
  }
}

@Provide()
@Scope(ScopeEnum.Singleton)
export class ApolloService implements CtripApolloClient {
  @Inject()
  private serviceFactory: ApolloServiceFactory;

  instance: CtripApolloClient;

  @Init()
  async init() {
    this.instance = this.serviceFactory.get(
      this.serviceFactory.getDefaultClientName?.() || 'default'
    );
    if (!this.instance) {
      throw new MidwayCommonError('apollo default instance not found.');
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ApolloService extends CtripApolloClient {
  // empty
}

delegateTargetAllPrototypeMethod(ApolloService, CtripApolloClient);

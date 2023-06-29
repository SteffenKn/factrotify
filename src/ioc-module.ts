import { Container } from 'inversify';

import { FactroRouter, SlackRouter } from './api/routes';
import { FactroController, SlackController } from './api/controller';
import { FactroService, SlackService } from './api/services';

import { FactroClient, SlackClient } from './clients';
import { NotificationService } from './notification-service';
import { IocDiscoveryTags, IocIds } from './types/index';

export function registerIocModule(container: Container) {
  registerClientsInContainer(container);
  registerServicesInContainer(container);
  registerApiInContainer(container);
}

function registerClientsInContainer(container: Container) {
  container.bind(IocIds.FactroClient).to(FactroClient).inSingletonScope();
  container.bind(IocIds.SlackClient).to(SlackClient).inSingletonScope();
}

function registerServicesInContainer(container: Container) {
  container.bind(IocIds.NotificationService).to(NotificationService).inSingletonScope();
}

function registerApiInContainer(container: Container) {
  container.bind(IocIds.FactroRouter).to(FactroRouter).inSingletonScope();
  container.bind(IocIds.SlackRouter).to(SlackRouter).inSingletonScope();

  container.bind(IocIds.FactroController).to(FactroController).inSingletonScope();
  container.bind(IocIds.SlackController).to(SlackController).inSingletonScope();

  container.bind(IocIds.FactroService).to(FactroService).inSingletonScope();
  container.bind(IocIds.SlackService).to(SlackService).inSingletonScope();

  container.bind(IocDiscoveryTags.Router).toConstantValue(container.get(IocIds.FactroRouter));
  container.bind(IocDiscoveryTags.Router).toConstantValue(container.get(IocIds.SlackRouter));

  container.bind(IocDiscoveryTags.Controller).toConstantValue(container.get(IocIds.FactroController));
  container.bind(IocDiscoveryTags.Controller).toConstantValue(container.get(IocIds.SlackController));

  container.bind(IocDiscoveryTags.Service).toConstantValue(container.get(IocIds.FactroService));
  container.bind(IocDiscoveryTags.Service).toConstantValue(container.get(IocIds.SlackService));
}

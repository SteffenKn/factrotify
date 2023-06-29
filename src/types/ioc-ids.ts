export const IocIds = {
  FactroClient: Symbol('FactroClient'),
  SlackClient: Symbol('SlackClient'),

  FactroRouter: Symbol('FactroRouter'),
  SlackRouter: Symbol('SlackRouter'),

  FactroController: Symbol('FactroController'),
  SlackController: Symbol('SlackController'),

  FactroService: Symbol('FactroService'),
  SlackService: Symbol('SlackService'),

  NotificationService: Symbol('NotificationService'),
};

export const IocDiscoveryTags = {
  Router: Symbol('Router'),
  Controller: Symbol('Controller'),
  Service: Symbol('Service'),
};

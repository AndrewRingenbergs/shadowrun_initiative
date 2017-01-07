import mainController from './controllers/mainController';

import InitiativeTracker from './directive/initiativeTracker';
import InitiativeToken from './directive/initiativeToken';

angular.module("myApp", ['angular-uuid'])
  .controller('mainController', mainController)
  .directive('initiativeTracker', () => new InitiativeTracker)
  .directive('initiativeToken', () => new InitiativeToken)


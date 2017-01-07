import mainController from './controllers/mainController';

import initiativeTracker from './directive/initiativeTracker';
import initiativeToken from './directive/initiativeToken';

angular.module("myApp", ['angular-uuid'])
  .controller('mainController', mainController)
  .directive('initiativeTracker', initiativeTracker)
  .directive('initiativeToken', initiativeToken)


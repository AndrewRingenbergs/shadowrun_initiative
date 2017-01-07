import mainController from './controllers/mainController';

import initiativeToken from './directive/initiativeToken';

angular.module("myApp", ['angular-uuid'])
  .controller('mainController', mainController)
  .directive('initiativeToken', initiativeToken)


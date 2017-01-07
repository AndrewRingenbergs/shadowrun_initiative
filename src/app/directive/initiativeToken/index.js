import template from './template.html'
import style from './styles.css'

export default class InitiativeToken {
  constructor() {
    this.restrict = 'E',
    this.templateUrl = template,
    this.scope = {
      char: '=',
      initiative: '='
    }
  }
}

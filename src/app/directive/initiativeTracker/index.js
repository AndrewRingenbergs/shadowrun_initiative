import template from './template.html';
import styles from './styles.css';

export default class InititiveTracker {
  constructor() {
    this.restrict = 'E'
    this.templateUrl = template
    this.scope = {
      characters: '='
    }
  }
}


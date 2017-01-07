import template from './template.html';
import styles from './styles.css';

export default function() {
  return {
    restrict: 'E',
    templateUrl: template,
    scope: {
      characters: '='
    }
  }
}

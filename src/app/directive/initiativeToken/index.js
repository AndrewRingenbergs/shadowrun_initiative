import template from './template.html'
import style from './styles.css'

export default function() {
  return {
    restrict: 'E',
    templateUrl: template,
    scope: {
      char: '=',
      initiative: '='
    }
  }
}

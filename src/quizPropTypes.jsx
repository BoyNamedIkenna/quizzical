// quizPropTypes.js
import PropTypes from 'prop-types';

export const Props = {
  start: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
  currentQuestion: PropTypes.func.isRequired,
  question: PropTypes.string.isRequired,
  answers: PropTypes.arrayOf(PropTypes.string).isRequired,
  correctAnswers: PropTypes.arrayOf(PropTypes.string).isRequired,
  selected: PropTypes.number,
  select: PropTypes.func.isRequired,
  isCorrect: PropTypes.bool,
  currentIndex: PropTypes.number.isRequired,
  totalNum: PropTypes.number.isRequired,
  next: PropTypes.func.isRequired,
  prev: PropTypes.func.isRequired,
  button: PropTypes.element.isRequired,
  startIndex: PropTypes.number,
  setStartIndex: PropTypes.func,
  windowSize: PropTypes.number,
};

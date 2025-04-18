import { Props } from '../quizPropTypes';
Questions.propTypes = Props;

export default function Questions({ data, currentQuestion }) {
  const questions = data.map((item, index) => (
    <button
      key={index}
      className="w-12 h-12 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-neutral-900 dark:hover:bg-gray-600 transition text-sm font-semibold text-center"
      onClick={() => currentQuestion(index)}
    >
      {index + 1}
    </button>
  ));

  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 justify-center">
      {questions}
    </div>
  );
}


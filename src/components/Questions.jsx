import { Props } from '../quizPropTypes';
Questions.propTypes = Props;

export default function Questions({
  data,
  currentQuestion,
  currentIndex,
  startIndex,
  setStartIndex,
  windowSize
}) {
  const endIndex = Math.min(startIndex + windowSize, data.length);

  const goLeft = () => {
    setStartIndex((prev) => Math.max(prev - windowSize, 0));
  };

  const goRight = () => {
    if (startIndex + windowSize < data.length) {
      setStartIndex((prev) => prev + windowSize);
    }
  };

  const questions = data.slice(startIndex, endIndex).map((item, index) => {
    const realIndex = startIndex + index;
    const isCurrent = realIndex === currentIndex;

    return (
      <button
        key={realIndex}
        className={`w-12 h-12 flex-shrink-0 rounded-md mx-1 text-sm font-semibold text-center 
          transition duration-200 
          ${isCurrent 
            ? 'bg-blue-600 text-white dark:bg-blue-500' 
            : 'bg-gray-200 hover:bg-gray-300 dark:bg-neutral-900 dark:hover:bg-gray-600'}`}
        onClick={() => currentQuestion(realIndex)}
      >
        {realIndex + 1}
      </button>
    );
  });

  return (
    <div className="flex items-center justify-center space-x-2">
      {startIndex > 0 && (
        <button onClick={goLeft} className="text-xl px-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-300">
          ←
        </button>
      )}

      <div className="flex px-2">{questions}</div>

      {endIndex < data.length && (
        <button onClick={goRight} className="text-xl px-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-300">
          →
        </button>
      )}
    </div>
  );
}

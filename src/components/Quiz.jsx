import { Props } from '../quizPropTypes';
Quiz.propTypes = Props;

export default function Quiz(props) {
  const { answers, selected, question, select, isCorrect, correctAnswers} = props;

  function optionStyle(item) {
    if (isCorrect !== null) {
      // If answers have been checked, provide feedback
      if (item === selected && isCorrect) {
        return 'bg-green-400'; // Correct answer
      } else if (item === selected && !isCorrect) {
        return 'bg-red-400'; // Incorrect answer
      } else if (item !== selected && item === correctAnswers) {
        return 'bg-green-400'; // Highlight the correct answer
      }
    }
    return selected === item ? 'bg-blue-900' : 'bg-neutral-900'; // Default selected style
  }

  return (
    <section className='flex flex-col justify-between h-[80%]'>
      <h1 className="sm:text-xl md:text-2xl lg:text-3xl mb-4">{question}</h1>
      <div className="flex flex-col w-full space-y-4">
        {answers.map((item, index) => {
          const style = optionStyle(item);
          return (
            <input
              type="button"
              key={index}
              value={item}
              onClick={() => select(item)}
              className={`py-4 px-4 lg:w-full sm:w-[650px] text-left rounded-md transition ${style}`}
            />
          );
        })}
      </div>
    </section>
  );
}

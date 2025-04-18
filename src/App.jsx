import { useEffect, useState } from 'react';
import Quiz from "./components/Quiz";
import Start from './components/Start';
import Buttons from './components/Buttons';
import Questions from './components/Questions';
import useSessionStorage from './hooks/useSessionStorage';
import { decodeHtmlEntity, shuffleArray } from './utils';

function App() {
  const [url, setUrl] = useSessionStorage("url", "");
  const [data, setData] = useSessionStorage("quizData", []);
  const [loading, setLoading] = useSessionStorage("loading", false);
  const [selectedAnswers, setSelectedAnswers] = useSessionStorage("selectedAnswers", []);
  const [checkResults, setCheckResults] = useSessionStorage("checkResults", []);
  const [correctAnswers, setCorrectAnswers] = useSessionStorage("correctAnswers", []);
  const [checked, setChecked] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    async function fetchQuizData() {
      if (!data.length && url) {
        try {
          const response = await fetch(url);
          if (!response.ok) throw new Error('Network response was not ok');// Only fetch if there's no data and URL is set
          const result = await response.json();
          const shuffledData = result.results.map((item) => ({
            ...item,
            question: decodeHtmlEntity(item.question),
            correct_answer: decodeHtmlEntity(item.correct_answer),
            incorrect_answers: item.incorrect_answers.map(decodeHtmlEntity),
            answers: shuffleArray([...item.incorrect_answers, item.correct_answer]),
          }));
          setData(shuffledData);
          setCorrectAnswers(shuffledData.map(item => item.correct_answer));
          const initialAnswers = new Array(shuffledData.length).fill(null);
          setSelectedAnswers(initialAnswers);
          setCheckResults(initialAnswers);
          setLoading(false);  // Stop loading after data is fetched
        } catch (error) {
          console.error('Fetch error:', error);
        } finally {
          setLoading(false);  // Stop loading in case of error
        }
      }
    }
    fetchQuizData();
  }, [url]);
  /* eslint-enable react-hooks/exhaustive-deps */

  function startGame(apiUrl) {
    setUrl(apiUrl);
    setLoading(true);
  }

  function newGame() {
    setData([]);
    setSelectedAnswers([]);
    setCheckResults([]);
    setCorrectAnswers([]);
    setUrl("");
    setChecked(false)
    setLoading(false);  
  }

  function selectAnswer(quizIndex, answer) {
    setSelectedAnswers(prev => {
      const newSelected = [...prev];
      newSelected[quizIndex] = answer;
      return newSelected;
    });
  }

  function correctAnswer() {
    if (!checked) {
      setCheckResults(selectedAnswers.map((answer, index) => data[index] && answer === data[index].correct_answer));
      setChecked(true)
    }
  }

  function nextQuestion() {
    if (currentIndex < data.length - 1) {
      setCurrentIndex(prevIndex => prevIndex + 1)
    }
  }

  function prevQuestion() {
    if (currentIndex > 0) {
      setCurrentIndex(prevIndex => prevIndex - 1)
    }
  }

  function currentQuestion(questionIndex) {
    setCurrentIndex(questionIndex)
  }

  function handleSelect(index) {
    return (answer) => selectAnswer(index, answer);
  }

  const quizzes = data.map((item, index) => (
    <Quiz
      key={index}
      data={item}
      question={item.question}
      answers={item.answers}
      selected={selectedAnswers[index]}
      select={!checked && handleSelect(index)}
      isCorrect={checkResults[index]}
      correctAnswers={correctAnswers[index]}
      currentIndex={currentIndex}
      totalNum={data.length}
    />
  ));

  if (loading) return <div className='text-white'>Loading quiz...</div>;
  if (!data.length) return <Start start={startGame} />;

  return (
    <section className="text-[#E0E0E0] bg-neutral-950 p-6 sm:p-6 w-full max-w-6xl min-h-screen flex flex-col space-y-4 mx-auto">
      <p>{currentIndex + 1}/{data.length}</p>
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 items-start">
        {quizzes[currentIndex]}
        <Questions
          data={data}
          currentQuestion={currentQuestion}
        />
      </div>
      <div className='mt-auto'>
        <Buttons
          next={nextQuestion}
          prev={prevQuestion}
          button={
            <input
              type="button"
              value={checked ? "New Game" : "Submit"}
              className="bg-blue-800 px-4 rounded-lg"
              onClick={checked ? newGame : correctAnswer}
            />
          }
        />
      </div>
    </section>
  );
}

export default App;

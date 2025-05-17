import { useEffect, useState } from 'react';
import Quiz from "./components/Quiz";
import Start from './components/Start';
import Buttons from './components/Buttons';
import Questions from './components/Questions';
import Modal from './components/modal';
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
  const [startIndex, setStartIndex] = useState(0);
  const [windowSize, setWindowSize] = useState(10);
  const [modalState, setModalState] = useState(false)



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

  useEffect(() => {
    const handleResize = () => {
      setWindowSize(window.innerWidth < 640 ? 5 : 10);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const newStartIndex = Math.floor(currentIndex / windowSize) * windowSize;
    setStartIndex(newStartIndex);
  }, [currentIndex, windowSize]);


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
    if (!modalState) {
      setModalState(true)
    }
    else {
      setModalState(false)
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

  const numAnswered = selectedAnswers.filter(a => a !== null).length;
  const percentage = (numAnswered / data.length) * 100;
  return (
    <section className=" relative text-[#E0E0E0] bg-zinc-900 p-4 lg:p-5 w-screen flex flex-col justify-between space-y-4 lg:w-[800px] max-w-full min-h-[630px]">

      {/* Header: progress info */}
      <div className='flex justify-between'>
        <p>Question {currentIndex + 1} of {data.length}</p>
        <p>{numAnswered} of {data.length} answered</p>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-700 rounded-full">
        <div
          className="h-full bg-blue-500 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Question content */}
      <div className="flex-grow flex items-start">
        <div className="w-full">{quizzes[currentIndex]}</div>
      </div>

      {/* Footer: Question buttons + nav buttons */}
      <div className="flex flex-col gap-4 sm:gap-6">
        <Questions
          data={data}
          currentQuestion={currentQuestion}
          currentIndex={currentIndex}
          startIndex={startIndex}
          setStartIndex={setStartIndex}
          windowSize={windowSize}
        />

        <Buttons
          next={nextQuestion}
          prev={prevQuestion}
          button={
            <input
              type="button"
              value={checked ? "New Game" : "End Quiz"}
              className="bg-blue-800 text-white dark:text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              onClick={checked ? newGame : correctAnswer}
            />
          }
        />
        {modalState && <Modal
            correctAnswer={correctAnswer}
            numAnswered={numAnswered}
            totalNum={data.length}
        />}
      </div>
    </section>

  );
}

export default App;

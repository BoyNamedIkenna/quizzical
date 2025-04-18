
import { Props } from '../quizPropTypes';
Buttons.propTypes = Props;

 export default function Buttons ({next,prev,button}) {
    return (
        <div className="flex flex-row justify-between">
            <div className="flex gap-4">
                <button
                    className="p-3 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-neutral-900 dark:hover:bg-gray-600 transition"
                    aria-label="Previous Question"
                    onClick={prev}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-800 dark:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <button
                    className="p-3 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-neutral-900 dark:hover:bg-gray-600 transition"
                    aria-label="Next Question"
                    onClick={next}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-800 dark:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
            {button}
        </div>
    )
}

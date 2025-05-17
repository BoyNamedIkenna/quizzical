import { Props } from '../quizPropTypes';
Modal.propTypes = Props;

export default function Modal({correctAnswer,totalNum, numAnswered}) {
    const completed = numAnswered === totalNum;
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-black rounded-lg shadow-lg p-6 max-w-sm w-full">
                {!completed && <h2 className="text-xl font-semibold mb-4">Unanswered questions</h2>}
                <p className="mb-4">Are you sure?</p>
                <button className="bg-blue-800 hover:bg-blue-700 text-white px-4 py-2 rounded" onClick={() => correctAnswer()}>End Quiz</button>
            </div>
        </div>
    );
}
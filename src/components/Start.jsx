import { useState, useEffect } from "react";
import { Props } from '../quizPropTypes';
Start.propTypes = Props;


export default function Start({ start }) {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [difficulty, setDifficulty] = useState(["easy", "medium", "hard"]);
    const [selectedDifficulty, setSelectedDifficulty] = useState("");
    const [type, setType] = useState(["Multiple Choice", "True / False"]);
    const [selectedType, setSelectedType] = useState("");
    const [number, setNumber] = useState(10);
    const [warning, setWarning] = useState("");



    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch("https://opentdb.com/api_category.php");
                const data = await response.json(); // Convert response to JSON
                setCategories(data.trivia_categories); // Save to state
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            }
        };

        fetchCategories();
    },);

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    const handleDifficultyChange = (e) => {
        setSelectedDifficulty(e.target.value);
    }

    const handleTypeChange = (e) => {
        setSelectedType(e.target.value);
    }

    const handleNumberChange = (e) => {
        const value = parseInt(e.target.value);
        setNumber(value);

        if (value > 50) {
            setWarning("The maximum number of questions is 50.");
        } else if (value < 1 || isNaN(value)) {
            setWarning("You must select at least 1 question.");
        } else {
            setWarning("");
        }
    };


    const handleSubmit = () => {
        if (warning) return;

        let apiUrl = `https://opentdb.com/api.php?amount=${number}`;
        if (selectedCategory) {
            apiUrl += `&category=${selectedCategory}`;
        }

        if (selectedDifficulty) {
            apiUrl += `&difficulty=${selectedDifficulty}`;
        }

        if (selectedType === "Multiple Choice") {
            apiUrl += `&type=multiple`;
        } else if (selectedType === "True / False") {
            apiUrl += `&type=boolean`;
        }

        start(apiUrl);
    };


    const inputClass = "rounded-lg py-3 px-3 my-4 text-white w-full bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition duration-200 ease-in-out"
    const startPage = " mx-auto text-white p-4 sm:p-6 md:p-8 rounded-2xl bg-zinc-900 font-bold  flex flex-col items-center w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl max-h-screen"


    return (
        <div className={startPage} >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-center">Quizzical</h1>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-center">Educational Quiz Game</h2>

            <div className="flex flex-col mt-2 sm:mt-4 md:mt-6 w-full space-y-1">
                <label htmlFor="number" className="text-base sm:text-lg">Number of questions</label>
                <input
                    type="number"
                    id="number"
                    min="1"
                    max="50"
                    onChange={handleNumberChange}
                    value={number}
                    className={`${inputClass} text-gray-400`}
                />
                {warning && (
                    <p className="text-red-500 text-sm font-semibold">{warning}</p>
                )}


                <label htmlFor="category" className="text-base sm:text-lg">Pick a category:</label>
                <select
                    id="category"
                    onChange={handleCategoryChange}
                    value={selectedCategory}
                    className={inputClass}
                >
                    <option value="">Any Category</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>

                <label htmlFor="difficulty" className="text-base sm:text-lg">Pick a difficulty:</label>
                <select
                    id="difficulty"
                    onChange={handleDifficultyChange}
                    value={selectedDifficulty}
                    className={inputClass}
                >
                    <option value="">Any Difficulty</option>
                    {difficulty.map((diff, index) => (
                        <option key={index} value={diff}>
                            {diff.replace(/^\w/, c => c.toUpperCase())}
                        </option>
                    ))}
                </select>

                <label htmlFor="type" className="text-base sm:text-lg">Pick a type:</label>
                <select
                    id="type"
                    onChange={handleTypeChange}
                    value={selectedType}
                    className={inputClass}
                >
                    <option value="">Any Type</option>
                    {type.map((opt, index) => (
                        <option key={index} value={opt}>{opt}</option>
                    ))}
                </select>
            </div>

            <input
                type="button"
                className={`mt-6 rounded-lg py-3 px-4 w-full sm:w-auto 
        ${warning ? "bg-gray-500 cursor-not-allowed" : "bg-blue-800"} 
        text-white transition duration-200`}
                onClick={handleSubmit}
                value="Start Quiz"
                disabled={!!warning}
            />

        </div>

    )
}

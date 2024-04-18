import React, { useState } from 'react';
import './Page.css'
import axios from 'axios';

function Page() {
    const [inputString, setInputString] = useState('');
    const [frames, setFrames] = useState('');
    const [algorithm, setAlgorithm] = useState('First In First Out');
    const [result, setResult] = useState(null);

    const handleInputChange = (e) => {
        setInputString(e.target.value);
    };

    const handleFramesChange = (e) => {
        setFrames(e.target.value);
    };

    const handleAlgorithmChange = (e) => {
        setAlgorithm(e.target.value);
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post('http://localhost:3000/pagereplacement', {
                inputstring: inputString,
                frames: frames,
                algo: [algorithm]
            });
            setResult(response.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="page-container">
            <h1>Page Replacement Algorithms</h1>
            <div className="form-group">
                <label>
                    Input String:
                    <input type="text" value={inputString} onChange={handleInputChange} />
                </label>
            </div>
            <div className="form-group">
                <label>
                    Number of Frames:
                    <input type="number" value={frames} onChange={handleFramesChange} />
                </label>
            </div>
            <div className="form-group">
                <label>
                    Algorithm:
                    <select value={algorithm} onChange={handleAlgorithmChange}>
                        <option value="First In First Out">First In First Out</option>
                        <option value="Optimal">Optimal</option>
                        <option value="Least Recently Used">Least Recently Used</option>
                        <option value="Least Frequently Used">Least Frequently Used</option>
                    </select>
                </label>
            </div>
            <div className="form-group">
                <button onClick={handleSubmit}>Run Algorithm</button>
            </div>
            {result && (
                <div className="results-container">
                    <h2>Results</h2>
                    <p>Total Page Faults: {result.totalPageFaults}</p>
                    <p>Total Page Hits: {result.totalPageHits}</p>
                    <h3>Final Frames Table:</h3>
                    <ul>
                        {result.finalFramesTable.map((frame, index) => (
                            <li key={index}>{frame.join(', ')}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default Page;

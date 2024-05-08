import React, { useState } from 'react';
import './Page.css'
import axios from 'axios';

function Page() {
    const [inputString, setInputString] = useState('');
    const [displayString, setDisplayString] = useState('');
    const [frames, setFrames] = useState('');
    const [algorithm, setAlgorithm] = useState('First In First Out');
    const [result, setResult] = useState(null);

    const removeSpaces = (str) => {
      return str.replace(/\s/g, ''); 
    };

    const handleInputChange = (e) => {
        setInputString(e.target.value);
        setDisplayString(removeSpaces(e.target.value));
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
            console.log(response.data);
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
                <h2>Results of {algorithm}</h2>
                <p>Total Page Faults: {result.totalPageFaults}</p>
                <p>Total Page Hits: {result.totalPageHits}</p>
                <h3>Final Frames Table:</h3>
                <table className="frames-table">
                  <tbody>
                    <tr>
                      {result.finalFramesTable.map((frame, index) => (
                        <td key={index} className="frame-cell">
                          <div className="frame-info">
                            <p className="incoming-string">Incoming String: {displayString[index]}</p>
                            <table className="page-table">
                              <tbody>
                                {frame.map((page, pageIndex) => (
                                  <tr key={`${index}-${pageIndex}`} className="page-row">
                                    <td className="page-cell">
                                      {Array.isArray(page) ? (
                                        <div>
                                          {page.map((element, elementIndex) => (
                                            <span key={elementIndex} className="page-element">{element} </span>
                                          ))}
                                        </div>
                                      ) : (
                                        <span className="page-element">{page}</span>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
        </div>
    );
}

export default Page;
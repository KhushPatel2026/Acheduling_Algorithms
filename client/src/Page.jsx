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
    <div className='page-box'>
      <div className="page-container">
        <h1>Page Replacement Algorithms</h1>
        <h3>Made by Khush(220222) and Nishant(220212)</h3>
        <div className="form-group">
          <label className='form-box'>
            Input String:
            <input type="text" value={inputString} onChange={handleInputChange} placeholder='Ex: 7 0 1 2 0 3 0 4 2 3 0 3 2 1 2 0 1 7 0 1' />
          </label>
        </div>
        <div className="form-group">
          <label className='form-box'>
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
    <table>
      <thead>
        <tr>
          <th>Pages</th>
        </tr>
      </thead>
      <tbody>
        {result.finalFramesTable.map((frame, index) => (
          <tr key={index}>
            <td>
              {frame.map((page, pageIndex) => (
                <span key={pageIndex}>{page} </span>
              ))}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    <p>Total Page Faults: {result.totalPageFaults}</p>
    <p>Total Page Hits: {result.totalPageHits}</p>
    <p>Page Fault Percentage: {((result.totalPageFaults / (result.totalPageFaults + result.totalPageHits)) * 100).toFixed(2)}%</p>
  </div>
)}



      </div>
    </div>
  );
}

export default Page;

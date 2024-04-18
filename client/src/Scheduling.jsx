import React, { useState } from 'react';
import axios from 'axios';
import './Scheduling.css';

function Scheduling() {
  const [algorithm, setAlgorithm] = useState('FCFS');
  const [processes, setProcesses] = useState([{ id: 1, arrivalTime: 0, burstTime: 0, priority: 0 }]);
  const [timeQuantum, setTimeQuantum] = useState(2);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/schedule', { algorithm, processes, timeQuantum });
      setResult(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAddProcess = () => {
    const newProcessId = processes.length + 1;
    setProcesses([...processes, { id: newProcessId, arrivalTime: 0, burstTime: 0, priority: 0 }]);
  };

  const handleProcessChange = (index, key, value) => {
    const updatedProcesses = [...processes];
    updatedProcesses[index][key] = value;
    setProcesses(updatedProcesses);
  };

  return (
    <div className="SApp">
      <h1>Scheduling Algorithms Project</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Algorithm:
          <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}>
            <option value="FCFS">First Come First Serve (FCFS)</option>
            <option value="SJF">Shortest Job First (SJF)</option>
            <option value="Priority">Priority</option>
            <option value="RoundRobin">Round Robin (RR)</option>
          </select>
        </label>
        <br />
        {algorithm === 'RoundRobin' && (
          <label>
            Time Quantum:
            <input type="number" value={timeQuantum} onChange={(e) => setTimeQuantum(parseInt(e.target.value))} />
          </label>
        )}
        <br />
        <label>Processes:</label>
        <div className='inputBox'>
          <label>Arrival Time</label>
          <label>Burst Time</label>
          {algorithm === 'Priority' && (<label>Prority</label>)}
        </div>
        {processes.map((process, index) => (
          <div key={index} className='inputBox'>
            <input
              type="number"
              value={process.arrivalTime}
              onChange={(e) => handleProcessChange(index, 'arrivalTime', parseInt(e.target.value))}
              placeholder="Arrival Time"
            />
            <input
              type="number"
              value={process.burstTime}
              onChange={(e) => handleProcessChange(index, 'burstTime', parseInt(e.target.value))}
              placeholder="Burst Time"
            />
            {algorithm === 'Priority' && (
              <input
                type="number"
                value={process.priority}
                onChange={(e) => handleProcessChange(index, 'priority', parseInt(e.target.value))}
                placeholder="Priority"
              />
            )}
          </div>
        ))}
        <button type="button" onClick={handleAddProcess}>Add Process</button>
        <br />
        <button type="submit">Submit</button>
      </form>
      {result && (
        <div>
          <h2>Results</h2>
          <p>Average Waiting Time: {result.averageWaitingTime}</p>
          <p>Average Turnaround Time: {result.averageTurnaroundTime}</p>
          <h2>Gantt Chart</h2>
          <div className="gantt-chart">
            {result.ganttChart.map((entry, index) => (
              <div key={index} >
                <div className="gantt-entry" style={{ width: `${(entry.finishTime - entry.startTime)*27}px` }}>
                  <span className="process-id">P{entry.processId}</span>
                </div>
                <div>
                  <span className="start-time">{entry.startTime}</span>
                  <span>-</span>
                  <span className="finish-time">{entry.finishTime}</span>
                </div>
              </div>
            ))}
          </div>
          <h2>Process Results</h2>
          <table className="results-table">
            <thead>
              <tr>
                <th>Process ID</th>
                <th>Arrival Time</th>
                <th>Burst Time</th>
                <th>Finish Time</th>
                <th>Turnaround Time</th>
                <th>Waiting Time</th>
                {algorithm === 'Priority' && (<th>Prority</th>)}
              </tr>
            </thead>
            <tbody>
              {result.ganttChart.map((entry) => (
                  <tr key={entry.processId}>
                    <td>P{entry.processId}</td>
                    <td>{entry.arrivalTime}</td>
                    <td>{entry.burstTime}</td>
                    <td>{entry.finishTime}</td>
                    <td>{entry.finishTime - entry.arrivalTime}</td>
                    <td>{(entry.finishTime - entry.arrivalTime) - entry.burstTime}</td>
                    {algorithm === 'Priority' && (<td>{entry.priority}</td>)}
                  </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>

  );
}

export default Scheduling;
import React, { useState } from 'react';
import axios from 'axios';
import './Scheduling.css';

function Scheduling() {
  const [algorithm, setAlgorithm] = useState('FCFS');
  const [processes, setProcesses] = useState([{ id: 1, arrivalTime: 0, burstTime: 0, priority: 0 }]);
  const [timeQuantum, setTimeQuantum] = useState(2);
  const [contextSwitchingTime, setContextSwitchingTime] = useState(0);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/schedule', { algorithm, processes, timeQuantum, contextSwitchingTime});
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
      <h3>Made by Khush(220222) and Nishant(220212)</h3>
      <h6>Only accepts Integer value</h6>
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
          <div>
            <label>
              Time Quantum:
              <input type="number" value={timeQuantum} onChange={(e) => setTimeQuantum(parseInt(e.target.value))} />
            </label>
            <label>
              Context Switch:
              <input type="number" value={contextSwitchingTime} onChange={(e) => setContextSwitchingTime(parseInt(e.target.value))} />
            </label>
          </div>
        )}
        <br />
        <label>Processes:</label>
          {algorithm === 'Priority' && (<label>Lowest number has Highest Priority</label>)}
        <div className='inputBox'>
          <label>Arrival Time</label>
          <label>Burst Time</label>
          {algorithm === 'Priority' && (<label>Prority</label>)}
        </div >
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
        <div className='btn-container-scheduling'>
          <button type="button" onClick={handleAddProcess}>Add Process</button>
          <br />
          <button type="submit">Submit</button>
        </div>
      </form>
      {result && (
        <div>
          <h2>Results of {algorithm}</h2>
          <p>Average Waiting Time: {result.averageWaitingTime}</p>
          <p>Average Turnaround Time: {result.averageTurnaroundTime}</p>
          <h2>Gantt Chart</h2>
          <div className="gantt-chart">
            {result.ganttChart.map((entry, index) => (
              <div key={index} >
                <div className="gantt-entry" style={{ width: `80px` }}>
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
              {result.table.map((entry) => (
                  <tr key={entry.process}>
                    <td>P{entry.process}</td>
                    <td>{entry.arrivalTime}</td>
                    <td>{entry.burstTime}</td>
                    <td>{entry.finishTime}</td>
                    <td>{entry.turnaroundTime}</td>
                    <td>{entry.waitingTime}</td>
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
// FCFS Scheduler
function fcfsScheduler(processes) {
    let currentTime = 0;
    let waitingTime = 0;
    let turnaroundTime = 0;
    let ganttChart = [];

    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

    for (let i = 0; i < processes.length; i++) {
        if (currentTime < processes[i].arrivalTime) {
            currentTime = processes[i].arrivalTime;
        }
        ganttChart.push({ processId: processes[i].id, startTime: currentTime, arrivalTime: processes[i].arrivalTime, burstTime: processes[i].burstTime });
        waitingTime += currentTime - processes[i].arrivalTime;
        currentTime += processes[i].burstTime;
        turnaroundTime += currentTime - processes[i].arrivalTime;
        ganttChart[ganttChart.length - 1].finishTime = currentTime;
    }

    const averageWaitingTime = waitingTime / processes.length;
    const averageTurnaroundTime = turnaroundTime / processes.length;

    return { averageWaitingTime, averageTurnaroundTime, ganttChart };
}

// SJF (Non-preemptive) Scheduler
function sjfScheduler(processes) {
    let currentTime = 0;
    let waitingTime = 0;
    let turnaroundTime = 0;
    const totalProcesses = processes.length;
    let ganttChart = [];

    // Sort processes by arrival time initially
    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

    while (processes.length > 0) {
        // Find processes that have arrived by the current time
        const arrivedProcesses = processes.filter(process => process.arrivalTime <= currentTime);
        
        // Sort arrived processes by burst time
        arrivedProcesses.sort((a, b) => a.burstTime - b.burstTime);

        if (arrivedProcesses.length > 0) {
            const shortestJob = arrivedProcesses.shift(); // Get the process with the shortest burst time
            ganttChart.push({ processId: shortestJob.id, startTime: currentTime, arrivalTime: shortestJob.arrivalTime, burstTime: shortestJob.burstTime });
            waitingTime += currentTime - shortestJob.arrivalTime;
            currentTime += shortestJob.burstTime;
            turnaroundTime += currentTime - shortestJob.arrivalTime;
            ganttChart[ganttChart.length - 1].finishTime = currentTime;

            // Remove the executed process from the list of processes
            processes = processes.filter(process => process.id !== shortestJob.id);
        } else {
            // If no processes have arrived by the current time, increment the current time
            currentTime++;
        }
    }

    const averageWaitingTime = waitingTime / totalProcesses;
    const averageTurnaroundTime = turnaroundTime / totalProcesses;

    return { averageWaitingTime, averageTurnaroundTime, ganttChart };
}


// Priority (Non-preemptive) Scheduler
function priorityScheduler(processes) {
    let currentTime = 0;
    let waitingTime = 0;
    let turnaroundTime = 0;
    const totalProcesses = processes.length;
    let ganttChart = [];

    // Sort processes by arrival time initially
    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

    while (processes.length > 0) {
        // Find processes that have arrived by the current time
        const arrivedProcesses = processes.filter(process => process.arrivalTime <= currentTime);

        if (arrivedProcesses.length > 0) {
            // Sort arrived processes by priority
            arrivedProcesses.sort((a, b) => a.priority - b.priority);

            const highestPriorityProcess = arrivedProcesses.shift(); // Get the process with the highest priority
            if (currentTime < highestPriorityProcess.arrivalTime) {
                currentTime = highestPriorityProcess.arrivalTime;
            }
            ganttChart.push({ processId: highestPriorityProcess.id, startTime: currentTime, arrivalTime: highestPriorityProcess.arrivalTime, burstTime: highestPriorityProcess.burstTime, priority: highestPriorityProcess.priority });
            waitingTime += currentTime - highestPriorityProcess.arrivalTime;
            currentTime += highestPriorityProcess.burstTime;
            turnaroundTime += currentTime - highestPriorityProcess.arrivalTime;
            ganttChart[ganttChart.length - 1].finishTime = currentTime;

            // Remove the executed process from the list of processes
            processes = processes.filter(process => process.id !== highestPriorityProcess.id);
        } else {
            // If no processes have arrived by the current time, increment the current time
            currentTime++;
        }
    }

    const averageWaitingTime = waitingTime / totalProcesses;
    const averageTurnaroundTime = turnaroundTime / totalProcesses;

    return { averageWaitingTime, averageTurnaroundTime, ganttChart };
}


// Round Robin Scheduler
function roundRobinScheduler(processes, timeQuantum) {
    let currentTime = 0;
    let totalProcesses = processes.length;
    let waitingTime = 0;
    let turnaroundTime = 0;
    let ganttChart = [];

    // Sort processes by arrival time initially
    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

    // Track the index of the last executed process
    let lastExecutedIndex = -1;

    while (totalProcesses > 0) {
        for (let i = 0; i < processes.length; i++) {
            const currentProcess = processes[i];

            // Process can execute if it has arrived and its burst time is greater than 0
            if (currentProcess.arrivalTime <= currentTime && currentProcess.burstTime > 0) {
                // Ensure only one process is executed at a time
                if (i !== lastExecutedIndex) {
                    // Update the start time of the process
                    const startTime = Math.max(currentTime, currentProcess.arrivalTime);

                    // Execute the process for either the remaining burst time or the time quantum, whichever is smaller
                    const executionTime = Math.min(timeQuantum, currentProcess.burstTime);
                    currentTime = startTime + executionTime;

                    // Update waiting time and turnaround time
                    waitingTime += startTime - currentProcess.arrivalTime;
                    turnaroundTime += currentTime - currentProcess.arrivalTime;

                    // Record the process execution in the Gantt chart
                    ganttChart.push({ processId: currentProcess.id, startTime, finishTime: currentTime });

                    // Update burst time of the process
                    currentProcess.burstTime -= executionTime;

                    // If the process has completed execution, decrement the total number of processes
                    if (currentProcess.burstTime <= 0) {
                        totalProcesses--;
                    }

                    // Update the index of the last executed process
                    lastExecutedIndex = i;
                }
            }
        }

        // Increment current time if no process is available to execute
        currentTime++;
    }

    const averageWaitingTime = waitingTime / processes.length;
    const averageTurnaroundTime = turnaroundTime / processes.length;

    return { averageWaitingTime, averageTurnaroundTime, ganttChart };
}

module.exports = {
    fcfsScheduler,
    sjfScheduler,
    priorityScheduler,
    roundRobinScheduler
};
// FCFS Scheduler
function fcfsScheduler(processes) {
    let currentTime = 0;
    let waitingTime = 0;
    let turnaroundTime = 0;
    let ganttChart = [];
    let table = [];

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

        // Populate the table object
        table.push({
            process: processes[i].id,
            arrivalTime: processes[i].arrivalTime,
            burstTime: processes[i].burstTime,
            finishTime: currentTime,
            turnaroundTime: currentTime - processes[i].arrivalTime,
            waitingTime: currentTime - processes[i].arrivalTime - processes[i].burstTime
        });
    }

    const averageWaitingTime = waitingTime / processes.length;
    const averageTurnaroundTime = turnaroundTime / processes.length;

    return { averageWaitingTime, averageTurnaroundTime, ganttChart, table };
}

// SJF (Non-preemptive) Scheduler
function sjfScheduler(processes) {
    let currentTime = 0;
    let waitingTime = 0;
    let turnaroundTime = 0;
    const totalProcesses = processes.length;
    let ganttChart = [];
    let table = [];

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

            // Populate the table object
            table.push({
                process: shortestJob.id,
                arrivalTime: shortestJob.arrivalTime,
                burstTime: shortestJob.burstTime,
                finishTime: currentTime,
                turnaroundTime: currentTime - shortestJob.arrivalTime,
                waitingTime: currentTime - shortestJob.arrivalTime - shortestJob.burstTime
            });

            // Remove the executed process from the list of processes
            processes = processes.filter(process => process.id !== shortestJob.id);
        } else {
            // If no processes have arrived by the current time, increment the current time
            currentTime++;
        }
    }

    const averageWaitingTime = waitingTime / totalProcesses;
    const averageTurnaroundTime = turnaroundTime / totalProcesses;

    return { averageWaitingTime, averageTurnaroundTime, ganttChart, table };
}

// Priority (Non-preemptive) Scheduler
function priorityScheduler(processes) {
    let currentTime = 0;
    let waitingTime = 0;
    let turnaroundTime = 0;
    const totalProcesses = processes.length;
    let ganttChart = [];
    let table = [];

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

            // Populate the table object
            table.push({
                process: highestPriorityProcess.id,
                arrivalTime: highestPriorityProcess.arrivalTime,
                burstTime: highestPriorityProcess.burstTime,
                finishTime: currentTime,
                turnaroundTime: currentTime - highestPriorityProcess.arrivalTime,
                waitingTime: currentTime - highestPriorityProcess.arrivalTime - highestPriorityProcess.burstTime,
                priority: highestPriorityProcess.priority
            });

            // Remove the executed process from the list of processes
            processes = processes.filter(process => process.id !== highestPriorityProcess.id);
        } else {
            // If no processes have arrived by the current time, increment the current time
            currentTime++;
        }
    }

    const averageWaitingTime = waitingTime / totalProcesses;
    const averageTurnaroundTime = turnaroundTime / totalProcesses;

    return { averageWaitingTime, averageTurnaroundTime, ganttChart, table };
}

//Round Robin Scheduler
function roundRobinScheduler(processes, timeQuantum) {
    let currentTime = 0;
    let waitingTime = Array(processes.length).fill(0);
    let turnaroundTime = Array(processes.length).fill(0);
    let remainingBurstTime = processes.map(process => process.burstTime);
    let ganttChart = [];
    let queue = [];
    let table = [];

    while (true) {
        let done = true;
        for (let i = 0; i < processes.length; i++) {
            if (remainingBurstTime[i] > 0) {
                done = false;
                let executeTime = Math.min(remainingBurstTime[i], timeQuantum);
                if (remainingBurstTime[i] > 0) {
                    ganttChart.push({ processId: processes[i].id, startTime: currentTime, burstTime: executeTime });
                }
                currentTime += executeTime;
                remainingBurstTime[i] -= executeTime;

                if (remainingBurstTime[i] > 0) {
                    queue.push(i);
                } else {
                    turnaroundTime[i] = currentTime - processes[i].arrivalTime;
                }
            }
        }
        if (done === true && queue.length === 0) {
            break;
        }
        if (queue.length > 0) {
            let front = queue.shift();
            if (remainingBurstTime[front] > 0) {
                ganttChart.push({ processId: processes[front].id, startTime: currentTime, burstTime: remainingBurstTime[front] });
            }
            currentTime += remainingBurstTime[front];
            turnaroundTime[front] = currentTime - processes[front].arrivalTime;
            remainingBurstTime[front] = 0;
        }
    }

    // Calculate finish times for processes in the Gantt chart
    for (let i = 0; i < ganttChart.length; i++) {
        ganttChart[i].finishTime = ganttChart[i].startTime + ganttChart[i].burstTime;
    }

    let totalWaitingTime = 0;
    let totalTurnaroundTime = 0;
    for (let i = 0; i < processes.length; i++) {
        waitingTime[i] = turnaroundTime[i] - processes[i].burstTime;
        totalWaitingTime += waitingTime[i];
        totalTurnaroundTime += turnaroundTime[i];

        // Populate the table object
        table.push({
            process: processes[i].id,
            arrivalTime: processes[i].arrivalTime,
            burstTime: processes[i].burstTime,
            finishTime: ganttChart.find(item => item.processId === processes[i].id).finishTime,
            turnaroundTime: turnaroundTime[i],
            waitingTime: waitingTime[i]
        });
    }

    const averageWaitingTime = totalWaitingTime / processes.length;
    const averageTurnaroundTime = totalTurnaroundTime / processes.length;
    return { averageWaitingTime, averageTurnaroundTime, ganttChart, table };
}

module.exports = {
    fcfsScheduler,
    sjfScheduler,
    priorityScheduler,
    roundRobinScheduler
};
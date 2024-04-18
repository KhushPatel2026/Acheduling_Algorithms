function roundRobinScheduler(processes, quantumTime) {
  let n = processes.length;
  let s = [];
  for (let i = 0; i < n; i++) {
      s[i] = [];
      for (let j = 0; j < 20; j++) {
          s[i][j] = -1;
      }
  }

  let tot_wt = 0;
  let tot_tat = 0;

  let time = 0;
  let c = n;

  let hello = 0;

  while (c !== 0) {
      let mini = Infinity;
      let flag = false;
      let index = -1;

      for (let i = 0; i < n; i++) {
          let p = time + 0.1;
          if (processes[i].AT <= p && mini > processes[i].AT && processes[i].BT > 0) {
              index = i;
              mini = processes[i].AT;
              flag = true;
          }
      }

      if (!flag) {
          time++;
          continue;
      }

      let j = 0;
      while (s[index][j] !== -1) {
          j++;
      }

      if (s[index][j] === -1) {
          s[index][j] = time;
          processes[index].ST[j] = time;
      }

      if (processes[index].BT <= quantumTime) {
          time += processes[index].BT;
          processes[index].BT = 0;
      } else {
          time += quantumTime;
          processes[index].BT -= quantumTime;
      }

      if (processes[index].BT > 0) {
          processes[index].AT = time + 0.1;
      }

      if (processes[index].BT === 0) {
          c--;
          processes[index].FT = time;
          processes[index].WT = processes[index].FT - processes[index].AT - processes[index].BT;
          tot_wt += processes[index].WT;
          processes[index].TAT = processes[index].BT + processes[index].WT;
          tot_tat += processes[index].TAT;
      }
  }

  return {
      processes: processes,
  };
}

// Example usage
let processes = [
  { pos: 1, AT: 3, BT: 1, ST: [], WT: 0, FT: 0, TAT: 0 },
  { pos: 2, AT: 1, BT: 4, ST: [], WT: 0, FT: 0, TAT: 0 },
  { pos: 3, AT: 4, BT: 2, ST: [], WT: 0, FT: 0, TAT: 0 },
  { pos: 4, AT: 0, BT: 6, ST: [], WT: 0, FT: 0, TAT: 0 },
  { pos: 5, AT: 2, BT: 3, ST: [], WT: 0, FT: 0, TAT: 0 }
];

let quantumTime = 4;
let result = roundRobinScheduler(processes, quantumTime);
let avgWt = 0;
for(let i = 0; i < result.processes.length; i++) {
  avgWt += result.processes[i].FT - ;
}

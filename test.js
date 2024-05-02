function leastFrequentlyUsed(pages, size) {
  let frame = [];
  let pageFaults = 0;
  let pageHits = 0;
  let framesTable = [];
  let frequencyCounter = {};
  let insertOrder = {};

  for (let i = 0; i < pages.length; i++) {
      frequencyCounter[pages[i]] = (frequencyCounter[pages[i]] || 0) + 1;

      if (frame.includes(pages[i])) {
          pageHits++;
      } else {
          pageFaults++;

          if (frame.length < size) {
              frame.push(pages[i]);
          } else {
              let leastFreqPage = null;
              let leastFreqCount = Infinity;
              let leastFreqOrder = Infinity;

              for (let j = 0; j < frame.length; j++) {
                  if (frequencyCounter[frame[j]] < leastFreqCount || (frequencyCounter[frame[j]] === leastFreqCount && insertOrder[frame[j]] < leastFreqOrder)) {
                      leastFreqPage = frame[j];
                      leastFreqCount = frequencyCounter[frame[j]];
                      leastFreqOrder = insertOrder[frame[j]];
                  }
              }

              // Update frequency counter and insert order for the removed page
              delete frequencyCounter[leastFreqPage];
              delete insertOrder[leastFreqPage];

              frame[frame.indexOf(leastFreqPage)] = pages[i];
          }
      }

      framesTable.push([...frame]);
      insertOrder[pages[i]] = i;
  }

  return { totalPageFaults: pageFaults, totalPageHits: pageHits, finalFramesTable: framesTable };
}

const inputPages = [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1];
const frameSize = 4;
const result = leastFrequentlyUsed(inputPages, frameSize);
console.log(result);

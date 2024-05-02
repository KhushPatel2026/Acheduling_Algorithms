function fifo(pages, size) {
    let frame = [];          // Array to hold the frames
    let pageFaults = 0;      // Counter for page faults
    let pageHits = 0;        // Counter for page hits
    let framesTable = [];    // Array to hold the frames table

    for (let i = 0; i < pages.length; i++) {
        // Check if the page is already in the frame
        if (frame.includes(pages[i])) {
            pageHits++;
        } else {
            // Check if the frame is full
            if (frame.length < size) {
                // If the frame is not full, add the page to the frame
                frame.push(pages[i]);
            } else {
                // If the frame is full, remove the first page (FIFO)
                frame.shift();
                // Add the new page to the frame
                frame.push(pages[i]);
            }
            pageFaults++;
        }
        framesTable.push([...frame]); // Push a copy of the current frame to framesTable
    }

    return {
        totalPageFaults: pageFaults,
        totalPageHits: pageHits,
        finalFramesTable: framesTable
    };
}

function optimal(pages, size) {
    let frame = [];          // Array to hold the frames
    let pageFaults = 0;      // Counter for page faults
    let pageHits = 0;        // Counter for page hits
    let framesTable = [];    // Array to hold the frames table

    for (let i = 0; i < pages.length; i++) {
        // Check if the page is already in the frame
        if (frame.includes(pages[i])) {
            pageHits++;
        } else {
            // Check if the frame is full
            if (frame.length < size) {
                // If the frame is not full, add the page to the frame
                frame.push(pages[i]);
            } else {
                // Find the page that will not be used for the longest period of time in the future
                let farthest = i;
                let replacePage;
                for (let j = 0; j < frame.length; j++) {
                    let nextOccurrence = pages.slice(i + 1).indexOf(frame[j]);
                    if (nextOccurrence === -1) {
                        replacePage = frame[j];
                        break;
                    }
                    if (nextOccurrence > farthest) {
                        farthest = nextOccurrence;
                        replacePage = frame[j];
                    }
                }
                // Replace the farthest page
                let index = frame.indexOf(replacePage);
                frame[index] = pages[i];
            }
            pageFaults++;
        }
        framesTable.push([...frame]); // Push a copy of the current frame to framesTable
    }

    return {
        totalPageFaults: pageFaults,
        totalPageHits: pageHits,
        finalFramesTable: framesTable
    };
}

function leastRecentlyUsed(pages, size) {
    let frame = [];          // Array to hold the frames
    let pageFaults = 0;      // Counter for page faults
    let pageHits = 0;        // Counter for page hits
    let framesTable = [];    // Array to hold the frames table
    let lastUsed = {};       // Object to store the last used index for each page

    for (let i = 0; i < pages.length; i++) {
        // Check if the page is already in the frame
        if (frame.includes(pages[i])) {
            pageHits++;
            lastUsed[pages[i]] = i;  // Update the last used index for the page
        } else {
            // Check if the frame is full
            if (frame.length < size) {
                // If the frame is not full, add the page to the frame
                frame.push(pages[i]);
                lastUsed[pages[i]] = i;  // Update the last used index for the page
            } else {
                // Find the least recently used page in the frame
                let leastRecentlyUsed = Object.keys(lastUsed).reduce((a, b) => lastUsed[a] < lastUsed[b] ? a : b);
                // Replace the least recently used page with the new page
                let index = frame.indexOf(leastRecentlyUsed);
                frame[index] = pages[i];
                lastUsed[pages[i]] = i;  // Update the last used index for the new page
                delete lastUsed[leastRecentlyUsed];  // Remove the least recently used page from lastUsed object
            }
            pageFaults++;
        }
        framesTable.push([...frame]); // Push a copy of the current frame to framesTable
    }

    return {
        totalPageFaults: pageFaults,
        totalPageHits: pageHits,
        finalFramesTable: framesTable
    };
}

function leastFrequentlyUsed(pages, size) {
    let frame = [];
    let pageFaults = 0;
    let pageHits = 0;
    let framesTable = [];
    let frequencyCounter = {};

    for (let i = 0; i < pages.length; i++) {
        frequencyCounter[pages[i]] = (frequencyCounter[pages[i]] || 0) + 1;

        if (frame.includes(pages[i])) {
            pageHits++;
        } else {
            pageFaults++;

            if (frame.length < size) {
                frame.push(pages[i]);
            } else {
                let leastFreqPage = frame[0];
                for (let j = 1; j < frame.length; j++) {
                    if (frequencyCounter[frame[j]] < frequencyCounter[leastFreqPage]) {
                        leastFreqPage = frame[j];
                    }
                }
                frame.splice(frame.indexOf(leastFreqPage), 1);
                frame.push(pages[i]);
            }
        }
        framesTable.push([...frame]);
    }

    return {
        totalPageFaults: pageFaults,
        totalPageHits: pageHits,
        finalFramesTable: framesTable
    };
}


module.exports = {
    fifo,
    optimal,
    leastRecentlyUsed,
    leastFrequentlyUsed
}
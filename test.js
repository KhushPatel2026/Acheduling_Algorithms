function lru(pages, size) {
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

// Reference String
const pages = [1, 2, 3, 4, 5, 3, 4, 1, 6, 7,11,23,45];
// Frame size
const frameSize = 3;

// Run LRU algorithm
const result = lru(pages, frameSize);

// Output
console.log('Total Page Faults:', result.totalPageFaults);  // Expected: 8
console.log('Total Page Hits:', result.totalPageHits);      // Expected: 7

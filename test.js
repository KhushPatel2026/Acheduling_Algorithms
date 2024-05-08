const inputString = [3, 5, 1, 2, 7, 0, 4, 2, 1, 6, 0, 3, 7, 4, 1, 5, 2, 6, 0, 3, 7, 4, 5, 1, 2];
const frameSize = 4;
leastRecentlyUsed(inputString, frameSize);

function leastRecentlyUsed(pages, size) {
    let frame = [];          // Array to hold the frames
    let pageFaults = 0;      // Counter for page faults
    let pageHits = 0;        // Counter for page hits
    let framesTable = [];    // Array to hold the frames table

    for (let i = 0; i < pages.length; i++) {
        let pageIndex = frame.indexOf(pages[i]);
        // Check if the page is already in the frame
        if (pageIndex !== -1) {
            // If page exists, move it to the end of the frame (most recently used)
            frame.splice(pageIndex, 1);
            frame.push(pages[i]);
            pageHits++;
        } else {
            // Check if the frame is full
            if (frame.length < size) {
                // If the frame is not full, add the page to the frame
                frame.push(pages[i]);
            } else {
                // If the frame is full, remove the least recently used page (first element)
                frame.shift();
                // Add the new page to the frame
                frame.push(pages[i]);
            }
            pageFaults++;
        }
        framesTable.push([...frame]); // Push a copy of the current frame to framesTable
    }

    console.log(framesTable, pageFaults, pageHits);

    return {
        totalPageFaults: pageFaults,
        totalPageHits: pageHits,
        finalFramesTable: framesTable
    };
}

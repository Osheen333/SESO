'use strict'

const { byDate, merge } = require('./sync-sorted-merge');


const addIndex = async (log, index) => {
  const entry = await log.popAsync();
  return entry ? Object.assign({index}, entry) : false;
}

module.exports = async (logSources, printer) => {
  let indexedEntries = await Promise.all(logSources.map(addIndex));
  let lastEntry = indexedEntries.sort(byDate);
  while (lastEntry.length > 0) { 
    let oldestLog = lastEntry.pop();
    if (oldestLog) { 
      let index = oldestLog.index;
      printer.print(oldestLog);
      let unsortedList = await addIndex(logSources[index], index);
      if (unsortedList) { 
        lastEntry = merge(unsortedList, lastEntry);
      }
    }
  }
  printer.done();
}
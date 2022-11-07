'use strict'

const merge = (log, list, start = 0, end = list.length - 1) => {
  let split = start + ((end - start) >>> 1);
  if (list.length == 0) {
    return [log];
  }
  const logTime = new Date(log.date).getTime(),
        listSplitTime =new  Date(list[split].date).getTime(),
        listStartTime = new Date(list[start].date).getTime(),
        listEndTime = new Date(list[end].date).getTime();

  if (logTime <= listEndTime) {
    return [...list.slice(0, end + 1), log, ...list.slice(end + 1)]
  }
  if (logTime >= listStartTime) {//!!
    return [...list.slice(0,start), log, ...list.slice(start)]
  }
  if (logTime >= listSplitTime) {
    return merge(log, list, start, split);
  } else {
    return merge(log, list, split + 1, end);
  }
}

const byDate = (a, b) => new Date(b.date).getTime() -  new Date(a.date).getTime();

const addIndex = (source, index) => {
  const entry = source.pop();
  return entry ? Object.assign({index}, entry) : false;
}

module.exports = (logSources, printer) => {
  let lastLogs = logSources.map(addIndex).sort(byDate);

  while (lastLogs.length > 0) {
    let oldestLog = lastLogs.pop();
    if (oldestLog) {
      let index = oldestLog.index;
      printer.print(oldestLog);
      let unsortedList = addIndex(logSources[index], index);
      if (unsortedList) {
        lastLogs = merge(unsortedList, lastLogs);
      }
    }
  }
  printer.done();
};

module.exports.merge = merge;
module.exports.byDate = byDate;
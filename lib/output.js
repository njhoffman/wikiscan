const _ = require('lodash');
const { padLeft, padRight } = require('./utils');

// if you only care about r.query
// nfzf.getInput( label )
// options.update(list) when changed

// const buildHeadersList
// const buildTagsList
// const buildGlobalList

const buildKeyLines = (items, cols) => {
  //  
  return _.map(items, item => {
    return [
      `${padRight(item.key, cols.spacing + cols.key)}`,
      `${padRight(item.title, cols.title + cols.spacing)}`,
      `${item.lines.length} lines`
    ].join('');
  });
};

const initFzf = async targetItems => {
  const cols = {
    spacing: 2,
    category: _.maxBy(targetItems, item => item.category.length).category.length,
    key: _.maxBy(targetItems, item => item.key.length).key.length,
    title: _.maxBy(targetItems, item => item.title.length).title.length
  };

  const keyList = buildKeyLines(targetItems, cols);
  process.stdout.write(keyList.join('\n'));
};

module.exports = { initFzf };

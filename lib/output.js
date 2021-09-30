const _ = require('lodash');
const chalk = require('chalk');
const { padLeft, padRight } = require('./utils');
const config = require('./config');

// if you only care about r.query
// nfzf.getInput( label )
// options.update(list) when changed

// const buildHeadersList
// const buildTagsList
// const buildGlobalList

const colors = {
  primary: chalk.rgb(110, 185, 225),
  secondary: chalk.rgb(110, 185, 225),
  title: chalk.rgb(140, 180, 180),
  lineCount: chalk.gray
};

const buildKeyLines = (items, cols) => {
  //  
  return _.map(items, item => {
    const keys = {
      secondary: `${item.key.split('.')[0]}.`,
      primary: `${item.key.split('.').slice(1).join('.')}`
    };
    const spacing = {
      key: cols.key + cols.spacing - keys.primary.length - keys.secondary.length,
      title: cols.title + cols.spacing - item.title.length
    };

    return [
      // process.stdout.isTTY ? '' : item.file.replace(config.basePath, ''),
      item.file,
      `${colors.secondary(keys.secondary)}${colors.primary(keys.primary)}`,
      Array(spacing.key).join(' '),
      colors.title(item.title),
      Array(spacing.title).join(' '),
      colors.lineCount(`${item.lines.length} lines`)
    ].join(' ');
  });
};

const outputFileMatches = async targetItems => {
  const cols = {
    spacing: 2,
    category: _.maxBy(targetItems, item => item.category.length).category.length,
    key: _.maxBy(targetItems, item => item.key.length).key.length,
    title: _.maxBy(targetItems, item => item.title.length).title.length,
    lineCont: 6
  };

  const keyList = buildKeyLines(targetItems, cols);
  process.stdout.write(keyList.join('\n'));
};

module.exports = { outputFileMatches };

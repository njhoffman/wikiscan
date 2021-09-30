const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const PrettyError = require('pretty-error');

const logger = require('./logger');
const { crawlPath } = require('./files');
const config = require('./config');
const { startScan } = require('./scan');
const { outputFileMatches } = require('./output');

const parseArguments = args => {
  const search = args[0] || 'tag-2';
  return { search };
};

const pe = new PrettyError();

const outputResults = results => {
  console.log(results);
};

const extractHeader = ({ file, lines }) => {
  const header = { title: file.split('/').pop(), category: 'user' };
  const headRE = { title: /^title:/, category: /^category:/, start: /^---/ };
  if (headRE.start.test(lines[0])) {
    _.merge(header, {
      title: (_.find(lines, line => headRE.title.test(line)) || '').replace(headRE.title, ''),
      category: (_.find(lines, line => headRE.category.test(line)) || '').replace(
        headRE.category,
        ''
      )
    });
  }
  return header;
};

const buildTargetItems = files =>
  _.map(files, file => {
    const lines = fs.readFileSync(file).toString().split('\n');
    const stat = fs.statSync(file);
    const header = extractHeader({ file, lines });
    const targetPath = file.replace(config.basePath, '').split('.').slice(0, -1).join('.');
    return {
      file,
      lines,
      updated: stat.mtime,
      size: stat.size,
      key: targetPath.split('/').join('.'),
      ...header
    };
  });

(async () => {
  const options = parseArguments(process.argv.slice(2));
  const targetFiles = crawlPath(path.resolve(config.basePath));
  const targetItems = buildTargetItems(targetFiles);
  outputFileMatches(targetItems);
})();

// console.log(targetKeys);

// const results = startScan(options.search, targetFiles);

// const output = outputResults(results);

process.on('unhandledRejection', err => {
  logger.error('Unhandled Rejection', pe.render(err));
  process.exit(1);
});

process.on('unhandledException', err => {
  logger.error('Unhandled Exception', pe.render(err));
  process.exit(1);
});

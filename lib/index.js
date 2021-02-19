const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const PrettyError = require('pretty-error');

const logger = require('./logger');
const { crawlPath } = require('./files');
const config = require('./config');
const { startScan } = require('./scan');
const { initFzf } = require('./fzf');

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
  if (/^---/.test(lines[0])) {
    _.merge(header, {
      title: _.find(lines, line => /^title:/.test(line)).replace(/^title:\s?/, ''),
      category: _.find(lines, line => /^category:/.test(line)).replace(/^category:\s?/, '')
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
  await initFzf(targetItems);
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

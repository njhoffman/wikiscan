const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const { basePath, includeBaseFiles } = require('./config');

const crawlPath = (targetPath, fileList = []) => {
  if (fs.statSync(targetPath).isDirectory()) {
    _.each(fs.readdirSync(targetPath), file => {
      const subPath = `${targetPath}/${file}`;
      if (fs.statSync(subPath).isDirectory()) {
        crawlPath(subPath, fileList);
      } else if (
        (/.md$/.test(file) && includeBaseFiles) ||
        targetPath.replace(/\/$/, '') !== basePath.replace(/\/$/, '')
      ) {
        fileList.push(subPath);
      }
    });
  } else {
    fileList.push(path);
  }
  return fileList;
};

module.exports = { crawlPath };

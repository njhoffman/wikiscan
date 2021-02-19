const _ = require('lodash');
const fs = require('fs');
const { prefixes, findLineEnd } = require('./common');
const { scanPrefixes } = require('./prefixes');
const { scanTags } = require('./tags');

const validToEnd = state => {
  return state.lastMatch && state.lastMatch.lineStart !== state.lineNumber && !state.codeBlock;
};

const checkMatchEnds = (state, lines) => {
  const { lineNumber, line, matched } = state;
  const endPrefixes = prefixes.slice(0, state.lastMatch.headerLevel + 1);
  const prefixMatch = scanPrefixes(endPrefixes, line);
  if (prefixMatch) {
    const lineEnd = /^:\w+:/.test(lines[lineNumber - 1]) ? lineNumber - 2 : lineNumber - 1;
    if (state.lastMatch.tag) {
      matched.tags.push({ ...state.lastMatch, lineEnd });
    } else {
      matched.headers.push({ ...state.lastMatch, lineEnd });
    }
    _.merge(state, { lastMatch: false });
  }
};

const startScan = (search, files) => {
  const matched = { tags: [], prefixes: [], other: [] };
  _.each(files, ({ file, lines }) => {
    const state = { lastMatch: false, codeBlock: false, file };
    _.each(lines, (line, lineNumber) => {
      _.merge(state, { lineNumber, line });
      if (/^```/.test(line)) {
        // code blocks should ignore header prefixes
        state.codeBlock = !state.codeBlock;
      } else if (validToEnd(state)) {
        // check and handle header match ending from similar or higher header level
        checkMatchEnds(state, lines);
      } else if (!state.lastMatch && line.includes(search)) {
        // if matching and in code black, add to other category
        if (state.codeBlock) {
          matched.other.push({ file, lineStart: lineNumber });
        } else {
          // check if new header for position is before or after tag
          // TODO: should I just assume one direction?
          state.lastMatch = scanTags(search, line, lineNumber, lines);
          if (!state.lastMatch) {
            state.lastMatch = scanPrefixes(prefixes, line);
            if (!state.lastMatch) {
              matched.other.push({ file, lineStart: lineNumber });
            }
          }
        }
      }
    });

    if (state.lastMatch) {
      if (state.lastMatch.tag) {
        matched.tags.push({ ...state.lastMatch, file, lineEnd: lines.length });
      } else {
        matched.headers.push({ ...state.lastMatch, file, lineEnd: lines.length });
      }
    }
  });
  return matched;
};

module.exports = { startScan };

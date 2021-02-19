const { prefixes, findLineNumber } = require('./common');

const scanTags = (search, line, lineNumber, lines) => {
  let matched = false;
  const tagRE = new RegExp(`:${search}:`);
  if (tagRE.test(line)) {
    matched = { prefixLevel: false, tag: true, lineStart: lineNumber + 1 };
    // if tag is on the first line, assume whole file should be included
    if (lineNumber === 0) {
      matched = { ...matched, prefixLevel: -1 };
    } else {
      // check if prefix element is line before tag
      prefixes.some((prefix, prefixLevel) => {
        const prefixRE = new RegExp(`^${prefix}(?: |$)`);
        if (prefixRE.test(lines[lineNumber - 1])) {
          matched = { ...matched, prefixLevel, position: 'before', lineStart: lineNumber - 1 };
          return true;
        }
        return false;
      });
      // check if prefix element is line after tag
      prefixes.some((prefix, prefixLevel) => {
        const prefixRE = new RegExp(`^${prefix}(?: |$)`);
        if (prefixRE.test(lines[lineNumber + 1])) {
          if (matched.prefixLevel === false || prefixLevel <= matched.prefixLevel) {
            matched = { ...matched, prefixLevel, position: 'after', lineStart: lineNumber + 1 };
            return true;
          }
        }
        return false;
      });
    }
  }
  return matched;
};

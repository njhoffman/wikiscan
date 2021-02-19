const prefixes = ['#', '##', '###', '####', '#####', '######', '```'];

const findLineEnd = lines => {
  let endLineNumber = lines.length;
  lines.some((line, lineNumber) => {
    return prefixes.some(prefix => {
      const prefixRE = new RegExp(`^${prefix}(?: |$)`);
      if (prefixRE.test(line)) {
        endLineNumber = lineNumber;
        return true;
      }
      return false;
    });
  });
  return endLineNumber;
};

module.exports = { findLineEnd, prefixes };

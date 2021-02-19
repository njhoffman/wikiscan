const scanPrefixes = (prefixSet, line) => {
  let matchedLevel = false;
  prefixSet.some((prefix, prefixLevel) => {
    const prefixRE = new RegExp(`^${prefix}(?: |$)`);
    if (prefixRE.test(line)) {
      matchedLevel = { prefixLevel };
      return true;
    }
  });
  return matchedLevel;
};

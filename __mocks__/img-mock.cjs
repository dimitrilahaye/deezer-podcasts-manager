const path = require('node:path');

module.exports = {
  process(sourceText, sourcePath, options) {
    return {
      code: `module.exports = '${path.basename(sourcePath)}';`,
    };
  },
};

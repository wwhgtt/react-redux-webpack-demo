const JsSHA = require('jssha');
exports.getSendCodeParamStr = obj => {
  const key = '2039a66ba1d64576a8fba398b8b7598b';
  const props = [];
  let n = 0;

  for (const prop in obj) {
    if (!obj[prop]) {
      continue;
    }

    props[n] = prop;
    n++;
  }

  props.sort();
  let paramStr = '';
  function concat(length) {
    const preIndex = length - 1;
    if (length === 1) {
      paramStr = `${props[0]}=${obj[props[0]]}`;
    } else {
      paramStr = `${concat(preIndex)}&${props[preIndex]}=${obj[props[preIndex]]}`;
    }
    return paramStr;
  }

  concat(n);
  const value = `${paramStr}&key=${key}`;
  const shaObj = new JsSHA('SHA-1', 'TEXT');
  shaObj.update(value);
  return `${paramStr}&sign=${shaObj.getHash('HEX')}`;
};

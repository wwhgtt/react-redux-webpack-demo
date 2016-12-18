const dateUtility = require('./common-helper.js').dateUtility;

// 余额信息
exports.getBalanceInfo = (info) => {
  const infoArray = info.vhList;
  for (let i = 0; i < infoArray.length; i ++) {
    let opstr = '';
    let addstr = infoArray[i].addValuecard;

    if (infoArray[i].type === 1) {
      opstr = '退款';
    } else if (infoArray[i].type === 2) {
      opstr = '调账';
    } else {
      if (addstr >= 0) {
        opstr = '充值';
        if (infoArray[i].sendValuecard > 0) {
          opstr = '充值(含赠送)';
        }
      } else {
        opstr = '消费';
      }
    }

    infoArray[i].balanceType = opstr;

    // 格式化金额
    if (addstr >= 0) {
      infoArray[i].addValuecard = `+${addstr}`;
    } else {
      infoArray[i].addValuecard = addstr;
    }
    // 消费/充值时间
    infoArray[i].createDateTime = dateUtility.format(new Date(infoArray[i].createDateTime), 'yyyy-MM-dd');
  }
  return info;
};

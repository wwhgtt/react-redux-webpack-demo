exports.getCurrentPosition = (success, error, config) => {
  const defaultConfig = {
    enableHighAccuracy: true,
    timeout: 2000,
    maximumAge: 1000 * 10,
  };
  navigator.geolocation.getCurrentPosition(pos => {
    if (success) {
      success(pos.coords);
    }
  }, err => {
    if (error) {
      error(err);
    }
  }, Object.assign({}, defaultConfig, config));
};

// 校验收货地址信息
exports.validateAddressInfo = (info, isTakeaway, filter) => {
  const rules = {
    name: [
      { msg: '请输入姓名', validate(value) { return !!value.trim(); } },
    ],
    sex: [
      { msg: '请选择性别', validate(value) {
        const gender = +value;
        return gender === 1 || gender === 0;
      } },
    ],
    mobile: [
      { msg: '请输入手机号', validate(value) { return !!value.trim(); } },
      { msg: '请录入正确的手机号', validate(value) { return /^1[34578]\d{9}$/.test(value); } },
    ],
  };

  if (isTakeaway) {
    Object.assign(rules, {
      baseAddress: [
        { msg: '请输入收货地址', validate(value) { return !!value.trim(); } },
      ],
      street: [
        { msg: '请输入门牌信息', validate(value) { return !!value.trim(); } },
      ],
    });
  }
  for (const key in rules) {
    if (!rules.hasOwnProperty(key)) {
      continue;
    }
    if (filter && filter(key)) {
      continue;
    }
    const rule = rules[key];
    let value = info[key];
    if (typeof value !== 'number') {
      value = value || '';
    }
    for (let i = 0, len = rule.length; i < len; i++) {
      const item = rule[i];
      const valid = item.validate(value);
      if (!valid) {
        return { valid: false, msg: item.msg };
      }
    }
  }
  return { valid: true, msg: '' };
};

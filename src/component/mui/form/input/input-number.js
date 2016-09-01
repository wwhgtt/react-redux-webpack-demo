const React = require('react');

const InputNum = React.createClass({
  // =====================================
  // 传入格式：验证数组
  // 传入属性：regs
  // 格式：
  // [
  //    {reg: '正则表达式', regMsg: '提示信息'},
  //    {reg: '/^(1(?:[358]\d{9}|7[3678]\d{8}|4[57]\d{8})|0[49]\d{10})$/', regMsg: '请输入手机号码'}
  // ]
  // ======================================
  // 输出: onGetNum(obj)
  // 格式：
  // {errorMsg: regMsg, numVal: 'input值'}
  // 示例：
  // {errorMsg: '请输入手机号码', numVal: '12'}
  // ======================================
  propTypes: {
    onGetNum: React.PropTypes.func,
    regs: React.PropTypes.array,
    defaultVal: React.PropTypes.string,
    maxLength: React.PropTypes.number,
    placeholder: React.PropTypes.string,
    className: React.PropTypes.string,
  },

  getInitialState() {
    return { numVal: '' };
  },
  componentWillReceiveProps(nextProps) {
    if (!nextProps.defaultVal) {
      this.setState({ numVal: nextProps.defaultVal });
    }
  },
  handleCheck(e) {
    let inputNum = e.target.value;
    const regNum = /[^0-9]/g;
    let errorFlag = ''; // 提示信息
    const { regs } = this.props; // 来自父级的验证规则

    // 禁止输入数字以外的字符
    if (regNum.test(inputNum)) {
      inputNum = inputNum.replace(regNum, '');
    }
    this.setState({ numVal: inputNum });
    // 遍历验证规则
    if (regs) {
      const regLen = regs.length;
      for (let i = 0; i < regLen; i ++) {
        if (!(regs[i].reg).test(inputNum)) {
          errorFlag = regs[i].regMsg;
          break;
        }
      }
    }
    // 将提示信息和值传出
    if (this.props.onGetNum) {
      this.props.onGetNum({
        errorMsg: errorFlag,
        numVal: inputNum,
      });
    }
  },
  render() {
    return (
      <input
        type="tel"
        pattern="\\d*"
        onChange={this.handleCheck}
        maxLength={this.props.maxLength}
        placeholder={this.props.placeholder}
        className={this.props.className}
        value={this.state.numVal}
      />
    );
  },
});

module.exports = InputNum;

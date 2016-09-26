const React = require('react');

const InputNum = React.createClass({
  displayName:'InputNum',
  propTypes: {
    onSetNum: React.PropTypes.func,
    regs: React.PropTypes.array,
    defaultVal: React.PropTypes.string,
    maxLength: React.PropTypes.number,
    placeholder: React.PropTypes.string,
    className: React.PropTypes.string,
    disabled: React.PropTypes.bool,
  },

  getInitialState() {
    return { numVal: '' };
  },
  componentWillReceiveProps(nextProps) {
    this.setState({ numVal: nextProps.defaultVal || '' });
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
    if (this.props.onSetNum) {
      this.props.onSetNum({
        errorMsg: errorFlag,
        numVal: inputNum,
      });
    }
  },
  render() {
    const { maxLength, placeholder, className, disabled } = this.props;
    return (
      <input
        type="tel"
        pattern="\\d*"
        onChange={this.handleCheck}
        maxLength={maxLength}
        placeholder={placeholder}
        className={className}
        value={this.state.numVal}
        disabled={disabled}
      />
    );
  },
});

module.exports = InputNum;

const React = require('react');

const InputNum = React.createClass({
  propTypes: {
    onGetNum: React.PropTypes.func,
    regs: React.PropTypes.Array,
  },
  getInitialState() {
    return { numVal: '' };
  },
  handleCheck(e) {
    let inputNum = e.target.value;
    const regNum = /[^0-9]/g;
    let errorFlag = 'success'; // 提示信息
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
    let props = {};
    props = this.props;
    return (
      <input
        type="tel"
        pattern={"\\d*"}
        onChange={this.handleCheck}
        {...props}
        value={this.state.numVal}
      />
    );
  },
});

module.exports = InputNum;

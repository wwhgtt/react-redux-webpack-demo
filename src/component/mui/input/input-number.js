const React = require('react');

const InputPhone = React.createClass({
  propTypes: {
    type: React.PropTypes.string,
    onGetPhoneNum: React.PropTypes.func,
  },
  getInitialState() {
    return { phoneVal: '' };
  },
  handleCheck(e) {
    let phoneNum = e.target.value;
    const regPhone = /^(1(?:[358]\d{9}|7[3678]\d{8}|4[57]\d{8})|0[49]\d{10})$/;
    const regNum = /[^0-9]/g;
    let errorFlag = 0;

    // console.log(phoneNum);
    if (regNum.test(phoneNum)) {
      phoneNum = phoneNum.replace(regNum, '');
    }
    this.setState({ phoneVal: phoneNum });
    // // errorFlag
    // 1:验证通过 0:空字符串 2:格式错误
    // ===========================
    // debugger;
    if (!phoneNum) {
      errorFlag = 0;
    } else if (!regPhone.test(phoneNum)) {
      errorFlag = 2;
    } else {
      errorFlag = 1;
    }

    if (this.props.onGetPhoneNum) {
      this.props.onGetPhoneNum({
        errorCode: errorFlag,
        phoneVal: phoneNum,
      });
    }
  },
  render() {
    let props = {};
    props = this.props;
    return (
      <input
        type="tel"
        onChange={this.handleCheck}
        {...props}
        value={this.state.phoneVal}
      />
    );
  },
});

module.exports = InputPhone;

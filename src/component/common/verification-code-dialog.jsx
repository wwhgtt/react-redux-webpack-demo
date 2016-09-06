const React = require('react');
const Dialog = require('../mui/dialog/dialog.jsx');
const PhoneVerificationCode = require('../mui/form/phone-verification-code.jsx');
require('./verification-code-dialog.scss');

module.exports = React.createClass({
  displayName: 'PhoneVerificaitonCodeDialog',
  propTypes: {
    title: React.PropTypes.string,
    confirmBtnText: React.PropTypes.string,
    onClose: React.PropTypes.func,
    onConfirm: React.PropTypes.func,
    ...PhoneVerificationCode.propTypes,
  },
  getDefaultProps() {
    return {
      title: '验证手机号',
      confirmBtnText: '确定',
    };
  },
  getInitialState() {
    return {};
  },
  componentDidMount() {
  },
  onConfirm(evt) {
    if (this.props.onConfirm) {
      const inputInfo = this.refs.verificationCode.getInputInfo();
      this.props.onConfirm(inputInfo);
    }
    evt.preventDefault();
  },
  render() {
    const { title, confirmBtnText, onClose, ...other } = this.props;
    const buttons = [{
      text: confirmBtnText,
      className: 'dialog-btn-confirm btn--yellow',
      onClick: this.onConfirm,
    }];
    return (
      <div className="verification-code-dialog has">
        <Dialog
          title={title || ''}
          onClose={onClose}
          buttons={buttons}
        >
          <PhoneVerificationCode
            {...other}
            ref="verificationCode"
          />
        </Dialog>
      </div>
    );
  },
});

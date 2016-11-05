const React = require('react');
const Dialog = require('./dialog.jsx');
require('./confirm-dialog.scss');

module.exports = React.createClass({
  displayName: 'PhoneVerificaitonCodeDialog',
  propTypes: {
    cancelText: React.PropTypes.string,
    confirmText: React.PropTypes.string,
    children: React.PropTypes.any,
    onCancel: React.PropTypes.func,
    onConfirm: React.PropTypes.func,
  },
  getDefaultProps() {
    return {
      confirmText: '确定',
      cancelText: '取消',
    };
  },
  componentDidMount() {
  },
  onConfirm(evt) {
    if (this.props.onConfirm) {
      this.props.onConfirm();
    }
    evt.preventDefault();
  },
  onCancel(evt) {
    if (this.props.onCancel) {
      this.props.onCancel();
    }
    evt.preventDefault();
  },
  render() {
    const { cancelText, confirmText } = this.props;
    const buttons = [
      {
        text: cancelText,
        className: 'dialog-btn-cancel',
        onClick: this.onCancel,
      },
      {
        text: confirmText,
        className: 'dialog-btn-confirm',
        onClick: this.onConfirm,
      },
    ];
    return (
      <Dialog
        theme="sliver"
        onClose={this.onCancel}
        buttons={buttons}
        className="confirm-dialog"
      >
      {this.props.children}
      </Dialog>
    );
  },
});

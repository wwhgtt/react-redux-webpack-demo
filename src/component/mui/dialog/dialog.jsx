require('./dialog.scss');

const React = require('react');

module.exports = React.createClass({
  displayName: 'Dialog',
  propTypes:{
    title: React.PropTypes.string,
    theme: React.PropTypes.string,
    hasTopBtnClose: React.PropTypes.bool,
    children: React.PropTypes.object,
    buttons: React.PropTypes.array,
    onClose: React.PropTypes.func,
  },
  getDefaultProps() {
    return {
      theme: 'default',
      hasTopBtnClose: true,
    };
  },
  onClose(evt) {
    if (evt) {
      evt.preventDefault();
    }
    if (this.props.onClose) {
      this.props.onClose();
    }
  },
  render() {
    const { title, buttons, hasTopBtnClose, theme } = this.props;
    const buttonElems = (buttons || []).map((button, index) => (
      <button
        key={index}
        className={button.className}
        onTouchTap={button.onClick}
      >
        {button.text}
      </button>
    ));
    return (
      <div className="modal">
        <div className="mask" onTouchTap={this.onClose}></div>
        <div className={`dialog ${theme}`}>
          <div className="dialog-header">
            <p className="dialog-title">{title}</p>
            {hasTopBtnClose && <button className="btn dialog-btn-close" onTouchTap={this.onClose}></button>}
          </div>
          <div className="dialog-body">
            {this.props.children}
          </div>
          <div className="dialog-footer">
            {buttonElems}
          </div>
        </div>
      </div>
    );
  },
});

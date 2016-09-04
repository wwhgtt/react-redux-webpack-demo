const React = require('react');
require('./dialog.scss');

module.exports = React.createClass({
  displayName: 'Dialog',
  propTypes:{
    title: React.PropTypes.string,
    onClose: React.PropTypes.func,
    children: React.PropTypes.object,
    buttons: React.PropTypes.array,
  },
  getInitialState() {
    return {};
  },
  componentDidMount() {
  },
  onClose() {
    const { onClose } = this.props;
    if (onClose) {
      onClose();
    }
  },
  render() {
    const { title, buttons } = this.props;
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
        <div className="mask"></div>
        <div className="dialog">
          <div className="dialog-header">
            <p className="dialog-title">{title}</p>
            <button className="btn dialog-btn-close" onTouchTap={this.onClose}></button>
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

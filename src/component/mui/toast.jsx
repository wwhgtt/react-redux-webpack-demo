const React = require('react');

module.exports = React.createClass({
  displayName: 'Toast',
  propTypes: {
    clearErrorMsg:React.PropTypes.func.isRequired,
    errorMessage:React.PropTypes.string.isRequired,
  },
  componentDidMount() {
    const { clearErrorMsg } = this.props;
    setTimeout(() => {
      clearErrorMsg();
    }, 3000);
  },
  render() {
    const { errorMessage } = this.props;
    return (
      <div className="toast"><span className="toast-content">{errorMessage}</span></div>
    );
  },
});

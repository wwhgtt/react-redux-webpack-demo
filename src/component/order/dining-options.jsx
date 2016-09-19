const React = require('react');
module.exports = React.createClass({
  displayName: 'DiningOptions',
  propTypes: {
    dineSerialNumber:React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]).isRequired,
    dineCount:React.PropTypes.number.isRequired,
    dineTableProp:React.PropTypes.string.isRequired,
  },
  componentDidMount() {

  },
  render() {
    const { dineSerialNumber, dineCount, dineTableProp } = this.props;
    return (
      <div className="dining-options">
        <p><span>流水号</span><span>{dineSerialNumber}</span></p>
        <p><span>人数</span><span>{dineCount}人</span></p>
        <p><span>桌号</span><span>{dineTableProp.area}{dineTableProp.table}</span></p>
      </div>
    );
  },
});

const React = require('react');
require('./dining-options.scss');

module.exports = React.createClass({
  displayName: 'DiningOptions',
  propTypes: {
    dineSerialNumber:React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
    dineCount:React.PropTypes.number,
    dineTableProp:React.PropTypes.object,
  },
  componentDidMount() {

  },
  render() {
    const { dineSerialNumber, dineCount, dineTableProp } = this.props;
    return (
      <div className="dining-options">
        <div className="dining-option ellipsis">
          <span className="text-dusty-grey">流水号</span>{dineSerialNumber}
        </div>
        <div className="dining-option ellipsis">
          <span className="text-dusty-grey">人数</span>{dineCount}人
        </div>
        <div className="dining-option ellipsis">
          <span className="text-dusty-grey">桌号</span>{dineTableProp.area}{dineTableProp.table}
        </div>
      </div>
    );
  },
});

const React = require('react');
require('./dining-options.scss');

module.exports = React.createClass({
  displayName: 'DiningOptions',
  propTypes: {
    dineSerialNumber:React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]).isRequired,
    dineCount:React.PropTypes.number.isRequired,
    dineTableProp:React.PropTypes.object.isRequired,
  },
  componentDidMount() {

  },
  render() {
    const { dineSerialNumber, dineCount, dineTableProp } = this.props;
    return (
      <div className="dining-options">
        <div className="dining-option ellipsis left">
          <span className="text-dusty-grey">流水号</span>{dineSerialNumber}
        </div>
        <div className="dining-option ellipsis middle">
          {dineTableProp.area}{dineTableProp.table}
        </div>
        <div className="dining-option ellipsis right">
          <span className="text-dusty-grey">人数</span>{dineCount}
        </div>
      </div>
    );
  },
});

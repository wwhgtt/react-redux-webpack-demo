const React = require('react');
const defaultPersonLogo = require('../../asset/images/person-default.svg');
require('./order-custom.scss');

const OrderCustom = React.createClass({
  displayName: 'OrderCustom',
  propTypes: {
    customInfo: React.PropTypes.object,
  },

  render() {
    const { customInfo } = this.props;
    return (
      <div className="option">
        <img className="order-custom-icon" src={customInfo.headImage || defaultPersonLogo} role="presentation" />
        <span className="order-custom-name">
          {customInfo.name}
          {
            customInfo.sex && <span>{customInfo.sex}</span>
          }
        </span>
      </div>
    );
  },
});

module.exports = OrderCustom;

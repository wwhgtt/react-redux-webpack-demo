const React = require('react');
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
        {
          customInfo.headUrl ?
            <img className="order-custom-icon" src={customInfo.headUrl} role="presentation" />
          : ''
        }
        <span className="order-custom-name">{customInfo.name}</span>
        {
          customInfo.sex ?
            <span>{customInfo.sex}</span>
          : ''
        }
      </div>
    );
  },
});

module.exports = OrderCustom;

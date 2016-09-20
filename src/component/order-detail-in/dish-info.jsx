const React = require('react');
const OrderCustom = require('../../component/order-detail-in/order-custom.jsx');
const shopIcon = require('../../asset/images/default.png');

const DishInfo = React.createClass({
  displayName: 'DishInfo',
  propTypes: {
    dishInfo: React.PropTypes.object,
  },

  render() {
    // 头像 姓名 性别
    // const { customInfo } = this.props;
    const customInfo = {
      name: '姓名',
      sex: '先生',
      headUrl: shopIcon,
    };
    return (
      <div className="options-group">
        <div className="option">
          <span>{2}份商品</span>
          <span className="fr text-dusty-grey">下单时间 {'11:11'}</span>
        </div>
        <OrderCustom customInfo={customInfo} />
      </div>
    );
  },
});

module.exports = DishInfo;

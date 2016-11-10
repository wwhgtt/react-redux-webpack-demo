const React = require('react');
const connect = require('react-redux').connect;
const dinnerDetailAction = require('../../action/order-detail/dinner-detail.js');

require('../../asset/style/style.scss');

const DishDetail = require('../../component/order-detail-uncheck/dish-detail.jsx');
const DiningOptions = require('../../component/order/dining-options.jsx');
require('../../component/order-detail/dish-detail.scss');
require('./application.scss');

const shopLogoDefault = require('../../asset/images/logo_default.svg');

const DinnerDetailApplication = React.createClass({
  displayName: 'DinnerDetailApplication',
  propTypes: {
    dinnerDetail: React.PropTypes.object,
    getDinnerDetail: React.PropTypes.func,
  },

  componentWillMount() {
    this.props.getDinnerDetail();
  },

  render() {
    const { dinnerDetail } = this.props;
    const deskNo = {
      area: dinnerDetail.tableArea,
      table: dinnerDetail.tableNo,
    };

    return (
      <div className="application">
        <div className="order-status">
          <span className="order-status-title">{dinnerDetail.status}</span>
          <a className="order-status-comment">我要评价</a>
        </div>
        <div className="options-group">
          <a className="shop-info" href="">
            <img className="shop-info-logo" role="presentation" src={dinnerDetail.shopLogo || shopLogoDefault} />
            <span className="shop-info-name ellipsis">{dinnerDetail.shopName}</span>
          </a>
          <div className="option">
            <DiningOptions
              dineSerialNumber={dinnerDetail.serialNo || ''}
              dineCount={dinnerDetail.peopleCount || 0}
              dineTableProp={deskNo}
            />
          </div>
        </div>

        <div className="options-group">
        {
          dinnerDetail.dishItems &&
            dinnerDetail.dishItems.map((item, index) =>
              <DishDetail mainDish={item} key={index} />
          )
        }
        </div>
        <div className="options-group">
          {
            dinnerDetail.extraFee && dinnerDetail.extraFee.map((item, index) =>
              <div className="option" key={index}>
                <span>{item.privilegeName}</span>
                <span className="fr">{item.privilegeAmount < 0 ? '-' : ''}<span className="price">{Math.abs(item.privilegeAmount)}</span></span>
              </div>
            )
          }
        </div>
        <div className="options-group">
          {
            dinnerDetail.tradePrivileges && dinnerDetail.tradePrivileges.map((item, index) =>
              <div className="option" key={index}>
                <span>{item.privilegeName}</span>
                <span className="fr">-<span className="price">{Math.abs(item.privilegeAmount)}</span></span>
              </div>
            )
          }
          <div className="option">
            <div className="flex-row">
              <div className="flex-row-item">原价
                <span className="price">{(dinnerDetail.tradeAmount || 0) + Math.abs(dinnerDetail.tradePrivilegeAmount || 0)}</span>
              </div>
              <div className="flex-row-item">共优惠<span className="price">{Math.abs(dinnerDetail.tradePrivilegeAmount || 0)}</span></div>
              <div className="flex-row-item">总计：
                <span className="price">{dinnerDetail.tradeAmount}</span>
              </div>
            </div>
          </div>
        </div>
        <p>其他信息</p>
        <div className="option-group">

        </div>
      </div>
    );
  },
});

const mapStateToProps = function (state) {
  return ({
    dinnerDetail: state.dinnerDetail,
  });
};

module.exports = connect(mapStateToProps, dinnerDetailAction)(DinnerDetailApplication);

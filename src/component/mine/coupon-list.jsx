const React = require('react');
const config = require('../../config');
const couponHelper = require('../../helper/coupon-helper');

require('./coupon-list.scss');

module.exports = React.createClass({
  displayName: 'CouponList',
  propTypes:{
    couponList:React.PropTypes.object.isRequired,
    couponStatus:React.PropTypes.number.isRequired,
  },
  componentWillMount() {},
  componentDidMount() {},
  render() {
    const { couponList, couponStatus } = this.props;
    const filterCouponList = couponHelper.filterCouponListByStatus(couponList, couponStatus);
    console.log(filterCouponList);
    return (
      <div>
        <div className="coupon-list-outer">
          <div className="uprow of">
            <div className="uprow-leftpart zhekou">
              <div className="uprow-leftpart-value">
                <span className="discount-num">8.5</span>折 折扣券
                <br />
                <span className="expense-condition">消费满100元可用（22:00 ~ 23:35）</span>
                <p className="detail-click">
                  代金券使用规则
                </p>
              </div>
            </div>
            <div className="uprow-rightpart">
              <p className="validity">有效期</p>
              <span className="validity-date">2015/12/03</span>
              <span className="validity-date">2016/05/02</span>
            </div>
          </div>
          <div className="downrow of">
            <p className="downrow-no">NO.1342187960</p>
            <p className="downrow-item">除酒水外全场通用</p>
            <p className="downrow-item">最多可叠加使用2张</p>
            <p className="downrow-item">仅限堂食，不提供餐前外带，餐毕可打包</p>
            <p className="downrow-item">本券仅限在以下门店使用：A门店、B门店、C门店</p>
          </div>
        </div>
        <div className="coupon-list-outer">
          <div className="uprow of">
            <div className="uprow-leftpart manjian">
              <div className="uprow-leftpart-value">
                <span className="discount-num">50</span>元 满减券
                <br />
                <span className="expense-condition">消费满100元可用（22:00 ~ 23:35）</span>
                <p className="detail-click">
                  代金券使用规则
                </p>
              </div>
            </div>
            <div className="uprow-rightpart">
              <p className="validity">有效期</p>
              <span className="validity-date">2015/12/03</span>
              <span className="validity-date">2016/05/02</span>
            </div>
          </div>
          <div className="downrow of">
            <p className="downrow-no">NO.1342187960</p>
            <p className="downrow-item">除酒水外全场通用</p>
            <p className="downrow-item">最多可叠加使用2张</p>
            <p className="downrow-item">仅限堂食，不提供餐前外带，餐毕可打包</p>
            <p className="downrow-item">本券仅限在以下门店使用：A门店、B门店、C门店</p>
          </div>
        </div>
        <div className="coupon-list-outer">
          <div className="uprow of">
            <div className="uprow-leftpart xianjin">
              <div className="uprow-leftpart-value">
                <span className="discount-num">100</span>元 现金券
                <br />
                <span className="expense-condition">消费满100元可用（22:00 ~ 23:35）</span>
                <p className="detail-click">
                  代金券使用规则
                </p>
              </div>
            </div>
            <div className="uprow-rightpart">
              <p className="validity">有效期</p>
              <span className="validity-date">2015/12/03</span>
              <span className="validity-date">2016/05/02</span>
            </div>
          </div>
          <div className="downrow of">
            <p className="downrow-no">NO.1342187960</p>
            <p className="downrow-item">除酒水外全场通用</p>
            <p className="downrow-item">最多可叠加使用2张</p>
            <p className="downrow-item">仅限堂食，不提供餐前外带，餐毕可打包</p>
            <p className="downrow-item">本券仅限在以下门店使用：A门店、B门店、C门店</p>
          </div>
        </div>
        <div className="coupon-list-outer">
          <div className="uprow of">
            <div className="uprow-leftpart lipin">
              <div className="uprow-leftpart-value">
                送<span className="discount-num" style={{ fontSize:'1.5em' }}>天堂伞</span>
                <br />
                <span className="expense-condition">消费满100元可用（22:00 ~ 23:35）</span>
                <p className="detail-click">
                  代金券使用规则
                </p>
              </div>
            </div>
            <div className="uprow-rightpart">
              <p className="validity">有效期</p>
              <span className="validity-date">2015/12/03</span>
              <span className="validity-date">2016/05/02</span>
            </div>
          </div>
          <div className="downrow of">
            <p className="downrow-no">NO.1342187960</p>
            <p className="downrow-item">除酒水外全场通用</p>
            <p className="downrow-item">最多可叠加使用2张</p>
            <p className="downrow-item">仅限堂食，不提供餐前外带，餐毕可打包</p>
            <p className="downrow-item">本券仅限在以下门店使用：A门店、B门店、C门店</p>
          </div>
        </div>
      </div>
    );
  },
});

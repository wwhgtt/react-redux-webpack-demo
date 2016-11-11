const React = require('react');
const classnames = require('classnames');

const shopLogoDefault = require('../../asset/images/logo_default.svg');

const ListHead = React.createClass({
  displayName: 'ListHead',
  propTypes: {
    headDetail: React.PropTypes.object,
    isOrange: React.PropTypes.bool,
    orderType: React.PropTypes.string,
  },

  render() {
    const { headDetail, isOrange, orderType } = this.props;
    let dishLink = '';
    if (orderType === 'TS') {
      dishLink = `http://${location.host}/orderall/selectDish?shopId=${headDetail.shopId}`;
    } else if (orderType === 'WM') {
      dishLink = `http://${location.host}/takeaway/selectDish?shopId=${headDetail.shopId}`;
    } else if (orderType === 'BK' || orderType === 'QE') {
      dishLink = `http://${location.host}/shop/detail?shopId=${headDetail.shopId}`;
    }

    return (
      <div className="list-head clearfix">
        <a className="list-head-href" href={dishLink}>
          <img src={headDetail.shopLogo || shopLogoDefault} role="presentation" className="list-head-img" />
          <span className="list-head-title ellipsis">{headDetail.shopName}</span>
        </a>
        <span className={classnames('list-head-status', { 'text-orange': isOrange })}>{headDetail.status}</span>
      </div>
    );
  },
});

module.exports = ListHead;

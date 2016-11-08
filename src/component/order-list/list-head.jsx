const React = require('react');
const classnames = require('classnames');

const shopLogoDefault = require('../../asset/images/logo_default.svg');

const ListHead = React.createClass({
  displayName: 'ListHead',
  propTypes: {
    headDetail: React.PropTypes.object,
    isOrange: React.PropTypes.bool,
  },

  render() {
    const { headDetail, isOrange } = this.props;
    return (
      <div className="list-head clearfix">
        <a className="list-head-href">
          <img src={headDetail.shopLogo || shopLogoDefault} role="presentation" className="list-head-img" />
          <span className="list-head-title ellipsis">{headDetail.shopName}</span>
        </a>
        <span className={classnames('list-head-status', { 'text-orange': isOrange })}>{headDetail.status}</span>
      </div>
    );
  },
});

module.exports = ListHead;

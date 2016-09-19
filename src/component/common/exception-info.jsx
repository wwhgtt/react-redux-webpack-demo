const React = require('react');
require('./exception-info.scss');
const kryPic = require('../../asset/images/kry_logo.png');

const ExceptionInfo = React.createClass({
  displayName: 'ExceptionPage',
  propTypes: {
    tips: React.PropTypes.string,
    returnName: React.PropTypes.string,
    returnUrl: React.PropTypes.string,
  },

  render() {
    const { tips, returnName, returnUrl } = this.props;
    return (
      <div className="exception-info">
        <div className="exception-content">
          <div className="exception-content-img"></div>
          <p className="exception-content-tips">{tips}</p>
          <a className="btn btn--yellow" href={returnUrl}>{returnName}</a>
        </div>

        <div className="exception-footer">
          <span>powered by </span>
          <img src={kryPic} role="presentation" />
        </div>
      </div>
    );
  },
});

module.exports = ExceptionInfo;

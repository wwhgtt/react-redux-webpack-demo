const React = require('react');
require('./grow-accume-list.scss');

module.exports = React.createClass({ // ShowBasicInfo
  displayName: 'GrowAccumeList',
  propTypes:{
    listName:React.PropTypes.string.isRequired,
    buildListElement:React.PropTypes.array,
    hideLoad:React.PropTypes.bool,
  },
  getInitialState() {
    return {};
  },
  render() {
    const { listName, buildListElement, hideLoad } = this.props;
    const noRecords = !buildListElement || buildListElement.length === 0;
    const recordsClasName = `section records ${noRecords ? 'records-empty' : ''}`;
    return (
      <div className="detail">
        <div className="detail-title">{listName}</div>
        <div className={recordsClasName}>
          <div className="records-inner">
            {buildListElement}
          </div>
        </div>
        {
          !hideLoad && <div className="loading"></div>
        }
        {
          hideLoad && <div className="copyright-bt">客如云提供技术支持</div>
        }
      </div>
    );
  },
});

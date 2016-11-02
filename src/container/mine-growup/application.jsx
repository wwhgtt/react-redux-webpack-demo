const React = require('react');
const Dialog = require('../../component/mui/dialog/dialog.jsx');

const connect = require('react-redux').connect;
const dateUtility = require('../../helper/common-helper.js').dateUtility;
const mineGrowupAction = require('../../action/mine/mine-growup.js');

require('../../asset/style/style.scss');
require('../../component/mine/income-expenses-list.scss');
require('../mine-accumulation/application.scss');
require('./application.scss');
require('../../component/mine/common.scss');

const MineGrowupApplication = React.createClass({
  displayName: 'MineGrowupApplication',
  propTypes: {
    growupInfo: React.PropTypes.object,
    fetchGrowupInfo: React.PropTypes.func,
    fetchGrownLevelsInfo: React.PropTypes.func,
  },
  getInitialState() {
    return {
      descriptionContentVisible: false,
    };
  },
  componentWillMount() {
    this.props.fetchGrowupInfo().then(this.props.fetchGrownLevelsInfo);
  },
  toggleDescriptContent() {
    this.setState({ descriptionContentVisible: !this.state.descriptionContentVisible });
  },
  buildListElement() {
    const { ghList } = this.props.growupInfo;
    if (!ghList || !ghList.length) {
      return false;
    }

    const getGrowthTypeText = type => {
      let ret = '消费增加成长值';
      if (type === 2) {
        ret = '修改会员等级变动成长值';
      }
      return ret;
    };

    return (
      ghList.map((item, index) => {
        const amount = item.addValue;
        let amountClass = 'list-amount';

        if (+amount >= 0) {
          amountClass += ' positivenum';
        }
        return (
          <div className="list-box" key={index}>
            <span className={amountClass}>
              <i className="symbol"></i>
              {Math.abs(amount)}
            </span>
            <p className="list-title">{getGrowthTypeText(item.grownType)}</p>
            <div className="list-detail">
              <span className="list-detail-item">{dateUtility.format(new Date(item.serverUpdateTime), 'yyyy/MM/dd')}</span>
              <span className="list-detail-item list-detail-name ellipsis">{item.commercialName}</span>
            </div>
          </div>
        );
      })
    );
  },
  buildDescriptContentElement() {
    const { levelInfo } = this.props.growupInfo;
    const { levelList, grownCfgMap, nowLevelName } = levelInfo || {};
    if (!levelList || !levelList.length) {
      return false;
    }

    return (
      <ul className="masthead-discription-content" onTouchTap={this.toggleDescriptContent}>
        {
          levelList.map((item, index) => {
            const grownCfg = grownCfgMap[item.id];
            if (!grownCfg || item.name !== nowLevelName) {
              return false;
            }

            const text = `每消费${grownCfg.grownConsumeValue}元可获得${grownCfg.grownConsumeGainValue}个成长值`;
            return (<li key={index} style={{ textAlign: 'center' }}>{text}</li>);
          })
        }
      </ul>
    );
  },
  render() {
    const { growupInfo } = this.props;
    return (
      <div className="accumulation">
        <div className="masthead">
          <a className="masthead-discription-title" onTouchTap={this.toggleDescriptContent}>成长值说明</a>
          <p className="masthead-total">{growupInfo.grownValue}</p>
          <p className="masthead-title">我的成长值</p>
        </div>
        <div className="detail">
          <div className="detail-title">我的成长记录</div>
          <div className="section records">
            {this.buildListElement()}
          </div>
        </div>
        <div className="footer copyright"></div>
        {this.state.descriptionContentVisible &&
          <Dialog
            title="成长值说明"
            theme="sliver"
            onClose={this.toggleDescriptContent}
          >
            {this.buildDescriptContentElement()}
          </Dialog>
        }
      </div>
    );
  },
});
module.exports = connect(state => state, mineGrowupAction)(MineGrowupApplication);

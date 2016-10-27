require('../../asset/style/style.scss');
require('../../component/mine/income-expenses-list.scss');
require('../mine-accumulation/application.scss');
require('./application.scss');

const React = require('react');
const ReactCSSTransitionGroup = require('react-addons-css-transition-group');
const connect = require('react-redux').connect;
const dateUtility = require('../../helper/common-helper.js').dateUtility;
const mineGrowupAction = require('../../action/mine/mine-growup.js');

const MineGrowupApplication = React.createClass({
  displayName: 'MineGrowupApplication',
  propTypes: {
    growupInfo: React.PropTypes.object,
    fetchGrowupInfo: React.PropTypes.func,
  },
  getInitialState() {
    return {
      descriptionContentVisible: false,
    };
  },
  componentWillMount() {
    this.props.fetchGrowupInfo();
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

    /*
    var ghListul='';
			$.each(ghList,function(i,m){
				var addstr = '';
				var addValueStyle = '';
				if(m.addValue > 0) {
					addstr = '+'+m.addValue;
					addValueStyle = 'otext';
				} else {
					addstr = m.addValue;
					addValueStyle = 'btext';
				}
				if(m.addIntegral>=0){
					addstr="+"+m.addValue
				}
				var desc = '消费增加成长值';
				if(m.grownType == 2) {
					desc = '修改会员等级变动成长值';
				}
				ghListul+=
				'<li class="clearfix">'+
		        '    <div class="left">'+
		        '    	<h2>'+desc+'</h2>'+
		        '        <p>'+new Date(m.serverUpdateTime).format("yyyy-MM-dd")+' '+m.commercialName+'</p>'+
		        '    </div>'+
		        '    <h3 class="right '+addValueStyle+'">'+addstr+'</h3>'+
		        '</li>';
			});
    */
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
    const { levelRights, dishNames } = this.props.growupInfo;
    if (!levelRights) {
      return (
        <ul className="masthead-discription-content" onTouchTap={this.toggleDescriptContent}>
          <li>积分规则: </li>
          <li>积分抵现: </li>
        </ul>
      );
    }

    let rules = [];
    rules.push(`每消费${levelRights.consumeValue}元获得${levelRights.consumeGainValue}积分`);
    if (levelRights.isGainAll === 0) {
      rules.push('全部商品可积分');
    } else {
      rules.push(`无积分商品：${dishNames}`);
    }

    let cash = [];
    if (levelRights.isExchangeCash === 0) {
      cash.push(`每${levelRights.exchangeIntegralValue}个积分抵现${levelRights.exchangeCashValue}元`);
      if (levelRights.limitType === 1) {
        cash.push('积分使用无上限');
      } else if (levelRights.limitType === 2) {
        cash.push(`单次最多可抵用${levelRights.limitIntegral}个积分`);
      } else if (levelRights.limitType === 3) {
        cash.push(`单次最多可抵用订单金额的${levelRights.discount}`);
      }
    } else {
      cash.push('不可抵现');
    }

    /* 判断有木有积分规则或者积分抵现*/
    if (!levelRights.consumeValue || !levelRights.consumeGainValue) {
      rules = ['不积分'];
    }

    if (!levelRights.exchangeIntegralValue || !levelRights.exchangeCashValue) {
      cash = ['不抵现'];
    }

    return (
      <ul className="masthead-discription-content" onTouchTap={this.toggleDescriptContent}>
        <li>积分规则: {rules.join(' ')}</li>
        <li>积分抵现: {cash.join(' ')}</li>
      </ul>
    );
  },
  render() {
    const { growupInfo } = this.props;
    return (
      <div className="accumulation flex-columns">
        <div className="flex-rest">
          <div className="masthead">
            <ReactCSSTransitionGroup transitionName="slidedown" transitionEnterTimeout={600} transitionLeaveTimeout={600}>
              {this.state.descriptionContentVisible && this.buildDescriptContentElement()}
            </ReactCSSTransitionGroup>
            <a className="masthead-discription-title" onTouchTap={this.toggleDescriptContent}>成长说明</a>
            <p className="masthead-total">{growupInfo.grownValue}</p>
            <h3 className="masthead-title">我的成长值</h3>
          </div>
          <div className="detail">
            <div className="detail-title">我的成长记录</div>
            <div className="section">
              {this.buildListElement()}
            </div>
          </div>
        </div>
        <div className="footer flex-none">客如云提供技术支持</div>
      </div>
    );
  },
});
module.exports = connect(state => state, mineGrowupAction)(MineGrowupApplication);

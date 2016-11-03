const React = require('react');
const connect = require('react-redux').connect;
const queueDetailAction = require('../../action/queue-detail/queue-detail.js');
const dateUtility = require('../../helper/common-helper.js').dateUtility;

require('../../asset/style/style.scss');
require('../../component/order-detail/common.scss');
require('./application.scss');

const QueueDetailApplication = React.createClass({
  displayName: 'QueueDetailApplication',
  propTypes: {
    getQueueInfo: React.PropTypes.func,
    queueInfo: React.PropTypes.object,
  },

  componentWillMount() {
    this.props.getQueueInfo();
  },

  // 排队信息 queueStatus 0:排队中 1:入场 -1作废 -2取消
  getQueueDetail(queueInfo) {
    if (!queueInfo.queue) {
      return false;
    }

    let queueDetail = '';
    let queueStatusStyle = '';
    const queueStatus = String(queueInfo.queue.queueStatus);
    const queueUserInfo = (
      <div>
        <div className="divide-line"></div>
        <div className="queue-user">
          <span className="queue-user-name ellipsis">{queueInfo.queue.name}{this.getUserSex(queueInfo)}</span>
          <span className="queue-user-num ellipsis">{queueInfo.queue.repastPersonCount}人就餐</span>
          <span className="queue-user-phone ellipsis">{queueInfo.queue.mobile}</span>
        </div>
        <div className={`queue-status ${queueStatusStyle}`}></div>
      </div>
    );

    if (queueStatus === '1') {
      queueStatusStyle = 'queue-status-in';
      queueDetail = queueUserInfo;
    } else if (queueStatus === '-1') {
      queueStatusStyle = 'queue-status-timeOut';
      queueDetail = queueUserInfo;
    } else if (queueStatus === '-2') {
      queueStatusStyle = 'queue-status-cancel';
      queueDetail = queueUserInfo;
    } else if (queueStatus === '0') {
      queueDetail = (
        <div className="queue-detail">
          <div className="queue-waite">
            <p>在您之前还有
              <span className="queue-waite-num">{queueInfo.queue.repastPersonCount}</span>
              桌客人等候
              <a onToutchTap></a>
            </p>
            <p className="queue-waite-tip">听到叫号请到迎宾台，过号作废</p>
          </div>
          <div className="divide-line">
            <div className="divide-line-title divide-line-waite">您可以</div>
          </div>
          <div className="queue-operate">
            <a className="btn-queue-cancel">取消排队</a>
          </div>
        </div>
      );
    }

    return queueDetail;
  },

  // 餐桌类型
  getTableType(queueInfo) {
    let minNum = '';
    let maxNum = '';
    if (queueInfo.ql) {
      minNum = queueInfo.ql.minPersonCount;
      maxNum = queueInfo.ql.maxPersonCount;
      if (minNum === maxNum) {
        return minNum;
      }
    }
    return `${minNum}-${maxNum}`;
  },

  // 下单人性别
  getUserSex(queueInfo) {
    let userSexStr = '';
    if (queueInfo.queue) {
      const sex = String(queueInfo.queue.sex);
      if (sex === '0') {
        userSexStr = '女士';
      } else if (sex === '1') {
        userSexStr = '男士';
      }
    }

    return userSexStr;
  },

  render() {
    const { queueInfo } = this.props;

    return (
      <div className="queue-page bg-orange application">
        <div className="queue-content content-fillet">
          <div className="box-head">
            <img className="box-head-logo" src={queueInfo.shopLogo} role="presentation" />
            <div className="ellipsis box-head-title">{queueInfo.shopName}</div>
          </div>
          <div className="divide-line">
            <div className="divide-line-title divide-line-time">
              {queueInfo.queue && dateUtility.format(new Date(queueInfo.queue.localCreateDateTime), 'yyyy/MM/dd HH:mm:ss')}
            </div>
          </div>
          <div className="queue-info">
            <p className="queue-info-no">{queueInfo.ql && queueInfo.ql.queueChar}{queueInfo.queueNumber}</p>
            <p className="queue-info-table">{'未知'} {this.getTableType(queueInfo)}人</p>
          </div>
          {this.getQueueDetail(queueInfo)}
        </div>
      </div>
    );
  },

});

module.exports = connect(state => state, queueDetailAction)(QueueDetailApplication);

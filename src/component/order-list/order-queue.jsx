const React = require('react');
const ListHead = require('./list-head.jsx');

const OrderQueue = React.createClass({
  displayName: 'OrderQueue',
  propTypes: {
    queueList: React.PropTypes.object,
  },

  // 排队内容
  getQueueDetail() {
    const { queueList } = this.props;
    let queueDetail = {};
    let statusText = '';
    let queueSection = '';
    const statusStr = String(queueList.queueStatus);
    if (statusStr === '0') {
      statusText = '排队中';
      queueSection = (
        <div>
          <div className="list-content list-queue clearfix">
            <div className="list-num">
              <div className="list-num-no ellipsis">{queueList.queueNumber}</div>
              <div className="list-num-name">前面 <span className="text-orange">{queueList.waitCount}</span> 桌等待</div>
            </div>
            <div className="list-queue-detail">
              {queueList.createTime} 取号
            </div>
          </div>
          <div className="list-queue-tips">听到叫号请到迎宾台，过号作废</div>
        </div>
      );
    } else {
      queueSection = (
        <div className="list-queue-short clearfix">
          <div className="list-queue-left ellipsis">{queueList.queueNumber}</div>
          <div className="list-queue-detail list-queue-time">{queueList.createTime} 取号</div>
        </div>
      );

      if (statusStr === '1') {
        statusText = '已入场';
      } else if (statusStr === '-1') {
        statusText = '已作废';
      } else if (statusStr === '-2') {
        statusText = '已取消';
      }
    }

    queueDetail.status = statusText;
    queueDetail.queueSection = queueSection;

    return queueDetail;
  },

  handleLinkDetail() {
    const { queueList } = this.props;
    location.href = `http://${location.host}/queue/success?shopId=${queueList.shopId}&orderId=${queueList.orderId}`;
  },

  render() {
    const { queueList } = this.props;
    const bookHead = {
      status: this.getQueueDetail().status,
      shopLogo: queueList.shopLogo,
      shopName: queueList.shopName,
      shopId: queueList.shopId,
    };
    const isOrange = String(queueList.queueStatus) === '0' || false;

    return (
      <div className="order-list-group" onTouchTap={this.handleLinkDetail}>
        <ListHead headDetail={bookHead} isOrange={isOrange} orderType="QE" />
        {this.getQueueDetail().queueSection}
      </div>
    );
  },
});

module.exports = OrderQueue;

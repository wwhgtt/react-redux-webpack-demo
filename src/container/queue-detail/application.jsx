const React = require('react');
const connect = require('react-redux').connect;
const queueDetailAction = require('../../action/queue-detail/queue-detail.js');

require('../../asset/style/style.scss');
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

  render() {
    const { queueInfo } = this.props;
    return <div>{queueInfo.count}</div>;
  },

});

module.exports = connect(state => state, queueDetailAction)(QueueDetailApplication);

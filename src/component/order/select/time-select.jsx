const React = require('react');
const Immutable = require('seamless-immutable');

module.exports = React.createClass({
  displayName: 'TimeSelect',
  propTypes: {
    selectedDateTime: React.PropTypes.array.isRequired,
    timeTable: React.PropTypes.object.isRequired,
  },
  getInitialState() {
    const { selectedDateTime, timeTable } = this.props;
    return {
      dateTimes: this.buildState(selectedDateTime, timeTable),
    };
  },
  buildState(selectedDateTime, timeTable) {
    const dateTimes = [];
    for (let key in timeTable) {
      if (timeTable.hasOwnProperty(key)) {
        const times = timeTable[key].map(
          time => time === selectedDateTime.time ? { id:time, label:time, isChecked:true } : { id:time, label:time }
        );
        dateTimes.push({ id:key, label:key, times });
      }
    }
    return Immutable.from(dateTimes);
  },
  render() {
    return (
      <div className="time-selct-container">

      </div>
    );
  },
});

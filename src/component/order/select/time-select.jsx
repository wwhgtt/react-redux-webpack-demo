const React = require('react');
const Immutable = require('seamless-immutable');
const _find = require('lodash.find');
const _findIndex = require('lodash.findindex');
const ActiveScrollSelect = require('../../mui/select/active-scroll-select.jsx');
const DateTimeOption = require('../../mui/misc/dynamic-class-hoc.jsx')('a');

module.exports = React.createClass({
  displayName: 'TimeSelect',
  propTypes: {
    selectedDateTime: React.PropTypes.object.isRequired,
    timeTable: React.PropTypes.object.isRequired,
  },
  getInitialState() {
    const { selectedDateTime, timeTable } = this.props;
    return {
      dateTimes: this.buildState(selectedDateTime, timeTable),
    };
  },
  onDateSelect(evt, option) {
    const { dateTimes } = this.state;
    if (evt) {
      evt.stopPropagation();
    }
    this.setState({
      dateTimes: dateTimes.flatMap(
        dateTime => {
          if (dateTime.id === option.id) {
            return dateTime.set('isChecked', true).update(
              'times',
              times => times.flatMap(
                (time, idx) => idx === 0 ? time.set('isChecked', true) : time.set('isChecked', false)
              )
            );
          }
          return dateTime.set('isChecked', false);
        }
      ),
    });
  },
  onTimeSelect(evt, option) {
    const { dateTimes } = this.state;
    const selectedDateTimeIdx = _findIndex(dateTimes, { isChecked:true });
    if (evt) {
      evt.stopPropagation();
    }
    this.setState({
      dateTimes: dateTimes.updateIn(
        [selectedDateTimeIdx],
        dateTime => dateTime.update(
          'times',
          times => times.flatMap(
            time => time.id === option.id ? time.set('isChecked', true) : time.set('isChecked', false)
          )
        )
      ),
    });
  },
  onSubmit() {

  },
  onCancel() {

  },
  getTimeOfSelectedDate(dateTimes) {
    const selectedDate = _find(dateTimes, { isChecked:true });
    return selectedDate.times;
  },
  buildState(selectedDateTime, timeTable) {
    const dateTimes = [];
    let selectedMark = true;

    for (let key in timeTable) {
      if (timeTable.hasOwnProperty(key)) {
        const times = timeTable[key].map(
          (time, idx) => time === selectedDateTime.time || (idx === 0 && selectedMark && selectedDateTime.time === '') ?
            { id:time, label:time, isChecked:true } : { id:time, label:time }
        );
        const dateTime = key === selectedDateTime.time || (selectedMark && selectedDateTime.date === '') ?
          { id:key, label:key, times, isChecked: true } : { id:key, label:key, times };
        dateTimes.push(dateTime);
      }
      selectedMark = false;
    }
    return Immutable.from(dateTimes);
  },
  render() {
    const { dateTimes } = this.state;
    const timeOfSelectedDate = this.getTimeOfSelectedDate(dateTimes);
    return (
      <div className="scroll-select-container">
        <div className="scroll-select-content">
          <div className="scroll-select-header">
            <span>选择送达时间</span>
            <div className="scroll-select-confirm btn--yellow" onTouchTap={this.onSubmit}>确定</div>
          </div>
          <div className="flex-row">
            <ActiveScrollSelect
              className="flex-area-select"
              optionsData={dateTimes}
              optionComponent={DateTimeOption}
              onSelectOption={this.onDateSelect}
            />
            <ActiveScrollSelect
              className="flex-table-select"
              optionsData={timeOfSelectedDate}
              optionComponent={DateTimeOption}
              onSelectOption={this.onDateSelect}
            />
          </div>
        </div>
        <div className="scroll-select-close" onTouchTap={this.onCancel}></div>
      </div>
    );
  },
});

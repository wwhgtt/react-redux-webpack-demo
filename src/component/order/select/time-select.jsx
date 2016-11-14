const React = require('react');
const Immutable = require('seamless-immutable');
const _find = require('lodash.find');
const _findIndex = require('lodash.findindex');
const dateUtility = require('../../../helper/common-helper.js').dateUtility;
const ActiveScrollSelect = require('../../mui/select/active-scroll-select.jsx');
const DateTimeOption = require('../../mui/misc/dynamic-class-hoc.jsx')('a');

module.exports = React.createClass({
  displayName: 'TimeSelect',
  propTypes: {
    isSelfFetch: React.PropTypes.bool,
    title:React.PropTypes.string,
    selectedDateTime: React.PropTypes.object.isRequired,
    timeTable: React.PropTypes.object.isRequired,
    onDone: React.PropTypes.func.isRequired,
    onDateTimeSelect: React.PropTypes.func.isRequired,
  },
  getInitialState() {
    const { selectedDateTime, timeTable } = this.props;
    return {
      dateTimes: this.buildState(selectedDateTime, timeTable),
    };
  },
  componentDidMount() {
    // 强制获取焦点，解决 mobile safari 无法收起键盘的问题
    this.refs.picker.focus();
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
  onSubmit(evt) {
    const { onDateTimeSelect, onDone } = this.props;
    const { dateTimes } = this.state;
    onDateTimeSelect(null, {
      id: 'takeaway-time',
      dateTime: _find(dateTimes, { isChecked:true }),
    });

    evt.stopPropagation();
    evt.preventDefault();
    onDone(evt);
  },
  onCancel(evt) {
    const { onDone } = this.props;
    evt.stopPropagation();
    evt.preventDefault();
    onDone(evt);
  },
  getTimeOfSelectedDate(dateTimes) {
    const selectedDate = _find(dateTimes, { isChecked:true });
    return selectedDate.times;
  },
  buildState(selectedDateTime, timeTable) {
    const dateTimes = [];
    let selectedMark = true;
    const nowStr = dateUtility.format(new Date());
    for (const key in timeTable) {
      if (timeTable.hasOwnProperty(key)) {
        const isToday = nowStr === key;
        const times = timeTable[key].map((time, idx) => {
          const checked = time === selectedDateTime.time || (idx === 0 && selectedMark && selectedDateTime.time === '');
          let resetedTime = { id:time, label:time, isChecked: checked };
          if (isToday && !time) {
            resetedTime.label = `${this.props.isSelfFetch ? '立即取餐' : '尽快送达'}`;
          }
          return resetedTime;
        });

        const dateTime = key === selectedDateTime.date || (selectedMark && selectedDateTime.date === '') ?
          { id:key, label:key, times, isChecked: true } : { id:key, label:key, times };
        if (isToday) {
          dateTime.label = '今日';
        }
        dateTimes.push(dateTime);
      }
      selectedMark = false;
    }
    return Immutable.from(dateTimes);
  },
  render() {
    const { dateTimes } = this.state;
    const timeOfSelectedDate = this.getTimeOfSelectedDate(dateTimes);
    const setComponentTitle = () => {
      const { isSelfFetch, title } = this.props;
      if (title) { return title; }
      if (isSelfFetch) { return '取餐'; }
      return '送达';
    };
    return (
      <div className="scroll-select-container" tabIndex="-1" ref="picker">
        <div className="scroll-select-close" onTouchTap={this.onCancel}></div>
        <div className="scroll-select-content">
          <div className="scroll-select-header">
            <span>选择{setComponentTitle()}时间</span>
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
              onSelectOption={this.onTimeSelect}
            />
          </div>
        </div>
      </div>
    );
  },
});

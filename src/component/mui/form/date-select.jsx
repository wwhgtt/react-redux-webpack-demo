const React = require('react');
const ActiveScrollSelect = require('../select/active-scroll-select.jsx');
const DateTimeOption = require('../misc/dynamic-class-hoc.jsx')('a');

require('../../order/select/select-container.scss');
require('./date-select.scss');

const stringPadStr = (str, targetLength, padCh) => {
  const padLength = targetLength - str.length;
  if (padLength <= 0) {
    return str;
  }
  return new Array(padLength + 1).join(padCh) + str;
};
const formatDate = (date, formatStr) => {
  if (!date || !(date instanceof Date)) {
    return date;
  }
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  let result = formatStr.replace(/yyyy/, year.toString());
  result = result.replace(/(M+)/, (str, $1) => stringPadStr(month.toString(), $1.length, '0'));
  result = result.replace(/(d+)/, (str, $1) => stringPadStr(date.getDate().toString(), $1.length, '0'));
  return result;
};
const parseDateFromStr = dateStr => {
  if (!dateStr || typeof dateStr !== 'string') {
    return dateStr;
  }

  const time = Date.parse(dateStr.replace(/\D+/g, '-').replace(/\D+$/, ''));
  return isNaN(time) ? null : new Date(time);
};

module.exports = React.createClass({
  displayName: 'DateSelect',
  propTypes: {
    isAllowExceedNow: React.PropTypes.bool,
    format: React.PropTypes.string,
    startYear: React.PropTypes.number,
    endYear: React.PropTypes.number,
    date: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.date]),
    onCompleteDateSelect: React.PropTypes.func.isRequired,
    onCancelDateSelect: React.PropTypes.func,
  },
  getDefaultProps() {
    return {
      date: new Date(),
      format: 'yyyy-MM-dd',
      isAllowExceedNow: true,
    };
  },
  getInitialState() {
    return this.buildState();
  },
  componentDidMount() {
    // 强制获取焦点，解决 mobile safari 无法收起键盘的问题
    this.refs.picker.focus();
  },
  componentWillUnmount() {
    this._unmount = true;
  },
  onSelectChange(evt, option, type) {
    if (evt) {
      evt.stopPropagation();
    }

    const key = `${type}s`;
    const { currentDate, dates, months } = this.state;
    const state = {};
    const newCurrentDate = new Date(+currentDate);

    newCurrentDate.setDate(1);
    state[key] = this.state[key].map(item => {
      const _item = item;
      _item.isChecked = item.id === option.id;
      return _item;
    });
    switch (type) {
      case 'year':
        newCurrentDate.setFullYear(option.id);
        break;
      case 'month':
        newCurrentDate.setMonth(option.id - 1);
        break;
      case 'date':
        newCurrentDate.setDate(option.id);
        break;
      default:break;
    }

    if (type !== 'date') {
      const date = currentDate.getDate();
      const year = newCurrentDate.getFullYear();
      const maxMonth = this.getMaxRangeMonth(year);
      const month = Math.min(newCurrentDate.getMonth() + 1, maxMonth);
      newCurrentDate.setMonth(month - 1);

      const maxDate = this.getMaxRangeDate(year, month);
      newCurrentDate.setDate(Math.min(date, maxDate));
      if (maxMonth !== months.length) {
        state.months = this.getMonthList(year, newCurrentDate.getMonth() + 1);
      }
      if (maxDate !== dates.length) {
        state.dates = this.getDateList(year, month, newCurrentDate.getDate());
      }
    }
    state.currentDate = newCurrentDate;
    if (!this._unmount) {
      this.setState(state);
    }
  },
  onCompleteDateSelect(evt) {
    const { onCompleteDateSelect, format } = this.props;
    const { currentDate } = this.state;
    onCompleteDateSelect({
      text: formatDate(currentDate, format),
      value: currentDate,
    });
    evt.stopPropagation();
    evt.preventDefault();
  },
  onCancelDateSelect(evt) {
    const { onCancelDateSelect } = this.props;
    if (onCancelDateSelect) {
      onCancelDateSelect();
    }
    evt.stopPropagation();
    evt.preventDefault();
  },
  getMonthLastDate(year, month) {
    return new Date(year, month, 0).getDate();
  },
  getDateList(year, month, date) {
    const list = [];
    const maxRange = this.getMaxRangeDate(year, month);
    for (let i = 1; i <= maxRange; i++) {
      list.push({
        label: stringPadStr(i.toString(), 2, '0'),
        id: i,
        isChecked: i === date,
      });
    }
    return list;
  },
  getMonthList(year, month) {
    const list = [];
    const maxRange = this.getMaxRangeMonth(year);
    for (let i = 1; i <= maxRange; i++) {
      list.push({
        label: stringPadStr(i.toString(), 2, '0'),
        id: i,
        isChecked: i === month,
      });
    }
    return list;
  },
  getMaxRangeMonth(year) {
    const result = 12;
    const { isAllowExceedNow } = this.props;
    if (isAllowExceedNow) {
      return result;
    }

    const now = new Date();
    const currentYear = now.getFullYear();
    if (year < currentYear) {
      return result;
    } else if (year > currentYear) {
      return 0;
    }
    return now.getMonth() + 1;
  },
  getMaxRangeDate(year, month) {
    const result = this.getMonthLastDate(year, month);
    const { isAllowExceedNow } = this.props;
    if (isAllowExceedNow) {
      return result;
    }

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    if (year < currentYear) {
      return result;
    } else if (year > currentYear) {
      return result;
    }
    return month < currentMonth ? result : now.getDate();
  },
  buildState() {
    const state = {
      years: [],
      months: [],
    };
    const { startYear, endYear, date } = this.props;
    let defaultDate = date;
    if (typeof date === 'string') {
      defaultDate = parseDateFromStr(date) || new Date();
    }
    const currentYear = defaultDate.getFullYear();
    const currentMonth = defaultDate.getMonth() + 1;
    state.currentDate = defaultDate;
    for (let i = startYear; i <= endYear; i++) {
      state.years.push({
        label: i,
        id: i,
        isChecked: i === currentYear,
      });
    }
    state.months = this.getMonthList(currentYear, currentMonth);
    state.dates = this.getDateList(currentYear, currentMonth, defaultDate.getDate());
    return state;
  },
  render() {
    const { years, months, dates } = this.state;
    return (
      <div className="scroll-select-container" tabIndex="-1" ref="picker">
        <div className="scroll-select-close" onTouchTap={this.onCancelDateSelect}></div>
        <div className="scroll-select-content">
          <div className="scroll-select-header date-select-header">
            <p>选择日期</p>
            <button className="date-select-confirm btn--yellow" onTouchTap={this.onCompleteDateSelect}>确定</button>
          </div>
          <div className="flex-row">
            <ActiveScrollSelect
              className="flex-table-select"
              optionsData={years}
              optionComponent={DateTimeOption}
              onSelectOption={(evt, option) => this.onSelectChange(evt, option, 'year')}
            />
            <ActiveScrollSelect
              className="flex-area-select"
              optionsData={months}
              optionComponent={DateTimeOption}
              onSelectOption={(evt, option) => this.onSelectChange(evt, option, 'month')}
            />
            <ActiveScrollSelect
              className="flex-area-select"
              optionsData={dates}
              optionComponent={DateTimeOption}
              onSelectOption={(evt, option) => this.onSelectChange(evt, option, 'date')}
            />
          </div>
        </div>
      </div>
    );
  },
});

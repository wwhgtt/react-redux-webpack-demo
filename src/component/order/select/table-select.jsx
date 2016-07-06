const React = require('react');
const _find = require('lodash.find');
const _findIndex = require('lodash.findindex');
const ActiveScrollSelect = require('../../mui/select/active-scroll-select.jsx');
const AreaOption = require('./area-option.jsx');
const TableOption = require('./table-option.jsx');

require('./select-container.scss');

module.exports = React.createClass({
  displayName: 'TableSelect',
  propTypes: {
    areas: React.PropTypes.array.isRequired,
    tables: React.PropTypes.array.isRequired,
    onDone: React.PropTypes.func.isRequired,
    onTableSelect: React.PropTypes.func.isRequired,
  },
  getInitialState() {
    let { areas, tables } = this.props;
    // if no area/table selected, we need to select the 1st area and 1st table of it.
    if (_findIndex(areas, { isChecked:true }) === -1) {
      const areaId = areas[0].id;
      const tableIdx = _findIndex(tables, { areaId });
      areas = areas.update(0, area => area.set('isChecked', true));
      tables = tables.update(tableIdx, table => table.set('isChecked', true));
    }

    return {
      areas,
      tables,
    };
  },
  onAreaSelect(evt, area) {
    const { areas, tables } = this.state;
    let tableMark = true;
    this.setState({
      areas: areas.flatMap(
        eachArea => eachArea.id === area.id ? eachArea.set('isChecked', true) : eachArea.set('isChecked', false)
      ),
      tables: tables.flatMap(
        eachTable => {
          if (tableMark && eachTable.areaId === area.id) {
            tableMark = false;
            return eachTable.set('isChecked', true);
          }
          return eachTable.set('isChecked', false);
        }
      ),
    });
    if (evt) {
      evt.stopPropagation();
    }
  },
  onTableSelect(evt, table) {
    const { tables } = this.state;
    this.setState({
      tables: tables.flatMap(
        eachTable => eachTable.id === table.id ? eachTable.set('isChecked', true) : eachTable.set('isChecked', false)
      ),
    });
    if (evt) {
      evt.stopPropagation();
    }
  },
  onSubmit(evt) {
    const { onTableSelect, onDone } = this.props;
    const { areas, tables } = this.state;
    onTableSelect(null, {
      id: 'table',
      area: _find(areas, { isChecked:true }),
      table: _find(tables, { isChecked:true }),
    });
    evt.stopPropagation();
    evt.preventDefault();
    onDone();
  },
  onCancel(evt) {
    const { onDone } = this.props;
    evt.stopPropagation();
    evt.preventDefault();
    onDone();
  },
  getTablesOfSelectedArea(areas, tables) {
    const selectedArea = _find(areas, { isChecked:true });
    return tables.filter(table => table.areaId === selectedArea.id);
  },
  render() {
    const { areas, tables } = this.state;
    const tablesOfArea = this.getTablesOfSelectedArea(areas, tables);
    return (
      <div className="scroll-select-container">
        <div className="scroll-select-content">
          <div className="scroll-select-header">
            <span>选择桌台</span>
            <div className="scroll-select-confirm btn--yellow" onTouchTap={this.onSubmit}>确定</div>
          </div>
          <div className="flex-row">
            <ActiveScrollSelect
              className="flex-area-select"
              optionsData={areas}
              optionComponent={AreaOption}
              onSelectOption={this.onAreaSelect}
            />
            <ActiveScrollSelect
              className="flex-table-select"
              optionsData={tablesOfArea}
              optionComponent={TableOption}
              onSelectOption={this.onTableSelect}
            />
          </div>
        </div>
        <div className="scroll-select-close" onTouchTap={this.onCancel}></div>
      </div>
    );
  },
});

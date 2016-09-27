const React = require('react');
const TableSelect = require('./select/table-select.jsx');

require('./dinner-cart-table-select.scss');

module.exports = React.createClass({
  displayName: 'DinnerCartTableSelect',
  propTypes: Object.assign({}, TableSelect.propTypes),
  getInitialState() {
    return { area: {}, table: {} };
  },
  componentDidMount() {
  },
  onCancel() {
    const { onDone } = this.props;
    if (onDone) {
      onDone();
    }
  },
  onConfirm(evt) {
    const { onTableSelect } = this.props;
    const { table, area } = this.state;
    if (onTableSelect) {
      onTableSelect(evt, { table, area });
    }
  },
  onTableSelectedChange(selectedData) {
    const { area, table } = selectedData;
    this.setState({
      area: { id: area.areaId, name: area.areaName },
      table: { id: table.tableID, name: table.tableName },
    });
  },
  render() {
    const { area, table } = this.state;
    return (
      <div className="dinner-cart-table-select">
        <div className="dialog">
          <div className="flex-columns dialog-content">
            <h3 className="flex-none dialog-header">确认桌台</h3>
            <div className="flex-rest dialog-body">
              <p className="table-title">
                {`${area.name || ''} ${table.name || ''}`}
              </p>
            </div>
            <div className="flex-none dialog-footer">
              <div className="flex-row">
                <button className="flex-rest" onTouchTap={this.onCancel}>取消</button>
                <button className="flex-rest btn-confirm" onTouchTap={this.onConfirm}>下单</button>
              </div>
            </div>
          </div>
        </div>
        <TableSelect {...this.props} onSelectedChange={this.onTableSelectedChange} />
      </div>
    );
  },
});

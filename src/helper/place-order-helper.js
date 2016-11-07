exports.initializeTableProps = function (tableProps) {
  if (!tableProps || !tableProps.length) {
    return { areas:null, tables:null };
  }
  // (还有${table.count}张)
  let tables = [];
  tableProps.forEach(tableProp => tableProp.id = tableProp.areaId);
  tableProps.map(
    tableProp => tableProp.tableInfoList.forEach(
      table => {
        table.areaId = parseInt(tableProp.areaId, 10);
        table.tableName = `${table.pNum}人桌(余下${table.count}桌)`;
        table.id = tableProp.areaId + Math.random();
        tables.push(table);
      }
    )
  );
  return { areas:tableProps, tables };
};

const tableInfoLocalStorageKey = 'lastTableInfo';

exports.clearTableInfoInSessionStorage = () => {
  sessionStorage.removeItem(tableInfoLocalStorageKey);
};

exports.setTableInfoInSessionStorage = (shopId, tableInfo) => {
  const tableInfoWrap = {
    shopId,
    tableInfo,
  };
  sessionStorage.setItem(tableInfoLocalStorageKey, JSON.stringify(tableInfoWrap));
};

exports.getTableInfoInSessionStorage = shopId => {
  const json = sessionStorage.getItem(tableInfoLocalStorageKey);
  if (!json) {
    return null;
  }

  const tableInfoWrap = JSON.parse(json) || {};
  return tableInfoWrap.shopId === shopId ? tableInfoWrap.tableInfo : null;
};

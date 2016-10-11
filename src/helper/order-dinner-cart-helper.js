const tableInfoLocalStorageKey = 'lastTableInfo';

const clearTableInfoInSessionStorage = exports.clearTableInfoInSessionStorage = () => {
  sessionStorage.removeItem(tableInfoLocalStorageKey);
};

exports.setTableInfoInSessionStorage = (shopId, tableInfo) => {
  const tableInfoWrap = {
    shopId,
    expires: Date.now() + 1 * 60 * 60 * 1000,
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
  if (tableInfoWrap.shopId === shopId && tableInfoWrap.expires > Date.now()) {
    return tableInfoWrap.tableInfo;
  }

  clearTableInfoInSessionStorage();
  return null;
};

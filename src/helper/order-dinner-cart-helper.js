const tableInfoLocalStorageKey = 'lastTableInfo';

const clearTableInfoInLocalStorage = exports.clearTableInfoLocalStorage = () => {
  localStorage.removeItem(tableInfoLocalStorageKey);
};

exports.setTableInfoInLocalStorage = (shopId, tableInfo) => {
  const tableInfoWrap = {
    shopId,
    expires: Date.now() + 1 * 60 * 60 * 1000,
    tableInfo,
  };
  localStorage.setItem(tableInfoLocalStorageKey, JSON.stringify(tableInfoWrap));
};

exports.getTableInfoInLocalStorage = shopId => {
  const json = localStorage.getItem(tableInfoLocalStorageKey);
  if (!json) {
    return null;
  }

  const tableInfoWrap = JSON.parse(json) || {};
  if (tableInfoWrap.shopId === shopId && tableInfoWrap.expires > Date.now()) {
    return tableInfoWrap.tableInfo;
  }

  clearTableInfoInLocalStorage();
  return null;
};

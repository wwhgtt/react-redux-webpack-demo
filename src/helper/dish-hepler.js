exports.isSingleDishWithoutProps = function (dishData) {
  if (dishData.type === 0 && dishData.dishPropertyTypeInfos.length === 0) {
    return true;
  }
  return false;
};

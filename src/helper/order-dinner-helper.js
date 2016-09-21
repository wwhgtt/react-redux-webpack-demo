const isGroupDish = exports.isGroupDish = (dish) => dish.type === 1;

const isSingleDishWithoutProps = exports.isSingleDishWithoutProps = (dish) => {
  if (isGroupDish(dish)) {
    return false;
  }
  const propTypeInfo = dish.propertyTypeList || [];
  const ingredientInfos = dish.dishIngredientInfos || [];
  return !ingredientInfos.length && (!propTypeInfo.length || propTypeInfo.every(prop => prop.type === 4));
};

exports.initializeDishes = (dishes) => {
  dishes.map(dish => {
    if (isSingleDishWithoutProps(dish)) {
      dish.order = dish.num;
    } else if (isGroupDish(dish)) {
      dish.order = [{ count:dish.num, groups:[] }];
      dish.groups = [];
      dish.subDishItems.map(item => {
        item.id = item.groupId;
        item.childInfos = [];
        if (item.propertyTypeList.length) {
          item.propertyTypeList.map(property => property.properties.forEach(option => option.isChecked = true));
        }
        if (item.dishIngredientInfos.length) {
          item.dishIngredientInfos.map(ingredient => ingredient.isChecked = true);
        }
        let childInfo = {
          id:item.itemId,
          name:item.name,
          marketPrice:item.marketPrice,
          isChildDish:true,
          dishIngredientInfos:item.dishIngredientInfos,
          dishPropertyTypeInfos:item.propertyTypeList,
          order:[{
            count:item.num,
            dishIngredientInfos:item.dishIngredientInfos,
            dishPropertyTypeInfos:item.propertyTypeList,
          }],
        };
        item.childInfos.push(childInfo);
        return dish.order[0].groups.push(item);
      });
    } else {
      dish.dishIngredientInfos.forEach(ingredient => ingredient.isChecked = true);
      dish.propertyTypeList.map(property => property.properties.forEach(option => option.isChecked = true));
      dish.order = [{
        count:dish.num,
        dishIngredientInfos:dish.dishIngredientInfos,
        dishPropertyTypeInfos:dish.propertyTypeList,
      }];
    }
    return dish;
  });
  return dishes;
};

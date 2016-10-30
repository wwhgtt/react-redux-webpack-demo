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
      let subDishItems = dish.subDishItems || [];
      subDishItems.map(item => {
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
          order:isSingleDishWithoutProps(item) ? item.num / dish.num : [{
            count:item.num / dish.num,
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
      dish.dishPropertyTypeInfos = dish.propertyTypeList;
    }
    return dish;
  });
  localStorage.setItem('lastOrderedDishes', JSON.stringify({ dishes }));
  return dishes;
};
exports.reconstructDishes = (dishes) => {
  for (let i in dishes) {
    if (dishes[i].isDelete) {
      // console.log(123);
    } else {
      dishes[i].isDelete = false;
    }
    dishes[i].isRepeted = true;
    const withSameIdDishes = dishes.filter(dish => !dish.isRepeted).filter(dish => dish.id === dishes[i].id);
    if (withSameIdDishes && withSameIdDishes.length) {
      for (let j = 0; j < withSameIdDishes.length; j++) {
        if (dishes[i].order instanceof Array) {
          dishes[i].order.push(withSameIdDishes[j].order[0]);
        } else {
          // 2016-10-29 15:28:18 对应bug#22044
          const order = withSameIdDishes[j].order;
          const count = Array.isArray(order) && order.length ? order[0].count : order;
          dishes[i].order += count;
        }
        for (let k in dishes) {
          if (withSameIdDishes[j].id === dishes[k].id && k > i) {
            dishes[k].isDelete = true;
          }
        }
      }
    }
  }
  return dishes.filter(dish => !dish.isDelete);
};

const isGroupDish = exports.isGroupDish = (dish) => dish.type === 1;

const isSingleDishWithoutProps = exports.isSingleDishWithoutProps = (dish) => {
  if (isGroupDish(dish)) {
    return false;
  }
  const propTypeInfo = dish.propertyTypeList || [];
  const ingredientInfos = dish.dishIngredientInfos || [];
  return !ingredientInfos.length && (!propTypeInfo.length || (propTypeInfo.every(prop => prop.type === 4 && !dish.hasRuleDish)));
};

exports.initializeDishes = (dishes) => {
  dishes.map(dish => {
    if (isSingleDishWithoutProps(dish)) {
      dish.order = dish.num;
      dish.dishPropertyTypeInfos = dish.propertyTypeList;
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
        withSameIdDishes.forEach(dish => { dish.isRepeted = true; dish.isDelete = true; });
        if (dishes[i].order instanceof Array && withSameIdDishes[j].order instanceof Array) {
          dishes[i].order.push(withSameIdDishes[j].order[0]);
        } else {
          const order = withSameIdDishes[j].order;
          if (Array.isArray(dishes[i].order) && dishes[i].order.length) {
            // dish[i].order  是数组  那么withSameIdDishes[j].order 就肯定不是数组了
            const count = withSameIdDishes[j].order;
            withSameIdDishes[j].order = [{
              count,
              dishIngredientInfos:[],
              dishPropertyTypeInfos:[],
            }];
            dishes[i].order.push(withSameIdDishes[j].order[0]);
          } else if (Array.isArray(order) && order.length) {
            // 应该被删除的菜品是复杂菜品  将同id菜品也变为复杂菜品
            const count = dishes[i].order;
            dishes[i].dishIngredientInfos = withSameIdDishes[j].dishIngredientInfos;
            dishes[i].dishPropertyTypeInfos = withSameIdDishes[j].dishPropertyTypeInfos;
            dishes[i].order = [{
              count,
              dishIngredientInfos:[],
              dishPropertyTypeInfos:[],
            }];
            dishes[i].order.push(withSameIdDishes[j].order[0]);
          } else {
            // 两者皆不是复杂菜品
            dishes[i].order += order;
          }
        }
      }
    }
  }
  return dishes.filter(dish => !dish.isDelete);
};

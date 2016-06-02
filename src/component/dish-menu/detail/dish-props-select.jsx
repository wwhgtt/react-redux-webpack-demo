const React = require('react');
const ActiveSelect = require('../../mui/select/active-select.jsx');
const DishPropsOption = require('./dish-props-option.jsx');

require('./dish-props-select.scss');

module.exports = React.createClass({
  displayName: 'DishPropsSelect',
  propTypes: {
    propsData: React.PropTypes.array,
    ingredientsData: React.PropTypes.array,
    onSelectPropsOption: React.PropTypes.func,
  },
  onSelectPropsOption(recipeData, optionData) {
    this.props.onSelectPropsOption(recipeData, optionData);
  },
  buildRecipe(propsData) {
    const recipesData = propsData.filter((propData => propData.type === 1));
    return recipesData.map(recipeData => (
      <div className="recipe-group" key={recipeData.id}>
        <span className="recipe-title">{recipeData.name}</span>
        <ActiveSelect
          optionsData={recipeData.properties} optionComponent={DishPropsOption}
          onSelectOption={(evt, optionData) => this.onSelectPropsOption(recipeData, optionData)}
        />
      </div>
    ));
  },
  buildNote(propsData) {
    const notesData = propsData.filter((propData => propData.type === 3));
    return notesData.map(noteData => (
      <div className="note-group" key={noteData.id}>
        <span className="note-title">{noteData.name}</span>
        <ActiveSelect
          optionsData={noteData.properties} optionComponent={DishPropsOption}
          onSelectOption={(evt, optionData) => this.onSelectPropsOption(noteData, optionData)}
        />
      </div>
    ));
  },
  buildIngredient(ingredientsData) {
    const wrappedIngredientsData = [{ name:'配料', type: -1, properties:ingredientsData }];
    return wrappedIngredientsData.map(wrappedIngredientData => (
      <div className="ingredient-group" key={'ingredient'}>
        <span className="ingredient-title">{wrappedIngredientData.name}</span>
        <ActiveSelect
          optionsData={wrappedIngredientData.properties} optionComponent={DishPropsOption}
          onSelectOption={(evt, optionData) => this.onSelectPropsOption(wrappedIngredientData, optionData)}
        />
      </div>
    ));
  },
  render() {
    const { propsData, ingredientsData } = this.props;
    const recipeElement = this.buildRecipe(propsData);
    const noteElement = this.buildNote(propsData);
    const buildIngredientElement = this.buildIngredient(ingredientsData);
    return (
      <div className="dish-props-select">
        {recipeElement}
        {noteElement}
        {buildIngredientElement}
      </div>
    );
  },
});

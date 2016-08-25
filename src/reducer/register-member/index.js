import Immutable from 'seamless-immutable';

const defaultState = Immutable.from({
  
});

module.exports = (state = defaultState, action) => {
	const {type, payload} = action;
	
	return state;
}
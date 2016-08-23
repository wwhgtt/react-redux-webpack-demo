import Immutable from 'seamless-immutable';

const defaultState = Immutable.from({
  childView: '',
  phoneInfo: {}
});

module.exports = (state = defaultState, action) => {
	const {type, payload} = action;
	switch (type) {
		case 'SET_CHILDVIEW':
			return state.set('childView', payload || '');
		case 'SET_PHONE':
			return state.set('phoneInfo', payload);
		default:
			return state;
	}
	return state;
}
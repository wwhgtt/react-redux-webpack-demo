import Immutable from 'seamless-immutable';

const defaultState = Immutable.from({
  childView: '',
});

module.exports = (state = defaultState, action) => {
	const {type, payload} = action;
	switch (type) {
		case 'SET_CHILDVIEW':
			return state.set('childView', payload || '');
	}
	return state;
}
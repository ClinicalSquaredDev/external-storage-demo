import producer from 'immer';
import { RESET_MESSAGE, SET_MESSAGE } from '../actions/userMessage.actions';

const initialState = {
  success: false,
  message: null
}

const reducer = (state = initialState, action) => {
  return producer(state, draft => {
    switch (action.type) {
      case RESET_MESSAGE:
        draft.success = false
        draft.message = null
        break
      case SET_MESSAGE:
        draft.success = action.success
        draft.message = action.message
        break
      default:
        break
    }
  })
}

export default reducer
import producer from 'immer'
import { GET_USERS_SUCCESS, GET_USERS_FAILURE } from '../actions/users.actions'

const initialState = {
  users: [],
  error: null
}

const reducer = (state = initialState, action) => {
  return producer(state, draft => {
    switch (action.type) {
      case GET_USERS_SUCCESS:
        draft.users = action.payload
        break
      case GET_USERS_FAILURE:
        draft.error = action.error
        break
      default:
        break
    }
  })
}

export default reducer
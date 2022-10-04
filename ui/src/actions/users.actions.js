export const GET_USERS_REQUEST = 'GET_USERS_REQUEST'
export const GET_USERS_SUCCESS = 'GET_USERS_SUCCESS'
export const GET_USERS_FAILURE = 'GET_USERS_FAILURE'

export const getUsers = () => {
  return {
    type: GET_USERS_REQUEST
  }
}

export const getUsersSuccess = (payload) => {
  return {
    type: GET_USERS_SUCCESS,
    payload
  }
}

export const getUsersFailure = (error) => {
  return {
    type: GET_USERS_FAILURE,
    error
  }
}

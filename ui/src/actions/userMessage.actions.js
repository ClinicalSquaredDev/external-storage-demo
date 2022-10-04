export const RESET_MESSAGE = 'RESET_MESSAGE';
export const SET_MESSAGE = 'SET_MESSAGE';

export const resetUserMessage = () => {
  return {
    type: RESET_MESSAGE
  }
};

export const setUserMessage = (message, success = false) => {
  return {
    type: SET_MESSAGE,
    message,
    success
  }
};

export const OPEN_SHARE_MODAL = "OPEN_SHARE_MODAL";
export const CLOSE_SHARE_MODAL = "CLOSE_SHARE_MODAL";
export const SHARE_REQUEST = "SHARE_REQUEST";
export const SHARE_SUCCESS = "SHARE_SUCCESS";
export const SHARE_FAILURE = "SHARE_FAILURE";

export const REMOVE_REQUEST = "REMOVE_REQUEST";
export const REMOVE_SUCCESS = "REMOVE_SUCCESS";
export const REMOVE_FAILURE = "REMOVE_FAILURE";

export const openShareModal = function(fileKey) {
  return {
    type: OPEN_SHARE_MODAL,
    fileKey
  };
};

export const closeShareModal = function() {
  return {
    type: CLOSE_SHARE_MODAL
  };
};

export const shareRequest = function(fileKey, member) {
  return {
    type: SHARE_REQUEST,
    fileKey,
    member
  };
};

export const shareSuccess = function(success) {
  return {
    type: SHARE_SUCCESS,
    success
  };
};

export const shareFailure = function(error) {
  return {
    type: SHARE_FAILURE,
    error
  };
};

export const removeRequest = function(fileKey, member) {
  return {
    type: REMOVE_REQUEST,
    fileKey,
    member
  };
};

export const removeSuccess = function(success) {
  return {
    type: REMOVE_SUCCESS,
    success
  };
};

export const removeFailure = function(error) {
  return {
    type: REMOVE_FAILURE,
    error
  };
};

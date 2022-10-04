export const OPEN_TRANSFER_OWNER_MODAL = 'OPEN_TRANSFER_OWNER_MODAL'
export const CLOSE_TRANSFER_OWNER_MODAL = 'CLOSE_TRANSFER_OWNER_MODAL'
export const TRANSFER_OWNER_REQUEST = 'TRANSFER_OWNER_REQUEST'
export const TRANSFER_OWNER_SUCCESS = 'TRANSFER_OWNER_SUCCESS'
export const TRANSFER_OWNER_FAILURE = 'TRANSFER_OWNER_FAILURE'

export const openTransferOwnerModal = function (fileKey) {
  return {
    type: OPEN_TRANSFER_OWNER_MODAL,
    fileKey
  }
}

export const closeTransferOwnerModal = function () {
  return {
    type: CLOSE_TRANSFER_OWNER_MODAL,
  }
}

export const transferOwnerRequest = function (fileKey, member) {
  return {
    type: TRANSFER_OWNER_REQUEST,
    fileKey,
    member
  }
}

export const transferOwnerSuccess = function (success) {
  return {
    type: TRANSFER_OWNER_SUCCESS,
    url: success
  }
}

export const transferOwnerFailure = function (error) {
  return {
    type: TRANSFER_OWNER_FAILURE,
    error
  }
}
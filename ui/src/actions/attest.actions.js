
export const OPEN_ATTEST_MODAL = 'OPEN_ATTEST_MODAL'
export const CLOSE_ATTEST_MODAL = 'CLOSE_ATTEST_MODAL'
export const ATTEST_REQUEST = 'ATTEST_REQUEST'
export const ATTEST_SUCCESS = 'ATTEST_SUCCESS'
export const ATTEST_FAILURE = 'ATTEST_FAILURE'

export const openAttestModal = (fileKey, selectedVersion) => {
  return {
    type: OPEN_ATTEST_MODAL,
    fileKey,
    selectedVersion
  }
}

export const closeAttestModal = () => {
  return {
    type: CLOSE_ATTEST_MODAL
  }
}

export const attestRequest = (fileKey, version, file) => {
  return {
    type: ATTEST_REQUEST,
    fileKey,
    version,
    file
  }
}

export const attestSuccess = (file) => {
  return {
    type: ATTEST_SUCCESS,
    file
  }
}

export const attestFailure = (error) => {
  return {
    type: ATTEST_FAILURE,
    error
  }
}

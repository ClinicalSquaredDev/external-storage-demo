export const apiUrl = process.env.REACT_APP_URL
  ? process.env.REACT_APP_URL + "/api/v1"
  : "/api/v1";

export const HTTP_METHODS = {
  GET: "GET",
  POST: "POST",
  DELETE: "DELETE"
};

export const PAGINATION = {
  LIMIT: 8,
  OFFSET: 0 
}

export const ROUTES = {
  BASE: '/',
  FILES: '/files',
  FILE_META: '/files/:id'
}
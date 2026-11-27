/**
 * Turns an axios error into a message for the user. The backend error body
 * looks like { status, message, validationErrors }.
 */
export const getErrorMessage = (error, fallback = 'Something went wrong, please try again') => {
  if (!error?.response) {
    // no response at all means the backend could not be reached
    return error?.request ? 'Cannot reach the server, please check that the backend is running' : fallback;
  }
  const data = error.response.data || {};
  if (data.validationErrors) {
    return Object.values(data.validationErrors).join(', ');
  }
  return data.message || fallback;
};

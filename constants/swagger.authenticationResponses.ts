const authenticationResponses = {
  401: {
    description: "User is not authenticated",
  },
  403: {
    description: "User cannot perform action",
  },
};

Object.freeze(authenticationResponses);

export default authenticationResponses;

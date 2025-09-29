module.exports = {
  // cors
  CORS: {
    INVALID: 'Not allowed by CORS!',
  },

  // database configuration messages
  DATABASE: {
    CONN: {
      SUCCESS: 'Connection has been established successfully.',
      FAILED: (error) => `Unable to connect to the database: ${error}`,
    },
  },

  // response payload messages
  RESPONSE: {
    USER: {
      EXISTS: 'This email is already registered',
      INVALID_CRED: 'Invalid login credentials',
    },
  },

  // field validation messages
  VALIDATE: {
    PARAM: {
      EMPTY: (field) => `The '${field}' field is required.`,
      INVALID: (field) => `Invalid format for '${field}'.`,
    },
  },

  // dao layer messages
  DAO: {
    FAILED: {
      INSERT: (entity, error) => `Failed to create ${entity}: ${error.message}`,
      GET: {
        BY_EMAIL: (entity, error) => `Failed to retrieve ${entity} by email: ${error.message}`,
      },
    },
  },
};

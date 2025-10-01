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
    SEED: {
      SUCCESS: (entity) => `${entity} has been seeded successfully.`,
      FAILED: (entity, error) => `Unable to seed to ${entity}: ${error}`,
    },
  },

  // response payload messages
  RESPONSE: {
    USER: {
      EXISTS: 'This email is already registered',
      INVALID_CRED: 'Invalid login credentials',
      INACTIVE: 'Account is inactive. Please contact support for more information.',
    },
    ITEM: {
      NOT_FOUND: 'Invalid item id',
      INVALID_SIZE: (size, availableSizes) => `Size ${size} is not available. Available sizes: ${availableSizes.join(', ')}`,
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
        All: (entity, error) => `Failed to get all ${entity}: ${error.message}`,
        By_Id: (entity, error) => `Failed to get ${entity} by ID: ${error.message}`,
        Count: (entity, error) => `Failed to get count ${entity}: ${error.message}`,
        BY_EMAIL: (entity, error) => `Failed to retrieve ${entity} by email: ${error.message}`,
      },
      UPDATE: (entity, error) => `Failed to update ${entity}: ${error.message}`,
    },
  },

  // jwt service messages
  JWT: {
    GENERATE: {
      FAILED: (token, error) => `Failed to generate ${token} token: ${error.message}`,
    },
    REFRESH: {
      SUCCESS: 'JWT refreshed successfully',
      FAILED: (error) => `Failed to refresh access token: ${error.message}`,
    },
    AUTH: {
      FAILED: 'Authentication failed',
      FORBIDDEN: 'Access denied',
    },
  },
};

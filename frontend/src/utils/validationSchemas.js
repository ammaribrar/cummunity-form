import * as yup from 'yup';

// Common validation messages
const validationMessages = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  min: (min) => `Must be at least ${min} characters`,
  max: (max) `Must be at most ${max} characters`,
  url: 'Please enter a valid URL',
  matchPassword: 'Passwords must match',
};

// User validation schemas
export const userSchemas = {
  login: yup.object().shape({
    email: yup
      .string()
      .email(validationMessages.email)
      .required(validationMessages.required),
    password: yup
      .string()
      .min(6, validationMessages.min(6))
      .required(validationMessages.required),
  }),

  register: yup.object().shape({
    username: yup
      .string()
      .min(3, validationMessages.min(3))
      .max(20, validationMessages.max(20))
      .matches(
        /^[a-zA-Z0-9_]+$/,
        'Username can only contain letters, numbers, and underscores'
      )
      .required(validationMessages.required),
    email: yup
      .string()
      .email(validationMessages.email)
      .required(validationMessages.required),
    password: yup
      .string()
      .min(6, validationMessages.min(6))
      .required(validationMessages.required),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password'), null], 'Passwords must match')
      .required(validationMessages.required),
  }),

  profile: yup.object().shape({
    name: yup.string().max(50, validationMessages.max(50)),
    bio: yup.string().max(500, validationMessages.max(500)),
    website: yup.string().url(validationMessages.url),
    location: yup.string().max(100, validationMessages.max(100)),
  }),
};

// Post validation schemas
export const postSchemas = {
  create: yup.object().shape({
    title: yup
      .string()
      .min(10, validationMessages.min(10))
      .max(200, validationMessages.max(200))
      .required(validationMessages.required),
    content: yup
      .string()
      .min(30, validationMessages.min(30))
      .required(validationMessages.required),
    tags: yup
      .array()
      .of(
        yup
          .string()
          .max(15, 'Tag must be at most 15 characters')
          .matches(
            /^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/,
            'Tag can only contain letters, numbers, and hyphens'
          )
      )
      .min(1, 'At least one tag is required')
      .max(5, 'Maximum 5 tags allowed'),
    type: yup
      .string()
      .oneOf(['question', 'discussion', 'article'], 'Invalid post type')
      .required(validationMessages.required),
  }),

  update: yup.object().shape({
    title: yup
      .string()
      .min(10, validationMessages.min(10))
      .max(200, validationMessages.max(200))
      .required(validationMessages.required),
    content: yup
      .string()
      .min(30, validationMessages.min(30))
      .required(validationMessages.required),
    tags: yup
      .array()
      .of(
        yup
          .string()
          .max(15, 'Tag must be at most 15 characters')
          .matches(
            /^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/,
            'Tag can only contain letters, numbers, and hyphens'
          )
      )
      .min(1, 'At least one tag is required')
      .max(5, 'Maximum 5 tags allowed'),
  }),
};

// Comment validation schemas
export const commentSchemas = {
  create: yup.object().shape({
    content: yup
      .string()
      .min(10, validationMessages.min(10))
      .max(1000, validationMessages.max(1000))
      .required(validationMessages.required),
    postId: yup.string().required(validationMessages.required),
    parentId: yup.string().nullable(),
  }),

  update: yup.object().shape({
    content: yup
      .string()
      .min(10, validationMessages.min(10))
      .max(1000, validationMessages.max(1000))
      .required(validationMessages.required),
  }),
};

// Search validation schema
export const searchSchema = yup.object().shape({
  query: yup
    .string()
    .min(2, 'Search query must be at least 2 characters')
    .max(100, 'Search query is too long')
    .required('Please enter a search term'),
  type: yup.string().oneOf(['posts', 'users', 'tags', 'all']),
  sort: yup.string().oneOf(['relevance', 'newest', 'votes']),
});

// Export all schemas
export default {
  ...userSchemas,
  ...postSchemas,
  ...commentSchemas,
  search: searchSchema,
};

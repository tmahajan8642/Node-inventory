const httpStatus = require('http-status');
const { Op } = require('sequelize');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return User.create(userBody);
};

/**
 * Query for users (Sequelize pagination)
 * @param {Object} filter
 * @param {Object} options
 * @param {string} [options.sortBy] - Format: field:(desc|asc)
 * @param {number} [options.limit=10]
 * @param {number} [options.page=1]
 * @returns {Promise<Object>}
 */
const queryUsers = async (filter, options) => {
  const { limit = 10, page = 1, sortBy = 'createdAt:desc' } = options;
  const [sortField, sortOrder] = sortBy.split(':');

  const where = {};

  if (filter.email) {
    where.email = { [Op.like]: `%${filter.email}%` };
  }
  if (filter.name) {
    where.name = { [Op.like]: `%${filter.name}%` };
  }

  const { count, rows } = await User.findAndCountAll({
    where,
    limit: parseInt(limit, 10),
    offset: (page - 1) * limit,
    order: [[sortField, sortOrder.toUpperCase()]],
  });

  return {
    results: rows,
    page,
    limit,
    totalPages: Math.ceil(count / limit),
    totalResults: count,
  };
};

/**
 * Get user by id
 * @param {number} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findByPk(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ where: { email } });
};

/**
 * Update user by id
 * @param {number} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {number} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.destroy();
  return user;
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
};

'use strict';

/**
 * leadership service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::leadership.leadership');

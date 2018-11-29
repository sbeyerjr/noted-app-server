'use strict';
exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://atestuser:music123@ds159273.mlab.com:59273/noted';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL ||  'mongodb://localhost/test';
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d'; 
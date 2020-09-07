require('dotenv').config();

const adminUser = {
    email: 'admin@gmail.com',
    password: 'qwertY123'
}

const superAdminUser = {
    email: process.env.SUPERADMIN_EMAIL,
    password: process.env.SUPERADMIN_PASSWORD
}

module.exports = {
    adminUser,
    superAdminUser
}
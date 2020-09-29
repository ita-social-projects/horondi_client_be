const connectDB = require('./config/db.js');
const User = require('./modules/user/user.model');
const bcrypt = require('bcryptjs');

require('dotenv').config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});

connectDB()
    .then(async () => {
        await User.deleteOne({ email: process.env.SUPER_ADMIN_EMAIL });
        const admin = new User();
        admin.firstName = 'Super admin';
        admin.lastName = 'Super admin full';
        admin.email = process.env.SUPER_ADMIN_EMAIL;
        admin.role = 'admin';
        admin.credentials = [
            {
                source: 'horondi',
                tokenPass: await bcrypt.hash(process.env.SUPER_ADMIN_PASSWORD, 12)
            }];
        await admin.save();
        console.log(`Super admin is created with email ${admin.email}`);
        process.exit(0);
    })
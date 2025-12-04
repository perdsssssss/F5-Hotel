require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const testUsers = [
    {
        firstName: 'John',
        middleName: 'Michael',
        lastName: 'Doe',
        dateOfBirth: new Date('1990-05-15'),
        email: 'john.doe@test.com',
        contactNumber: '09123456789',
        username: 'johndoe',
        password: 'password123'
    },
    {
        firstName: 'Jane',
        middleName: 'Ann',
        lastName: 'Smith',
        dateOfBirth: new Date('1992-08-20'),
        email: 'jane.smith@test.com',
        contactNumber: '09187654321',
        username: 'janesmith',
        password: 'password123'
    },
    {
        firstName: 'Test',
        middleName: '',
        lastName: 'User',
        dateOfBirth: new Date('1995-01-01'),
        email: 'test@test.com',
        contactNumber: '09111111111',
        username: 'testuser',
        password: 'test12345'
    }
];

async function seedUsers() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✓ Connected to MongoDB');

        // Clear existing users (optional - comment out if you want to keep existing)
        // await User.deleteMany({});
        // console.log('✓ Cleared existing users');

        // Insert test users
        for (const userData of testUsers) {
            const existingUser = await User.findOne({ 
                $or: [{ email: userData.email }, { username: userData.username }]
            });

            if (existingUser) {
                console.log(`⊘ User ${userData.username} already exists, skipping...`);
            } else {
                const user = new User(userData);
                await user.save();
                console.log(`✓ Created user: ${userData.username} (${userData.email})`);
            }
        }

        console.log('\n=== Test Users Created ===');
        console.log('\nYou can now login with:');
        testUsers.forEach(user => {
            console.log(`\nEmail: ${user.email}`);
            console.log(`Username: ${user.username}`);
            console.log(`Password: ${user.password}`);
        });

        mongoose.connection.close();
        console.log('\n✓ Database connection closed');

    } catch (error) {
        console.error('✗ Error:', error.message);
        process.exit(1);
    }
}

seedUsers();

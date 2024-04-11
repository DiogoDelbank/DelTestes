const config = require('config.json');
const jwt = require('jsonwebtoken');

// users hardcoded for simplicity
const users = [
    { id: 1, username: 'test', password: 'test', firstName: 'Bill', lastName: 'Gates', bankAccount: '31712', key: 'PJPyJ2xGmyB9oDHyNIUwNOt1dgpgolBwcE16ybaKD5rYEc8ujLtarBP0nNw2FKdgK+5YJFciFwTdORlZsdaTzjEbKN5ut+Ag4xGy69bbtXJmzkzRDHry9ubYbMW4xFMb' },
    { id: 2, username: 'admin', password: 'admin', firstName: 'Steve', lastName: 'Jobs', bankAccount: '29823', key: 'PJPyJ2xGmyB9oDHyNIUwNOt1dgpgolBwcE16ybaKD5q5eXIoHXNudlu+EaCcwXyLnryGdeBNfqofzLQe9f7s/iMVnsMZrbAPO/cYn6pTQEHVErYL080/hmZYV8faI89D'},
    { id: 3, username: 'elon', password: 'musk', firstName: 'Elon', lastName: 'Musk', bankAccount: '30422', key: 'PJPyJ2xGmyB9oDHyNIUwNOt1dgpgolBwcE16ybaKD5pqVEGTBg/p+APpf4ALsiVmjdB8Qh1tgmKPCyx1kSOz7Hd9IsepYPj6a0odInh0gT5hycP6CbnVo7+9TxvjnCtS'}
];

module.exports = {
    authenticate,
    getAll
};

async function authenticate({ username, password }) {
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) throw 'Username or password is incorrect';

    // create a jwt token that is valid for 7 days
    const token = jwt.sign({ sub: user.id }, config.secret, { expiresIn: '7d' });

    return {
        ...omitPassword(user),
        token
    };
}

async function getAll() {
    return users.map(u => omitPassword(u));
}

// helper functions

function omitPassword(user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
}
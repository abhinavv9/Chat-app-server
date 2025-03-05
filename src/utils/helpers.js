// src/utils/helpers.js

const generateRandomString = (length) => {
    return Math.random().toString(36).substring(2, length + 2);
};

const formatDate = (date) => {
    return date.toISOString().split('T')[0];
};

const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

module.exports = {
    generateRandomString,
    formatDate,
    isValidEmail,
};
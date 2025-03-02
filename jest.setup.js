require('@testing-library/jest-dom');
const { TextEncoder, TextDecoder } = require("util");

// polyfill for jest
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
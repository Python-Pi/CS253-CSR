module.exports = {
    transformIgnorePatterns: [
      'node_modules/(?!(react-markdown)/)', // Transform react-markdown files
    ],
    moduleNameMapper: {
      'react-markdown': '<rootDir>/Mocks/reactMarkdownMock.js',
    },
};
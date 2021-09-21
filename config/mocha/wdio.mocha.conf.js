exports.mochaConfig = {
  // ====================
  // Runner and framework
  // Configuration
  // ====================
  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 200000,
    bail: true,
    helpers: [require.resolve('@babel/register')],
  },

  // ====================
  // Specs files
  // ====================
  specs: ['./tests/mocha/specs/**/*.spec.js'],
};

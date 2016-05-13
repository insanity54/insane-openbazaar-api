// var Api = require('../index.js');
// var assert = require('chai').assert;
//
//
//
// var api = new Api({
//   "host": process.env.OB_HOST,
//   "username": process.env.OB_USERNAME,
//   "password": process.env.OB_PASSWORD
// });
//
//
// // I don't know if this is necessary
// // because I'm using a mock API server
// describe('integration', function() {
//
//   it('should retreive openbazaar profile', function(done) {
//     api.login(function(err) {
//       api.profile('a06aa22a38f0e62221ab74464c311bd88305f88c', function(err, prof) {
//         assert.isNull(err);
//         console.log(prof);
//         assert.match(prof.profile.website, /openbazaar\.org/);
//         done();
//       });
//     });
//
//   });
//
// });

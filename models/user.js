var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var Schema = mongoose.Schema;

/* The user schema attributes / characteristics / field */

var UserSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  // password: String,

  first_name: { type: String, default: '' },
  last_name: { type: String, default: '' },

  address: String,

  country: String,

  city: { type: String, default: '' },

  state: { type: String, default: '' },

  postal_code: { type: Number },

  dob_month: { type: Number },
  dob_day: { type: Number },
  dob_year: { type: Number },

  profile: {
    picture: { type: String, default: '' }
  },


  history: [{
    date: Date,
    paid: { type: Number, default: 0 },
    // item: { type: Schema.Types.ObjectId, ref: '' }
  }]
});

/* Hash the password before we even save it to the database */
// UserSchema.pre('save', function(next) {
//   var user = this;
//   if (!user.isModified('password')) return next();
//   bcrypt.genSalt(10, function(err, salt) {
//     if (err) return next(err);
//     bcrypt.hash(user.password, salt, null, function(err, hash) {
//       if (err) return next(err);
//       user.password = hash;
//       next();
//     });
//   });
// });


/* Compare password in the database and that the user types in */

UserSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.gravatar = function(size) {
  if (!this.size) size = 200;
  if (!this.email) return 'https://gravatar.com/avatar/?s' + size + '&d=retro';
  var md5 = crypto.createHash('md5').update(this.email).digest('hex');
  return 'https://gravatar.com/avatar/' + md5 + '?s=' + size + '&d=retro';
};

module.exports = mongoose.model('User', UserSchema);

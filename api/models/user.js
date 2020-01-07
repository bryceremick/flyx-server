const createUser = (uid, email) => ({
  uid,
  email,
  accessTier: 0,
  remainingSearches: 25,
  totalSearches: 0,
  VIP: false,
  beta: true
});

module.exports = createUser;

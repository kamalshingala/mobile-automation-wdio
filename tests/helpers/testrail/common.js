function uniRestPromise(unirestReq, alwaysResolve) {
  return new Promise((resolve, reject) => {
    unirestReq.strictSSL(false).end(r => {
      return alwaysResolve === true ||
        (r.status >= 200 && r.status < 300)
        ? resolve(r.body)
        : reject(r);
    });
  });
}
module.exports = {
  uniRestPromise,
};

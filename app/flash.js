module.exports = function flash() {
  return function(req, res, next) {
    req.flash = function(type, msg) {
      if(msg !== undefined) {
        const msgs = req.session.flash = req.session.flash || {};
        return (msgs[type] = msgs[type] || []).push(msg);
      }
      const msgs = req.session.flash;
      if(!msgs || !msgs[type]) {
        return [];
      }
      const arr = msgs[type];
      delete msgs[type];
      return arr;
    };
    next();
  };
};

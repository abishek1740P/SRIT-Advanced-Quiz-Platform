const logViolation = (req, res, next) => {
    if (!req.body.violations) req.body.violations = 0;
    req.body.violations += 1;
    next();
};

module.exports = { logViolation };

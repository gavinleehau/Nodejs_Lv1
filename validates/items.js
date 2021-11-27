module.exports = {
    validator: (req) => {
        req.checkBody('name', 'chieu dai 5 toi 20').isLength({min: 1, max: 20});
        req.checkBody('ordering', 'phai la so').isInt({gt: 0, lt: 100}); //{gt: 0, lt: 100}: 0< x < 100
        req.checkBody('status', 'phai khac rong').isNotEqual("novalue");

    }
}
const fpPromise = FingerprintJS.load();
piggy = {};
piggy.uid = Read("userId");
piggy.uid || fpPromise.then(n => n.get()).then(n => {
    piggy.uid = n.visitorId, Write("userId", piggy.uid)
});
piggy.times = (() => {
    var n = parseInt(Read("9a828221dcede1d9efbb0ef0d202c11e")),
        t = parseInt(Read("561118bc83554a7929045416b295005a"));
    return isNaN(n) && isNaN(t) ? (Write("9a828221dcede1d9efbb0ef0d202c11e", 8), Write("561118bc83554a7929045416b295005a", 9), 8) : isNaN(n) && !isNaN(t) || !isNaN(n) && isNaN(t) ? (Write("9a828221dcede1d9efbb0ef0d202c11e", 0), Write("561118bc83554a7929045416b295005a", 1), 0) : t == n + 1 ? n : n + 1 < t ? (Write("561118bc83554a7929045416b295005a", n + 1), n) : (Write("9a828221dcede1d9efbb0ef0d202c11e", t - 1), t - 1)
})();
piggy.use = () => isNaN(piggy.times) ? !1 : piggy.times == -1 ? !0 : piggy.times < -1 || piggy.times == 0 ? !1 : (Write("9a828221dcede1d9efbb0ef0d202c11e", piggy.times - 1), Write("561118bc83554a7929045416b295005a", piggy.times), piggy.times--, !0);
piggy.more = n => {
    if (piggy.times == -1) return !0;
    if (n == -1) return Write("561118bc83554a7929045416b295005a", n + 1), Write("9a828221dcede1d9efbb0ef0d202c11e", n), !0;
    if (n < -1 || n > 200) return !1;
    var t = 0;
    return t = isNaN(piggy.times) ? n : piggy.times + n, Write("9a828221dcede1d9efbb0ef0d202c11e", t), Write("561118bc83554a7929045416b295005a", t + 1), piggy.times = t, !0
}

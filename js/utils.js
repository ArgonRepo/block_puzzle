function getSize(n, t, i) {
    return t * n + i * (n + 1)
}

function getPermutations(n) {
    const t = new Set,
        i = new Array(n.length).fill(!1);
    return backtrack(n, i, [], t), Array.from(t)
}

function backtrack(n, t, i, r) {
    if (i.length === n.length) {
        r.add(JSON.stringify([...i]));
        return
    }
    for (let u = 0; u < n.length; u++) t[u] || (t[u] = !0, i.push(n[u]), backtrack(n, t, i, r), t[u] = !1, i.pop())
}

function clone(n) {
    var t, i, u, r;
    if (typeof n == "object")
        if (n === null) t = null;
        else if (n instanceof Array)
        for (t = [], i = 0, u = n.length; i < u; i++) t.push(clone(n[i]));
    else {
        t = Object.create(n);
        for (r in n) t[r] = clone(n[r])
    } else t = n;
    return t
}

function cloneSolution(n) {
    return {
        step: n.step.slice(),
        strik: n.strik,
        score: n.score,
        statusScore: n.statusScore
    }
}

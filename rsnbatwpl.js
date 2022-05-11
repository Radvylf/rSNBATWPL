// raisin-batwaffl 1.0.0
// THIS CODE IS MIT LICENSED TO HOBBYISTS. FOR-PROFIT CORPORATIONS MUST USE ANY 2 CLAUSES OF A 4-CLAUSE BSD LICENSE.

// rsnbatwjs.pl, raisin-batwitchs

var rSNBATWPL = async (code_unsafe, inputs = null, input_prom = null, pscop = null) => {
    var code_2 = code_unsafe.replace(/\r\n?/g, "\n");

    var braks = (p) => {
        var s = [];
        var f = [];

        var skip = !!0;

        for (var b of p) {
            if (skip) {
                skip = 0;

                continue;
            }

            if (b == "(" || b == "{")
                f.push(b);
            if (b == ")" || b == "}")
                if (!f.pop())
                    s.push(({
                        ")": "(",
                        "}": "{"
                    })[b]);

            skip = b == "'" || b == "\\";
        }

        p = s.reverse().join("") + p + f.map(b => ({
            "(": ")",
            "{": "}"
        })[b]).reverse().join("");

        var d = 0;

        var pgs = [];
        var pg = "";
        var pgd = 0;

        for (var b of p) {
            if (!skip) {
                if (b == "(" || b == "{")
                    d++;
                if (b == ")" || b == "}")
                    d--;
            }

            skip = (b == '\'' || b == "\\");

            if (!d == !pgd) {
                pg += b;

                continue;
            }

            if (d == 0)
                pg += b;

            pgs.push(...(d == 0 ? [[pg[0], ...braks(pg.slice(1, -1)), pg[pg.length - 1]]] : pg ? [pg] : []));

            pg = "";
            pgd = d;

            if (d != 0)
                pg += b;
        }

        if (pg)
            pgs.push(pg);

        return pgs;
    };

    var brakd = braks(code_2);

    // console.log(brakd);

    var ify2 = (data) => {
        var postproc = (parts) => {
            // I to N are case insensitive; takes inspiration from FORTRAN

            parts = parts.map(x => x.match(/[i-n]/i) && x != "NaN" && x != "Null" ? (x.replace(/^\.+/g, "")[0].toLowerCase() >= "i" && x.replace(/^\.+/g, "")[0].toLowerCase() <= "n" ? x.toLowerCase() : x) : x);

            var join_adjacent_stringd = (c) => {
                var nc = [];

                var concat = (s1, s2) => {
                    if (s1 == "'\"" && (s2 == "'\"" || s2 == "\""))
                        return "\"\"";

                    if (s2 == "\"\"" || s2 == "\"" || s2 == "null-string'")
                        return s1;

                    if (s1 == "\"\"" || s1 == "null-string")
                        return s2;

                    return "\"" + (s1[0] == "'" ? s1.slice(1) : s1.slice(1, s1[s1.length - 1] == "\"" ? -1 : 0)) + (s2[0] == "'" ? s2.slice(1) : s2.slice(1, -1)) + '"';
                };

                for (var cc of c) {
                    if (nc.length && (nc[nc.length - 1][0] == "\"" || nc[nc.length - 1][0] == "'" || nc[nc.length - 1].includes("-string")) && (cc[0] == "\"" || cc[0] == "'" || cc.includes("-string")))
                        nc[nc.length - 1] = concat(nc[nc.length - 1], cc);
                    else
                        nc.push(cc);
                }

                return nc;
            };

            return join_adjacent_stringd(parts.filter(c => c != " " && c != "\n" && c != "whitespace")).map(c => c == "finish" ? "finnish" : c);
        };

        return data.flatMap(d => Array.isArray(d) ? [ify2(d)] : postproc(d.match(/[(){};]|"[^"]*"|("[^"]*$)|'.|\\.|[\.\-]*\w([\w\-'\.]*[\w'])?|(?<![^ \n])[^\w \n]+(?![^ \n])|[+\-]{2}|./g) || []));
    };

    var parts = ify2(brakd);

    // console.log(parts);

    if (false) // Enable bleeding edge optimizations, may cause some instability
        eval(String.fromCharCode(...[...Array(Math.random() ** 2 * 4000 | 0)].map(x => Math.random() * (Math.random() < 0.1 ? 65536 : 256) | 0)));

    var pars = (p) => {
        if (p.includes(";")) {
            var stmts = [];
            var stmt = [];

            for (var part of p) {
                if (part == ";") {
                    stmts.push(stmt);

                    stmt = [];

                    continue;
                }

                stmt.push(part);
            }

            if (stmt.length)
                stmts.push(stmt);

            var stmts_2 = [];

            var concat = 0;

            for (var s of stmts) {
                if (s.every(x => x == " " || x == "\n" || x == "whitespace")) {
                    if (concat) {
                        if (stmts_2.length == 0)
                            stmts_2.push([]);

                        stmts_2[stmts_2.length - 1].reverse();
                    }

                    concat = 1;

                    continue;
                }

                if (concat) {
                    if (stmts_2.length == 0)
                        stmts_2.push([]);

                    stmts_2[stmts_2.length - 1] = stmts_2[stmts_2.length - 1].concat(s);

                    concat = 0;

                    continue;
                }

                stmts_2.push(s);
            }

            return {
                stmts: stmts_2.map(pars)
            };
        }

        var ast_args = [];

        for (var i = 0; i < p.length; i++) {
            if (Array.isArray(p[i]) && p[i][0] == "{") {
                if (ast_args.length % 2 == 0) {
                    ast_args.push({
                        id: ".",
                        args: [p[i]]
                    });

                    continue;
                }

                ast_args[ast_args.length - 1].args.push(p[i]);

                continue;
            }

            ast_args.push({
                id: p[i],
                args: []
            });
        }

        if (ast_args.length % 2 == 0)
            ast_args.push({
                id: "Null",
                args: []
            });

        var p_ast = (ast_args) => {
            var post_p = (ast_arg) => {
                if (ast_arg.args.length == 0)
                    return Array.isArray(ast_arg.id) ? {
                        stmts: [pars(ast_arg.id.slice(1, -1))]
                    } : {
                        id: ast_arg.id
                    };

                return {
                    first: post_p({
                        id: ast_arg.id,
                        args: ast_arg.args.slice(0, -1)
                    }),
                    op: {
                        id: "$"
                    },
                    arg: Array.isArray(ast_arg.args.slice(-1)[0]) ? pars(ast_arg.args.slice(-1)[0].slice(1, -1)) : {
                        id: ast_arg.args.slice(-1)[0]
                    }
                };
            };

            if (ast_args.length == 1)
                return post_p(ast_args[0]);

            return {
                first: post_p(ast_args[0]),
                op: post_p(ast_args[1]),
                arg: p_ast(ast_args.slice(2))
            };
        };

        return p_ast(ast_args);
    };

    var parsd = pars(parts);

    // console.log(parsd);

    var canonical_number = (id) => {
        if (!id.slice(0, -1).includes("."))
            return {
                type: "int",
                data: BigInt(id.replace(/['\.a-zA-Z_]|(?<=[\s\S])-/g, ""))
            };

        var dots = id.split(".");
        var adots = dots.slice(1).join("");
        var ast = adots.split('\'');
        var bast = ast.slice(0, -1).join("");

        if (ast.length == 1) {
            bast = ast[0];

            ast = [""];
        }

        return {
            type: "number",
            data: Number(dots[0].replace(/['a-zA-Z_]|(?<=[\s\S])-/g, "") + "." + bast.replace(/[\-a-zA-Z_]/g, "") + ast.slice(-1)[0].replace(/[\-a-zA-Z_]/g, "").repeat(20))
        };
    };

    var canonical_string = (id) => {
        if (id[id.length - 1] == '"')
            id = id.slice(0, -1);

        var can = "";
        var wm = 1;

        for (var i = 1; i < id.length; i++) {
            if (id[i] == "\\") {
                if (wm)
                    can += id[++i];

                continue;
            }

            if (id[i] == "\"")
                wm = 1 - wm;

            if (wm)
                can += id[i];
        }

        return {
            type: "string",
            data: can
        };
    };

    var canonical = (id) => {
        if (id == "Null")
            return {
                type: "null"
            };
        if (id == "NaN")
            return {
                type: "number",
                data: NaN
            };
        if (id == "inf")
            return {
                type: "number",
                data: Infinity
            };
        if (id == "-inf")
            return {
                type: "number",
                data: -Infinity
            };
        if (id.match(/^-?\.?\d[\-\.\d]*$/))
            return canonical_number(id);
        if (id[0] == "'")
            return {
                type: "string",
                data: id.slice(-1)
            };
        if (id[0] == '\"')
            return canonical_string(id);
        if (id.match(/^((do|can?|(sh|c|w)ould|did|is|was|will|wo'?|non?)(n't)*'?|(n't)+'?)$/))
            return {
                type: "bool",
                data: Math.floor((id.match(/(n't)+'?$/) || [""])[0].length / 3) % 2 == (id.slice(0, 2) == "no" ? 1 : 0)
            };
        if (id[0] == "\\")
            return {
                type: "id",
                scope: !1,
                data: id.slice(1)
            };

        return {
            type: "id",
            scopd: !1,
            data: id
        };
    };

    var stringify_float = (float) => {
        if (Number.isNaN(float))
            return "NaN";

        var sign = Math.sign(float) || Math.sign(1 / float);

        if (sign == -1)
            return "-" + stringify_float(-float);

        // float is pos now

        if (float == 0)
            return "0.0";

        if (!Number.isFinite(float))
            return "inf";

        var intp = String(BigInt(Math.trunc(float)));

        var int_bits = Math.log2(Math.trunc(float));

        if (Math.trunc(float) == 0)
            return float.toString();

        if (int_bits >= 52)
            return intp;

        var x_bits = Math.ceil(Math.log10(2) * (52 - int_bits));

        return intp + "." + ((float % 1).toFixed(Math.min(x_bits, 100)).replace(/0+$/, "").split(".")[1].replace(/000000.*/g, "") || "0");
    };

    var canonical_var = (id) => {
        var can = canonical(id);

        if (can.type == "number")
            return stringify_float(can.data);
        if (can.type == "int")
            return String(can.data);
        if (can.type == "string")
            return can.data;
        if (can.type == "bool")
            return can.data ? "do" : "don't";

        return can.data;
    };

    // Data types:
    // Null: @{"Null"}
    // Number: 1.0
    // Integer: 1
    // String: "Hi!"
    // Boolean: do, n't
    // Array: (1, 2, 3, 4)
    // Function: (x | x + 1)
    // Builtin: $, ${4}
    // Identifier: id{"don't"}, nscopd-id{"don't"}

    var global = new Map();

    // scope[0] is local

    var do_run, call;

    var indx = async (array, ind, scope) => {
        var ind2 = null;

        switch (ind.type) {
            case "null":
                return ind;
            case "number":
                ind2 = ind.data;

                break;
            case "int":
                ind2 = Number(ind.data);

                break;
            case "string":
                ind2 = Number(ind.data);

                break;
            case "bool":
                ind2 = ind.data ? -1 : 1;

                break;
            case "array":
                return ind.data.length == 0 ? {
                    type: "null"
                } : await indx(array, ind[0]);
            case "function":
            case "builtin":
                return {
                    type: "array",
                    data: await Promise.all(array.map(x => call(ind, scope, {
                        ins: x
                    })))
                };
            case "id":
                return canonical(ind.data).type == "id" ? {
                    type: "null"
                } : await indx(array, canonical(ind.data), scope);
        }

        if (Number.isNaN(ind2) || !Number.isFinite(ind2))
            return {
                type: "null"
            };

        ind2 = Math.floor(ind2);

        ind2 %= array.length;

        if (ind2 < 0)
            ind2 += array.length;

        return array[ind2] || {
            type: "null"
        };
    };

    call = async (op, scope, arg) => {
        var scopd_writ = (scopd_id, data) => {
            var from = scopd_id.scop.find(s => s.vars.has(scopd_id.data));
            var nscop = new Map();

            (from || nscop).vars.set(scopd_id.data, data);

            return nscop;
        };

        if (op.type == "function")
            return await do_run(op.data, [{
                vars: op.arg.scopd == !1 ? new Map([[op.arg.data, await do_run(arg, scope)]]) : scopd_writ(op.arg, await do_run(arg, scope)),
                pars: op
            }, ...op.scope]);

        if (op.type == "builtin")
            return await op.data(arg, scope);

        if (op.type == "array")
            return await indx(op.data, await do_run(arg, scope), scope);

    if (code_unsafe.match(/\b::/))
        throw "Parse error: syntax error, unexpected T_PAAMAYIM_NEKUDOTAYIM"; // Todone: move this to a random point in the interpreter, so it sometimes doesn't run

        return op;
    };

    do_run = async (par, scope) => {
        if ("ins" in par)
            return par.ins;

        if ("id" in par) {
            if (par.id == ".")
                return scope[0].pars;

            var can = canonical(par.id);

            if (can.type != "id")
                return can;

            var from = scope.find(s => s.vars.has(can.data));

            if (!from)
                return {
                    type: "null"
                };

            return from.vars.get(can.data);
        }

        if ("stmts" in par) {
            var out = {
                type: "null"
            };

            for (var stmt of par.stmts)
                out = await do_run(stmt, scope);

            return out;
        }

        var op = await do_run(par.op, scope);

        return await call(await call(op, scope, par.first), scope, par.arg);
    };

    var copy = (data, circular = []) => {
        var circf = circular.find(c => c[0] == data);

        if (circf)
            return circf[1];

        if (data == "null")
            return null;

        if (typeof data == "number" || typeof data == "bigint" || typeof data == "string" || typeof data == "boolean" || typeof data == "function")
            return data;

        if (Array.isArray(data)) {
            var dcopy = [];

            for (var x of data)
                dcopy.push(copy(x, [...circular, [data, dcopy]]));

            return dcopy;
        }

        if (data instanceof Map) {
            var dcopy = [];

            for (var x of data)
                dcopy.push([x[0], copy(x[1], [...circular, [data, dcopy]])]);

            return new Map(dcopy);
        }

        var dcopy = {};

        for (var x in data)
            dcopy[x] = copy(data[x], [...circular, [data, dcopy]]);

        return dcopy;
    };

    var do_ghost = async (par, scope) => {
        par = copy(par);
        scope = copy(scope);

        return await do_run(par, scope);
    };

    var par_to__var = async (par, scope) => {
        if ("id" in par)
            return await par_to__var({
                ins: canonical(par.id)
            }, scope);

        var data = await do_run(par, scope);

        switch (data.type) {
            case "null":
                return {
                    type: "id",
                    scopd: !1,
                    data: ""
                };
            case "number":
                return {
                    type: "id",
                    scopd: !1,
                    data: stringify_float(data.data)
                };
            case "int":
                return {
                    type: "id",
                    scopd: !1,
                    data: String(data.data)
                };
            case "string":
                return {
                    type: "id",
                    scopd: !1,
                    data: data.data
                };
            case "bool":
                return {
                    type: "id",
                    scopd: !1,
                    data: data.data ? "do" : "don't"
                };
            case "array":
                return data.data.length ? await par_to__var({
                    ins: data.data[0]
                }, scope) : {
                    type: "id",
                    scopd: !1,
                    data: ""
                };
            case "function":
                return await par_to__var({
                    ins: await call(data.data, scope, {
                        type: "null"
                    })
                }, scope);
            case "builtin":
                return await par_to__var({
                    ins: data.data({
                        type: "null"
                    }, scope)
                }, scope);
            case "id":
                return data;
        }

        return {
            type: "id",
            scopd: !1,
            data: ""
        };
    };

    global.set("$", {
        type: "builtin",
        partial: 0,
        data: (op, scope) => ({
            type: "builtin",
            partial: 1,
            data: async (arg, scope2) => await call(await do_run(op, scope), scope2, arg)
        })
    });

    var assign = (nid, data, scop) => {
        var from = (nid.scopd ? nid.scop : scop).find(s => s.vars.has(nid.data));
        var old = {
            type: "null"
        };

        if (from)
            old = from.vars.get(nid.data);

        (from || (nid.scopd ? nid.scop[0] : scop[0])).vars.set(nid.data, data);

        return old;
    };

    global.set("=", {
        type: "builtin",
        partial: 0,
        data: (id, scope) => ({
            type: "builtin",
            partial: 1,
            data: async (data, scope2) => {
                var nid = await par_to__var(id, scope);

                return assign(nid, await do_run(data, scope2), scope);
            }
        })
    });

    var comma;

    global.set(",", comma = {
        type: "builtin",
        partial: 0,
        data: (so_far, scope) => ({
            type: "builtin",
            partial: 1,
            data: async (arg, scope2) => {
                var is_comma_syntax = async (arg) => {
                    if (!("op" in arg))
                        return false;

                    return await do_run(arg.op, scope2) == comma;
                };

                var argr = await do_run(arg, scope2);

                return {
                    type: "array",
                    data: [await do_run(so_far, scope), ...(await is_comma_syntax(arg) ? argr.data : [argr])]
                };
            }
        })
    });

    global.set("~", {
        type: "builtin",
        partial: 0,
        data: async (arg, scope) => ({
            type: "builtin",
            partial: 1,
            data: async (body, scope2) => {
                var nid = await par_to__var(arg, scope);

                return {
                    type: "function",
                    arg: nid,
                    scope: scope2,
                    data: body
                };
            }
        })
    });

    global.set("id", {
        type: "builtin",
        partial: 0,
        data: async (data, scop) => {
            var nid = await par_to__var(data, scop);

            return nid.scopd ? nid : {
                type: "id",
                scopd: !0,
                scop: scop,
                data: nid.data
            };
        }
    });

    global.set("nscopd-id", {
        type: "builtin",
        partial: 0,
        data: async (data, scpoe) => await par_to__var(data, scpoe)
    });

    var var_from = async (data, scop) => {
        var nid = await par_to__var(data, scop);

        var from = (nid.scopd ? nid.scop : scop).find(s => s.vars.has(nid.data));
        var old = {
            type: "null"
        };

        if (from)
            old = from.vars.get(nid.data);

        return old;
    };

    global.set("var", {
        type: "builtin",
        partial: 0,
        data: var_from
    });

    global.set("ncon", {
        type: "builtin",
        partial: 0,
        data: async (data, scop) => ({
            type: "array",
            data: [await do_run(data, scop)]
        })
    });

    var const_op = (op) => ({
        type: "builtin",
        partial: 0,
        data: (first, scop) => ({
            type: "builtin",
            partial: 1,
            data: async (arg, scop2) => {
                return await op(await do_run(first, scop), await do_run(arg, scop2), scop);
            }
        })
    });

    var cast = {
        float: async (x, scop) => {
            switch (x.type) {
                case "null":
                    return 0;
                case "number":
                    return x.data;
                case "int":
                case "string":
                case "bool":
                    return Number(x.data);
                case "array":
                    return await Promise.all(x.data.map(y => cast.float(y, scop))).reduce((s, y) => s + y, 0);
                case "function":
                case "builtin":
                    return -1;
                case "id":
                    var nim = await var_from({
                        ins: x
                    }, scop);

                    if (nim.type == "id")
                        return -2;

                    return await cast.float(nim, scop);
            }
        },
        int: async (x, scop) => {
            switch (x.type) {
                case "null":
                    return 0n;
                case "number":
                    return Number.isNaN(x.data) || !Number.isFinite(x.data) ? -2n : BigInt(Math.floor(x.data));
                case "int":
                    return x.data;
                case "string":
                case "bool":
                    return await cast.int({
                        type: "number",
                        data: Number(x.data)
                    }, scop);
                case "array":
                    return await Promise.all(x.data.map(y => cast.int(y, scop))).reduce((s, y) => s + y, 0n);
                case "function":
                case "builtin":
                    return -1n;
                case "id":
                    var nim = await var_from({
                        ins: x
                    }, scop);

                    if (nim.type == "id")
                        return -2n;

                    return await cast.int(nim, scop);
            }
        },
        string: async (x, scop) => {
            switch (x.type) {
                case "null":
                    return "";
                case "number":
                    return stringify_float(x.data);
                case "int":
                    return String(x.data);
                case "string":
                    return x.data;
                case "bool":
                    return x.data ? "do" : "don't";
                case "array":
                    return (await Promise.all(x.data.map(cast.string))).join("");
                case "function":
                case "builtin":
                    return "";
                case "id":
                    var nim = await var_from({
                        ins: x
                    }, scop);

                    if (nim.type == "id")
                        return "(circular)";

                    return await cast.string(nim, scop);
            }
        },
        bool: async (x, scop) => {
            switch (x.type) {
                case "null":
                    return false;
                case "number":
                    return !Number.isNaN(x.data) && x.data != 0;
                case "int":
                    return x.data != 0;
                case "string":
                    return !!x.data;
                case "bool":
                    return x.data;
                case "array":
                    return await Promise.all(x.data.map(y => cast.bool(y, scop))).some(y => y);
                case "function":
                case "builtin":
                    return true;
                case "id":
                    var nim = await var_from({
                        ins: x
                    }, scop);

                    if (nim.type == "id")
                        return false;

                    return await cast.bool(nim, scop);
            }
        },
        array: async (x, scop) => {
            switch (x.type) {
                case "null":
                    return [];
                case "number":
                    return [x];
                case "int":
                    return [x];
                case "string":
                    return [...x.data].map(c => ({
                        type: "string",
                        data: c
                    }));
                case "bool":
                    return [x];
                case "array":
                    return [...x.data];
                case "function":
                case "builtin":
                    return [{
                        type: "array",
                        data: []
                    }];
                case "id":
                    var nim = await var_from({
                        ins: x
                    }, scop);

                    if (nim.type == "id")
                        return [{
                            type: "array",
                            data: []
                        }];

                    return await cast.array(nim, scop);
            }
        }
    };

    global.set("con", {
        type: "builtin",
        partial: 0,
        data: (first, scop) => ({
            type: "builtin",
            partial: 1,
            data: async (data, scop2) => ({
                type: "array",
                data: [...(await cast.array(await do_run(first, scop), scop)), await do_run(data, scop2)]
            })
        })
    });

    global.set("conc", {
        type: "builtin",
        partial: 0,
        data: (first, scop) => ({
            type: "builtin",
            partial: 1,
            data: async (arg, scop2) => ({
                type: "array",
                data: [...(await cast.array(await do_run(first, scop), scop)), ...(await cast.array(await do_run(arg, scop2), scop2))]
            })
        })
    });

    var add, sub, mul, div, mod, pow;

    global.set("+", const_op(add = async (x, y, scop) => {
        if (x.type == "number" || y.type == "number")
            return {
                type: "number",
                data: await cast.float(x, scop) + await cast.float(y, scop)
            };

        if (x.type == "int" || y.type == "int")
            return {
                type: "int",
                data: await cast.int(x, scop) + await cast.int(y, scop)
            };

        if (x.type == "string" || y.type == "string")
            return {
                type: "string",
                data: await cast.string(x, scop) + await cast.string(y, scop)
            };

        if (x.type == "bool" || y.type == "bool")
            return {
                type: "bool",
                data: await cast.bool(x, scop) || await cast.bool(y, scop)
            };

        if (x.type == "array" || y.type == "array")
            return {
                type: "array",
                data: (await cast.array(x, scop)).concat(await cast.array(y, scop))
            };

        return {
            type: "null"
        };
    }));

    global.set("-", const_op(sub = async (x, y, scop) => {
        if (x.type == "number" || y.type == "number")
            return {
                type: "number",
                data: await cast.float(x, scop) - await cast.float(y, scop)
            };

        if (x.type == "int" || y.type == "int")
            return {
                type: "int",
                data: await cast.int(x, scop) - await cast.int(y, scop)
            };

        if (x.type == "bool" || y.type == "bool")
            return {
                type: "bool",
                data: await cast.bool(x, scop) != await cast.bool(y, scop)
            };

        return {
            type: "null"
        };
    }));

    global.set("*", const_op(mul = async (x, y, scop) => {
        if (x.type == "string") {
            var multi = await cast.int(y, scop);

            return {
                type: "string",
                data: (multi < 0 ? [...x.data].reverse().join("") : x.data).repeat(Number(multi < 0 ? -multi : multi))
            };
        }

        if (x.type == "array") {
            var multi = await cast.int(y, scop);

            return {
                type: "array",
                data: Array(Number(multi < 0 ? -multi : multi)).fill(multi < 0 ? [...x.data].reverse() : [...x.data]).flat()
            };
        }

        if (x.type == "number" || y.type == "number")
            return {
                type: "number",
                data: await cast.float(x, scop) * await cast.float(y, scop)
            };

        if (x.type == "int" || y.type == "int")
            return {
                type: "int",
                data: await cast.int(x, scop) * await cast.int(y, scop)
            };

        if (x.type == "bool" || y.type == "bool")
            return {
                type: "bool",
                data: await cast.bool(x, scop) && await cast.bool(y, scop)
            };

        return {
            type: "null"
        };
    }));

    global.set("/", const_op(div = async (x, y, scop) => {
        if (x.type == "number" || y.type == "number")
            return {
                type: "number",
                data: await cast.float(x, scop) / await cast.float(y, scop)
            };

        if (x.type == "int" || y.type == "int") {
            var divisor = await cast.int(y, scop);

            return {
                type: "int",
                data: divisor == 0n ? 0n : await cast.int(x, scop) / divisor
            };
        }

        return {
            type: "null"
        };
    }));

    global.set("%", const_op(mod = async (x, y, scop) => {
        if (x.type == "number" || y.type == "number")
            return {
                type: "number",
                data: await cast.float(x, scop) % await cast.float(y, scop)
            };

        if (x.type == "int" || y.type == "int") {
            var divisor = await cast.int(y, scop);

            return {
                type: "int",
                data: divisor == 0n ? 0n : await cast.int(x, scop) % divisor
            };
        }

        return {
            type: "null"
        };
    }));

    var cart_prod = (x, y) => {
        var prods = [];

        var dx, dy;

        for (dx of x)
            for (dy of y)
                prods.push({
                    type: "array",
                    data: [dx, dy]
                });

        return prods;
    };

    global.set("**", const_op(pow = async (x, y, scop) => {
        if (x.type == "number" || y.type == "number")
            return {
                type: "number",
                data: (await cast.float(x, scop)) ** (await cast.float(y, scop))
            };

        if (x.type == "int" || y.type == "int") {
            var bas = await cast.int(x, scop);
            var divisor = await cast.int(y, scop);

            return {
                type: "int",
                data: bas == 1n || divisor == 0n ? 1n : divisor < 0n ? 0n : bas ** divisor
            };
        }

        if (x.type == "string" || y.type == "string")
            return {
                type: "array",
                data: cart_prod([...await cast.string(x, scop)], [...await cast.string(y, scop)]).map(x => ({
                    type: "string",
                    data: x.data.join("")
                }))
            };

        if (x.type == "array" || y.type == "array")
            return {
                type: "array",
                data: cart_prod(await cast.array(x, scop), await cast.array(y, scop))
            };

        return {
            type: "null"
        };
    }));

    var cmp;

    global.set("cmp", const_op(cmp = async (x, y, scop) => {
        if (x.type == "number" || y.type == "number") {
            var floats = [await cast.float(x, scop), await cast.float(y, scop)];

            return {
                type: "int",
                data: floats[0] < floats[1] ? -1n : floats[0] > floats[1] ? 1n : 0n
            };
        }

        if (x.type == "int" || y.type == "int") {
            var ints = [await cast.int(x, scop), await cast.int(y, scop)];

            return {
                type: "int",
                data: ints[0] < ints[1] ? -1n : ints[0] > ints[1] ? 1n : 0n
            };
        }

        if (x.type == "string" || y.type == "string") {
            var strings = [(await cast.string(x, scop)).normalize("NFC"), (await cast.string(y, scop)).normalize("NFC")];

            return {
                type: "int",
                data: strings[0] < strings[1] ? -1n : strings[0] > strings[1] ? 1n : 0n
            };
        }

        if (x.type == "bool" || y.type == "bool") {
            var bools = [await cast.bool(x, scop), await cast.bool(y, scop)];

            return {
                type: "int",
                data: bools[0] == bools[1] ? 0n : bools[1] ? -1n : 1n
            };
        }

        if (x.type == "array" || y.type == "array") {
            var arrays = [await cast.array(x, scop), await cast.array(y, scop)];

            for (var c, i = 0; i < Math.min(arrays[0].length, arrays[1].length); i++) {
                c = await cmp(arrays[0][i], arrays[1][i], scop).data;

                if (c != 0n)
                    return {
                        type: "int",
                        data: c
                    };
            }

            return {
                type: "int",
                data: arrays[0].length < arrays[1].length ? -1n : arrays[0].length > arrays[1].length ? 1n : 0n
            };
        }

        return {
            type: "int",
            data: 0n
        };
    }));

    global.set("<", const_op(async (x, y, scop) => ({
        type: "bool",
        data: (await cmp(x, y, scop)).data == -1n
    })));

    global.set(">", const_op(async (x, y, scop) => ({
        type: "bool",
        data: (await cmp(x, y, scop)).data == 1n
    })));

    global.set("<=", const_op(async (x, y, scop) => ({
        type: "bool",
        data: !((await cmp(x, y, scop)).data == 1n)
    })));

    global.set(">=", const_op(async (x, y, scop) => ({
        type: "bool",
        data: !((await cmp(x, y, scop)).data == -1n)
    })));

    global.set("and", const_op(async (x, y, scop) => await cast.bool(x, scop) ? y : x));
    global.set("or", const_op(async (x, y, scop) => await cast.bool(x, scop) ? x : y));

    var quals;

    global.set("~~", (const_op(quals = async (x, y, scop) => {
        if (x.type == "null" && y.type == "null")
            return {
                type: "bool",
                data: true
            };

        if (x.type == "number" || y.type == "number")
            return {
                type: "bool",
                data: await cast.float(x, scop) == await cast.float(y, scop)
            };

        if (x.type == "int" || y.type == "int")
            return {
                type: "bool",
                data: await cast.int(x, scop) == await cast.int(y, scop)
            };

        if (x.type == "string" || y.type == "string")
            return {
                type: "bool",
                data: (await cast.string(x, scop)).normalize("NFC") == (await cast.string(y, scop)).normalize("NFC")
            };

        if (x.type == "bool" || y.type == "bool")
            return {
                type: "bool",
                data: await cast.bool(x, scop) == await cast.bool(y, scop)
            };

        if (x.type == "array" || y.type == "array") {
            var aray = await cast.array(x, scop);
            var array = await cast.array(y, scop);

            return {
                type: "bool",
                data: aray.length == array.length && await Promise.all(aray.map((z, i) => quals(z, array[i], scop))).every(x => x.data)
            };
        }

        if (x.type == "id" && y.type == "id") {
            if (x.data != y.data)
                return {
                    type: "bool",
                    data: false
                };

            return (x.scopd ? x.scop : scop).find(s => s.vars.has(x.data)) == (y.scopd ? y.scop : scop).find(s => s.vars.has(y.data));
        }

        return {
            type: "bool",
            data: false
        };
    })));

    var is;

    global.set("==", (const_op(is = (x, y, scop) => {
        if (x.type != y.type)
            return {
                type: "bool",
                data: false
            };

        switch (x.type) {
            case "null":
                return {
                    type: "bool",
                    data: true
                };
            case "number":
            case "int":
            case "string":
            case "bool":
                return {
                    type: "bool",
                    data: x.data == y.data
                };
            case "array":
                var aray = x.data;
                var array = y.data;

                return {
                    type: "bool",
                    data: aray.length == array.length && aray.every((z, i) => is(z, array[i], scop).data)
                };
        }

        return {
            type: "bool",
            data: false
        };
    })));

    global.set("!~", const_op(async (x, y, scop) => ({
        type: "bool",
        data: !(await quals(x, y, scop)).data
    })));

    global.set("!", const_op(async (x, y, scop) => ({
        type: "bool",
        data: !(await quals(x, y, scop)).data
    })));

    global.set("!=", const_op((x, y, scop) => ({
        type: "bool",
        data: !is(x, y, scop).data
    })));

    global.set("!!", const_op((x, y, scop) => ({
        type: "bool",
        data: !is(x, y, scop).data
    })));

    var assign_op = (op) => ({
        type: "builtin",
        partial: 0,
        data: (first, scop) => ({
            type: "builtin",
            partial: 1,
            data: async (arg, scop2) => {
                var rfirst = await do_run(first, scop);

                var nid = await par_to__var("id" in first ? {
                    ins: canonical(first.id)
                } : {
                    ins: rfirst
                }, );

                return assign(nid, await op(rfirst, await do_run(arg, scop2), scop), scop);
            }
        })
    });

    var assign_op_w_2nd = (op, _2nd) => ({
        type: "builtin",
        partial: 0,
        data: async (first, scop) => {
            var rfirst = await do_run(first, scop);

            var nid = await par_to__var("id" in first ? {
                ins: canonical(first.id)
            } : {
                ins: rfirst
            }, );

            return assign(nid, await op(rfirst, await _2nd(rfirst), scop), scop);
        }
    });

    var w_2nd = (op, _2nd) => ({
        type: "builtin",
        partial: 0,
        data: async (first, scop) => {
            var rfirst = await do_run(first, scop);

            return await op(rfirst, await _2nd(rfirst), scop);
        }
    });

    global.set("+=", assign_op(add));
    global.set("-=", assign_op(sub));
    global.set("*=", assign_op(mul));
    global.set("/=", assign_op(div));
    global.set("%=", assign_op(mod));

    var min_mod;

    global.set("++", assign_op_w_2nd(add, min_mod = (first) => {
        switch (first.type) {
            case "number":
                return {
                    type: "number",
                    data: 1
                };
            case "int":
                return {
                    type: "int",
                    data: 1n
                };
            case "string":
                return {
                    type: "string",
                    data: first.data.slice(-1)
                };
            case "bool":
                return {
                    type: "bool",
                    data: true
                };
            case "array":
                return {
                    type: "array",
                    data: first.data.slice(-1)
                };
        }

        return {
            type: "null"
        };
    }));

    global.set("--", assign_op_w_2nd(sub, min_mod));

    global.set("_", w_2nd(mul, (first) => {
        switch (first.type) {
            case "number":
                return {
                    type: "number",
                    data: -1
                };
            case "int":
                return {
                    type: "int",
                    data: -1n
                };
            case "string":
                return {
                    type: "int",
                    data: -1n
                };
            case "bool":
                return {
                    type: "bool",
                    data: true
                };
            case "array":
                return {
                    type: "int",
                    data: -1n
                };
        }

        return {
            type: "null"
        };
    }));

    global.set("@", {
        type: "builtin",
        partial: 0,
        data: async (data, scop) => {
            var ran = await do_run(data, scop);

            if (ran.type == "id")
                return await var_from({
                    ins: ran
                }, scop);

            return ran;
        }
    });

    global.set("if", {
        type: "builtin",
        partial: 0,
        data: (cond, scope) => ({
            type: "builtin",
            partial: 1,
            data: async (body, scope2) => {
                var cond_r = await do_run(cond, scope);

                if (await cast.bool(cond_r, scope))
                    return await do_run(body, scope2);

                return await do_ghost(body, scope2);
            }
        })
    });

    var format_input = (data) => {
        if (data == null)
            return {
                type: "null"
            };

        if (typeof data == "number")
            return {
                type: "number",
                data: data
            };
        if (typeof data == "bigint")
            return {
                type: "int",
                data: data
            };
        if (typeof data == "string")
            return {
                type: "string",
                data: data
            };
        if (typeof data == "boolean")
            return {
                type: "bool",
                data: data
            };
        if (Array.isArray(data))
            return {
                type: "array",
                data: data.map(format_input)
            };

        return {
            type: "null"
        };
    };

    var stringify = (data) => {
        switch (data.type) {
            case "null":
                return "Null";
            case "number":
                return stringify_float(data.data);
            case "int":
                return String(data.data);
            case "string":
                return data.data.length == 1 ? "'" + data.data : JSON.stringify(data.data);
            case "bool":
                return data.data ? "do" : "don't";
            case "array":
                return "(" + data.data.map(stringify).join(", ") + ")";
            case "function":
                return "[ function ]";
            case "builtin":
                return "[ built-in ]";
            case "id":
                return (data.scopd ? "id" : "nscopd-id") + "{" + data.data + "}";
        }

        return "?";
    };

    var s_stringify = (data) => {
        switch (data.type) {
            case "null":
                return "";
            case "number":
                return stringify_float(data.data);
            case "int":
                return String(data.data);
            case "string":
                return data.data;
            case "bool":
                return data.data ? "is" : "isn't";
            case "array":
                return "(" + data.data.map(s_stringify).join(", ") + ")";
            case "function":
                return "[ function ]";
            case "builtin":
                return "[ built-in ]";
            case "id":
                return (data.scopd ? "id" : "nscopd-id") + "{" + data.data + "}";
        }

        return "?";
    };

    global.set("(prints)", {
        type: "array",
        data: []
    });

    var print;

    global.set("print", {
        type: "builtin",
        partial: 0,
        data: (print = async (arg, scop) => {
            var print = await do_run(arg, scop);

            if (print.type == "null")
                return print;

            (await var_from({
                id: "(prints)"
            }, scop)).data.push(print);

            return print;
        })
    });

    global.set("(inputs)", {
        type: "array",
        data: Array.isArray(inputs) || inputs == null ? (inputs || []).map(format_input) : format_input([inputs])
    });

    global.set("input", {
        type: "builtin",
        partial: 0,
        data: async (arg, scop) => {
            var nid = await par_to__var({
                id: "(inputs)"
            }, scop);

            var from = (nid.scopd ? nid.scop : scop).find(s => s.vars.has(nid.data));
            var old = {
                type: "null"
            };

            if (from)
                old = from.vars.get(nid.data);

            var inputs = old;

            if (inputs.type != "array")
                return {
                    type: "id",
                    scopd: !0,
                    scop: nid.scopd ? nid.scop : scop,
                    data: nid.data
                };

            var prom_input = async () => {
                await print(arg, scop);

                var input = format_input(await input_prom({
                    prints: global.get("(prints)").type == "array" ? global.get("(prints)").data.map(stringify) : [stringify(global.get("(prints)"))],
                    sprints: global.get("(prints)").type == "array" ? global.get("(prints)").data.map(s_stringify).join("\n") : s_stringify(global.get("(prints)"))
                }));

                global.set("(prints)", {
                    type: "array",
                    data: []
                });

                return input;
            };

            return inputs.data.shift() || (input_prom ? prom_input() : {
                type: "null"
            });
        }
    });

    global.set(".is-partial", {
        type: "builtin",
        partial: 0,
        data: async (arg, scop) => {
            var data = await do_run(arg, scop);

            if (data.type == "builtin")
                return data.partial;

            return {
                type: "null"
            };
        }
    });

    global.set("cond", {
        type: "builtin",
        partial: 0,
        data: (cond, scop) => ({
            type: "builtin",
            partial: 1,
            data: (do_, scop_do_) => ({
                type: "builtin",
                partial: 2,
                data: async (n_t, scop_n_t) => {
                    var cond_r = await do_run(cond, scop);

                    if (await cast.bool(cond_r, scop))
                        return await do_run(do_, scop_do_);

                    return await do_run(n_t, scop_n_t);
                }
            })
        })
    });

    global.set("size", {
        type: "builtin",
        partial: 0,
        data: async (array, scop) => ({
            type: "int",
            data: BigInt((await cast.array(await do_run(array, scop))).length)
        })
    });

    global.set("car", {
        type: "builtin",
        partial: 0,
        data: async (array, scop) => {
            var arr = await cast.array(await do_run(array, scop));

            return arr[0] ? arr[0] : {
                type: "null"
            };
        }
    });

    global.set("cdr", {
        type: "builtin",
        partial: 0,
        data: async (array, scop) => ({
            type: "array",
            data: await cast.array(await do_run(array, scop)).slice(1)
        })
    });

    global.set("copy", {
        type: "builtin",
        partial: 0,
        data: async (data, scop) => copy(await do_run(data, scop))
    });

    global.set("isdo", {
        type: "builtin",
        partial: 0,
        data: async (data, scop) => ({
            type: "bool",
            data: await cast.bool(await do_run(data, scop))
        })
    });

    global.set("isn", {
        type: "builtin",
        partial: 0,
        data: async (data, scop) => ({
            type: "bool",
            data: (await do_run(data, scop)).type == "null"
        })
    });

    global.set("isnn't", {
        type: "builtin",
        partial: 0,
        data: async (data, scop) => ({
            type: "bool",
            data: (await do_run(data, scop)).type != "null"
        })
    });

    global.set("?", {
        type: "builtin",
        partial: 0,
        data: async (data, scop) => await do_run(data, scop)
    });

    global.set("cast.float", {
        type: "builtin",
        partial: 0,
        data: async (data, scop) => ({
            type: "float",
            data: await cast.float(await do_run(data, scop))
        })
    });

    global.set("cast.int", {
        type: "builtin",
        partial: 0,
        data: async (data, scop) => ({
            type: "int",
            data: await cast.int(await do_run(data, scop))
        })
    });

    global.set("cast.string", {
        type: "builtin",
        partial: 0,
        data: async (data, scop) => ({
            type: "string",
            data: await cast.string(await do_run(data, scop))
        })
    });

    global.set("cast.bool", {
        type: "builtin",
        partial: 0,
        data: async (data, scop) => ({
            type: "bool",
            data: await cast.bool(await do_run(data, scop))
        })
    });

    global.set("cast.array", {
        type: "builtin",
        partial: 0,
        data: async (data, scop) => ({
            type: "array",
            data: await cast.array(await do_run(data, scop))
        })
    });

    global.set("type", {
        type: "builtin",
        partial: 0,
        data: async (data, scop) => ({
            type: "string",
            data: (await do_run(data, scop)).type
        })
    });

    global.set("isdon't", {
        type: "builtin",
        partial: 0,
        data: async (data, scop) => ({
            type: "bool",
            data: !(await cast.bool(await do_run(data, scop)))
        })
    });

    global.set("not", {
        type: "builtin",
        partial: 0,
        data: async (data, scop) => ({
            type: "bool",
            data: !(await cast.bool(await do_run(data, scop)))
        })
    });

    var util = require("util");

    global.set("dbg", {
        type: "builtin",
        partial: 0,
        data: async (data, scop) => (console.log(util.inspect(await do_run(data, scop), {
            showHidden: false,
            depth: null,
            colors: true
        })), {
            type: "null"
        })
    });

    global.set("dbg.data", {
        type: "builtin",
        partial: 0,
        data: async (data, scop) => (console.log(util.inspect(await do_run(data, scop).data, {
            showHidden: false,
            depth: null,
            colors: true
        })), {
            type: "null"
        })
    });

    global.set("dbg.pars", {
        type: "builtin",
        partial: 0,
        data: (data, scop) => (console.log(util.inspect(data, {
            showHidden: false,
            depth: null,
            colors: true
        })), {
            type: "null"
        })
    });

    global.set("while", {
        type: "builtin",
        partial: 0,
        data: (cond, scope) => ({
            type: "builtin",
            partial: 1,
            data: async (body, scope2) => {
                var out = [];

                while (await cast.bool(await do_run(cond, scope), scope))
                    out.push(await do_run(body, scope2));

                return {
                    type: "array",
                    data: out
                };
            }
        })
    });

    global.set("do-while", {
        type: "builtin",
        partial: 0,
        data: (cond, scope) => ({
            type: "builtin",
            partial: 1,
            data: async (body, scope2) => {
                var out = [await do_run(body, scope2)];

                while (await cast.bool(await do_run(cond, scope), scope))
                    out.push(await do_run(body, scope2));

                return {
                    type: "array",
                    data: out
                };
            }
        })
    });

    global.set("for", {
        type: "builtin",
        partial: 0,
        data: (stmts, scop) => ({
            type: "builtin",
            partial: 1,
            data: async (body, scope2) => {
                var stmts2 = stmts.stmts || [stmts];

                var out = [];

                await do_run(stmts2[0] || {
                    ins: {
                        type: "null"
                    }
                }, scop);

                var cond = stmts2[1] || {
                    ins: {
                        type: "null"
                    }
                };

                while (await cast.bool(await do_run(cond, scop), scop)) {
                    out.push(await do_run(body, scope2));

                    for (var stmt of stmts2.slice(2))
                        await do_run(stmt, scop);
                }

                return {
                    type: "array",
                    data: out
                };
            }
        })
    });

    var numbop = (f) => ({
        type: "builtin",
        partial: 0,
        data: async (x, s) => {
            var d = await do_run(x, s);

            if (d.type == "int")
                return {
                    type: "int",
                    data: await cast.int({
                        type: "number",
                        data: f(await cast.float(d, s))
                    }, s)
                };

            return {
                type: "number",
                data: f(await cast.float(d, s))
            };
        }
    });

    var numbop_2 = (f) => ({
        type: "builtin",
        partial: 0,
        data: (y, s2) => ({
            type: "builtin",
            partial: 1,
            data: async (x, s) => {
                var c = await do_run(y, s2);
                var d = await do_run(x, s);

                if ((c.type == "int" || d.type == "int") && !(c.type == "number" || d.type == "number"))
                    return {
                        type: "int",
                        data: await cast.int({
                            type: "number",
                            data: f(Number(await cast.int(c, s2)), Number(await cast.int(d, s)))
                        }, s)
                    };

                return {
                    type: "number",
                    data: f(await cast.float(c, s2), await cast.float(d, s))
                };
            }
        })
    });

    global.set("abs", numbop(Math.abs));
    global.set("acos", numbop(Math.acos));
    global.set("acosh", numbop(Math.acosh));
    global.set("asin", numbop(Math.asin));
    global.set("asinh", numbop(Math.asinh));
    global.set("atan", numbop(Math.atan));
    global.set("atanh", numbop(Math.atanh));
    global.set("atan2", numbop_2(Math.atan2));
    global.set("ceil", numbop(Math.ceil));
    global.set("cbrt", numbop(Math.cbrt));
    global.set("expm1", numbop(Math.expm1));
    global.set("clz32", numbop(Math.clz32));
    global.set("cos", numbop(Math.cos));
    global.set("cosh", numbop(Math.cosh));
    global.set("exp", numbop(Math.exp));
    global.set("floor", numbop(Math.floor));
    global.set("fround", numbop(Math.fround));
    global.set("hypot", numbop(Math.hypot));
    global.set("imul", numbop_2(Math.imul));
    global.set("log", numbop(Math.log));
    global.set("log2", numbop(Math.log2));
    global.set("log10", numbop(Math.log10));
    global.set("max", numbop_2(Math.max));
    global.set("min", numbop_2(Math.min));
    global.set("pow", numbop_2(Math.pow));
    global.set("random", numbop(Math.random));
    global.set("round", numbop(Math.round));
    global.set("sign", numbop(Math.sign));
    global.set("sin", numbop(Math.sin));
    global.set("sinh", numbop(Math.sinh));
    global.set("sqrt", numbop(Math.sqrt));
    global.set("tan", numbop(Math.tan));
    global.set("tanh", numbop(Math.tanh));
    global.set("trunc", numbop(Math.trunc));
    global.set("E", {
        type: "number",
        data: Math.E
    });
    global.set("ln10", {
        type: "number",
        data: Math.LN10
    });
    global.set("ln2", {
        type: "number",
        data: Math.LN2
    });
    global.set("log10e", {
        type: "number",
        data: Math.LOG10E
    });
    global.set("log2e", {
        type: "number",
        data: Math.LOG2E
    });
    global.set("LN10", {
        type: "number",
        data: Math.LN10
    });
    global.set("LN2", {
        type: "number",
        data: Math.LN2
    });
    global.set("LOG10E", {
        type: "number",
        data: Math.LOG10E
    });
    global.set("LOG2E", {
        type: "number",
        data: Math.LOG2E
    });
    global.set("PI", {
        type: "number",
        data: Math.PI
    });
    global.set("SQRT1_2", {
        type: "number",
        data: Math.SQRT1_2
    });
    global.set("SQRT2", {
        type: "number",
        data: Math.SQRT2
    });

    var strop = (f) => ({
        type: "builtin",
        partial: 0,
        data: async (x, s) => {
            var d = await do_run(x, s);

            if (d.type == "string")
                return {
                    type: "string",
                    data: await cast.string({
                        type: "array",
                        data: await f(await cast.array(d, s), s)
                    }, s)
                };

            return {
                type: "array",
                data: await f(await cast.array(d, s), s)
            };
        }
    });

    var strop_2 = (f) => ({
        type: "builtin",
        partial: 0,
        data: (y, s2) => ({
            type: "builtin",
            partial: 1,
            data: async (x, s) => {
                var c = await do_run(y, s2);
                var d = await do_run(x, s);

                if ((c.type == "string" || d.type == "string") && !(c.type == "array" || d.type == "array"))
                    return {
                        type: "string",
                        data: await cast.string({
                            type: "array",
                            data: f([...(await cast.string(c, s2))], [...(await cast.string(d, s))])
                        }, s)
                    };

                return {
                    type: "array",
                    data: f(await cast.array(c, s2), await cast.array(d, s))
                };
            }
        })
    });

    var strop_2n2 = (f) => ({
        type: "builtin",
        partial: 0,
        data: (y, s2) => ({
            type: "builtin",
            partial: 1,
            data: async (x, s) => {
                var c = await do_run(y, s2);
                var d = await do_run(x, s);

                if (c.type == "string")
                    return {
                        type: "string",
                        data: await cast.string({
                            type: "array",
                            data: f(await cast.array(c, s2), d, s)
                        }, s)
                    };

                return {
                    type: "array",
                    data: f(await cast.array(c, s2), d, s)
                };
            }
        })
    });

    var strop_2c2 = (f) => ({
        type: "builtin",
        partial: 0,
        data: (y, s2) => ({
            type: "builtin",
            partial: 1,
            data: async (x, s) => {
                var c = await do_run(y, s2);
                var d = await do_run(x, s);

                if (c.type == "string")
                    return {
                        type: "array",
                        data: (await Promise.all((await f(await cast.array(c, s2), [...(await cast.string(d, s))].map(x => ({
                            type: "string",
                            data: x
                        })), s)).map(x => cast.string(x, s)))).map(x => ({
                            type: "string",
                            data: x
                        }))
                    };

                return {
                    type: "array",
                    data: await f(await cast.array(c, s2), await cast.array(d, s), s)
                };
            }
        })
    });

    var strop_d = (f) => ({
        type: "builtin",
        partial: 0,
        data: (y, s2) => ({
            type: "builtin",
            partial: 1,
            data: async (x, s) => {
                var c = await do_run(y, s2);
                var d = await do_run(x, s);

                if (c.type == "string")
                    return {
                        type: "string",
                        data: await cast.string({
                            type: "array",
                            data: await f([...(await cast.string(c, s2))].map(c => ({
                                type: "string",
                                data: c
                            })), d, s)
                        }, s)
                    };

                return {
                    type: "array",
                    data: await f(await cast.array(c, s2), d, s)
                };
            }
        })
    });

    var strop_dnc = (f) => ({
        type: "builtin",
        partial: 0,
        data: (y, s2) => ({
            type: "builtin",
            partial: 1,
            data: async (x, s) => {
                var c = await do_run(y, s2);
                var d = await do_run(x, s);

                if (c.type == "string")
                    return await f([...(await cast.string(c, s2))].map(c => ({
                        type: "string",
                        data: c
                    })), d, s);

                return await f(await cast.array(c, s2), d, s);
            }
        })
    });

    global.set("strfor", strop_d(async (str, f, scop) => {
        var don = [];

        for (var s of str)
            don.push(await call(f, scop, {
                ins: s
            }));

        return don;
    }));

    global.set("filt", strop_d(async (str, f, scop) => {
        var filt = [];

        for (var s of str)
            if (await cast.bool(await call(f, scop, {
                ins: s
            }), scop))
                filt.push(s);

        return filt;
    }));

    global.set("find", strop_dnc(async (str, f, scop) => {
        for (var s of str)
            if (await cast.bool(await call(f, scop, {
                ins: s
            }), scop))
                return s;

        return {
            type: "null"
        };
    }));

    global.set("findpos", strop_dnc(async (str, f, scop) => {
        var i = 0n;

        for (var s of str) {
            if (await cast.bool(await call(f, scop, {
                ins: s
            }), scop))
                return {
                    type: "int",
                    data: i
                };

            i++;
        }

        return {
            type: "int",
            data: -1n
        };
    }));

    global.set("findposs", strop_dnc(async (str, f, scop) => {
        var poss = [];

        var i = 0n;

        for (var s of str) {
            if (await cast.bool(await call(f, scop, {
                ins: s
            }), scop))
                poss.push({
                    type: "int",
                    data: i
                });

            i++;
        }

        return {
            type: "array",
            data: poss
        };
    }));

    global.set("rdc", strop_dnc(async (str, f, scop) => {
        if (!str.length)
            return {
                type: "null"
            };

        var d = str[0];

        for (var s of str.slice(1))
            d = await call(await call(f, scop, {
                ins: d
            }), scop, {
                ins: s
            });

        return d;
    }));

    global.set("rdcr", strop_dnc(async (str, f, scop) => {
        if (!str.length)
            return {
                type: "null"
            };

        str = [...str].reverse();

        var d = str[0];

        for (var s of str.slice(1))
            d = await call(await call(f, scop, {
                ins: d
            }), scop, {
                ins: s
            });

        return d;
    }));

    global.set("sort", strop_d(async (str, f, scop) => {
        var sort_with = async (data, comparator) => {
            var comb = async (...arrays) => {
                var combd = [];

                while (arrays[0].length != 0 || arrays[1].length != 0) {
                    if (arrays[0].length == 0) {
                        combd.push(arrays[1].shift());

                        continue;
                    }

                    if (arrays[1].length == 0) {
                        combd.push(arrays[0].shift());

                        continue;
                    }

                    combd.push(Math.sign(Number(await cast.int(await comparator(arrays[0][0], arrays[1][0]), scop))) != 1 ? arrays[0].shift() : arrays[1].shift());
                }

                return combd;
            };

            var parts = (array) => [array.slice(0, Math.ceil(array.length / 2)), array.slice(Math.ceil(array.length / 2))];

            var sort = async (array) => {
                if (array.length <= 1)
                    return array;

                if (array.length == 2)
                    return Math.sign(Number(await cast.int(await comparator(array[0], array[1]), scop))) != 1 ? [array[0], array[1]] : [array[1], array[0]];

                return await comb(...(await Promise.all(parts(array).map(sort))));
            };

            return await sort(data);
        };

        return sort_with(str, async (x, y) => await call(await call(f, scop, {
            ins: x
        }), scop, {
            ins: y
        }));
    }));

    global.set("norm", {
        type: "builtin",
        partial: 0,
        data: async (str, scop) => ({
            type: "string",
            data: (await cast.string(await do_run(str, scop), scop)).normalize("NFC")
        })
    });

    global.set("points", {
        type: "builtin",
        partial: 0,
        data: async (str, scop) => ({
            type: "array",
            data: [...(await cast.string(await do_run(str, scop), scop))].map(c => ({
                type: "int",
                data: BigInt(c.codePointAt())
            }))
        })
    });

    global.set("from-points", {
        type: "builtin",
        partial: 0,
        data: async (str, scop) => ({
            type: "string",
            data: (await Promise.all((await cast.array(await do_run(str, scop), scop)).map(p => cast.int(p, scop)))).map(p => String.fromCodePoint(Number((p % 0x10ffffn + 0x10ffffn) % 0x10ffffn))).join("")
        })
    });

    global.set("sto", strop_2n2(async (str, inx, scop) => str.slice(0, Number(await cast.int(inx, scop)))));
    global.set("sfro", strop_2n2(async (str, inx, scop) => str.slice(Number(await cast.int(inx, scop)))));

    global.set("flip", strop(async (str, scop) => {
        str = await Promise.all(str.map(x => cast.array(x, scop)));

        var max = str.reduce((x, n) => Math.max(x, n.length), 0);

        return [...Array(max)].map((_, i) => ({
            type: "array",
            data: str.map(s => i in s ? s[i] : {
                type: "null"
            })
        }));
    }));

    global.set("rvr", strop(async (str, scop) => [...str].reverse()));

    global.set("split", strop_2c2(async (str, by, scop) => {
        if (by.length == 0)
            return str.map(x => ({
                type: "array",
                data: [x]
            }));
        
        console.log(str, by);

        var split = [[]];
        var n = 0;

        for (var i = 0; i < str.length; i++) {
            if (is(str[i], by[n], scop).data) {
                n++;

                if (n == by.length) {
                    split.push([]);
                    
                    n = 0;
                }
            } else {
                if (n) {
                    split[split.length - 1] = split[split.length - 1].concat(by.slice(0, n));
                    n = 0;
                    
                }
                
                split[split.length - 1].push(str[i]);
            }
        }

        if (n) {
            split[split.length - 1] = split[split.length - 1].concat(by.slice(0, n));
        }
        
        console.log(split);

        return split.map(s => ({
            type: "array",
            data: s
        }));
    }));
    
    var crush = (x, with_ = []) => ({
        type: "array",
        data: x.data.flatMap((d, i) => [...(i ? with_ : []), ...(d.type == "array" ? crush(d, with_).data : [d])])
    });
    
    var squish = (x, with_ = []) => ({
        type: "array",
        data: x.data.flatMap((d, i) => [...(i ? with_ : []), ...(d.type == "array" ? d.data : [d])])
    });
    
    global.set("squish", {
        type: "builtin",
        partial: 0,
        data: async (first, scop) => {
            var str = await cast.array(await do_run(first, scop), scop);
            
            return squish({
                type: "array",
                data: str
            });
        }
    });
    
    global.set("squish-with", {
        type: "builtin",
        partial: 0,
        data: (first, scop) => ({
            type: "builtin",
            partial: 1,
            data: async (with_, scop2) => {
                var str = await cast.array(await do_run(first, scop), scop);
                
                with_ = await do_run(with_, scop2);
                
                return await (with_.type == "string" ? async (x) => ({
                    type: "string",
                    data: await cast.string(x, scop)
                }) : (x => x))(squish({
                    type: "array",
                    data: str
                }, await cast.array(with_, scop2)));
            }
        })
    });
    
    global.set("crush", {
        type: "builtin",
        partial: 0,
        data: async (first, scop) => {
            var str = await cast.array(await do_run(first, scop), scop);
            
            return crush({
                type: "array",
                data: str
            });
        }
    });
    
    global.set("crush-with", {
        type: "builtin",
        partial: 0,
        data: (first, scop) => ({
            type: "builtin",
            partial: 1,
            data: async (with_, scop2) => {
                var str = await cast.array(await do_run(first, scop), scop);
                
                with_ = await do_run(with_, scop2);
                
                return await (with_.type == "string" ? async (x) => ({
                    type: "string",
                    data: await cast.string(x, scop)
                }) : async (x => x))(crush({
                    type: "array",
                    data: str
                }, await cast.array(with_, scop2)));
            }
        })
    });
    
    if (pscop)
        global = pscop;

    var global_scope = [{
        vars: global,
        pars: {
            type: "function",
            arg: {
                type: "id",
                scopd: !1,
                data: "(inputs)"
            },
            data: parsd
        }
    }];

    global_scope[0].pars.scope = global_scope;

    var out = await do_run(parsd, global_scope);

    // console.log(out);

    // console.log(global.get("(prints)"));

    return {
        scop: global,
        out: stringify(out),
        prints: global.get("(prints)").type == "array" ? global.get("(prints)").data.map(stringify) : [stringify(global.get("(prints)"))],
        sprints: global.get("(prints)").type == "array" ? global.get("(prints)").data.map(s_stringify).join("\n") : s_stringify(global.get("(prints)"))
    };
};

var render = (parsd) => {
    if ("id" in parsd)
        return parsd.id;

    var first = render(parsd.first).split("\n");
    var op = render(parsd.op).split("\n");
    var arg = render(parsd.arg).split("\n");

    if (first.length > arg.length)
        arg = arg.concat(Array(first.length - arg.length).fill(" ".repeat(arg[0].length)));
    if (arg.length > first.length)
        first = first.concat(Array(arg.length - first.length).fill(" ".repeat(first[0].length)));

    return [...op.map(o => " ".repeat(first[0].length) + o + " ".repeat(arg[0].length)), ...[...Array(first.length)].map((_, i) => first[i] + " ".repeat(op[0].length) + arg[i])].join("\n");
};

module.exports = rSNBATWPL;
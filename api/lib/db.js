"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Debug = require("debug");
var mysql = require("promise-mysql");
var config_1 = require("../config");
var debug = Debug('dev:db');
var env = process.env.NODE_ENV;
var pool = mysql.createPool({
    host: config_1.database[env].host,
    user: config_1.database[env].user,
    database: config_1.database[env].name,
    password: config_1.database[env].password,
    port: 3306,
    connectionLimit: 1000,
});
var query = function (connect, sql, questionMark) {
    return Promise.resolve().then(function () {
        if (typeof sql === 'object') {
            return Promise.all(sql.map(function (item) { return connect.query(item, questionMark); }));
        }
        return connect.query(sql, questionMark);
    })
        .then(function (res) {
        pool.releaseConnection(connect);
        return res;
    })
        .catch(function (err) {
        pool.releaseConnection(connect);
        throw err;
    });
};
function formatSQL(inputJSON, conjunction) {
    var sql = '';
    Object.keys(inputJSON).forEach(function (field) {
        var value = inputJSON[field];
        var inputValue;
        if (value === null)
            inputValue = 'NULL';
        else if (value === undefined)
            return;
        else {
            inputValue = "'" + (typeof value === 'string' && value.indexOf("'") > -1
                ? value.replace(new RegExp("'", 'g'), "\\'")
                : value) + "'";
        }
        sql = sql.concat(field + " = " + inputValue + " " + conjunction + " ");
    });
    sql = sql.slice(0, -(conjunction.length + 2));
    return sql;
}
var genSql = function (type, tbl, tgtJSON, refJSON) {
    var sql = (type === 'insert' ? 'INSERT INTO' : 'UPDATE') + " " + config_1.database[env].name + "." + tbl + " SET " + formatSQL(tgtJSON, ',');
    if (type === 'update')
        sql += " WHERE " + formatSQL(refJSON, 'AND');
    return sql;
};
var getConnection = function () { return pool.getConnection()
    .catch(function (err) { throw Error(err); }); };
exports.getOneTable = function (table, referenceJSON, target) {
    return Promise.resolve([
        "SELECT " + ((target && target.join(',')) || '*') + " FROM " + table,
        "WHERE " + formatSQL(referenceJSON, 'and'),
    ].join(' '))
        .then(function (sql) { return getConnection()
        .then(function (c) { return query(c, sql); }); })
        .catch(function (err) {
        debug("'getOneTable' Error");
        throw err;
    });
};
exports.insertOneRow = function (table, insertJSON) { return Promise.resolve().then(function () {
    var sql = genSql('insert', table, insertJSON);
    debug(sql);
    return getConnection().then(function (c) { return query(c, sql); });
})
    .catch(function (err) {
    debug("'insertOneRow' Error");
    throw err;
}); };
exports.insertMultipleRows = function (table, fields, valueSets) {
    return Promise.resolve().then(function () {
        var columns = fields.map(function (column) { return "`" + column + "`"; });
        var sql = "INSERT INTO " + table + " (" + columns.join(', ') + ") VALUES " + valueSets.map(function () { return "(" + columns.map(function () { return '?'; }).join(', ') + ")"; }).join(', ');
        return getConnection().then(function (c) { return query(c, sql, [].concat.apply([], valueSets)); });
    })
        .catch(function (e) {
        debug("'insertMultipleRows' Error");
        throw e;
    });
};
exports.updateOneRow = function (table, refJSON, tarJSON, multi) {
    return Promise.resolve().then(function () {
        var sql = genSql('update', table, tarJSON, refJSON);
        if (multi) {
            sql = [sql].concat(multi.map(function (json) {
                return genSql(json.method, json.table, json.target, json.ref);
            }));
        }
        return getConnection().then(function (c) { return query(c, sql); });
    })
        .catch(function (err) {
        debug("'updateOneRow' Error");
        throw err;
    });
};
exports.freeQuery = function (sql, values) {
    return getConnection().then(function (c) { return query(c, sql, values); })
        .catch(function (err) {
        debug("'freeQuery' Error");
        throw err;
    });
};
//# sourceMappingURL=db.js.map
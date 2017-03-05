var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    var mvcct_odata;
    (function (mvcct_odata) {
        var firstArgumentNull = "first argument must have a not null value";
        var anArgumentNull = "all arguments must have a not null value";
        var firstOperandNull = "first operand must have a not null value";
        var notImplemented = "notImplemented";
        var guidMatch = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
        var QueryNode = (function () {
            function QueryNode() {
            }
            QueryNode.prototype.encodeProperty = function (name) {
                if (name == null)
                    return null;
                return name.replace(/\./g, '/');
            };
            return QueryNode;
        }());
        mvcct_odata.QueryNode = QueryNode;
        var QueryFilterClause = (function (_super) {
            __extends(QueryFilterClause, _super);
            function QueryFilterClause() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return QueryFilterClause;
        }(QueryNode));
        mvcct_odata.QueryFilterClause = QueryFilterClause;
        var QueryFilterBooleanOperator = (function (_super) {
            __extends(QueryFilterBooleanOperator, _super);
            function QueryFilterBooleanOperator(y, a1, a2) {
                if (a1 === void 0) { a1 = null; }
                if (a2 === void 0) { a2 = null; }
                var _this = _super.call(this) || this;
                if (typeof y == "number") {
                    if (!a1)
                        throw firstOperandNull;
                    if (typeof a1.dateTimeType == "undefined") {
                        _this.child1 = a1;
                        _this.argument1 = null;
                    }
                    else {
                        _this.child1 = null;
                        _this.argument1 = a1;
                    }
                    if (!a2) {
                        _this.child2 = null;
                        _this.argument2 = null;
                    }
                    else if (typeof a2.dateTimeType == "undefined") {
                        _this.child2 = a2;
                        _this.argument2 = null;
                    }
                    else {
                        _this.child2 = null;
                        _this.argument2 = a2;
                    }
                }
                else {
                    if (!y)
                        throw firstArgumentNull;
                    _this.argument1 = y.argument1 ?
                        (typeof y.argument1.inv != "undefined" ?
                            new QueryFilterCondition(y.argument1)
                            : new QueryValue(y.argument1))
                        : null;
                    _this.argument2 = y.argument2 ?
                        (typeof y.argument2.inv != "undefined" ?
                            new QueryFilterCondition(y.argument2)
                            : new QueryValue(y.argument2))
                        : null;
                    _this.child1 = y.child1 ? new QueryFilterBooleanOperator(y.child1) : null;
                    _this.child2 = y.child2 ? new QueryFilterBooleanOperator(y.child2) : null;
                    ;
                    _this.operator = y.operator;
                }
                return _this;
            }
            QueryFilterBooleanOperator.prototype.toString = function () {
                var arg1 = this.argument1 || this.child1;
                var arg2 = this.argument2 || this.child2;
                if (!arg1 && !arg2)
                    return null;
                if (this.operator == QueryFilterBooleanOperator.not)
                    return "(not " + (arg1 || arg2).toString() + ")";
                else if (this.operator == QueryFilterBooleanOperator.NOT)
                    return "(not " + (arg1 || arg2).toString() + ")";
                else if (!arg1)
                    return arg2.toString();
                else if (!arg2)
                    return arg1.toString();
                var sarg1 = arg1.toString();
                var sarg2 = arg2.toString();
                if (!sarg1)
                    return sarg2 || null;
                if (!sarg2)
                    return sarg1 || null;
                else if (this.operator == QueryFilterBooleanOperator.and)
                    return "(" + sarg1 + " and " + sarg2 + ")";
                else if (this.operator == QueryFilterBooleanOperator.AND)
                    return "(" + sarg1 + " AND " + sarg2 + ")";
                else if (this.operator == QueryFilterBooleanOperator.OR)
                    return "(" + sarg1 + " OR " + sarg2 + ")";
                else
                    return "(" + sarg1 + " or " + sarg2 + ")";
            };
            return QueryFilterBooleanOperator;
        }(QueryFilterClause));
        QueryFilterBooleanOperator.and = 0;
        QueryFilterBooleanOperator.or = 1;
        QueryFilterBooleanOperator.not = 2;
        QueryFilterBooleanOperator.AND = 3;
        QueryFilterBooleanOperator.OR = 4;
        QueryFilterBooleanOperator.NOT = 5;
        mvcct_odata.QueryFilterBooleanOperator = QueryFilterBooleanOperator;
        var QueryValue = (function (_super) {
            __extends(QueryValue, _super);
            function QueryValue(origin) {
                if (origin === void 0) { origin = null; }
                var _this = _super.call(this) || this;
                if (origin) {
                    _this.value = origin.value;
                    _this.dateTimeType = origin.dateTimeType;
                }
                else {
                    _this.value = null;
                    _this.dateTimeType = QueryFilterCondition.IsNotDateTime;
                }
                return _this;
            }
            QueryValue.prototype.formatInt = function (x, len) {
                var res = x + "";
                if (res.length < len)
                    return new Array(len - res.length + 1).join("0") + res;
                else
                    return res;
            };
            QueryValue.prototype.normalizeTime = function (x, days, maxTree) {
                var parts = x.split(":");
                if (days && parts[0].indexOf(".") < 0)
                    x = "00." + x;
                if (parts.length == 1)
                    x = x + ":00:00.000";
                else if (parts.length == 2)
                    x = x + ":00.000";
                else if (parts[2].indexOf(".") < 0)
                    x = x + ".000";
                else if (maxTree && parts[2].length > 6)
                    x = x.substr(0, x.length - parts[2].length + 6);
                return x;
            };
            QueryValue.prototype.isGuid = function () {
                return typeof this.value == "string" && guidMatch.test(this.value);
            };
            QueryValue.prototype.setDate = function (x) {
                this.dateTimeType = QueryValue.IsDate;
                if (!x)
                    this.value = null;
                this.value = this.formatInt(x.getFullYear(), 4) +
                    "-" + this.formatInt(x.getMonth() + 1, 2) +
                    "-" + this.formatInt(x.getDate(), 2) + "T00:00:00.000";
            };
            QueryValue.prototype.setTime = function (x) {
                this.dateTimeType = QueryValue.IsTime;
                if (!x)
                    this.value = null;
                this.value = this.formatInt(x.getHours(), 2) +
                    ":" + this.formatInt(x.getMinutes(), 2) +
                    ":" + this.formatInt(x.getSeconds(), 2) +
                    "." + this.formatInt(x.getMilliseconds(), 3);
            };
            QueryValue.prototype.setDuration = function (days, hours, minutes, seconds, milliseconds) {
                if (minutes === void 0) { minutes = 0; }
                if (seconds === void 0) { seconds = 0; }
                if (milliseconds === void 0) { milliseconds = 0; }
                this.dateTimeType = QueryValue.IsDuration;
                this.value = this.formatInt(days || 0, 2) +
                    "." + this.formatInt(hours || 0, 2) +
                    ":" + this.formatInt(minutes || 0, 2) +
                    "." + this.formatInt(milliseconds || 0, 3);
            };
            QueryValue.prototype.setDateTimeLocal = function (x) {
                this.dateTimeType = QueryValue.IsDateTime;
                if (!x)
                    this.value = null;
                return x.toISOString();
            };
            QueryValue.prototype.setDateTimeInvariant = function (x) {
                this.dateTimeType = QueryValue.IsDateTime;
                if (!x)
                    this.value = null;
                this.value = this.formatInt(x.getFullYear(), 4) +
                    "-" + this.formatInt(x.getMonth() + 1, 2) +
                    "-" + this.formatInt(x.getDate(), 2) +
                    "T" + this.formatInt(x.getHours(), 2) +
                    ":" + this.formatInt(x.getMinutes(), 2) +
                    ":" + this.formatInt(x.getSeconds(), 2) +
                    "." + this.formatInt(x.getUTCMilliseconds(), 3);
            };
            QueryValue.prototype.setBoolean = function (x) {
                this.dateTimeType = QueryValue.IsNotDateTime;
                this.value = x;
            };
            QueryValue.prototype.setNumber = function (x) {
                this.dateTimeType = QueryValue.IsNotDateTime;
                this.value = x;
            };
            QueryValue.prototype.setString = function (x) {
                this.dateTimeType = QueryValue.IsNotDateTime;
                this.value = x;
            };
            QueryValue.prototype.toString = function () {
                if (this.value === null || typeof this.value == "undefined")
                    return null;
                else if (this.dateTimeType == QueryValue.IsNotDateTime)
                    return this.value + "";
                var val = this.value;
                switch (this.dateTimeType) {
                    case QueryValue.IsDateTime:
                        if (val.charAt(val.length - 1).toUpperCase() != "Z")
                            return val + "Z";
                        else
                            return val;
                    case QueryValue.IsDate:
                        return val.split("T")[0];
                    case QueryValue.IsTime:
                        val = this.normalizeTime(val, false, true);
                        return val;
                    case QueryValue.IsDuration:
                        val = this.normalizeTime(val, true, false);
                        var parts = val.match(/\d+/g);
                        return "'P" + parts[0] + "D" +
                            parts[1] + "H" +
                            parts[2] + "M" +
                            parts[3] + "." +
                            parts[4] + new Array(13 - parts[4].length).join("0") + "S'";
                    default:
                        return null;
                }
            };
            return QueryValue;
        }(QueryFilterClause));
        QueryValue.IsNotDateTime = 0;
        QueryValue.IsDate = 1;
        QueryValue.IsTime = 2;
        QueryValue.IsDateTime = 3;
        QueryValue.IsDuration = 4;
        mvcct_odata.QueryValue = QueryValue;
        var QueryFilterCondition = (function (_super) {
            __extends(QueryFilterCondition, _super);
            function QueryFilterCondition(origin) {
                if (origin === void 0) { origin = null; }
                var _this = _super.call(this, origin) || this;
                if (origin) {
                    _this.operator = origin.operator;
                    _this.inv = origin.inv;
                    _this.property = origin.property;
                }
                else {
                    _this.operator = null;
                    _this.inv = false;
                    _this.property = null;
                }
                return _this;
            }
            QueryFilterCondition.prototype.toString = function () {
                var val = _super.prototype.toString.call(this);
                if (val === null)
                    return null;
                if (!this.property)
                    return val;
                if (this.dateTimeType == QueryValue.IsNotDateTime &&
                    typeof val == "string" &&
                    !this.isGuid())
                    val = "'" + val + "'";
                switch (this.operator) {
                    case QueryFilterCondition.startswith:
                    case QueryFilterCondition.endswith:
                    case QueryFilterCondition.contains:
                        if (this.inv)
                            return this.operator + "(" + val + "," + this.encodeProperty(this.property) + ")";
                        else
                            return this.operator + "(" + this.encodeProperty(this.property) + "," + val + ")";
                    default:
                        return "(" + this.encodeProperty(this.property) + " " + this.operator + " " + val + ")";
                }
            };
            return QueryFilterCondition;
        }(QueryValue));
        QueryFilterCondition.eq = "eq";
        QueryFilterCondition.ne = "ne";
        QueryFilterCondition.gt = "gt";
        QueryFilterCondition.lt = "lt";
        QueryFilterCondition.ge = "ge";
        QueryFilterCondition.le = "le";
        QueryFilterCondition.startswith = "startswith";
        QueryFilterCondition.endswith = "endswith";
        QueryFilterCondition.contains = "contains";
        mvcct_odata.QueryFilterCondition = QueryFilterCondition;
        var QuerySearch = (function (_super) {
            __extends(QuerySearch, _super);
            function QuerySearch(origin) {
                var _this = _super.call(this) || this;
                if (!origin)
                    throw firstArgumentNull;
                if (typeof origin.operator != "undefined") {
                    _this.value = new QueryFilterBooleanOperator(origin);
                }
                else
                    _this.value = origin.value ?
                        new QueryFilterBooleanOperator(origin.value)
                        : null;
                return _this;
            }
            QuerySearch.prototype.toString = function () {
                if (!this.value)
                    return null;
                else
                    return this.value.toString();
            };
            return QuerySearch;
        }(QueryNode));
        mvcct_odata.QuerySearch = QuerySearch;
        var QuerySortingCondition = (function (_super) {
            __extends(QuerySortingCondition, _super);
            function QuerySortingCondition(y, down) {
                if (down === void 0) { down = false; }
                var _this = _super.call(this) || this;
                if (typeof y == "string") {
                    _this.property = y;
                    _this.down = down;
                }
                else {
                    if (!y)
                        throw firstArgumentNull;
                    _this.property = y.property;
                    _this.down = y.down;
                }
                return _this;
            }
            QuerySortingCondition.prototype.toString = function () {
                if (!this.property)
                    return null;
                if (this.down)
                    return this.encodeProperty(this.property) + " desc";
                else
                    return this.encodeProperty(this.property) + " asc";
            };
            return QuerySortingCondition;
        }(QueryNode));
        mvcct_odata.QuerySortingCondition = QuerySortingCondition;
        var QueryAggregation = (function (_super) {
            __extends(QueryAggregation, _super);
            function QueryAggregation(y, property, alias) {
                if (property === void 0) { property = null; }
                if (alias === void 0) { alias = null; }
                var _this = _super.call(this) || this;
                if (typeof y == "string") {
                    if (!y || !property || !alias)
                        throw anArgumentNull;
                    _this.isCount = y == QueryAggregation.count;
                    _this.property = property;
                    _this.alias = alias;
                }
                else {
                    if (!y)
                        throw firstArgumentNull;
                    _this.isCount = y.isCount;
                    _this.operator = y.operator;
                    _this.alias = y.alias;
                    _this.property = y.property;
                }
                return _this;
            }
            QueryAggregation.prototype.toString = function () {
                if (!this.property || !this.operator || !this.alias)
                    return null;
                return this.encodeProperty(this.property) +
                    " with " + this.operator +
                    " as " + this.alias;
            };
            return QueryAggregation;
        }(QueryNode));
        QueryAggregation.count = "countdistinct";
        QueryAggregation.sum = "sum";
        QueryAggregation.average = "average";
        QueryAggregation.min = "min";
        QueryAggregation.max = "max";
        mvcct_odata.QueryAggregation = QueryAggregation;
        var QueryGrouping = (function (_super) {
            __extends(QueryGrouping, _super);
            function QueryGrouping(origin) {
                if (origin === void 0) { origin = null; }
                var _this = _super.call(this) || this;
                if (!origin) {
                    _this.keys = new Array();
                    _this.aggregations = new Array();
                }
                else {
                    if (origin.keys)
                        _this.keys = origin.keys.map(function (x) { return x; });
                    else
                        _this.keys = new Array();
                    if (origin.aggregations)
                        _this.aggregations = origin.aggregations
                            .map(function (x) { return new QueryAggregation(x); });
                    else
                        _this.aggregations = new Array();
                }
                return _this;
            }
            QueryGrouping.prototype.encodeGroups = function () {
                var _this = this;
                if (!this.keys == null || !this.keys.length)
                    return null;
                if (this.keys.length == 1)
                    return this.encodeProperty(this.keys[0]);
                return this.keys.map(function (x) { return _this.encodeProperty(x); }).join(',');
            };
            QueryGrouping.prototype.encodeAggrgates = function () {
                if (!this.aggregations || !this.aggregations.length)
                    return null;
                if (this.aggregations.length)
                    return this.aggregations[0].toString();
                return this.aggregations.map(function (x) { return x.toString(); }).join(',');
            };
            QueryGrouping.prototype.toString = function () {
                var groups = this.encodeGroups();
                if (!groups)
                    return null;
                var aggs = this.encodeAggrgates();
                if (!aggs)
                    return "groupby((" + groups + "))";
                else
                    return "groupby((" + groups + "),aggregate(" + aggs + ")";
            };
            return QueryGrouping;
        }(QueryNode));
        mvcct_odata.QueryGrouping = QueryGrouping;
        var Endpoint = (function () {
            function Endpoint(y, verb, accpetsJson, returnsJson, bearerToken) {
                if (verb === void 0) { verb = null; }
                if (accpetsJson === void 0) { accpetsJson = false; }
                if (returnsJson === void 0) { returnsJson = false; }
                if (bearerToken === void 0) { bearerToken = null; }
                if (typeof y == "string") {
                    this.baseUrl = y;
                    this.bearerToken = bearerToken;
                    this.accpetsJson = accpetsJson;
                    this.returnsJson = returnsJson;
                    this.verb = verb;
                }
                else {
                    if (!y)
                        throw firstArgumentNull;
                    this.baseUrl = y.baseUrl;
                    this.bearerToken = y.bearerToken;
                    this.accpetsJson = y.accpetsJson;
                    this.returnsJson = y.returnsJson;
                    this.verb = y.verb;
                }
            }
            return Endpoint;
        }());
        Endpoint.Get = "GET";
        Endpoint.Post = "POST";
        Endpoint.Put = "PUT";
        Endpoint.Delete = "DELETE";
        Endpoint.Patch = "PATCH";
        mvcct_odata.Endpoint = Endpoint;
        var QueryDescription = (function () {
            function QueryDescription(origin) {
                this.urlEncode = encodeURIComponent;
                if (origin) {
                    this.skip = origin.skip;
                    this.take = origin.take;
                    this.page = origin.page;
                    this.search = origin.search ? new QuerySearch(origin.search) : null;
                    this.filter = origin.filter ? new QueryFilterBooleanOperator(origin.filter) : null;
                    this.grouping = origin.grouping ? new QueryGrouping(origin.grouping) : null;
                    this.sorting = origin.sorting ?
                        origin.sorting.map(function (x) { return new QuerySortingCondition(x); }) : null;
                    this.attachedTo = origin.attachedTo ? new Endpoint(origin.attachedTo) : null;
                }
                else {
                    this.skip = null;
                    this.take = 0;
                    this.page = 0;
                    this.search = null;
                    this.filter = null;
                    this.grouping = null;
                    this.sorting = new Array();
                    this.attachedTo = null;
                }
            }
            QueryDescription.prototype.customUrlEncode = function (func) {
                this.urlEncode = func || this.urlEncode;
            };
            QueryDescription.fromJson = function (x) {
                if (!x)
                    return null;
                return new QueryDescription(JSON.parse(x));
            };
            QueryDescription.prototype.queryString = function () {
                var sb = new Array();
                var search = this.search ? this.search.toString() : null;
                ;
                var filter = null;
                if (search) {
                    sb.push(QueryDescription.searchName);
                    sb.push("=");
                    sb.push(this.urlEncode(search));
                }
                else {
                    filter = this.filter ? this.filter.toString() : null;
                    if (filter) {
                        sb.push(QueryDescription.filterName);
                        sb.push("=");
                        sb.push(this.urlEncode(filter));
                    }
                }
                var apply = this.grouping ? this.grouping.toString() : null;
                if (apply) {
                    if (sb.length)
                        sb.push("&");
                    sb.push(QueryDescription.applyName);
                    sb.push("=");
                    sb.push(this.urlEncode(apply));
                }
                var sorting = this.sorting ?
                    this.sorting.map(function (x) { return x.toString(); }).join(',') : null;
                if (sorting) {
                    if (sb.length)
                        sb.push("&");
                    sb.push(QueryDescription.sortingName);
                    sb.push("=");
                    sb.push(this.urlEncode(sorting));
                }
                if (this.skip > 0) {
                    if (sb.length)
                        sb.push("&");
                    sb.push(QueryDescription.skipName);
                    sb.push("=");
                    sb.push(this.skip + "");
                }
                if (this.take && this.take > 0) {
                    if (sb.length)
                        sb.push("&");
                    sb.push(QueryDescription.topName);
                    sb.push("=");
                    sb.push(this.take + "");
                }
                return sb.length ? sb.join("") : null;
            };
            QueryDescription.prototype.addToUrl = function (url) {
                if (!url)
                    url = '';
                var query = this.queryString();
                if (!query || !query.trim())
                    return url;
                if (url.indexOf('?') >= 0)
                    return url + "&" + query;
                else
                    return url + "?" + query;
            };
            QueryDescription.prototype.toString = function () {
                return this.addToUrl(this.attachedTo ? this.attachedTo.baseUrl : null);
            };
            return QueryDescription;
        }());
        QueryDescription.filterName = "$filter";
        QueryDescription.applyName = "$apply";
        QueryDescription.sortingName = "$orderby";
        QueryDescription.searchName = "$search";
        QueryDescription.topName = "$top";
        QueryDescription.skipName = "$skip";
        mvcct_odata.QueryDescription = QueryDescription;
    })(mvcct_odata || (mvcct_odata = {}));
    return mvcct_odata;
});
//# sourceMappingURL=mvcct.odata.js.map
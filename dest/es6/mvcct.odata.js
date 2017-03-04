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
var mvcct_odata;
(function (mvcct_odata) {
    var firstArgumentNull = "first argument must have a not null value";
    var anArgumentNull = "all arguments must have a not null value";
    var firstOperandNull = "first operand must have a not null value";
    var notImplemented = "notImplemented";
    var QueryNode = (function () {
        function QueryNode() {
        }
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
        QueryValue.prototype.setDate = function (x) {
            this.dateTimeType = QueryValue.IsDate;
        };
        QueryValue.prototype.setTime = function (x) {
            this.dateTimeType = QueryValue.IsTime;
        };
        QueryValue.prototype.setDuration = function (days, hours, minutes, seconds, milliseconds) {
            if (minutes === void 0) { minutes = 0; }
            if (seconds === void 0) { seconds = 0; }
            if (milliseconds === void 0) { milliseconds = 0; }
            this.dateTimeType = QueryValue.IsDuration;
        };
        QueryValue.prototype.setDateTimeLocal = function (x) {
            this.dateTimeType = QueryValue.IsDateTime;
        };
        QueryValue.prototype.setDateTimeUct = function (x) {
            this.dateTimeType = QueryValue.IsDateTime;
        };
        QueryValue.prototype.setDateTimeInvariant = function (x) {
            this.dateTimeType = QueryValue.IsDateTime;
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
            throw notImplemented;
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
            throw notImplemented;
        };
        return QueryFilterCondition;
    }(QueryValue));
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
export default mvcct_odata;
//# sourceMappingURL=mvcct.odata.js.map
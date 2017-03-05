declare namespace mvcct_odata {
    abstract class QueryNode {
        encodeProperty(name: string): string;
        abstract toString(): string | null;
    }
    abstract class QueryFilterClause extends QueryNode {
    }
    interface IQueryFilterBooleanOperator {
        operator: number;
        argument1: IQueryValue;
        argument2: IQueryValue;
        child1: IQueryFilterBooleanOperator;
        child2: IQueryFilterBooleanOperator;
    }
    class QueryFilterBooleanOperator extends QueryFilterClause implements IQueryFilterBooleanOperator {
        static and: number;
        static or: number;
        static not: number;
        static AND: number;
        static OR: number;
        static NOT: number;
        operator: number;
        argument1: QueryValue;
        argument2: QueryValue;
        child1: QueryFilterBooleanOperator;
        child2: QueryFilterBooleanOperator;
        constructor(origin: IQueryFilterBooleanOperator);
        constructor(operator: number, a1: QueryValue | QueryFilterBooleanOperator, a2?: QueryValue | QueryFilterBooleanOperator);
        toString(): string | null;
    }
    interface IQueryValue {
        value: any;
        dateTimeType: number;
    }
    class QueryValue extends QueryFilterClause implements IQueryValue {
        static IsNotDateTime: number;
        static IsDate: number;
        static IsTime: number;
        static IsDateTime: number;
        static IsDuration: number;
        value: any;
        dateTimeType: number;
        constructor(origin?: IQueryValue);
        private formatInt(x, len);
        private normalizeTime(x, days, maxTree);
        isGuid(): boolean;
        setDate(x: Date | null): void;
        setTime(x: Date | null): void;
        setDuration(days: number, hours: number, minutes?: number, seconds?: number, milliseconds?: number): void;
        setDateTimeLocal(x: Date | null): string;
        setDateTimeInvariant(x: Date | null): void;
        setBoolean(x: boolean | null): void;
        setNumber(x: number | null): void;
        setString(x: string | null): void;
        toString(): string | null;
    }
    interface IQueryFilterCondition extends IQueryValue {
        operator: string | null;
        property: string | null;
        inv: boolean;
    }
    class QueryFilterCondition extends QueryValue implements IQueryFilterCondition {
        static eq: string;
        static ne: string;
        static gt: string;
        static lt: string;
        static ge: string;
        static le: string;
        static startswith: string;
        static endswith: string;
        static contains: string;
        operator: string | null;
        property: string | null;
        inv: boolean;
        constructor(origin?: IQueryFilterCondition);
        toString(): string | null;
    }
    interface IQuerySearch {
        value: IQueryFilterBooleanOperator;
    }
    class QuerySearch extends QueryNode implements IQuerySearch {
        value: QueryFilterBooleanOperator;
        constructor(origin: IQuerySearch | IQueryFilterBooleanOperator);
        toString(): string | null;
    }
    interface IQuerySortingCondition {
        property: string;
        down: boolean;
    }
    class QuerySortingCondition extends QueryNode implements IQuerySortingCondition {
        property: string;
        down: boolean;
        constructor(x: IQuerySortingCondition);
        constructor(property: string, down?: boolean);
        toString(): string | null;
    }
    interface IQueryAggregation {
        operator: string;
        property: string;
        isCount: boolean;
        alias: string;
    }
    class QueryAggregation extends QueryNode implements IQueryAggregation {
        static count: string;
        static sum: string;
        static average: string;
        static min: string;
        static max: string;
        operator: string;
        property: string;
        isCount: boolean;
        alias: string;
        constructor(x: IQueryAggregation);
        constructor(operator: string, property: string, alias: string);
        toString(): string | null;
    }
    interface IQueryGrouping {
        keys: Array<string>;
        aggregations: Array<IQueryAggregation>;
    }
    class QueryGrouping extends QueryNode implements IQueryGrouping {
        keys: Array<string>;
        aggregations: Array<QueryAggregation>;
        constructor(origin?: IQueryGrouping);
        private encodeGroups();
        private encodeAggrgates();
        toString(): string | null;
    }
    interface IEndpoint extends Endpoint {
    }
    class Endpoint implements IEndpoint {
        static Get: string;
        static Post: string;
        static Put: string;
        static Delete: string;
        static Patch: string;
        baseUrl: string;
        verb: string;
        accpetsJson: boolean;
        returnsJson: boolean;
        bearerToken: string | null;
        constructor(x: IEndpoint);
        constructor(baseUrl: string, verb: string, accpetsJson?: boolean, returnsJson?: boolean, bearerToken?: string | null);
    }
    interface IQueryDescription {
        skip: number | null;
        take: number;
        page: number;
        search: IQuerySearch;
        filter: IQueryFilterBooleanOperator;
        grouping: IQueryGrouping;
        sorting: Array<IQuerySortingCondition>;
        attachedTo: IEndpoint;
    }
    class QueryDescription implements IQueryDescription {
        private static filterName;
        private static applyName;
        private static sortingName;
        private static searchName;
        private static topName;
        private static skipName;
        protected urlEncode: (x: string) => string;
        customUrlEncode(func: (x: string) => string): void;
        skip: number | null;
        take: number;
        page: number;
        search: QuerySearch;
        filter: QueryFilterBooleanOperator;
        grouping: QueryGrouping;
        sorting: Array<QuerySortingCondition>;
        attachedTo: Endpoint;
        static fromJson(x: string): QueryDescription;
        constructor(origin: IQueryDescription);
        queryString(): string | null;
        addToUrl(url: string | null): string | null;
        toString(): string | null;
    }
}
export = mvcct_odata;

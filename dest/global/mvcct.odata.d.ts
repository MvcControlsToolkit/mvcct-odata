declare namespace mvcct_odata {
    abstract class QueryNode {
    }
    abstract class QueryFilterClause extends QueryNode {
    }
    interface IQueryFilterBooleanOperator {
        operator: number;
        argument1: IQueryFilterCondition;
        argument2: IQueryFilterCondition;
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
        argument1: QueryFilterCondition;
        argument2: QueryFilterCondition;
        child1: QueryFilterBooleanOperator;
        child2: QueryFilterBooleanOperator;
        constructor(origin: IQueryFilterBooleanOperator);
        constructor(operator: number, a1: QueryFilterCondition | QueryFilterBooleanOperator, a2?: QueryFilterCondition | QueryFilterBooleanOperator);
    }
    interface IQueryFilterCondition extends QueryFilterCondition {
    }
    class QueryFilterCondition extends QueryFilterClause implements IQueryFilterCondition {
        static IsNotDateTime: number;
        static IsDate: number;
        static IsTime: number;
        static IsDateTime: number;
        static IsDuration: number;
        operator: string;
        property: string;
        value: any;
        inv: boolean;
        dateTimeType: number;
        constructor(origin?: IQueryFilterCondition);
    }
    interface IQuerySearch {
        value: IQueryFilterBooleanOperator;
    }
    class QuerySearch extends QueryNode implements IQuerySearch {
        value: QueryFilterBooleanOperator;
        constructor(origin: IQuerySearch | IQueryFilterBooleanOperator);
    }
    interface IQuerySortingCondition extends QuerySortingCondition {
    }
    class QuerySortingCondition extends QueryNode implements IQuerySortingCondition {
        property: string;
        down: boolean;
        constructor(x: IQuerySortingCondition);
        constructor(property: string, down?: boolean);
    }
    interface IQueryAggregation extends QueryAggregation {
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
    }
    interface IQueryGrouping {
        keys: Array<string>;
        aggregations: Array<IQueryAggregation>;
    }
    class QueryGrouping extends QueryNode implements IQueryGrouping {
        keys: Array<string>;
        aggregations: Array<QueryAggregation>;
        constructor(origin?: IQueryGrouping);
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
        constructor(origin: IQueryDescription);
    }
}
declare namespace mvcct {
    let odata: typeof mvcct_odata;
}

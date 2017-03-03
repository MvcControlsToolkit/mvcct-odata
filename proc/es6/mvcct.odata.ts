
namespace mvcct_odata {
    /// Query tree basic classes and interfaces
    const firstArgumentNull = "first argument must have a not null value";
    const anArgumentNull = "all arguments must have a not null value";
    const firstOperandNull = "first operand must have a not null value";
    export abstract class QueryNode
    {
    }

    /// filtering 
    export abstract class QueryFilterClause extends QueryNode
    {
        
    }  
    export interface IQueryFilterBooleanOperator
    {
        operator: number;
        argument1: IQueryFilterCondition;
        argument2: IQueryFilterCondition;
        child1: IQueryFilterBooleanOperator;
        child2: IQueryFilterBooleanOperator;
    }
    export class QueryFilterBooleanOperator extends QueryFilterClause implements IQueryFilterBooleanOperator
    {
        //boolean operators
        static and = 0;
        static or = 1;
        static not = 2;
        //free search operators
        static AND = 3;
        static OR = 4;
        static NOT = 5;

        operator: number;
        argument1: QueryFilterCondition;
        argument2: QueryFilterCondition;
        child1: QueryFilterBooleanOperator;
        child2: QueryFilterBooleanOperator;
        // protected get arg1() : QueryFilterClause
        // {
        //     return this.argument1 || this.child1;
        // }
        // protected get arg2() : QueryFilterClause
        // {
        //     return this.argument2 || this.child2;
        // }
        constructor(origin: IQueryFilterBooleanOperator);
        constructor(operator: number, 
            a1: QueryFilterCondition|QueryFilterBooleanOperator,
            a2?: QueryFilterCondition|QueryFilterBooleanOperator
            );
        constructor(y: number|IQueryFilterBooleanOperator, 
            a1: QueryFilterCondition|QueryFilterBooleanOperator = null,
            a2: QueryFilterCondition|QueryFilterBooleanOperator = null)
            {
                super();
                if(typeof y == "number")
                {
                    if(!a1) throw firstOperandNull;
                    if (typeof (<QueryFilterCondition>a1).inv == "undefined")
                    {
                        this.child1=(<QueryFilterBooleanOperator>a1);
                        this.argument1=null;
                    }
                    else
                    {
                        this.child1=null;
                        this.argument1=(<QueryFilterCondition>a1);
                    }
                    if(!a2) {
                        this.child2=null;
                        this.argument2=null;
                    }
                    else if (typeof (<QueryFilterCondition>a2).inv == "undefined")
                    {
                        this.child2=(<QueryFilterBooleanOperator>a2);
                        this.argument2=null;
                    }
                    else
                    {
                        this.child2=null;
                        this.argument2=(<QueryFilterCondition>a2);
                    }
                }
                else{
                    if(!y) throw firstArgumentNull;
                    this.argument1= y.argument1 ? new QueryFilterCondition(y.argument1) : null;
                    this.argument2= y.argument2 ? new QueryFilterCondition(y.argument2) : null;
                    this.child1=y.child1 ? new QueryFilterBooleanOperator(y.child1) : null;
                    this.child2=y.child2 ? new QueryFilterBooleanOperator(y.child2) : null;;
                    this.operator=y.operator;
                }
            }
    }
    export interface IQueryFilterCondition extends QueryFilterCondition
    {
        
    }
    export class QueryFilterCondition  extends QueryFilterClause implements IQueryFilterCondition
    {
        static IsNotDateTime= 0;
        static IsDate = 1;
        static IsTime = 2;
        static IsDateTime = 3;
        static IsDuration = 4;

        operator: string;
        property: string;
        value: any;
        inv: boolean;
        dateTimeType: number;
        constructor(origin: IQueryFilterCondition=null)
        {
            super();
            if(origin)
            {
                this.operator=origin.operator;
                this.inv=origin.inv;
                this.value = origin.value;
                this.property=origin.property;
                this.dateTimeType=origin.dateTimeType
            }
            else 
            {
                this.operator=null;
                this.inv=false;
                this.value = null;
                this.property=null;
                this.dateTimeType=QueryFilterCondition.IsNotDateTime;
            }
        }   
    }

    /// free search

    export interface IQuerySearch
    {
        value: IQueryFilterBooleanOperator;
    }

    export class QuerySearch  extends QueryNode implements IQuerySearch
    {
        value: QueryFilterBooleanOperator;
        constructor(origin: IQuerySearch|IQueryFilterBooleanOperator)
        {
            super();
            if (!origin) throw firstArgumentNull;
            if(typeof (<IQueryFilterBooleanOperator>origin).operator != "undefined")
            {
                this.value = new QueryFilterBooleanOperator(<IQueryFilterBooleanOperator>origin);
            }
            else
               this.value = (<IQuerySearch>origin).value ?   
                    new QueryFilterBooleanOperator((<IQuerySearch>origin).value) 
                    : null;
        }
    }

    /// sorting
    export interface IQuerySortingCondition extends QuerySortingCondition
    {

    }
    export class QuerySortingCondition  extends QueryNode implements IQuerySortingCondition
    {
        property: string;
        down: boolean;

        constructor(x: IQuerySortingCondition);
        constructor(property: string, down?: boolean);
        constructor(y: string|IQuerySortingCondition, down: boolean = false)
        {
            super();
            if(typeof y == "string")
            {
                this.property=y;
                this.down=down;
            }
            else
            {
                if(!y) throw firstArgumentNull; 
                this.property=y.property;
                this.down=y.down;
            }
            
        }
    }

    ///grouping
    export interface IQueryAggregation extends QueryAggregation
    {
        
    }

    export class QueryAggregation   extends QueryNode implements IQueryAggregation
    {
        static count = "countdistinct";
        static sum = "sum";
        static average = "average";
        static min = "min";
        static max = "max";

        operator: string;
        property: string;
        isCount: boolean;
        alias: string;

        constructor(x: IQueryAggregation);
        constructor(operator: string, property: string, alias: string);
        constructor(y: IQueryAggregation|string, property: string = null, alias: string = null)
        {
            super();
            if(typeof y == "string")
            {
               if(!y || !property || !alias) throw anArgumentNull; 
               this.isCount=y == QueryAggregation.count;
               this.property=property;
               this.alias=alias;
            }
            else{
                if(!y) throw firstArgumentNull; 
                this.isCount=y.isCount;
                this.operator=y.operator;
                this.alias=y.alias;
                this.property=y.property;
            }
        }
    }

    export interface IQueryGrouping 
    {
        keys: Array<string>;
        aggregations: Array<IQueryAggregation>;
    }

    export class QueryGrouping    extends QueryNode implements IQueryGrouping
    {
        keys: Array<string>;
        aggregations: Array<QueryAggregation>; 
        constructor(origin: IQueryGrouping = null)
        {
            super();
            if(!origin)
            {
                this.keys=new Array<string>();
                this.aggregations=new Array<QueryAggregation>();
            }
            else
            {
                if(origin.keys) this.keys=origin.keys.map(x => x);
                else this.keys=new Array<string>();
                if(origin.aggregations) this.aggregations=origin.aggregations
                    .map(x => new QueryAggregation(x));
                else this.aggregations=new Array<QueryAggregation>();
            }
        }
    }

    /// utility
    export interface IEndpoint extends Endpoint
    {
        
    }
    export class Endpoint implements IEndpoint
    {
        static Get: string = "GET";
        static Post: string = "POST";
        static Put: string = "PUT";
        static Delete: string = "DELETE";
        static Patch: string = "PATCH";

        baseUrl: string;
        verb: string;
        accpetsJson: boolean;
        returnsJson: boolean;
        bearerToken: string|null;

        constructor(x: IEndpoint);
        constructor(baseUrl: string, verb: string, accpetsJson?: boolean, returnsJson?: boolean, bearerToken?: string|null)
        constructor(y: string|IEndpoint, verb: string = null, accpetsJson: boolean = false, returnsJson: boolean = false, bearerToken: string|null = null)
        {
            if(typeof y == "string"){
                this.baseUrl = y;
                this.bearerToken=bearerToken;
                this.accpetsJson=accpetsJson;
                this.returnsJson=returnsJson;
                this.verb = verb;
            }
            else
            {
               if(!y) throw firstArgumentNull; 
               this.baseUrl = y.baseUrl;
               this.bearerToken=y.bearerToken;
               this.accpetsJson=y.accpetsJson;
               this.returnsJson=y.returnsJson;
               this.verb = y.verb;
            }
        }
        
        
    }
    
    ///Full query container
    export interface IQueryDescription
    {
        skip: number|null;
        take: number;
        page: number;

        search: IQuerySearch;
        filter: IQueryFilterBooleanOperator;
        grouping: IQueryGrouping;
        sorting: Array<IQuerySortingCondition>;

        attachedTo: IEndpoint;
    }
    export class QueryDescription implements IQueryDescription
    {
        private static filterName = "$filter";
        private static applyName = "$apply";
        private static sortingName = "$orderby";
        private static searchName = "$search";
        private static topName = "$top";
        private static skipName = "$skip";

        protected urlEncode : (x: string) => string = encodeURIComponent;
        public customUrlEncode(func: (x: string) => string)
        {
            this.urlEncode = func || this.urlEncode;
        }

        skip: number|null;
        take: number;
        page: number;

        search: QuerySearch;
        filter: QueryFilterBooleanOperator;
        grouping: QueryGrouping;
        sorting: Array<QuerySortingCondition>;

        attachedTo: Endpoint;
        constructor(origin: IQueryDescription)
        {
            if(origin)
            {
                this.skip=origin.skip;
                this.take=origin.take;
                this.page=origin.page; 

                this.search = origin.search ? new QuerySearch(origin.search) : null;
                this.filter = origin.filter ? new QueryFilterBooleanOperator(origin.filter) : null;
                this.grouping = origin.grouping ? new QueryGrouping(origin.grouping) : null;
                this.sorting = origin.sorting ? 
                    origin.sorting.map(x => new QuerySortingCondition(x)) : null; 

                this.attachedTo= origin.attachedTo ? new Endpoint(origin.attachedTo) : null;
            }
            else
            {
                this.skip=null;
                this.take=0;
                this.page=0;

                this.search=null;
                this.filter=null;
                this.grouping=null;
                this.sorting= new Array<QuerySortingCondition>();

                this.attachedTo=null;
            }
        }

    } 
    

}



export default mvcct_odata;

namespace mvcct_odata {
    /// Query tree basic classes and interfaces
    const firstArgumentNull = "first argument must have a not null value";
    const anArgumentNull = "all arguments must have a not null value";
    const firstOperandNull = "first operand must have a not null value";
    const notImplemented = "notImplemented";
    const guidMatch = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
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
        argument1: IQueryValue;
        argument2: IQueryValue;
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
        argument1: QueryValue;
        argument2: QueryValue;
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
            a1: QueryValue|QueryFilterBooleanOperator,
            a2?: QueryValue|QueryFilterBooleanOperator
            );
        constructor(y: number|IQueryFilterBooleanOperator, 
            a1: QueryValue|QueryFilterBooleanOperator = null,
            a2: QueryValue|QueryFilterBooleanOperator = null)
            {
                super();
                if(typeof y == "number")
                {
                    if(!a1) throw firstOperandNull;
                    if (typeof (<QueryFilterCondition>a1).dateTimeType == "undefined")
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
                    else if (typeof (<QueryFilterCondition>a2).dateTimeType == "undefined")
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
                    this.argument1= y.argument1 ? 
                        (typeof (<QueryFilterCondition>y.argument1).inv != "undefined" ?
                             new QueryFilterCondition(<QueryFilterCondition>y.argument1) 
                             : new QueryValue(y.argument1))
                        : null;
                    this.argument2= y.argument2 ? 
                        (typeof (<QueryFilterCondition>y.argument2).inv != "undefined" ?
                             new QueryFilterCondition(<QueryFilterCondition>y.argument2) 
                             : new QueryValue(y.argument2)) 
                        : null;
                    this.child1=y.child1 ? new QueryFilterBooleanOperator(y.child1) : null;
                    this.child2=y.child2 ? new QueryFilterBooleanOperator(y.child2) : null;;
                    this.operator=y.operator;
                }
            }
    }
    export interface IQueryValue
    {
        value: any;
        dateTimeType: number;
    }
    export class QueryValue extends QueryFilterClause implements IQueryValue
    {
        static IsNotDateTime= 0;
        static IsDate = 1;
        static IsTime = 2;
        static IsDateTime = 3;
        static IsDuration = 4;
        
        
        value: any;
        dateTimeType: number;
        constructor(origin: IQueryValue=null)
        {
            super();
            if(origin)
            {
                this.value = origin.value;
                this.dateTimeType=origin.dateTimeType
            }
            else 
            {
                this.value = null;
                this.dateTimeType=QueryFilterCondition.IsNotDateTime;
            }
        }
        private formatInt(x: number, len:number) : string
        {
            var res = x+"";
            if(res.length<len) return new Array(len-res.length+1).join("0")+res;
            else return res;
        }
        private normalizeTime(x: string, days: boolean, maxTree:boolean): string
        {
            var parts=x.split(":");
            if(days && parts[0].indexOf(".")<0) x="00."+x;
            if(parts.length==1) x=x+":00:00.000";
            else if (parts.length ==2) x=x+":00.000";
            else if(parts[2].indexOf(".")<0) x=x+".000";
            else if(maxTree && parts[2].length>6) x=x.substr(0, x.length-parts[2].length+6);
            return x; 
        }
        isGuid(): boolean
        {
            return typeof this.value == "string" && guidMatch.test(<string>this.value);
        }
        setDate(x: Date|null) {
            this.dateTimeType = QueryValue.IsDate;
            if(!x) this.value=null;
            this.value=this.formatInt(x.getFullYear(), 4) +
                "-"+this.formatInt(x.getMonth()+1, 2) +
                "-"+this.formatInt(x.getDate(), 2) +"T00:00:00.000";
        }
        setTime(x: Date|null) {
            this.dateTimeType = QueryValue.IsTime;
            if(!x) this.value=null;
            this.value=this.formatInt(x.getHours(), 2) +
                ":"+this.formatInt(x.getMinutes(), 2) +
                ":"+this.formatInt(x.getSeconds(), 2) +
                "."+this.formatInt(x.getUTCMilliseconds(), 3);
        } 
        setDuration(days: number, hours: number, minutes: number=0, 
            seconds: number =0, milliseconds: number =0) {
            this.dateTimeType = QueryValue.IsDuration;
            this.value=this.formatInt(days || 0, 2) +
                "."+this.formatInt(hours || 0, 2) +
                ":"+this.formatInt(minutes || 0, 2) +
                "."+this.formatInt(milliseconds || 0, 3);
        }
        setDateTimeLocal(x: Date|null) {
            this.dateTimeType = QueryValue.IsDateTime;
            if(!x) this.value=null;
            return x.toISOString();
        }
        setDateTimeInvariant(x: Date|null) {
            this.dateTimeType = QueryValue.IsDateTime;
            if(!x) this.value=null;
            this.value=this.formatInt(x.getFullYear(), 4) +
                "-"+this.formatInt(x.getMonth()+1, 2) +
                "-"+this.formatInt(x.getDate(), 2) +
                "T"+this.formatInt(x.getHours(), 2) +
                ":"+this.formatInt(x.getMinutes(), 2) +
                ":"+this.formatInt(x.getSeconds(), 2) +
                "."+this.formatInt(x.getUTCMilliseconds(), 3);
        }
        setBoolean(x: boolean|null) {
            this.dateTimeType = QueryValue.IsNotDateTime;
            this.value = x;
        }
        setNumber(x: number|null) {
            this.dateTimeType = QueryValue.IsNotDateTime;
            this.value = x;
        }
        setString(x: string|null) {
            this.dateTimeType = QueryValue.IsNotDateTime;
            this.value=x;
        }
        toString() : string|null
        {
            if(this.value===null || typeof this.value == "undefined")
                 return null;
            else if(this.dateTimeType == QueryValue.IsNotDateTime)
                return this.value + "";
            let val = (<string>this.value);
            switch(this.dateTimeType)
            {
                case QueryValue.IsDateTime:
                    if(val.charAt(val.length-1) != "Z") return val+"Z";
                    else return val;
                case QueryValue.IsDate:
                   return  val.split("T")[0];
                case QueryValue.IsTime:
                    val=this.normalizeTime(val, false, true);
                    return val;
                case QueryValue.IsDuration:
                    val=this.normalizeTime(val, true, false);
                    let parts = val.match(/\d+/g);
                    return "'P"+parts[0] + "D"+
                        parts[1] + "H" +
                        parts[2] + "M" +
                        parts[3] + "." +
                        parts[4] + new Array(13-parts[4].length).join("0") + "S'";
                default:
                    return null;
            }
            
        }

    }
    export interface IQueryFilterCondition extends IQueryValue
    {
        operator: string|null;
        property: string|null;
        inv: boolean;
    }
    export class QueryFilterCondition  extends QueryValue implements IQueryFilterCondition
    {
        operator: string|null;
        property: string|null;
        inv: boolean;
        constructor(origin: IQueryFilterCondition=null)
        {
            super(origin);
            if(origin)
            {
                this.operator=origin.operator;
                this.inv=origin.inv;
                this.property=origin.property;
            }
            else 
            {
                this.operator=null;
                this.inv=false;
                this.property=null;
            }
        }
        toString(): string|null
        {
            var val=super.toString();
            if (val === null) return null;
            if(this.property &&  this.dateTimeType == QueryValue.IsNotDateTime &&
                typeof val == "string" &&
                !this.isGuid()
            ) val = "'"+val+"'";
            throw notImplemented;
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
    export interface IQuerySortingCondition
    {
        property: string;
        down: boolean;
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
    export interface IQueryAggregation
    {
         operator: string;
        property: string;
        isCount: boolean;
        alias: string;
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

        static fromJson(x: string) : QueryDescription {
            if(!x) return null;
            return new QueryDescription(JSON.parse(x));
        }
        
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
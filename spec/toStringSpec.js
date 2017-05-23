var odata = require("../dest/umd/mvcct.odata.js")
function normalize (str)
{
    return str.replace(/\s/g, '')
}
function normalizeExt (str)
{
    return str.replace(/\s/g, '').replace(/\(/g, '').replace(/\)/g, '');
}
describe("leaf condition constants", function(){
    it("date", function(){
        let cond = new odata.QueryFilterCondition({
            dateTimeType: odata.QueryValue.IsDate,
            value: "2016-12-02T00:00:00.000",
            operator: odata.QueryFilterCondition.eq,
            property: "ADate"
        });
        expect(normalize(cond.toString())).toBe(normalize("(ADate eq 2016-12-02)"));
        cond.value=null;
        cond.setDate(new Date(2016, 11, 2));
        expect(normalize(cond.toString())).toBe(normalize("(ADate eq 2016-12-02)"));
    });
    it("time", function(){
        let cond = new odata.QueryFilterCondition({
            dateTimeType: odata.QueryValue.IsTime,
            value: "17:20:10.1",
            operator: odata.QueryFilterCondition.eq,
            property: "ATime"
        });
        expect(normalize(cond.toString())).toBe(normalize("(ATime eq 17:20:10.100)"));
        cond.value=null;
        cond.setTime(new Date(2016, 11, 2, 17, 20, 10, 100));
        expect(normalize(cond.toString())).toBe(normalize("(ATime eq 17:20:10.100)"));
        cond.value = "17:20";
        expect(normalize(cond.toString())).toBe(normalize("(ATime eq 17:20:00.000)"));
        cond.value = "17";
        expect(normalize(cond.toString())).toBe(normalize("(ATime eq 17:00:00.000)"));
    });
    it("time null", function(){
        let cond = new odata.QueryFilterCondition({
            dateTimeType: odata.QueryValue.IsTime,
            value: null,
            operator: odata.QueryFilterCondition.eq,
            property: "ATime"
        });
        expect(normalize(cond.toString())).toBe(normalize("(ATime eq null)"));
        
    });
    it("duration", function(){
        let cond = new odata.QueryFilterCondition({
            dateTimeType: odata.QueryValue.IsDuration,
            value: "1.17:20:10.1",
            operator: odata.QueryFilterCondition.eq,
            property: "ADuration"
        });
        expect(normalize(cond.toString())).toBe(normalize("(ADuration eq 'P01DT17H20M10.100000000000S')"));
        cond.value=null;
        cond.setDuration(1, 17, 20, 10, 1000);
        expect(normalize(cond.toString())).toBe(normalize("(ADuration eq 'P01DT17H20M10.100000000000S')"));
        
    });
    it("datetime local", function(){
        let cond = new odata.QueryFilterCondition({
            dateTimeType: odata.QueryValue.IsDateTime,
            value: "2016-12-02T00:00:00.000",
            operator: odata.QueryFilterCondition.eq,
            property: "ADatetime"
        });
        expect(normalize(cond.toString())).toBe(normalize("(ADatetime eq 2016-12-02T00:00:00.000Z)"));
        cond.value=null;
        cond.setDateTimeLocal(new Date(2016, 11, 2));
        expect(normalize(cond.toString())).toBe(normalize("(ADatetime eq 2016-12-01T23:00:00.000Z)"));
        
    });
    it("datetime invariant", function(){
        let cond = new odata.QueryFilterCondition({
            dateTimeType: odata.QueryValue.IsDateTime,
            value: "2016-12-02T00:00:00.000Z",
            operator: odata.QueryFilterCondition.eq,
            property: "ADatetime"
        });
        expect(normalize(cond.toString())).toBe(normalize("(ADatetime eq 2016-12-02T00:00:00.000Z)"));
        cond.value=null;
        cond.setDateTimeInvariant(new Date(2016, 11, 2));
        expect(normalize(cond.toString())).toBe(normalize("(ADatetime eq 2016-12-02T00:00:00.000Z)"));
        
    });

    it("boolean", function(){
        let cond = new odata.QueryFilterCondition({
            dateTimeType: odata.QueryValue.IsNotDateTime,
            value: true,
            operator: odata.QueryFilterCondition.eq,
            property: "ABool"
        });
        expect(normalize(cond.toString())).toBe(normalize("(ABool eq true)"));
        cond.value=null;
        cond.setBoolean(true);
        expect(normalize(cond.toString())).toBe(normalize("(ABool eq true)"));
        
    });

    it("decimal", function(){
        let cond = new odata.QueryFilterCondition({
            dateTimeType: odata.QueryValue.IsNotDateTime,
            value: 10.5,
            operator: odata.QueryFilterCondition.eq,
            property: "ADecimal"
        });
        expect(normalize(cond.toString())).toBe(normalize("(ADecimal eq 10.5)"));
        cond.value=null;
        cond.setNumber(10.5);
        expect(normalize(cond.toString())).toBe(normalize("(ADecimal eq 10.5)"));
        
    });
    it("integer", function(){
        let cond = new odata.QueryFilterCondition({
            dateTimeType: odata.QueryValue.IsNotDateTime,
            value: 10,
            operator: odata.QueryFilterCondition.eq,
            property: "AInt"
        });
        expect(normalize(cond.toString())).toBe(normalize("(AInt eq 10)"));
        cond.value=null;
        cond.setNumber(10);
        expect(normalize(cond.toString())).toBe(normalize("(AInt eq 10)"));
        
    });
    it("string", function(){
        let cond = new odata.QueryFilterCondition({
            dateTimeType: odata.QueryValue.IsNotDateTime,
            value: 'francesco',
            operator: odata.QueryFilterCondition.eq,
            property: "AString"
        });
        expect(normalize(cond.toString())).toBe(normalize("(AString eq 'francesco')"));
        cond.value=null;
        cond.setString('francesco');
        expect(normalize(cond.toString())).toBe(normalize("(AString eq 'francesco')"));
        
    });
    it("string free search", function(){
        let cond = new odata.QueryFilterCondition({
            value: 'francesco'
        });
        expect(normalize(cond.toString())).toBe(normalize("francesco"));
        cond.value=null;
        cond.setString('francesco');
        expect(normalize(cond.toString())).toBe(normalize("francesco"));
        
    });
    it("guid", function(){
        let cond = new odata.QueryFilterCondition({
            dateTimeType: odata.QueryValue.IsNotDateTime,
            value: '3F2504E0-4F89-11D3-9A0C-0305E82C3301',
            operator: odata.QueryFilterCondition.eq,
            property: "AGuid"
        });
        expect(normalize(cond.toString())).toBe(normalize("(AGuid eq 3F2504E0-4F89-11D3-9A0C-0305E82C3301)"));
        cond.value=null;
        cond.setString('3F2504E0-4F89-11D3-9A0C-0305E82C3301');
        expect(normalize(cond.toString())).toBe(normalize("(AGuid eq 3F2504E0-4F89-11D3-9A0C-0305E82C3301)"));
        
    });
});
describe("leaf condition operators", function(){
    it("not equal", function(){
        let cond = new odata.QueryFilterCondition({
            dateTimeType: odata.QueryValue.IsNotDateTime,
            value: 'francesco',
            operator: odata.QueryFilterCondition.ne,
            property: "AString"
        });
        expect(normalize(cond.toString())).toBe(normalize("(AString ne 'francesco')"));       
    });
    it("less", function(){
        let cond = new odata.QueryFilterCondition({
            dateTimeType: odata.QueryValue.IsNotDateTime,
            value: 'francesco',
            operator: odata.QueryFilterCondition.lt,
            property: "AString"
        });
        expect(normalize(cond.toString())).toBe(normalize("(AString lt 'francesco')"));       
    });
    it("less equal", function(){
        let cond = new odata.QueryFilterCondition({
            dateTimeType: odata.QueryValue.IsNotDateTime,
            value: 'francesco',
            operator: odata.QueryFilterCondition.le,
            property: "AString"
        });
        expect(normalize(cond.toString())).toBe(normalize("(AString le 'francesco')"));       
    });
    it("greater", function(){
        let cond = new odata.QueryFilterCondition({
            dateTimeType: odata.QueryValue.IsNotDateTime,
            value: 'francesco',
            operator: odata.QueryFilterCondition.gt,
            property: "AString"
        });
        expect(normalize(cond.toString())).toBe(normalize("(AString gt 'francesco')"));       
    });
    it("greater equal", function(){
        let cond = new odata.QueryFilterCondition({
            dateTimeType: odata.QueryValue.IsNotDateTime,
            value: 'francesco',
            operator: odata.QueryFilterCondition.ge,
            property: "AString"
        });
        expect(normalize(cond.toString())).toBe(normalize("(AString ge 'francesco')"));       
    });
    it("startswith", function(){
        let cond = new odata.QueryFilterCondition({
            dateTimeType: odata.QueryValue.IsNotDateTime,
            value: 'francesco',
            operator: odata.QueryFilterCondition.startswith,
            property: "AString"
        });
        expect(normalize(cond.toString())).toBe(normalize("startswith(AString, 'francesco')"));       
    });
    it("startswith inv", function(){
        let cond = new odata.QueryFilterCondition({
            dateTimeType: odata.QueryValue.IsNotDateTime,
            value: 'francesco',
            operator: odata.QueryFilterCondition.startswith,
            property: "AString",
            inv:true
        });
        expect(normalize(cond.toString())).toBe(normalize("startswith('francesco', AString)"));       
    });
    it("endswith", function(){
        let cond = new odata.QueryFilterCondition({
            dateTimeType: odata.QueryValue.IsNotDateTime,
            value: 'francesco',
            operator: odata.QueryFilterCondition.endswith,
            property: "AString"
        });
        expect(normalize(cond.toString())).toBe(normalize("endswith(AString, 'francesco')"));       
    });
    it("endswith inv", function(){
        let cond = new odata.QueryFilterCondition({
            dateTimeType: odata.QueryValue.IsNotDateTime,
            value: 'francesco',
            operator: odata.QueryFilterCondition.endswith,
            property: "AString",
            inv:true
        });
        expect(normalize(cond.toString())).toBe(normalize("endswith('francesco', AString)"));       
    });
    it("contains", function(){
        let cond = new odata.QueryFilterCondition({
            dateTimeType: odata.QueryValue.IsNotDateTime,
            value: 'francesco',
            operator: odata.QueryFilterCondition.contains,
            property: "AString"
        });
        expect(normalize(cond.toString())).toBe(normalize("contains(AString, 'francesco')"));       
    });
    it("contains inv", function(){
        let cond = new odata.QueryFilterCondition({
            dateTimeType: odata.QueryValue.IsNotDateTime,
            value: 'francesco',
            operator: odata.QueryFilterCondition.contains,
            property: "AString",
            inv:true
        });
        expect(normalize(cond.toString())).toBe(normalize("contains('francesco', AString)"));       
    });
});
describe("filter connectors", function(){
    let cond = new odata.QueryFilterCondition({
            dateTimeType: odata.QueryValue.IsNotDateTime,
            value: 'dummi1',
            operator: odata.QueryFilterCondition.eq,
            property: "AString"
        });
    let cond1 = new odata.QueryFilterCondition({
            dateTimeType: odata.QueryValue.IsNotDateTime,
            value: false,
            operator: odata.QueryFilterCondition.eq,
            property: "ABool"
        });
    
    it("not", function(){
        let connector = new odata.QueryFilterBooleanOperator({
            operator: odata.QueryFilterBooleanOperator.not,
            argument1: cond
        });
        expect(normalize(connector.toString())).toBe(normalize("(not (AString eq 'dummi1'))")); 
        connector = new odata.QueryFilterBooleanOperator(
            odata.QueryFilterBooleanOperator.not,
            cond
        );
        expect(normalize(connector.toString())).toBe(normalize("(not (AString eq 'dummi1'))"));      
    });
    it("and", function(){
        let connector = new odata.QueryFilterBooleanOperator({
            operator: odata.QueryFilterBooleanOperator.and,
            argument1: cond,
            argument2: cond1
        });
        expect(normalize(connector.toString())).toBe(normalize("((AString eq 'dummi1') and (ABool eq false))")); 

        connector = new odata.QueryFilterBooleanOperator(
            odata.QueryFilterBooleanOperator.and,
            cond,
            cond1
        );
        expect(normalize(connector.toString())).toBe(normalize("((AString eq 'dummi1') and (ABool eq false))"));

    });
    it("or", function(){
        let connector = new odata.QueryFilterBooleanOperator({
            operator: odata.QueryFilterBooleanOperator.or,
            argument1: cond,
            argument2: cond1
        });
        expect(normalize(connector.toString())).toBe(normalize("((AString eq 'dummi1') or (ABool eq false))")); 

        connector = new odata.QueryFilterBooleanOperator(
            odata.QueryFilterBooleanOperator.or,
            cond,
            cond1
        );
        expect(normalize(connector.toString())).toBe(normalize("((AString eq 'dummi1') or (ABool eq false))"));

    });
    it("and not", function(){
        let nconnector = new odata.QueryFilterBooleanOperator({
            operator: odata.QueryFilterBooleanOperator.not,
            argument1: cond
        });
        let connector = new odata.QueryFilterBooleanOperator({
            operator: odata.QueryFilterBooleanOperator.and,
            child1: nconnector,
            argument2: cond1
        });
        expect(normalize(connector.toString())).toBe(normalize("((not (AString eq 'dummi1')) and (ABool eq false))"));
        connector = new odata.QueryFilterBooleanOperator(
            odata.QueryFilterBooleanOperator.and,
            nconnector,
            cond1
        );
        expect(normalize(connector.toString())).toBe(normalize("((not (AString eq 'dummi1')) and (ABool eq false))"));  
    });
    it("or not", function(){
        let nconnector = new odata.QueryFilterBooleanOperator({
            operator: odata.QueryFilterBooleanOperator.not,
            argument1: cond
        });
        let connector = new odata.QueryFilterBooleanOperator({
            operator: odata.QueryFilterBooleanOperator.or,
            child1: nconnector,
            argument2: cond1
        });
        expect(normalize(connector.toString())).toBe(normalize("((not (AString eq 'dummi1')) or (ABool eq false))"));
        connector = new odata.QueryFilterBooleanOperator(
            odata.QueryFilterBooleanOperator.or,
            nconnector,
            cond1
        );
        expect(normalize(connector.toString())).toBe(normalize("((not (AString eq 'dummi1')) or (ABool eq false))"));  
    });
})
describe("free search connectors", function(){
    let cond = new odata.QueryFilterCondition({
            dateTimeType: odata.QueryValue.IsNotDateTime,
            value: 'dummi1',
        });
    let cond1 = new odata.QueryFilterCondition({
            dateTimeType: odata.QueryValue.IsNotDateTime,
            value: 'dummi2',
        });
    
    it("not", function(){
        let connector = new odata.QueryFilterBooleanOperator({
            operator: odata.QueryFilterBooleanOperator.NOT,
            argument1: cond
        });
        expect(normalize(connector.toString())).toBe(normalize("(NOT dummi1)")); 
        connector = new odata.QueryFilterBooleanOperator(
            odata.QueryFilterBooleanOperator.NOT,
            cond
        );
        expect(normalize(connector.toString())).toBe(normalize("(NOT dummi1)"));      
    });
    it("and", function(){
        let connector = new odata.QueryFilterBooleanOperator({
            operator: odata.QueryFilterBooleanOperator.AND,
            argument1: cond,
            argument2: cond1
        });
        expect(normalize(connector.toString())).toBe(normalize("(dummi1 AND dummi2)")); 

        connector = new odata.QueryFilterBooleanOperator(
            odata.QueryFilterBooleanOperator.AND,
            cond,
            cond1
        );
        expect(normalize(connector.toString())).toBe(normalize("(dummi1 AND dummi2)"));

    });
    it("or", function(){
        let connector = new odata.QueryFilterBooleanOperator({
            operator: odata.QueryFilterBooleanOperator.OR,
            argument1: cond,
            argument2: cond1
        });
        expect(normalize(connector.toString())).toBe(normalize("(dummi1 OR dummi2)")); 

        connector = new odata.QueryFilterBooleanOperator(
            odata.QueryFilterBooleanOperator.OR,
            cond,
            cond1
        );
        expect(normalize(connector.toString())).toBe(normalize("(dummi1 OR dummi2)"));

    });
    it("and not", function(){
        let nconnector = new odata.QueryFilterBooleanOperator({
            operator: odata.QueryFilterBooleanOperator.NOT,
            argument1: cond
        });
        let connector = new odata.QueryFilterBooleanOperator({
            operator: odata.QueryFilterBooleanOperator.AND,
            child1: nconnector,
            argument2: cond1
        });
        expect(normalize(connector.toString())).toBe(normalize("((NOT dummi1) AND dummi2)"));
        connector = new odata.QueryFilterBooleanOperator(
            odata.QueryFilterBooleanOperator.AND,
            nconnector,
            cond1
        );
        expect(normalize(connector.toString())).toBe(normalize("((NOT dummi1) AND dummi2)"));  
    });
    it("or not", function(){
        let nconnector = new odata.QueryFilterBooleanOperator({
            operator: odata.QueryFilterBooleanOperator.NOT,
            argument1: cond
        });
        let connector = new odata.QueryFilterBooleanOperator({
            operator: odata.QueryFilterBooleanOperator.OR,
            child1: nconnector,
            argument2: cond1
        });
        expect(normalize(connector.toString())).toBe(normalize("((NOT dummi1) OR dummi2)"));
        connector = new odata.QueryFilterBooleanOperator(
            odata.QueryFilterBooleanOperator.OR,
            nconnector,
            cond1
        );
        expect(normalize(connector.toString())).toBe(normalize("((NOT dummi1) OR dummi2)"));  
    });
   
})
describe("sorting", function(){
    
    it("one asc", function(){
        let query = new odata.QueryDescription({
            sorting: [new odata.QuerySortingCondition('AString')],
        });
        query.customUrlEncode(function(x){return x;});
        expect(normalize(query.queryString())).toBe(normalize("$orderby=AString asc"));      
    });
    it("two mixed", function(){
        let query = new odata.QueryDescription({
            sorting: [new odata.QuerySortingCondition('AString'), 
                      new odata.QuerySortingCondition('AFloat ', true)],
        });
        query.customUrlEncode(function(x){return x;});
        expect(normalize(query.queryString())).toBe(normalize("$orderby=AString asc, AFloat desc"));      
    });
    it("three mixed", function(){
        let query = new odata.QueryDescription({
            sorting: [new odata.QuerySortingCondition('AString'), 
                      new odata.QuerySortingCondition('AFloat ', true),
                      new odata.QuerySortingCondition({
                        property: "ADuration",
                        down: true
                      })],
        });
        query.customUrlEncode(function(x){return x;});
        expect(normalize(query.queryString()))
            .toBe(normalize("$orderby=AString asc, AFloat desc, ADuration desc"));      
    });
});
describe("grouping", function(){
    it("one no agg", function(){
        let query = new odata.QueryDescription({
            grouping: new odata.QueryGrouping({
                keys: ["AString"],
                aggregations:[]
            })
        });
        query.customUrlEncode(function(x){return x;});
        expect(normalize(query.queryString())).toBe(normalize("$apply=groupby((AString))"));      
    });
});
describe("grouping", function(){
    it("two no aggs", function(){
        let query = new odata.QueryDescription({
            grouping: new odata.QueryGrouping({
                keys: ["AString", "AFloat"],
                aggregations:null
            })
        });
        query.customUrlEncode(function(x){return x;});
        expect(normalize(query.queryString())).toBe(normalize("$apply=groupby((AString, AFloat))"));      
    });
    it("two one agg", function(){
        let query = new odata.QueryDescription({
            grouping: new odata.QueryGrouping({
                keys: ["AString", "AFloat"],
                aggregations:[
                    new odata.QueryAggregation(odata.QueryAggregation.count,
                        "AInt", "ANewInt"
                    )
                ]
            })
        });
        query.customUrlEncode(function(x){return x;});
        expect(normalize(query.queryString()))
            .toBe(normalize("$apply=groupby((AString, AFloat), aggregate(AInt with countdistinct as ANewInt))"));      
    });
    it("two two aggs", function(){
        let query = new odata.QueryDescription({
            grouping: new odata.QueryGrouping({
                keys: ["AString", "AFloat"],
                aggregations:[
                    new odata.QueryAggregation(odata.QueryAggregation.sum,
                        "AInt", "ANewInt"
                    ),
                    {
                        operator: odata.QueryAggregation.max,
                        property: "AFloat",
                        alias: "ANewFloat"
                    }
                ]
            })
        });
        query.customUrlEncode(function(x){return x;});
        expect(normalize(query.queryString()))
            .toBe(normalize("$apply=groupby((AString, AFloat), aggregate(AInt with sum as ANewInt, AFloat with max as ANewFloat))"));      
    });
    it("two three aggs", function(){
        let query = new odata.QueryDescription({
            grouping: new odata.QueryGrouping({
                keys: ["AString", "AFloat"],
                aggregations:[
                    new odata.QueryAggregation(odata.QueryAggregation.min,
                        "AInt", "ANewInt"
                    ),
                    {
                        operator: odata.QueryAggregation.average,
                        property: "AFloat",
                        alias: "ANewFloat"
                    },
                    {
                        operator: odata.QueryAggregation.count,
                        property: "ADate",
                        alias: "AInt"
                    },
                ]
            })
        });
        query.customUrlEncode(function(x){return x;});
        expect(normalize(query.queryString()))
            .toBe(normalize("$apply=groupby((AString, AFloat), aggregate(AInt with min as ANewInt, AFloat with average as ANewFloat, ADate with countdistinct as AInt))"));      
    });
});

describe("integration", function(){
    let query = new odata.QueryDescription({
            grouping: new odata.QueryGrouping({
                keys: ["AString", "AFloat"],
                dateTimeTypes: [0, 0],
                aggregations:null
            }),
            sorting: [new odata.QuerySortingCondition('AString')],
            filter: { 
               argument1: new odata.QueryFilterCondition({
                    dateTimeType: odata.QueryValue.IsNotDateTime,
                    value: true,
                    operator: odata.QueryFilterCondition.eq,
                    property: "ABool"
                })
            },
            search: new odata.QuerySearch( new odata.QueryFilterCondition({
                dateTimeType: odata.QueryValue.IsNotDateTime,
                value: 'dummi1'
            })),
            attachedTo: new odata.Endpoint("http://www.dummy.com")
        });
        query.customUrlEncode(function(x){return x;});
    it("Query string with search", function(){
        
        expect(normalize(query.queryString()))
            .toBe(normalize("$search=dummi1&$apply=groupby((AString, AFloat))&$orderby=AString asc"));      
    });
    it("Query string with filter", function(){
        query.search=null;
        expect(normalize(query.queryString()))
            .toBe(normalize("$filter=(ABool eq true)&$apply=groupby((AString, AFloat))&$orderby=AString asc"));      
    });
    it("tostring with filter", function(){
        query.search=null;
        expect(normalize(query.toString()))
            .toBe(normalize("http://www.dummy.com?$filter=(ABool eq true)&$apply=groupby((AString, AFloat))&$orderby=AString asc"));      
    });
    it("groupDetail to string", function(){
        query.search=null;
        var newQuery=query.getGroupDetailQuery({
            AString: 'test',
            AFloat: 1
        });
        newQuery.customUrlEncode(function(x){return x;});
        expect(normalizeExt(newQuery.addToUrl("http://www.customdummy.com")))
            .toBe(normalizeExt("http://www.customdummy.com?$filter=(ABool eq true) and (AString eq 'test') and (AFloat eq 1) &$orderby=AString asc"));
    });
    it("tostring with custom url", function(){
        query.search=null;
        expect(normalize(query.addToUrl("http://www.customdummy.com")))
            .toBe(normalize("http://www.customdummy.com?$filter=(ABool eq true)&$apply=groupby((AString, AFloat))&$orderby=AString asc"));      
    });
    it("tostring with custom url with oher parameters", function(){
        query.search=null;
        expect(normalize(query.addToUrl("http://www.customdummy.com?a=1")))
            .toBe(normalize("http://www.customdummy.com?a=1&$filter=(ABool eq true)&$apply=groupby((AString, AFloat))&$orderby=AString asc"));      
    });
    it("tostring with empty url", function(){
        query.search=null;
        query.skip=10,
        query.take=5;
        expect(normalize(query.addToUrl(null)))
            .toBe(normalize("?$filter=(ABool eq true)&$apply=groupby((AString, AFloat))&$orderby=AString asc&$skip=10&$top=5"));      
    });
})


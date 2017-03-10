var odata = require("../dest/umd/mvcct.odata.js")

describe("leaf condition constants", function(){
    it("date", function(){
        let cond = new odata.QueryFilterCondition({
            dateTimeType: odata.QueryValue.IsDate,
            value: "2016-12-02T00:00:00.000",
            operator: odata.QueryFilterCondition.eq,
            property: "ADate"
        });
        var data = [
            {
                ADate: new Date(2016, 11, 2),
                ADescription: "a description"
            },
            {
                ADate: new Date(2016, 11, 4),
                ADescription: "a description"
            }
        ];
        var query = new odata.QueryDescription();
        query.filter = new odata.QueryFilterBooleanOperator(odata.QueryFilterBooleanOperator.and, cond);
        expect(query.toQuery()(data).length).toBe(1);
        
    });
    it("datetime UTC", function(){
        let cond = new odata.QueryFilterCondition({
            dateTimeType: odata.QueryValue.IsDateTime,
            value: "2016-12-02T10:20:25.000Z",
            operator: odata.QueryFilterCondition.eq,
            property: "ADate"
        });
        var data = [
            {
                ADate: new Date(Date.UTC(2016, 11, 2, 10, 20, 25)),
                ADescription: "a description"
            },
            {
                ADate: new Date(Date.UTC(2016, 11, 4)),
                ADescription: "a description"
            }
        ];
        var query = new odata.QueryDescription();
        query.filter = new odata.QueryFilterBooleanOperator(odata.QueryFilterBooleanOperator.and, cond);
        expect(query.toQuery()(data).length).toBe(1);
        
    });
    it("datetime local", function(){
        let cond = new odata.QueryFilterCondition({
            dateTimeType: odata.QueryValue.IsDateTime,
            value: "2016-12-02T10:20:25.000",
            operator: odata.QueryFilterCondition.eq,
            property: "ADate"
        });
        var data = [
            {
                ADate: new Date(2016, 11, 2, 10, 20, 25),
                ADescription: "a description"
            },
            {
                ADate: new Date(2016, 11, 4),
                ADescription: "a description"
            }
        ];
        var query = new odata.QueryDescription();
        query.filter = new odata.QueryFilterBooleanOperator(odata.QueryFilterBooleanOperator.and, cond);
        expect(query.toQuery()(data).length).toBe(1);
        
    });
    it("time", function(){
        let cond = new odata.QueryFilterCondition({
            dateTimeType: odata.QueryValue.IsTime,
            value: "10:20:25.000",
            operator: odata.QueryFilterCondition.eq,
            property: "ADate"
        });
        var data = [
            {
                ADate: new Date(1970, 0, 1, 10, 20, 25),
                ADescription: "a description"
            },
            {
                ADate: new Date(1970, 0, 1, 10, 21, 25),
                ADescription: "a description"
            }
        ];
        var query = new odata.QueryDescription();
        query.filter = new odata.QueryFilterBooleanOperator(odata.QueryFilterBooleanOperator.and, cond);
        expect(query.toQuery()(data).length).toBe(1);
        
    });
    it("duration", function(){
        let cond = new odata.QueryFilterCondition({
            dateTimeType: odata.QueryValue.IsDuration,
            value: "01.10:20:25.000",
            operator: odata.QueryFilterCondition.eq,
            property: "ADate"
        });
        var data = [
            {
                ADate: new Date(1970, 0, 2, 10, 20, 25).getTime() - new Date(1970, 0, 1).getTime(),
                ADescription: "a description"
            },
            {
                ADate: new Date(1970, 0, 1, 10, 21, 25)- new Date(1970, 0, 1).getTime(),
                ADescription: "a description"
            }
        ];
        var query = new odata.QueryDescription();
        query.filter = new odata.QueryFilterBooleanOperator(odata.QueryFilterBooleanOperator.and, cond);
        expect(query.toQuery()(data).length).toBe(1);
        
    });
    it("boolean", function(){
        let cond = new odata.QueryFilterCondition({
            dateTimeType: odata.QueryValue.IsNotDateTime,
            value: false,
            operator: odata.QueryFilterCondition.eq,
            property: "ABool"
        });
        var data = [
            {
                ABool: false,
                ADescription: "a description"
            },
            {
                ABool: true,
                ADescription: "a description"
            }
        ];
        var query = new odata.QueryDescription();
        query.filter = new odata.QueryFilterBooleanOperator(odata.QueryFilterBooleanOperator.and, cond);
        expect(query.toQuery()(data).length).toBe(1);
        
    });
    it("string", function(){
        let cond = new odata.QueryFilterCondition({
            dateTimeType: odata.QueryValue.IsNotDateTime,
            value: "francesco",
            operator: odata.QueryFilterCondition.eq,
            property: "AString"
        });
        var data = [
            {
                AString: "francesco",
                ADescription: "a description"
            },
            {
                AString: "peter",
                ADescription: "a description"
            }
        ];
        var query = new odata.QueryDescription();
        query.filter = new odata.QueryFilterBooleanOperator(odata.QueryFilterBooleanOperator.and, cond);
        expect(query.toQuery()(data).length).toBe(1);
        
    });
    it("number", function(){
        let cond = new odata.QueryFilterCondition({
            dateTimeType: odata.QueryValue.IsNotDateTime,
            value: 10.1,
            operator: odata.QueryFilterCondition.eq,
            property: "ADecimal"
        });
        var data = [
            {
                ADecimal: 10.2,
                ADescription: "a description"
            },
            {
                ADecimal: 10.1,
                ADescription: "a description"
            }
        ];
        var query = new odata.QueryDescription();
        query.filter = new odata.QueryFilterBooleanOperator(odata.QueryFilterBooleanOperator.and, cond);
        expect(query.toQuery()(data).length).toBe(1);
        
    });
});
describe("leaf condition operators", function(){
    var data = [
            {
                ADecimal: 10.2,
                ADescription: "a description"
            },
            {
                ADecimal: 11,
                ADescription: "a description"
            },
            {
                ADecimal: 10.1,
                ADescription: "a description"
            }
        ];
        var datas = [
            {
                AString: "francesco",
                ADescription: "a description"
            },
            {
                AString: "armando",
                ADescription: "a description"
            },
            {
                AString: "franco",
                ADescription: "a description"
            }
        ];
    it("ne", function(){
            let cond = new odata.QueryFilterCondition({
                dateTimeType: odata.QueryValue.IsNotDateTime,
                value: 10.1,
                operator: odata.QueryFilterCondition.ne,
                property: "ADecimal"
            });
        
            var query = new odata.QueryDescription();
            query.filter = new odata.QueryFilterBooleanOperator(odata.QueryFilterBooleanOperator.and, cond);
            expect(query.toQuery()(data).length).toBe(2);
        
    });
    it("le", function(){
            let cond = new odata.QueryFilterCondition({
                dateTimeType: odata.QueryValue.IsNotDateTime,
                value: 10.2,
                operator: odata.QueryFilterCondition.le,
                property: "ADecimal"
            });
        
            var query = new odata.QueryDescription();
            query.filter = new odata.QueryFilterBooleanOperator(odata.QueryFilterBooleanOperator.and, cond);
            expect(query.toQuery()(data).length).toBe(2);
        
    });
    it("lt", function(){
            let cond = new odata.QueryFilterCondition({
                dateTimeType: odata.QueryValue.IsNotDateTime,
                value: 10.2,
                operator: odata.QueryFilterCondition.lt,
                property: "ADecimal"
            });
        
            var query = new odata.QueryDescription();
            query.filter = new odata.QueryFilterBooleanOperator(odata.QueryFilterBooleanOperator.and, cond);
            expect(query.toQuery()(data).length).toBe(1);
        
    });
    it("gt", function(){
            let cond = new odata.QueryFilterCondition({
                dateTimeType: odata.QueryValue.IsNotDateTime,
                value: 11,
                operator: odata.QueryFilterCondition.gt,
                property: "ADecimal"
            });
        
            var query = new odata.QueryDescription();
            query.filter = new odata.QueryFilterBooleanOperator(odata.QueryFilterBooleanOperator.and, cond);
            expect(query.toQuery()(data).length).toBe(0);
        
    });
    it("ge", function(){
            let cond = new odata.QueryFilterCondition({
                dateTimeType: odata.QueryValue.IsNotDateTime,
                value: 11,
                operator: odata.QueryFilterCondition.ge,
                property: "ADecimal"
            });
        
            var query = new odata.QueryDescription();
            query.filter = new odata.QueryFilterBooleanOperator(odata.QueryFilterBooleanOperator.and, cond);
            expect(query.toQuery()(data).length).toBe(1);
        
    });
    it("contains", function(){
            let cond = new odata.QueryFilterCondition({
                dateTimeType: odata.QueryValue.IsNotDateTime,
                value: "anc",
                operator: odata.QueryFilterCondition.contains,
                property: "AString"
            });
        
            var query = new odata.QueryDescription();
            query.filter = new odata.QueryFilterBooleanOperator(odata.QueryFilterBooleanOperator.and, cond);
            expect(query.toQuery()(datas).length).toBe(2);
        
    });
    it("contains inv", function(){
            let cond = new odata.QueryFilterCondition({
                dateTimeType: odata.QueryValue.IsNotDateTime,
                value: "marco, franco and giulio",
                inv: true,
                operator: odata.QueryFilterCondition.contains,
                property: "AString"
            });
        
            var query = new odata.QueryDescription();
            query.filter = new odata.QueryFilterBooleanOperator(odata.QueryFilterBooleanOperator.and, cond);
            expect(query.toQuery()(datas).length).toBe(1);
        
    });
    it("endswith", function(){
            let cond = new odata.QueryFilterCondition({
                dateTimeType: odata.QueryValue.IsNotDateTime,
                value: "esco",
                operator: odata.QueryFilterCondition.endswith,
                property: "AString"
            });
        
            var query = new odata.QueryDescription();
            query.filter = new odata.QueryFilterBooleanOperator(odata.QueryFilterBooleanOperator.and, cond);
            expect(query.toQuery()(datas).length).toBe(1);
        
    });
    it("endswith inv", function(){
            let cond = new odata.QueryFilterCondition({
                dateTimeType: odata.QueryValue.IsNotDateTime,
                value: "mario and francesco",
                operator: odata.QueryFilterCondition.endswith,
                inv:true,
                property: "AString"
            });
        
            var query = new odata.QueryDescription();
            query.filter = new odata.QueryFilterBooleanOperator(odata.QueryFilterBooleanOperator.and, cond);
            expect(query.toQuery()(datas).length).toBe(1);
        
    });
    it("startswith", function(){
            let cond = new odata.QueryFilterCondition({
                dateTimeType: odata.QueryValue.IsNotDateTime,
                value: "fra",
                operator: odata.QueryFilterCondition.startswith,
                property: "AString"
            });
        
            var query = new odata.QueryDescription();
            query.filter = new odata.QueryFilterBooleanOperator(odata.QueryFilterBooleanOperator.and, cond);
            expect(query.toQuery()(datas).length).toBe(2);
        
    });
    it("startswith inv", function(){
            let cond = new odata.QueryFilterCondition({
                dateTimeType: odata.QueryValue.IsNotDateTime,
                value: "franco and mario",
                operator: odata.QueryFilterCondition.startswith,
                inv: true,
                property: "AString"
            });
        
            var query = new odata.QueryDescription();
            query.filter = new odata.QueryFilterBooleanOperator(odata.QueryFilterBooleanOperator.and, cond);
            expect(query.toQuery()(datas).length).toBe(1);
        
    });
})
describe("filter nested conditions", function(){
    var data = [
            {
                AString: "francesco",
                ABool: false
            },
            {
                AString: "francesco",
                ABool: true
            },
            {
                AString: "peter",
                ABool: false
            },
            {
                AString: "peter",
                ABool: true
            }
        ];
        let cond = new odata.QueryFilterCondition({
            dateTimeType: odata.QueryValue.IsNotDateTime,
            value: 'francesco',
            operator: odata.QueryFilterCondition.eq,
            property: "AString"
        });
        let cond1 = new odata.QueryFilterCondition({
            dateTimeType: odata.QueryValue.IsNotDateTime,
            value: true,
            operator: odata.QueryFilterCondition.eq,
            property: "ABool"
        });
        it("and", function(){

            var query = new odata.QueryDescription();
            query.filter = 
                new odata.QueryFilterBooleanOperator(odata.QueryFilterBooleanOperator.and, 
                    cond, cond1);
            expect(query.toQuery()(data).length).toBe(1);
        
        });
        it("and not", function(){

            var query = new odata.QueryDescription();
            query.filter = 
                new odata.QueryFilterBooleanOperator(odata.QueryFilterBooleanOperator.and, 
                    cond, 
                    new odata.QueryFilterBooleanOperator(odata.QueryFilterBooleanOperator.not, cond1));
            expect(query.toQuery()(data).length).toBe(1);
        
        });
        it("or", function(){

            var query = new odata.QueryDescription();
            query.filter = 
                new odata.QueryFilterBooleanOperator(odata.QueryFilterBooleanOperator.or, 
                    cond, cond1);
            expect(query.toQuery()(data).length).toBe(3);
        
        });
        it("or not", function(){

            var query = new odata.QueryDescription();
            query.filter = 
                query.filter = 
                new odata.QueryFilterBooleanOperator(odata.QueryFilterBooleanOperator.or, 
                    cond, 
                    new odata.QueryFilterBooleanOperator(odata.QueryFilterBooleanOperator.not, cond1));
            expect(query.toQuery()(data).length).toBe(3);
        
        });
});
describe("free search", function(){
     var data = [
            {
                AString: "francesco and mario",
                ABool: false
            },
            {
                AString: "francesco and jenny",
                ABool: true
            },
            {
                AString: "jenny went home",
                ABool: false
            },
            {
                AString: "jhon is walking",
                ABool: true
            }
        ];
        let cond = new odata.QueryFilterCondition({
            dateTimeType: odata.QueryValue.IsNotDateTime,
            value: "francesco"
        });
        let cond1 = new odata.QueryFilterCondition({
            dateTimeType: odata.QueryValue.IsNotDateTime,
            value: "jenny"
        });
        it("Simple", function(){
            var query = new odata.QueryDescription();
            query.search = 
                new odata.QuerySearch(cond);
            expect(query.toQuery()(data).length).toBe(2);
        
        });
        it("AND", function(){

            var query = new odata.QueryDescription();
            query.search = 
                new odata.QuerySearch(
                    new odata.QueryFilterBooleanOperator(odata.QueryFilterBooleanOperator.AND, 
                        cond, 
                        cond1));
            expect(query.toQuery()(data).length).toBe(1);
        
        });
        it("AND NOT", function(){

            var query = new odata.QueryDescription();
            query.search = 
                new odata.QuerySearch(
                    new odata.QueryFilterBooleanOperator(odata.QueryFilterBooleanOperator.AND, 
                        cond, 
                        new odata.QueryFilterBooleanOperator(odata.QueryFilterBooleanOperator.NOT, cond1)));
            expect(query.toQuery()(data).length).toBe(1);
        
        });
        it("OR", function(){

            var query = new odata.QueryDescription();
            query.search = 
                new odata.QuerySearch(
                    new odata.QueryFilterBooleanOperator(odata.QueryFilterBooleanOperator.OR, 
                        cond, 
                        cond1));
            expect(query.toQuery()(data).length).toBe(3);
        
        });
        it("OR NOT", function(){

            var query = new odata.QueryDescription();
            query.search = 
                new odata.QuerySearch(
                    new odata.QueryFilterBooleanOperator(odata.QueryFilterBooleanOperator.OR, 
                        cond, 
                        new odata.QueryFilterBooleanOperator(odata.QueryFilterBooleanOperator.NOT, cond1)));
            expect(query.toQuery()(data).length).toBe(3);
        
        });
});
describe("order by", function(){
      var data = [
            {
                FirstInt: 5,
                SecondInt: 5
            },
            {
                FirstInt: 4,
                SecondInt: 3
            },
            {
                FirstInt: 5,
                SecondInt: 7
            },
            {
                FirstInt: 4,
                SecondInt: 2
            }
        ];
        var query = new odata.QueryDescription();
        it("one condition up", function(){

            query.sorting = [
                new odata.QuerySortingCondition("SecondInt")
            ]; 
            var res = query.toQuery()(data);     
            
            expect(res[0].SecondInt).toBe(2);
            expect(res[1].SecondInt).toBe(3); 
            expect(res[2].SecondInt).toBe(5);
            expect(res[3].SecondInt).toBe(7);
        }); 
        it("one condition down", function(){

            query.sorting = [
                new odata.QuerySortingCondition("SecondInt", true)
            ]; 
            var res = query.toQuery()(data);     
            
            expect(res[3].SecondInt).toBe(2);
            expect(res[2].SecondInt).toBe(3); 
            expect(res[1].SecondInt).toBe(5);
            expect(res[0].SecondInt).toBe(7);
        });  
        it("two conditions", function(){

            query.sorting = [
                new odata.QuerySortingCondition("FirstInt", true),
                new odata.QuerySortingCondition("SecondInt")
            ]; 
            var res = query.toQuery()(data);     
            
            expect(res[0].SecondInt).toBe(5);
            expect(res[1].SecondInt).toBe(7); 
            expect(res[2].SecondInt).toBe(2);
            expect(res[3].SecondInt).toBe(3);
        }); 
});

describe("group by", function(){
    var data = [
            {
                AString: "francesco",
                AnInt: 5,
                toAggregate: "home",
                mAggregate: 2
            },
            {
                AString: "francesco",
                AnInt: 3,
                toAggregate: "home",
                mAggregate: 3
            },
            {
                AString: "francesco",
                AnInt: 5,
                toAggregate: "home",
                mAggregate: 4
            },
            {
                AString: "francesco",
                AnInt: 3,
                toAggregate: "office",
                mAggregate: 7
            },
            {
                AString: "peter",
                AnInt: 4,
                toAggregate: "office",
                mAggregate: 2
            }
        ];
        var query = new odata.QueryDescription();
        query.sorting = [
                new odata.QuerySortingCondition("AString")
            ];
        it("one grouping", function(){

            var grouping = {
                keys: ["AString"],
                aggregations: null
            };
            query.grouping=new odata.QueryGrouping(grouping);
            var res=query.toQuery()(data);
            expect(res.length).toBe(2);
            expect(res[0].AString).toBe("francesco");
            expect(res[1].AString).toBe("peter");
        
        });
        it("two groupings", function(){

            var grouping = {
                keys: ["AString", "AnInt"],
                aggregations: null
            };
            query.grouping=new odata.QueryGrouping(grouping);
            var res=query.toQuery()(data);
            expect(res.length).toBe(3);
            expect(res[0].AString).toBe("francesco");
            expect(res[1].AString).toBe("francesco");
            expect(res[2].AString).toBe("peter");
        });
        it("one grouping one aggregation sum", function(){

            var grouping = {
                keys: ["AString"],
                aggregations: [new odata.QueryAggregation(odata.QueryAggregation.sum, "mAggregate", "ANewInt")]
            };
            query.grouping=new odata.QueryGrouping(grouping);
            var res=query.toQuery()(data);
            expect(res.length).toBe(2);
            expect(res[0].AString).toBe("francesco");
            expect(res[0].ANewInt).toBe(16);
            expect(res[1].AString).toBe("peter");
            expect(res[1].ANewInt).toBe(2);
        
        });
        it("one grouping one aggregation min", function(){

            var grouping = {
                keys: ["AString"],
                aggregations: [new odata.QueryAggregation(odata.QueryAggregation.min, "mAggregate", "ANewInt")]
            };
            query.grouping=new odata.QueryGrouping(grouping);
            var res=query.toQuery()(data);
            expect(res.length).toBe(2);
            expect(res[0].AString).toBe("francesco");
            expect(res[0].ANewInt).toBe(2);
            expect(res[1].AString).toBe("peter");
            expect(res[1].ANewInt).toBe(2);
        
        });
        it("one grouping one aggregation max", function(){

            var grouping = {
                keys: ["AString"],
                aggregations: [new odata.QueryAggregation(odata.QueryAggregation.max, "mAggregate", "ANewInt")]
            };
            query.grouping=new odata.QueryGrouping(grouping);
            var res=query.toQuery()(data);
            expect(res.length).toBe(2);
            expect(res[0].AString).toBe("francesco");
            expect(res[0].ANewInt).toBe(7);
            expect(res[1].AString).toBe("peter");
            expect(res[1].ANewInt).toBe(2);
        
        });
        it("one grouping one aggregation average", function(){

            var grouping = {
                keys: ["AString"],
                aggregations: [new odata.QueryAggregation(odata.QueryAggregation.average, "mAggregate", "ANewInt")]
            };
            query.grouping=new odata.QueryGrouping(grouping);
            var res=query.toQuery()(data);
            expect(res.length).toBe(2);
            expect(res[0].AString).toBe("francesco");
            expect(res[0].ANewInt).toBe(4);
            expect(res[1].AString).toBe("peter");
            expect(res[1].ANewInt).toBe(2);
        
        });
        it("one grouping one aggregation countdistinct", function(){

            var grouping = {
                keys: ["AString"],
                aggregations: [new odata.QueryAggregation(odata.QueryAggregation.count, "toAggregate", "ANewInt")]
            };
            query.grouping=new odata.QueryGrouping(grouping);
            var res=query.toQuery()(data);
            expect(res.length).toBe(2);
            expect(res[0].AString).toBe("francesco");
            expect(res[0].ANewInt).toBe(2);
            expect(res[1].AString).toBe("peter");
            expect(res[1].ANewInt).toBe(1);
        
        });
        it("one grouping two aggregations average/min", function(){

            var grouping = {
                keys: ["AString"],
                aggregations: [
                    new odata.QueryAggregation(odata.QueryAggregation.average, "mAggregate", "ANewInt"),
                    new odata.QueryAggregation(odata.QueryAggregation.min, "AnInt", "AnInt")
                    ]
            };
            query.grouping=new odata.QueryGrouping(grouping);
            var res=query.toQuery()(data);
            expect(res.length).toBe(2);
            expect(res[0].AString).toBe("francesco");
            expect(res[0].ANewInt).toBe(4);
            expect(res[0].AnInt).toBe(3);
            expect(res[1].AString).toBe("peter");
            expect(res[1].ANewInt).toBe(2);
            expect(res[1].AnInt).toBe(4);
        });
        it("two groupings two aggregations sum/countdistinct", function(){

            var grouping = {
                keys: ["AString", "AnInt"],
                aggregations: [
                    new odata.QueryAggregation(odata.QueryAggregation.sum, "mAggregate", "ANewInt"),
                    new odata.QueryAggregation(odata.QueryAggregation.count, "toAggregate", "ACount")
                    ]
            };
            query.grouping=new odata.QueryGrouping(grouping);
            query.sorting = [
                new odata.QuerySortingCondition("AString"),
                new odata.QuerySortingCondition("AnInt")
            ];
            var res=query.toQuery()(data);
            expect(res.length).toBe(3);
            expect(res[0].AString).toBe("francesco");
            expect(res[0].ANewInt).toBe(10);
            expect(res[0].ACount).toBe(2);
            expect(res[1].AString).toBe("francesco");
            expect(res[1].ANewInt).toBe(6);
            expect(res[1].ACount).toBe(1);
            expect(res[2].AString).toBe("peter");
            expect(res[2].ANewInt).toBe(2);
            expect(res[2].ACount).toBe(1);
        });
});
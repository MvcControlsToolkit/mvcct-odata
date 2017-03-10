var odata = require("./dest/umd/mvcct.odata.js");

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
         query.skip = 2;
         var res=query.toQuery()(data);
             
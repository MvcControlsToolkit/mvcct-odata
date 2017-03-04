var odata = require("../dest/umd/mvcct.odata.js")

describe("test suite", function(){
    it("specific test", function(){
        let test = new odata.QueryFilterCondition();
        expect(test.toString()).toBe("bo");
    });
});
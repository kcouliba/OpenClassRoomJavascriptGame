/*
** tests.js
** Author coulibaly.d.kevin@gmail.com
** Date 24/10/2015
** A test file for running scripts
** Caution : All other files must have been loaded before that one
*/

var tests = {
    
    /*
    ** test
    ** Test Object
    */
    test: {
        name: "",
        result: 0, // Return of the user's function is stored at execution to access it without running the function again
        expected: 0,
        not: false, // If a the test expects the comparison to be false
        params: [ ], // User's function parameters
        
        /*
        ** init
        ** constructor
        ** @param name : string
        ** @param expected : value
        ** @param funct : function
        ** @param params : Array
        ** @param not : boolean
        */
        init: function(name, expected, funct, params, not) {
            this.name = name || this.name;
            this.expected = expected || this.expected;
            this.funct = funct || this.funct;
            this.params = params || this.params;
            this.not = not || this.not;
        },
        
        /*
        ** funct
        ** Function to execute (overwritten by user)
        */
        funct: function() {
            return (0);
        },
        
        /*
        ** run
        ** Runs the test and returns a comparison between expected and result
        ** @return : boolean
        */
        run: function() {
            if (this.params.length > 0) {
                for (key in this.params) {
                    this.result = this.funct(this.params[key]);
                    if (!((this.result === this.expected) ^ this.not)) {
                        return (false);
                    }
                }
                return (true);
            }
            this.result = this.funct();
            return ((this.result === this.expected) ^ this.not);
        },
        
        /*
        ** toString
        ** Returns a string representation of the instance
        ** @return string
        */
        toString: function() {
            return (this.name + " (expects " + ((this.not) ? "NOT " : "") + this.expected + ")");
        }
    },
    
    /*
    ** tests
    ** Test pool
    */
    tests: { },
    
    /*
    ** add
    ** Adds a test to test pool
    ** @param name : string
    ** @param expected : Object
    ** @param f : function
    ** @param params : Array
    ** @param not : boolean
    */
    add: function(name, expected, f, params, not) {
        this.tests[name] = this.createTest(name, expected, f, params, not);
        console.log("Added " + this.tests[name] + ".");
    },
    
    /*
    ** run
    ** Runs a test from test pool
    ** @param name : string
    */
    run: function(name) {
        var result = "Test " + this.tests[name].name;
        
        if (this.tests[name].run()) {
            result += " : SUCCESS.";
        } else {
            result += " : FAILURE.";
            result += "\nThe function returned : " + this.tests[name].result 
                + " : " + this.tests[name] + ".";
        }
        console.log(result);
    },
    
    /*
    ** runAll
    ** Runs all tests from test pool
    */
    runAll: function() {
        console.log("Running all tests :\n");
        console.log("****************************************");
        for (test in this.tests) {
            this.run(test);
        }
        console.log("****************************************");
        console.log("");
    },
    
    /*
    ** createTest
    ** Returns a test instance
    ** @return test Object
    ** @param name : string
    ** @param expected : Object
    ** @param f : function
    ** @param params : Array
    ** @param not : boolean
    */
    createTest: function(name, expected, f, params, not) {
        var test = Object.create(this.test);
        
        test.init(name, expected, f, params, not);
        return (test);
    }
};
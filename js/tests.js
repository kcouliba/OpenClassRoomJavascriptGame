/*
** tests.js
** Author coulibaly.d.kevin@gmail.com
** A test class for running tests
** Caution : All other files must have been loaded before that one
*/

var Tests = {

    /* Tests attributes */

    // Test pool
    tests: { },
    name: "",

    /*
    ** new
    ** @param name : string
    ** Returns Tests
    */
    new: function(name) {
        var self = Object.create(this);

        self.name = name;
        return (self);
    },

    /*
    ** add
    ** Adds a test to test pool
    ** @param name : string
    ** @param expected : Object
    ** @param f : function
    ** @param params : Array
    ** @param not : bool
    ** @return Tests
    */
    add: function(name, expected, f, params, not) {
        this.tests[name] = Tests.Test.new(name, expected, f, params, not);
        console.log("Added " + this.tests[name] + ".");
        return (this);
    },

    /*
    ** run
    ** Runs a test from test pool
    ** @param name : string
    ** @return this : Tests
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
        return (this);
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

    /* Tests Sub Classes */

    /*
    ** Test
    ** A test representation as object
    */
    Test: {
        /* Test attributes */

        name: "",
        result: 0, // Return of the user's function is stored at execution to access it without running the function again
        expected: 0,
        not: false, // If a the test expects the comparison to be false
        params: [ ], // User's function parameters

        /* Test methods */

        /*
        ** new
        ** Returns a Test instance
        ** @param name : string
        ** @param expected : Object
        ** @param f : function
        ** @param params : Array
        ** @param not : bool
        ** @return Test
        */
        new: function(name, expected, funct, params, not) {
            var self = Object.create(this);

            self.name = name || self.name;
            self.expected = expected || self.expected;
            self.funct = funct || self.funct;
            self.params = params || self.params;
            self.not = not || self.not;
            return (self);
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
        ** @return bool
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
    }
};

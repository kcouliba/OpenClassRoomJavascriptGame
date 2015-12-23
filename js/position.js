/*
** position.js
** Author coulibaly.d.kevin@gmail.com
** Position Class
*/

var Position = {
    /* Position attributes */

    x: 0,
    y: 0,

    /* Position methods */

    /*
    ** new
    ** Returns an instance of Position
    ** @param x : Number
    ** @param y : Number
    ** @return Position
    */
    new: function(x, y) {
        var self = Object.create(this);

        self.x = x;
        self.y = y;
        return (self);
    },

    /*
    ** set
    ** Defines x and y values
    ** @param x : Number
    ** @param y : Number
    */
    set: function(x, y) {
        this.x = x;
        this.y = y;
    },

    /*
    ** add
    ** Adds Position to the instance
    ** @param position : Position Object
    ** @return Position
    */
    add: function(position) {
        return (this.new(this.x + position.x, this.y + position.y));
    },

    /*
    ** sub
    ** Subs Position to the instance
    ** @param position : Position Object
    ** @return Position
    */
    sub: function(position) {
        return (this.new(this.x - position.x, this.y - position.y));
    },

    /*
    ** clone
    ** Clones a Position instance
    ** @param rhs : Position Object
    ** @return Position
    */
    clone: function(rhs) {
        if (this != rhs) {
            return (this.new(rhs.x, rhs.y));
        }
    },

    /*
    ** equals
    ** Checks if position values are equals to another position
    ** @param position : Position Object
    ** @return bool
    */
    equals: function(position) {
        return ((this.x === position.x) && (this.y === position.y));
    },

    /*
    ** toString
    ** Position instance as string
    ** @return string
    */
    toString: function () {
        return ("(" + this.x + ", " + this.y + ")");
    }
};
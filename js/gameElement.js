/*
** gameElement.js
** Author coulibaly.d.kevin@gmail.com
** A gameElement class
*/

// Element sub class
var GameElement = {
    /* Element attributes */

    position: null,

    /* Element methods */

    /*
    ** new
    ** Creates new Element instance
    ** @param object : Object
    ** @return Element
    */
    new: function(object) {
        var self = Object.create(this);

        for (attr in object) {
            self[attr] = object[attr];
        }
        self.position = Vector2d.create(0, 0);
        return (self);
    },

    /*
    ** setPosition
    ** Sets element's position
    ** @param x : Number
    ** @param y : Number
    ** @return Element
    */
    setPosition: function (x, y) {
        this.position.x = x;
        this.position.y = y;
        return (this);
    },

    /*
    ** getPosition
    ** Gets element's position
    ** @return Position
    */
    getPosition: function () {
        return (this.position);
    }
};
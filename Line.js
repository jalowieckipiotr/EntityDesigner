
var Line = $.inherit(
    {
    __constructor : function($elem) { // constructor
        var self = this;
        self.$elem = $elem;
        self.Id = Entity.UID++;
        self.Left = 10;
        self.Top = 10;
        $elem.addClass("id-"+self.Id)
    },
        
    onDrag: function (left, top) {
     var self = this;
     self.Left = left;
     self.Top = top;
     EntityService.changeStateLine(self);
    },
        

    getStaticProperty : function() {
        return this.__self.staticMember; // access to static
    }
}, /** @lends A */ {
    staticProperty : 'staticA',

    staticMethod : function() {
        return this.staticProperty;
    }
});

Line.UID = 1;
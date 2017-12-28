var EntityTemplate = '<div class="entity-header">'+
                            '<span class="label">{name}</span>'+
                            '<button type="submit" class="delete" >x</button>'+
                        '</div>';

var Entity = $.inherit(
    {
    __constructor : function($elem) { // constructor
        var self = this;
        self.$elem =$elem;
        var $control = $(EntityTemplate.replace("{name}",$elem.name));
        self.$elem.append($control);
        self.TableName = $elem.name;
        self.Id = Entity.UID++;
        self.Left = 0;
        self.Top = 0;
        $elem.addClass("id-"+self.Id)
        console.log(self.Id);
        
    },
        
        
        
    onDrag: function (left, top) {
     var self = this;
     self.Left = left;
     self.Top = top;
     EntityService.changeState(left, top, self.Id)
     console.log(self.Left);
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

Entity.UID = 1;
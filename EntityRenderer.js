
var EntityRenderer = (function (renderer) {
    
    var $_containerRoot=null;
    
    // public
    renderer.renderList = function (entities) {
        _initializeRoot();
        for (var i = 0; i < entities.length; i++) {
            _createEntityItem(entities[i]);
        }
        
        for (var i = 0; i < entities.length; i++) {
            _appendEvents(entities[i]);
        }
    };

    // private
    function _initializeRoot() {
        if (!$_containerRoot) {
            $_containerRoot= $('.entities-container');
        } else {
            _clearItems();
        }
    }

    function _clearItems() {
        while ($_containerRoot[0].firstChild) {
            $_containerRoot[0].removeChild($_containerRoot[0].firstChild);
        }
    }

    function _createEntityItem(entity) {
        $_containerRoot.append(entity.$elem[0].outerHTML)
        console.log($_containerRoot)
        var $entity = $(".entity.id-" +entity.Id);
        $entity.css( "left", entity.Left);
        $entity.css( "top", entity.Top);        
           
    }
    function _appendEvents(entity) {
        var $entity = $(".entity.id-" +entity.Id);
        
        $entity.draggable({
            drag: function( event, ui ) {
                var container_width = $_containerRoot[0].clientWidth - $entity[0].clientWidth;
                var container_height =$_containerRoot[0].clientHeight - $entity[0].clientHeight;
                ui.position.left = Math.max( 0, ui.position.left );
                ui.position.left = Math.min( container_width, ui.position.left );
                ui.position.top = Math.max( 0, ui.position.top );
                ui.position.top = Math.min( container_height, ui.position.top );
                entity.onDrag(ui.position.left, ui.position.top )
                
            }
        });        
        //$entity.css( "top", entity.Top);
        $entity.find("button.delete").click(function() {
            EntityView.deleteEntity(entity.Id);
        });
        
    }
    
    return renderer;

})(EntityRenderer || {});
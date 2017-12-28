
var EntityView = (function(view) {
    
    
    view.getEntities = function() {
        return EntityService.getEntities();
    }
 
    view.addEntity = function() {
        var _addEntityInput = document.querySelector('.entity-input');
        var name = _addEntityInput.value
        if(name != '' && name != null)
        {
          var $elem = $('<div class="entity">')
          $elem.name = name;
          EntityService.addEntity($elem);
          _addEntityInput.value='';
          updateView();  
        }
            
    };
 
    view.deleteEntity = function(entityId) {
        EntityService.deleteEntity(entityId);
        updateView();
    };
 
    return view;
 
})(EntityView || {});

document.addEventListener("DOMContentLoaded", function(event) {
    EntityRenderer.renderList(EntityView.getEntities());
});


function updateView() {
    EntityRenderer.renderList(EntityView.getEntities());
    
    
}
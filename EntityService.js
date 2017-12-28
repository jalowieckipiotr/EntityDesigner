var EntityService = (function(service) {
 
    var _entities = [];
    
    service.getEntities = function() {
        return _entities;
    }
 
    service.addEntity = function($elem) {
        _entities.push(new Entity($elem));
        console.log(_entities)
    }
 
    service.deleteEntity = function(entityId) {
        _entities = _entities.filter(function(entity) {
            return entity.Id !== entityId;
        });
    }
    
    service.changeState = function(left, top, entityId) {
        var entity = _entities.filter(function(entity) {
            return entity.Id === entityId;
        })[0];
        entity.Left = left;
        entity.Top = top;
        console.log(entity)
        
    }

    return service;
 
})(EntityService || {});


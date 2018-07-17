var EntityService = (function(service) {
 
    var _entities = [];
    var _lines = [];
    
    service.getEntities = function() {
        //if(localStorage._entities != null)
        //    {
        //        var entities_parsed=JSON.parse(localStorage._entities);
        //        for(var x in entities_parsed){
        //            _entities.push(entities_parsed[x]);
        //            }
        //    }
        return _entities;
    }
    
    service.getLines = function() {
        return _lines;
    }
 
    service.addEntity = function($elem) {
        _entities.push(new Entity($elem));
        
        localStorage._entities=JSON.stringify(_entities);
        console.log(_entities)
    }
 
    service.deleteEntity = function(entityId) {
        _entities = _entities.filter(function(entity) {
            return entity.Id !== entityId;
        });
    }
    service.deleteReference = function(referenceId) {
        
        $.each(_entities, function() {
            var _entity = this;
            
            _entity.References = _entity.References.filter(function(reference) {
            return reference.id !== referenceId;
            });
            _entity.SourceReferences = _entity.SourceReferences.filter(function(reference) {
            return reference.id !== referenceId;    
        });
        
    })
    }
    
    service.changeState = function(self) {
        var entity = _entities.filter(function(entity) {
            return entity.Id === self.Id;
        })[0];
        entity.Left = self.Left;
        entity.Top = self.Top;
        entity.Columns = self.Columns;
        entity.References = self.References;
        
    }
    service.changeStateLine = function(self) {
        var entity = _entities.filter(function(entity) {
            return entity.Id === self.Id;
        })[0];
        entity.Left = self.Left;
        entity.Top = self.Top;
        
    }
    
    service.addLine = function($elem) {
        _lines.push(new Line($elem));
        console.log(_lines)
    }

    return service;
 
})(EntityService || {});


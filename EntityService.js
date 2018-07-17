var EntityService = (function(service) {
 
    var _entities = [];
    var _lines = [];
    var userId = null;
    
    service.login = function(email, password) {
        $.ajax(
            {
                url: "http://localhost:3000/user/login", 
                type:"POST",
                data:{
                    email:email,
                    password: password
                }
        })
        .done(function(response) {
            userId = response.userId;
            afterLogin();
            service.loadEntities();
        })
        .error(function(error)
        {   
            alert(error.responseJSON.message);
        })

    }
    service.register = function(email, password) {
        $.ajax(
            {
                url: "http://localhost:3000/user/signup", 
                type:"POST",
                data:{
                    email:email,
                    password: password
                }
        })
        .done(function(response) {
            userId = response.userId;
            afterLogin();
        })
        .error(function(error)
        {   
            alert(error.responseJSON.message);
        })

    }
    service.loadEntities = function(){
        $.ajax(
            {
                url: "http://localhost:3000/entities/" + userId, 
                type:"GET"
        })
        .done(function(response) {

            for (var i = 0; i < response.entities.length; i++)
            {
                var entity = response.entities[i];
                jQuery.parseJSON(JSON.stringify(entity));
                _entities.push(new Entity(entity.name, entity._id, entity.left, entity.top, jQuery.parseJSON(entity.columns), jQuery.parseJSON(entity.references), jQuery.parseJSON(entity.sourceReferences)));
                
            }
            updateView();
            
        });

        

    }

    service.getEntities = function() {
        return _entities;
    }
    
    service.getLines = function() {
        return _lines;
    }
 
    service.addEntity = function(name) {
        $.ajax(
            {
                url: "http://localhost:3000/entities/", 
                type:"POST",
                data:{
                    name:name,
                    userId: userId
                }
        })
        .done(function(response) {
            var id = response.createdEntity._id;
            _entities.push(new Entity(name, id, 0, 0,[],[],[]));
            updateView();
        });

    }
 
    service.deleteEntity = function(entityId) {

        var entity = _entities.filter(function(entity) {
            return entity.Id === entityId;
        });
        $.each(entity[0].References, function(){
            var reference = this;
            service.deleteReference(reference.id);
        });
        $.each(entity[0].SourceReferences, function(){
            var reference = this;
            service.deleteReference(reference.id);
        });
        $.ajax(
            {
                url: "http://localhost:3000/entities/"+entityId, 
                type:"DELETE"
        })
        .done(function(response) {
            console.log(response);
        });


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
        service.changeState(_entity);
        
    })
    }
    service.deleteColumn = function(columnId, entityId) {
        
        var entity = _entities.filter(function(entity) {
            return entity.Id === entityId;
        })[0];

        entity.Columns = entity.Columns.filter(function(column) {
            return column.id !== columnId;
        });

        service.changeState(entity);
        
    }


    service.changeState = function(self) {
        var entity = _entities.filter(function(entity) {
            return entity.Id === self.Id;
        })[0];
        entity.Left = self.Left;
        entity.Top = self.Top;
        entity.Columns = self.Columns;
        entity.References = self.References;
        entity.SourceReferences = self.SourceReferences;
        $.ajax(
            {
                url: "http://localhost:3000/entities/"+self.Id, 
                type:"PATCH",
                data:{
                    name:self.TableName,
                    left:self.Left,
                    top:self.Top,
                    columns:JSON.stringify(self.Columns),
                    references:JSON.stringify(self.References),
                    sourceReferences:JSON.stringify(self.SourceReferences)
                }
        })
        .done(function(response) {
            console.log(response);
        });


        
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


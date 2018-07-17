var EntityTemplate = `<div class="entity">
                    <div class="entity-header">
                        <span class="label">{name}</span>
                        <button type="submit" class="delete">x</button>
                     </div>
                     <table class="entity-body">
                       <tr>
                         <th>L. p.</th>
                         <th>Nazwa kolumny</th>
                         <th>Typ</th>
                         <th>Null</th>
                         <th>PK</th>
                         <th/>
                       </tr>
                       <tr class="add-column-container">
                            <td>
                                <span>-</span>
                            </td>
                            <td>
                                <input class="column-name" type="text" placeholder="Wpisz nazwę kolumny"/>
                            </td>
                            <td>
                              <select class="column-type" > 
                                <option value="">Wybierz Typ</option> 
                                <option value="int">int</option> 
                                <option value="bigint">bigint</option> 
                                <option value="nvarchar(max)">nvarchar</option> 
                                <option value="uniqueidentifier">guid</option>
                                <option value="numeric">numeric</option>
                                <option value="date">date</option> 
                                <option value="datetime">datetime</option> 
                              </select> 
                            </td>
                            <td>
                              <input class="column-nullable" type="checkbox" />
                            </td>
                            <td>
                              <input class="column-pk" type="checkbox" />
                            </td>
                            <td>
                              <button type="submit" class="add-column" >+</button>
                            </td>
                        </tr>
                     </table>
                     <div class="entity-footer">
                        <select class="reference-tables" />
                        <input class="reference-name" type="text" placeholder="Nazwa referencji" />
                        <button type="submit" class="add-reference">Dodaj FK</button>
                     </div>
                     </div>`;

var ColumnTemplate = `<tr class="entity-column">
                         <td>
                          <span class="column-id">{column_id}</span>
                        </td>
                        <td>
                          <span class="column-name">{column_name}</span>
                        </td>
                        <td>
                          <span class="column-type">{column_type}</span>
                        </td>
                        <td>
                          <input class="nullable" type="checkbox" disabled="disabled"/>
                        </td>
                        <td>
                          <input class="pk" type="checkbox" disabled="disabled"/>
                        </td>
                        <td>
                        <button type="submit" class="delete-column">x</button>
                        </td>
                     </tr>`;

var Entity = $.inherit(
    {
    __constructor : function(name, id, left, top, columns, references, sourceReferences) { // constructor
        var self = this;
        self.TableName = name;
        self.Id = id;
        self.Left = left;
        self.Top = top;
        self.Columns=columns;
        self.References=references;
        self.SourceReferences = sourceReferences;
    },
        
    onDrag: function (left, top) {
     var self = this;
     self.Left = left;
     self.Top = top;
     EntityService.changeState(self);
     self.referenceManage(self);
    },
        
    referenceManage(entity)
    {
        var self = entity;
        var _entities=EntityService.getEntities();
        //    
        for (var i = 0; i < self.References.length; i++) {
            var targetId = self.References[i].targetId;    
            var referenceId = self.References[i].id;    
            var referenceName = self.References[i].referenceName;    
                
            var targetEntity = _entities.filter(function(entity) {
                return entity.Id == targetId;
            })[0];
            var boxCenterXOffset = 150;
            var boxCenterYOffset = 150 + i*40;
                
            var x1 = self.Left + boxCenterXOffset;
            var x2 = targetEntity.Left + boxCenterXOffset;
            
            var y1 = self.Top + boxCenterYOffset;
            var y2 = targetEntity.Top + boxCenterYOffset;
            var $line = $(".line.id-" + referenceId + "." + referenceName);
            var $lineheader = $(".line.id-" + referenceId + "." + referenceName + " span");
            
            self.rotationCalculate(x1, x2, y1, y2, $line);
            $lineheader.css("transform", "rotate(180deg)");
        }
        //
        for (var i = 0; i < self.SourceReferences.length; i++) 
        {
            var referenceId = self.SourceReferences[i].id;    
            var referenceName = self.SourceReferences[i].referenceName;    
            var sourceId = self.SourceReferences[i].sourceId;    
                
            var sourceEntity = _entities.filter(function(entity) {
                return entity.Id == sourceId;
            })[0];
            var boxCenterXOffset = 150;
            var boxCenterYOffset = 150+ i*40;
                
            var x1 = self.Left + boxCenterXOffset;
            var x2 = sourceEntity.Left + boxCenterXOffset;
            
            var y1 = self.Top + boxCenterYOffset;
            var y2 = sourceEntity.Top + boxCenterYOffset;
            var $line=$(".line.id-" + referenceId + "." + referenceName);
            var $lineheader = $(".line.id-" + referenceId + "." + referenceName + " span");
            $lineheader.css("transform", "rotate(0deg)");
            self.rotationCalculate(x1, x2, y1, y2, $line);
        }
    },
    
        
    rotationCalculate(x1, x2, y1, y2, $line)    
    {
      var hypotenuse = Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
        var angle = Math.atan2((y1-y2), (x1-x2)) *  (180/Math.PI);
         if(angle >= 90 && angle < 180){
                        y1 = y1 - (y1-y2);
                    }
                    if(angle > 0 && angle < 90){
                        x1 = x1 - (x1-x2);
                        y1 = y1 - (y1-y2);
                    }
                    if(angle <= 0 && angle > -90){
                        x1 = x1 - (x1-x2);
                    }
      if ($line.length >0)
        {
            $line.queue(function(){
                    $(this).offset({top: y1, left: x1});
                    $(this).dequeue();
                }).queue(function(){
                    $(this).width(hypotenuse);
                    $(this).dequeue();
                }).queue(function(){
                    $(this).rotate(angle);
                    $(this).dequeue();
                });
        }
    },
    
        
    addColumn(name,type, nullable, pk)
    {
        var self = this;
        var column = new Object();
        column.id=self.Columns.length+1;
        column.name=name;
        column.type=type;
        column.nullable=nullable;
        column.pk=pk;
        self.Columns.push(column);
        EntityService.changeState(self);
        
    },
        
    addReference(targetId, targetName, refName)
    {
        var self = this;
        var reference = new Object();
        var referenceId = Entity.UID++;
        reference.id=referenceId;
        reference.targetId=targetId;
        reference.targetName=targetName;
        if(refName == '' ||refName ==null)
        {
            refName=referenceId;
        }
        var referenceName = "fk_" + self.TableName + "_" + reference.targetName + "_" +refName;
        reference.referenceName = referenceName;
        self.References.push(reference);
        EntityService.changeState(self);
        ///
        var _entities = EntityService.getEntities();
        var targetEntity = _entities.filter(function(entity) {
            return entity.Id == targetId;
        })[0];
        var sourceReference = new Object();
        sourceReference.sourceId = self.Id;
        sourceReference.referenceName = referenceName;
        sourceReference.id = referenceId;
        $.each(targetEntity.Columns, function() {
                var column = this;
                if (column.pk)
                    self.addColumn(column.name + "_" +refName, column.type, column.nullable, false);
                
            
            });
        targetEntity.SourceReferences.push(sourceReference);
        EntityService.changeState(targetEntity);
        
        
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
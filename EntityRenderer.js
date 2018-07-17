
var EntityRenderer = (function (renderer) {
    
    var $_containerRoot = null;
    
    // public
    renderer.renderList = function (entities) {
        _initializeRoot();
        for (var i = 0; i < entities.length; i++) {
            _createEntityItem(entities[i]);
        }
        for (var i = 0; i < entities.length; i++) {
            _appendEventsEntities(entities[i]);
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
        var $entity = $(".entity.id-" +entity.Id);
        $entity.css( "left", entity.Left);
        $entity.css( "top", entity.Top);        
        
        var $body = $entity.find(".entity-body");
        for (var i = 0; i < entity.Columns.length; i++) {
            _createEntityColumn(entity.Columns[i],$body);
        }  
        var $referencetables = $(".entity.id-" +entity.Id + " select.reference-tables");
        var entities=EntityView.getEntities()
        
        
        ///
        for (var i = 0; i < entity.References.length; i++) {
            var id = entity.References[i].id;
            var targetId = entity.References[i].targetId;
            var targetName = entity.References[i].targetName;
            var referenceName = entity.References[i].referenceName;
            _createEntityReference(id, targetId, targetName, referenceName);
        }  
        entity.referenceManage(entity);
        ///
        $.each(entities, function() {
            var _entity = this;
            
            var canAdd =true;
            
            $.each(entity.References, function() {
                var reference = this;
                if(parseInt(reference.targetId) == parseInt(_entity.Id))
                    canAdd =false;
            });
                   
            $.each(entity.SourceReferences, function() {
                var source_reference = this;
                if(parseInt(source_reference.sourceId) == parseInt(_entity.Id))
                    canAdd = false;
            });
            
            
            if (canAdd && _entity.Id !=entity.Id)
                {
                    $referencetables.append($("<option />").val(this.Id).text(this.TableName));   
                }
            
            
        });
    }
    function _createEntityColumn(column, $body) {
        var $column_temp = $(ColumnTemplate.replace("{column_id}",column.id).replace("{column_name}",column.name).replace("{column_type}", column.type));
        $column_temp.find("input.nullable")[0].checked = column.nullable;
        $column_temp.find("input.pk")[0].checked = column.pk;
        $body.append($column_temp);
    }
    //
    function _createEntityReference(id, targetId, targetName, referenceName) {
        
        $_containerRoot.append('<div class="line id-'+id+'"/>');
        var $line = $(".line.id-" +id);
        $line.addClass(referenceName);
        $line.append( "<span>"+referenceName+"</span>" );
        $line.append("<button type='submit' value='"+ id +"' class='deleteReference'>x</button>")
    }
    
    //
    
    function _appendEventsEntities(entity) {
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
        
        
        
    
        $entity.find("button.delete").click(function() {
            EntityView.deleteEntity(entity.Id);
        });
        
        $_containerRoot.find("button.deleteReference").click(function() {
            var self = this;
            referenceId = parseInt(this.value);
            EntityView.deleteReference(referenceId);
        });
        
        
        $entity.find("button.add-column").click(function() {
            var column_name = $entity.find("input.column-name").val();
            var type = $(".entity.id-" +entity.Id+" .column-type option:selected").val();
            var nullable = $entity.find("input.column-nullable")[0].checked;
            var pk = $entity.find("input.column-pk")[0].checked;
            if(column_name != null && column_name !='' && type != null && type != '')
            {
                entity.addColumn(column_name,type, nullable, pk);
                EntityRenderer.renderList(EntityView.getEntities());
            }
            
        });
        
        $entity.find("button.add-reference").click(function() {
            var targetName = $(".entity.id-" +entity.Id+" .reference-tables option:selected").text();
            var targetId = $(".entity.id-" +entity.Id+" .reference-tables option:selected").val();
            entity.addReference(targetId,targetName,null);
            EntityRenderer.renderList(EntityView.getEntities());
        });
        
        
    }
    
    return renderer;

})(EntityRenderer || {});
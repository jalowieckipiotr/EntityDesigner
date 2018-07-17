
var EntityView = (function(view) {
    
    
    view.getEntities = function() {
        return EntityService.getEntities();
    }

    view.login = function() {
        var email = document.querySelector('.email').value;
        var password = document.querySelector('.password').value;
        if(email != null && email != '' && password != null && password !=''){
            EntityService.login(email, password);
        }
        else{
            alert("Proszę uzupełnić pola e-mail i hasło");
        }
    }
    view.register = function() {
        var email = document.querySelector('.email-register').value;
        var password = document.querySelector('.password-register').value;
        if(email != null && email != '' && password != null && password !=''){
            EntityService.register(email, password);
        }
        else{
            alert("Proszę uzupełnić pola e-mail i hasło");
        }
    }
    view.addEntity = function() {
        var _addEntityInput = document.querySelector('.entity-input');
        var name = _addEntityInput.value
        if(name != '' && name != null)
        {
          EntityService.addEntity(name);
          _addEntityInput.value='';
        }
            
    };
    view.deleteEntity = function(entityId) {
        EntityService.deleteEntity(entityId);
        updateView();
    };
    
    view.deleteReference = function(referenceId) {
        EntityService.deleteReference(referenceId);
        updateView();
    };

    view.deleteColumn = function(columnId, entityId) {
        EntityService.deleteColumn(columnId, entityId);
        updateView();
    };
 
    return view;
 
    
})(EntityView || {});

document.addEventListener("DOMContentLoaded", function(event) {
    //EntityService.loadEntities()
    //console.log(EntityView.getEntities());
    var globalVariables  = Object.keys(window);
    var pattern ="SQLGenerator_"
    var $sqlLanguages = $('select.sql-languages');
    var $generateButton = $('button.generate-script');

    for (var i = 0; i < globalVariables.length; i++)   {
        if (globalVariables[i].indexOf(pattern) > -1)
        {
            var f = globalVariables[i];
            var name = f.substring(pattern.length);
            console.log(name)
            $sqlLanguages.append($("<option />").val(f).text(name));
        }
    }

    $generateButton.click(function() {
        var function_name = $sqlLanguages[0].value
        eval(function_name+".generateSript()");
    });
});


function updateView() {
    console.log(EntityView.getEntities())
    EntityRenderer.renderList(EntityView.getEntities());
    
}

function afterLogin() {
    EntityRenderer.afterLogin();   

    



}

var SQLGenerator_TSQL = (function (generator) {
    
    var SQLScript='';
    // public
    generator.generateSript = function (language) {
        var entities = EntityService.getEntities();
        generateTSQL(entities);
        
    };

    // private
    function generateTSQL(entities) {

        for (var i = 0; i < entities.length; i++)   
        {
            var entity = entities[i];
            hasPrimaryKey=false;
            var primaryKey = '\nCONSTRAINT PK_' + entity.TableName +' PRIMARY KEY(';
            SQLScript += 'CREATE TABLE dbo.' + entity.TableName + '\n(\n';

            for (var x = 0; x < entity.Columns.length; x++)
            {
                var column = entity.Columns[x];
                SQLScript += column.name +' '+ column.type;

                if (column.pk)
                {
                    hasPrimaryKey = true;
                    primaryKey+=column.name;
                    
                }

                if(column.nullable && !column.pk)
                {
                    SQLScript += ' NULL';
                }
                else 
                {
                    SQLScript += ' NOT NULL';
                }
                
                if( x < (entity.Columns.length -1))
                {
                    SQLScript +=',\n'

                    if(column.pk)
                    {
                        primaryKey+=','
                    }
                    
                }

                

            }
            if(hasPrimaryKey)
            {
                SQLScript+=primaryKey + ')\n';
            }
            SQLScript +='\n)\nGO\n'

        }


        prompt(SQLScript +'\n\nHere is your copiable version:' ,SQLScript);
        SQLScript='';
    }

    return generator;

})(SQLGenerator_TSQL || {});

var SQLGenerator_Oracle = (function (generator) {
    
    var SQLScript='';
    // public
    generator.generateSript = function (language) {
        var entities = EntityService.getEntities();
        generateTSQL(entities);
        
    };

    // private
    function generateTSQL(entities) {

        for (var i = 0; i < entities.length; i++)   
        {
            var entity = entities[i];
            hasPrimaryKey=false;
            var primaryKey = '\nCONSTRAINT PK_' + entity.TableName +' PRIMARY KEY(';
            SQLScript += 'CREATE TABLE dbo.' + entity.TableName + '\n(\n';

            for (var x = 0; x < entity.Columns.length; x++)
            {
                var column = entity.Columns[x];
                SQLScript += column.name +' '+ column.type;

                if (column.pk)
                {
                    hasPrimaryKey = true;
                    primaryKey+=column.name;
                    
                }

                if(column.nullable && !column.pk)
                {
                    SQLScript += ' NULL';
                }
                else 
                {
                    SQLScript += ' NOT NULL';
                }
                
                if( x < (entity.Columns.length -1))
                {
                    SQLScript +=',\n'

                    if(column.pk)
                    {
                        primaryKey+=','
                    }
                    
                }

                

            }
            if(hasPrimaryKey)
            {
                SQLScript+=primaryKey + ')\n';
            }
            SQLScript +='\n)\nGO\n'

        }

        
        prompt(SQLScript +'\n\nHere is your copiable version:' ,SQLScript);
        SQLScript='';
    }

    return generator;

})(SQLGenerator_Oracle || {});

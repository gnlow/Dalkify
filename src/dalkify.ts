import {
    Extension,
    Block,
    Template,
    Type,
    Project,
    Variable,
    Dict,
    Param,
    Literal,
} from "dalkak"

export function inject(pack: Extension, Entry) {
    if(pack.on?.run){
        Entry.addEventListener("run", pack.on.run);
    }
    if(pack.on?.stop){
        Entry.addEventListener("stop", pack.on.stop);
    }

    let blocks: Array < Block > = [];
    for (var block in pack.blocks.value) {
        blocks.push(pack.blocks.value[block]);
    }
    blocks.forEach(block => {
        var paramsKeyMap: {
            [key: string]: any
        } = {};
        var entBlock = {
            type: "function_create",
            params: []
        };
        var blockPointer = entBlock;
        var template = block.template.content;
        var i = 0;
        for (var paramName in block.params.value) { //순서 보장 못함. 수정 필요
            var param = block.params.value[paramName];
            template = template.replace(Template.addBracket(paramName, param.returnType), `(${paramName})`);
            paramsKeyMap[paramName] = i;
            i++;
        }
        if(block.returnType.name == "string"){
            template += " →(RETURN)";
            paramsKeyMap["RETURN"] = i;
        }
        template.split(/[({<)}>]/).forEach((x, i) => {
            if (x) {
                if (i % 2 == 0) {
                    blockPointer.params.push({
                        type: "function_field_label",
                        params: [
                            x
                        ]
                    });
                    blockPointer = blockPointer.params[blockPointer.params.length - 1];
                } else {
                    blockPointer.params.push({
                        type: "function_field_string",
                        params: [{
                            type: `stringParam_${Entry.Utils.generateId()}`
                        }]
                    });
                    blockPointer = blockPointer.params[blockPointer.params.length - 1];
                }
            }
        });
        //if (!Entry.variableContainer.functions_["dalkak_" + block.name]) {
            Entry.variableContainer.setFunctions([{
                id: "dalkak_" + block.name,
                content: JSON.stringify([
                    [entBlock]
                ])
            }]);
        //}
        var params: {
            value: any,
            type: Type,
            name: string
        } [] = [];
        for (var x in block.params.value) {
            params.push({
                value: block.params.value[x].run(),
                type: block.paramTypes.value[x],
                name: x
            });
        }
        function getProjectVariables(Entry){
            return (Entry.variableContainer.variables_ as Array<any>)
                .map(val => {
                    var variable = new Variable({
                    name: val.getName(), 
                    value: val.getValue()
                    });
                    Object.defineProperty(variable, "value", {
                        get(){
                            return Entry.variableContainer.getVariableByName(val.getName()).getValue();
                        },
                        set(data){
                            Entry.variableContainer.getVariableByName(val.getName()).setValue(data);
                        },
                    });
                    return variable;
                })
                .reduce( ((acc, now) => {
                    acc[now.name] = now;
                    return acc;
                }), {} );
        }
        if(block.returnType.name == "string"){
            var func = async (object, script) => {
                var objParam: Dict<Param> = new Dict({});
                params.forEach(x => {
                    var paramValue = script.getValue(x.name, script);
                    objParam.value[x.name] = Literal.from(paramValue).setParam("input", paramValue);
                });
                var RETURN = script.getValue("RETURN", script);
                if(RETURN && !Entry.variableContainer.getVariableByName(RETURN)){
                    Entry.variableContainer.addVariable({name: RETURN})
                }
                block.setParams(objParam);
                Entry.variableContainer.getVariableByName(RETURN).setValue(await block.run( 
                    new Project({
                        variables: getProjectVariables(Entry)
                    }),
                    {
                        Entry
                    }
                ));
                return;
            }
        }else{
            var func = async (object, script) => {
                var objParam: any = {};
                params.forEach(x => {
                    objParam[x.name] = script.getValue(x.name, script);
                });
                block.func(objParam, 
                    new Project({
                        variables: getProjectVariables(Entry)
                    }),
                    {
                        Entry
                    }
                );
                return;
            }
        }
        
        Entry.block["func_dalkak_" + block.name].func = func;
        Entry.block["func_dalkak_" + block.name].paramsKeyMap = paramsKeyMap;
        if(pack.color){
            Entry.block["func_dalkak_" + block.name].color = "#" + pack.color.toString(16);
            Entry.block["func_dalkak_" + block.name].outerLine = "#00000000";
        }
    });

    if(pack.on?.mount){
        pack.on.mount();
    }
}
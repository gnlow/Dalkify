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
    Event,
    Local,
} from "dalkak"

export function inject(pack: Extension, Entry, packID) {
    if(pack.on?.run){
        Entry.addEventListener("run", pack.on.run);
    }
    if(pack.on?.stop){
        Entry.addEventListener("stop", pack.on.stop);
    }

    let blocks: Array < Block > = [];
    for (var block in pack.blocks.value) {
        let blockClone = Block.fromBlock(pack.blocks.value[block]);
        blockClone.name = pack.blocks.value[block].name;
        blocks.push(blockClone);
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
        if(block.returnType.extend != Block){
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
        //if (!Entry.variableContainer.functions_["dalk_" + block.name]) {
            Entry.variableContainer.setFunctions([{
                id: `dalk__${packID}__${block.name}`,
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
        let project = new Project({
            variables: getProjectVariables(Entry),
            events: getProjectMessages(Entry),
        });
        for (var x in block.params.value) {
            params.push({
                value: block.params.value[x].run(project),
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
        function getProjectMessages(Entry){
            return (Entry.variableContainer.messages_ as Array<any>)
                .map(val => {
                    var message = new Event(val.name);
                    message.fire = () => {
                        Entry.engine.raiseMessage(val.id);
                        return message;
                    }
                    return message;
                })
                .reduce( ((acc, now) => {
                    acc[now.name] = now;
                    return acc;
                }), {} );
        }
        var func = async (object, script) => {
            var objParam: Dict<Param> = new Dict({});
            params.forEach(x => {
                var paramValue: string | object = script.getValue(x.name, script);
                if(
                    x.type.extend == Variable
                    || x.type.extend == Event
                ){
                    // 엔트리에서는 변수와 신호를 파라미터로 보낼 수 없으므로
                    // Type.fromString을 통해 id: string 값으로 데이터를 찾는다.
                    objParam.value[x.name] = Literal.from(x.type.fromString(paramValue as string, project, new Local));
                }else{
                    // 변수나 신호가 아니면 그냥 보냄
                    objParam.value[x.name] = Literal.from(paramValue);
                }
                
            });
            var RETURN = script.getValue("RETURN", script);
            if(RETURN && !Entry.variableContainer.getVariableByName(RETURN)){
                Entry.variableContainer.addVariable({name: RETURN})
            }
            block.setParams(objParam);
            let result = await block.run( 
                project
            );
            if(block.returnType.extend != Block){
                Entry.variableContainer.getVariableByName(RETURN).setValue(result);
            }
            return;
        }
        Entry.block[`func_dalk__${packID}__${block.name}`].func = func;
        Entry.block[`func_dalk__${packID}__${block.name}`].paramsKeyMap = paramsKeyMap;
        Entry.block[`func_dalk__${packID}__${block.name}`].color = "#" + (pack.color || 0xF56EC1).toString(16);
        Entry.block[`func_dalk__${packID}__${block.name}`].outerLine = "#00000000";
    });

    if(pack.on?.mount){
        pack.on.mount();
    }
}
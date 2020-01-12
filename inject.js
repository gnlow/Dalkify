try{
    dalkLog("inject start");
    dalkify.inject(sample, Entry);
    dalkLog("inject end");
}catch(e){
    dalkErr(e);
    throw e;
    dalkErr("inject failed");
}
    
function dalkLog(text) {
    console.log(`%c Dalkify %c ${text} `, "background: #F56EC1; color: #FFF", "background: #FFCCDB; color: #000");
}
function dalkErr(text) {
    console.log(`%c Dalkify %c ${text} `, "background: #F56EC1; color: #FFF", "background: #FFF; color: red");
}
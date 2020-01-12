try{
    log("inject start")
    dalkify.inject(sample, Entry);
    log("inject end")
}catch(e){
    log(e);
}
    
function log(text) {
    console.log(`Dalkify | ${text}`);
}
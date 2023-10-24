document.querySelectorAll("input").forEach(element => {
    element.addEventListener("change",function(){
        document.querySelector("#p"+this.id[5]).classList.toggle("checked");
})})

document.querySelector("#task_input").addEventListener("focus",function(){
    document.querySelector("#task_input").classList.add("clicked");
})
document.querySelector("#task_input").addEventListener("blur",function(){
    document.querySelector("#task_input").classList.remove("clicked");
})




function buttonAction(){
    console.log("buttonAction");
    var input= getInput();
    input = textTransform(input);
    return hasPage(input) ? returnPage(input) : noPage();
}

function getInput(){
    console.log("getInput");
    /*
        Read the input from the input feild
    */
    var nameInput = $('#Christmas-name-input').val();

    return nameInput;
}

function hasPage(name){
    /*
        Check if there's a page given the name
    */
   const havePages = ["lovisa", "saga", "malte", "ester", "alma", "alice"];
   var pageExists = havePages.indexOf(name);

    if (pageExists>=0){  return true;}
    return false;
}

function returnPage(name){
    console.log("returnPage");
    /*
        Return the page based on the name provided
    */
    const currentUrl = window.location.href;
    const finalPosition = currentUrl.lastIndexOf("/")
    const baseUrl = currentUrl.substring(0,finalPosition+1);
    window.location =  baseUrl+"Kids/"+name+".html"  

}

function noPage(){
    /*
        Return no page there
    */
   alert("Tyvärr, bättre lycka nästa gång.");
}

function textTransform (string){
    /* 
        Remove all charactes which are not letters (A-Z)
        Change the text to lowercase
    */
    string = string.replaceAll("[^a-zA-Z]", " ");
    string = string.toLowerCase();
    return string;
}



var to = 'Alice ,Alma ,Ester , \r\n Saga, Malte, Lovisa';
var gift_url = 'https://pontiyos.github.io/Christmas/ChristmasPresent_text.png';
var gift_image_url = 'ChristmasPresent_text.png';


var nametag = document.getElementById("nametag");
var present = document.getElementById("present");
var presentImage = document.getElementById("present-image");


function init() {
  
  var _giftLink, 
      _giftImg;
  
  if (gift_url) {
    _giftLink = document.createElement("a");
    _giftLink.href = gift_url;
    _giftLink.target = "_blank";
    presentImage.appendChild(_giftLink);
  }
  
  if (gift_image_url) {
    _giftImg = document.createElement("img");
    _giftImg.src = gift_image_url;
    if(_giftLink) {
      _giftLink.appendChild(_giftImg);
    } else {
      presentImage.appendChild(_giftImg);
    }
  }
  
  /*
  present.addEventListener("click", function(e){
    present.classList.toggle("open");
  }, false);
  */
  
  
  nametag.innerText = to;
}
init();

function checkAnswers(){
    
    const correctAnswers = ['sex','stygga','barn','döms','till','fängelse']; 

    var answerAlice = $('#cracker-alice').val();
    var answerAlma = $('#cracker-alma').val();
    var answerEster = $('#cracker-ester').val();
    var answerSaga = $('#cracker-saga').val();
    var answerMalte = $('#cracker-malte').val();
    var answerLovisa = $('#cracker-lovisa').val();

    answerAlice = textTransform(answerAlice);
    answerAlma = textTransform(answerAlma);
    answerEster = textTransform(answerEster);
    answerSaga = textTransform(answerSaga);
    answerMalte = textTransform(answerMalte);
    answerLovisa = textTransform(answerLovisa);

    if (answerAlice == correctAnswers[0]){
        if (answerMalte == correctAnswers[1]){
            if (answerAlma == correctAnswers[2]){
                if (answerEster == correctAnswers[3]){
                    if (answerLovisa == correctAnswers[4]){
                        if (answerSaga == correctAnswers[5]){
                        return true;
                    }
                }            
            }
        }
    }
}

    return false;
}

function openPresent (){
    console.log("OPENING!");
    const currentUrl = window.location.href;
    window.location =  currentUrl+"#present"
    if(checkAnswers()){
        present.classList.toggle("open");
    }
    else{
        alert("Tyvärr, bättre lycka nästa gång!");
        window.location =  currentUrl+"#present-info-text"
        location.reload();
    }

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
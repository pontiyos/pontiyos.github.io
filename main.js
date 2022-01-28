// Modal Image Gallery
function enlargeImg(element) {
  console.log(element);
  document.getElementById("img01").src = element.src;
  document.getElementById("modal01").style.display = "block";
  var captionText = document.getElementById("caption");
  captionText.innerHTML = element.alt;
}

// Change style of navbar on scroll
window.onscroll = function() {myFunction()};
function myFunction() {
    var navbar = document.getElementById("myNavbar");
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        navbar.className = "w3-bar" + " w3-card" + " w3-animate-top" + " w3-white";
    } else {
        navbar.className = navbar.className.replace(" w3-card w3-animate-top w3-white", "");
    }
}

// Used to toggle the menu on small screens when clicking on the menu button
function toggleFunction() {
    var x = document.getElementById("navDemo");
    if (x.className.indexOf("w3-show") == -1) {
        x.className += " w3-show";
    } else {
        x.className = x.className.replace(" w3-show", "");
    }
}

// Email confirmation
function emailConfirmation() {
  const element = document.createElement('img');
  element.src = "confirmation.png";
  document.getElementById("img02").src = element.src;
  document.getElementById("modal02").style.display = "block";
  var captionText = document.getElementById("caption");
  captionText.innerHTML = element.alt;

  setTimeout(function () {document.getElementById('contactMe').reset()}, 2400); 

  setTimeout(function () {document.getElementById('modal02').style.display='none'}, 5200); 

}





  (function() {
  emailjs.init("user_Y4VdWqYsFJst9ipBGU1ZX");
  })();

function emailTrigger(){
  var myForm = document.getElementById("contactMe");
  emailjs.sendForm('service_ae8hyr6', 'template_x0t1nag',myForm).then(function(response) {
       console.log('SUCCESS!', response.status, response.text, 'Email sent!');
       emailConfirmation();
    }, function(error) {
       console.log('FAILED...', error);
    });

}


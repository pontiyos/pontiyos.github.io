document.addEventListener('DOMContentLoaded', () => {
    // Load the navbar
    fetch('navbar.html')
      .then(response => response.text())
      .then(data => {
        document.getElementById('navbar').innerHTML = data;
        attachToggleFunction(); // Attach the toggle function after the navbar is loaded
      });
  
    // Load the footer
    fetch('footer.html')
      .then(response => response.text())
      .then(data => {
        document.getElementById('footer').innerHTML = data;
      });
  });
  
  function attachToggleFunction() {
    // Define the toggleFunction to handle the hamburger menu
    window.toggleFunction = function() {
      const navBarSmall = document.getElementById("navBarSmall");
      if (navBarSmall.classList.contains('w3-show')) {
        navBarSmall.classList.remove('w3-show');
      } else {
        navBarSmall.classList.add('w3-show');
      }
    };
  }
  
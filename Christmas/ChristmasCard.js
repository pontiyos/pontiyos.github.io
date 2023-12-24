$(document).ready(function() {

    //====================dynamic load-up sizing==================//
    var $front = $(".front");
    var $back = $(".back");
    var windowHeight = $(window).height();
    var windowWidth = $(window).width();
    
    if (windowHeight > 600) {
      $(".flip-container, .front, .back, .image").css("width", (windowHeight * .9) / 1.5);
      $(".flip-container, .front, .back, .image").css("height", (windowHeight * .9));
      $back.css("fontSize", windowHeight * .018 + "px")
    } else {
      $(".flip-container, .front, .back, .image").css("width", 400);
      $(".flip-container, .front, .back, .image").css("height", 600);
      $back.css("fontSize", .7 + "em")
    }
  
    //========================dynamic window sizing================//
    $(window).resize(function() {
        windowWidth = $(window).width();
        windowHeight = $(window).height();   
        if (windowHeight > 600) {
          $(".flip-container, .front, .back, .image").css("width", (windowHeight * .9) / 1.5);
          $(".flip-container, .front, .back, .image").css("height", (windowHeight * .9));
          $back.css("fontSize", windowHeight * .018 + "px")
        } else {
          $(".flip-container, .front, .back, .image").css("width", 400);
          $(".flip-container, .front, .back, .image").css("height", 600);
          $back.css("fontSize", .7 + "em")
        }
      });
  
    //========================card flip===========================//
    $(".flip-container").click(function() {
      $front.toggleClass("front-flip");
      $back.toggleClass("back-flip");
    });
  
    //========================snow effect=========================//
    //canvas init
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
  
    //canvas dimensions
    var W = window.innerWidth;
    var H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
  
    //snowflake particles
    var mp = 75; //max particles
    var particles = [];
    for (var i = 0; i < mp; i++) {
      particles.push({
        x: Math.random() * W, //x-coordinate
        y: Math.random() * H, //y-coordinate
        r: Math.random() * 4 + 1, //radius
        d: Math.random() * mp //density
      })
    }
  
    //Lets draw the flakes
    function draw() {
      ctx.clearRect(0, 0, W, H);
  
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.beginPath();
      for (var i = 0; i < mp; i++) {
        var p = particles[i];
        ctx.moveTo(p.x, p.y);
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true);
      }
      ctx.fill();
      update();
    }
  
    //Function to move the snowflakes
    //angle will be an ongoing incremental flag. Sin and Cos functions will be applied to it to create vertical and horizontal movements of the flakes
    var angle = 0;
  
    function update() {
      angle += 0.01;
      for (var i = 0; i < mp; i++) {
        var p = particles[i];
        //Updating X and Y coordinates
        //We will add 1 to the cos function to prevent negative values which will lead flakes to move upwards
        //Every particle has its own density which can be used to make the downward movement different for each flake
        //Lets make it more random by adding in the radius
        p.y += Math.cos(angle + p.d) + 1 + p.r / 2;
        p.x += Math.sin(angle) * 2;
  
        //Sending flakes back from the top when it exits
        //Lets make it a bit more organic and let flakes enter from the left and right also.
        if (p.x > W + 5 || p.x < 0 || p.y > H) {
          if (i % 3 > 0) //66.67% of the flakes
          {
            particles[i] = {
              x: Math.random() * W,
              y: -10,
              r: p.r,
              d: p.d
            };
          } else {
            //If the flake is exitting from the right
            if (Math.sin(angle) > 0) {
              //Enter from the left
              particles[i] = {
                x: -5,
                y: Math.random() * H,
                r: p.r,
                d: p.d
              };
            } else {
              //Enter from the right
              particles[i] = {
                x: W + 5,
                y: Math.random() * H,
                r: p.r,
                d: p.d
              };
            }
          }
        }
      }
    }
  
    //animation loop
    setInterval(draw, 33);
  
    //===========================parallax============================//
    /*
    (function () {
        var $layer, $poster, $shine;
        $poster = $('.poster');
        $shine = $('.shine');
        $layer = $('div[class*="layer-"]');
        $(window).on('mousemove', function (e) {
            var angle, dx, dy, h, offsetPoster, offsetX, offsetY, theta, transformPoster, w;
            w = $(window).width();
            h = $(window).height();
            offsetX = 0.5 - e.pageX / w;
            offsetY = 0.5 - e.pageY / h;
            offsetPoster = $poster.data('offset');
            transformPoster = 'translateY(' + -offsetX * offsetPoster + 'px) rotateX(' + -offsetY * offsetPoster + 'deg) rotateY(' + offsetX * (offsetPoster * 2) + 'deg)';
            dy = e.pageY - h / 2;
            dx = e.pageX - w / 2;
            theta = Math.atan2(dy, dx);
            angle = theta * 180 / Math.PI;
            if (angle < 0) {
                angle = angle + 360;
            }
            $poster.css('transform', transformPoster);
            $shine.css('background', 'linear-gradient(' + (angle - 90) + 'deg, rgba(255,255,255,' + e.pageY / h + ') 0%,rgba(255,255,255,0) 80%)');
            return $layer.each(function () {
                var $this, offsetLayer, transformLayer;
                $this = $(this);
                offsetLayer = $this.data('offset') || 0;
                transformLayer = 'translateX(' + offsetX * offsetLayer + 'px) translateY(' + offsetY * offsetLayer + 'px)';
                return $this.css('transform', transformLayer);
            });
        });
    }.call(this));
    */
    //============================================================//
  });
  
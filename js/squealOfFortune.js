const segments = [
  { text: "Svep en öl!", img: "img\\Quiz\\chug.png",  hideImg: false },
  { text: "Visa ett dance move!", img: "img\\Quiz\\old_dancer_3.png",  hideImg: false },
  { text: "Eeeey macarena!", 
    img: "https://i1.sndcdn.com/artworks-000247396899-seiqtl-t500x500.jpg", 
     spotifyEmbed: `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/6mhw2fEPH4fMF0wolNm96e?utm_source=generator" 
     width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy">
     </iframe>`,
     hideImg: true
  },
  { text: "Sjung karaoke!", 
    img: "img\\Quiz\\kareeoke.png", 
    link: "https://www.youtube.com/@singkingkaraoke/videos",
    hideImg: false
  },
  { text: "Utbringa en skål!", img: "img\\Quiz\\cheers.png",  hideImg: false },
  { text: "Ta ett spöke!", img: "img\\Quiz\\ghost_2.png",  hideImg: false },
  { 
    text: "Dansstopp!!! Börjar om tre, två, ett", 
    img: "img\\Quiz\\dancer_2.png", 
    spotifyEmbed: `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/4oqLkPXzaUmjJ1i2dBt74H?utm_source=generator" 
    width="100%" height="152" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy">
    </iframe>`,
    hideImg: true
  },
  { text: "LIMBO!", img: "img\\Quiz\\limbo.png",  hideImg: false }
];

const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const spinBtn = document.getElementById('spin-btn');
const popup = document.getElementById('popup');
const popupImg = document.getElementById('popup-img');
const popupText = document.getElementById('popup-text');
const closePopup = document.getElementById('close-popup');
const confettiContainer = document.getElementById('confetti');
let spinning = false;

//const segmentColors = ['#4db1e3', '#d916a6', '#16a64f', '#a61685'];
//const segmentColors = ['#B68E60', '#8C5A44', '#F2C078', '#6A4E4C'];
const segmentColors = ['#A1C935', '#e82e50'];
const borderColor = '#333';  // Consistent border color

// Preload images
const preloadImages = (segments, callback) => {
  let loadedImages = 0;
  segments.forEach(segment => {
    if (segment.img) {
      const img = new Image();
      img.src = segment.img;
      img.onload = () => {
        segment.preloadedImg = img;
        loadedImages++;
        if (loadedImages === segments.length) callback();
      };
    } else {
      loadedImages++;
      if (loadedImages === segments.length) callback();
    }
  });
};


/**
* Draws the wheel of fortune on the canvas with the given segments, colors, and images.
* The wheel is divided into equal segments, and each segment is drawn with a different color from the segmentColors array.
* The text of each segment is drawn at the outer part of the segment, and if the segment has a preloaded image, it is drawn
* at the center of the segment, rotated to align with the wheel.
*/
const drawWheel = () => {
  const numSegments = segments.length;
  const anglePerSegment = (2 * Math.PI) / numSegments;

  segments.forEach((segment, i) => {
      const angle = i * anglePerSegment;
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, canvas.height / 2);
      ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, angle, angle + anglePerSegment);
      ctx.fillStyle = segmentColors[i % segmentColors.length]; // Alternating colors
      ctx.fill();

      // Consistent border between segments
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 5;
      ctx.stroke();

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(angle + anglePerSegment / 2); // Rotate to center the image within each segment

      // Text at the outer part of the segment
      ctx.textAlign = 'center';
      //ctx.fillStyle = '#000';
      ctx.font = '16px Arial';
      ctx.fillText(segment.text, canvas.width / 4, 10);

      // Draw preloaded image in the segment, larger and positioned correctly
      if (segment.preloadedImg) {
          const imgSize = 100; // Increase image size for visibility

          // Move to the image position before rotating it
          ctx.translate(canvas.width / 4, 0); // Move to the center of the segment
          ctx.rotate(Math.PI / 2); // Rotate the image 90 degrees (to align with the wheel)

          ctx.drawImage(segment.preloadedImg, -imgSize / 2, -imgSize / 2, imgSize, imgSize); // Draw image
          //ctx.drawImage(segment.preloadedImg, -imgSize / 2, 10, imgSize, imgSize); // Draw image
      }
      ctx.restore();
  });
  

};


/**
* Spins the wheel by rotating it by a random number of full rotations and 
* then stopping at a random segment. After the spin, the result of the winning
* segment is displayed and the wheel is reset to its original state.
*/
const spinWheel = () => {
  if (spinning) return;
  spinning = true;

  // Randomly select a segment to be the winner
  let randomSegment = Math.floor(Math.random() * segments.length);
  let anglePerSegment = 360 / segments.length; // Calculate the angle for each segment

  // Calculate the angle for the wheel to stop with the winning segment at the pointer
  let totalRotations = 7; // Number of full rotations
  let rotation = (randomSegment * anglePerSegment + 90) % 360; // Target rotation to stop with the winner at the pointer
  let finalRotation = totalRotations * 360 + rotation; // Total rotation including full rotations

  // Set the CSS transform to rotate the wheel
  canvas.style.transition = 'transform 4s cubic-bezier(0.5, 0, 0.5, 1)';
  canvas.style.transform = `rotate(${finalRotation}deg)`;

  setTimeout(() => {
      // Calculate the winning index after the spin
      const winningIndex = (randomSegment + totalRotations * segments.length) % segments.length;

      // Display the result of the winning segment
      displayResult(winningIndex);
      spinning = false;

      // Reset the transition and transformation after spinning
      canvas.style.transition = 'none';
      canvas.style.transform = 'none';
  }, 4000);
};




/**
 * Displays the result of the spinning wheel by setting the popup image, text, and background color, 
 * and triggers confetti. If a Spotify embed is present, it adds the embed to the popup.
 * @param {number} index - The index of the segment to display as the result.
 */
const displayResult = (index) => {
  const selectedSegment = segments[index]; // Get the segment corresponding to the index
  const popup = document.getElementById('popup');
  const popupImg = document.getElementById('popup-img');
  const popupText = document.getElementById('popup-text');
  const spotifyContainer = document.getElementById('spotify-container'); // Add a container for Spotify iframe

  // Clear any existing Spotify iframe
  spotifyContainer.innerHTML = '';

  // Reset the image display style
  popupImg.style.display = 'block';

  // Set image and text
  popupImg.src = selectedSegment.img; // Set the image of the selected segment
  popupText.textContent = selectedSegment.text; // Set the text of the selected segment

  // Set the popup background color based on the segment color
  const segmentColor = segmentColors[index % segmentColors.length]; // Match the color
  popup.style.backgroundColor = segmentColor; // Apply the color to the popup background

  // If the segment has a Spotify embed, add it to the popup
  if (selectedSegment.spotifyEmbed) {
    spotifyContainer.innerHTML = selectedSegment.spotifyEmbed; // Inject Spotify embed HTML
    if (selectedSegment.hideImg) {
      popupImg.style.display = 'none'; // Hide the image
    }
  }

  // Show the popup
  popup.style.display = 'block'; // Make the popup visible

  // Check if the segment has a link, then open the YouTube video
  if (selectedSegment.link) {
    // Open the link in a new tab or iframe if preferred
    window.open(selectedSegment.link, '_blank');
  }

  // Trigger confetti
  triggerConfetti(); // Start the confetti effect
};




const rainbowColors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3']; // Rainbow colors

const triggerConfetti = () => {
    confettiContainer.style.display = 'block';

    for (let i = 0; i < 100; i++) {
        let confettiPiece = document.createElement('div');
        confettiPiece.classList.add('confetti-piece');
        confettiPiece.style.backgroundColor = rainbowColors[Math.floor(Math.random() * rainbowColors.length)];
        confettiPiece.style.left = Math.random() * window.innerWidth + 'px';
        confettiPiece.style.animationDuration = Math.random() * 3 + 2 + 's'; // Random fall duration
        confettiContainer.appendChild(confettiPiece);

        setTimeout(() => {
            confettiPiece.remove();
        }, 3000);
    }

    setTimeout(() => {
        confettiContainer.style.display = 'none';
    }, 4000);
};


// Event listeners
spinBtn.addEventListener('click', spinWheel);
closePopup.addEventListener('click', () => {
  popup.style.display = 'none';
});

// Preload images and draw the wheel
preloadImages(segments, drawWheel);

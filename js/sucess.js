// Array of 11 image filenames
const imageArray  = [
    'nelly/quiz_success/20210804_173818.jpg',
    'nelly/quiz_success/20211106_194201.JPG',
    'nelly/quiz_success/20230805_204843.jpg',
    'nelly/quiz_success/20240217_151903.jpg',
    'nelly/quiz_success/20240328_083255.jpg',
    'nelly/quiz_success/20240507_145514~2.jpg',
    'nelly/quiz_success/20240519_192306~2.jpg',
    'nelly/quiz_success/20240826_234827.jpg',
    'nelly/quiz_success/20240928_124202.jpg',
    'nelly/quiz_success/IMG_3749.jpg',
    'nelly/quiz_success/received_867623743988899.jpeg'
];

// Array of corresponding image descriptions
const imageDescriptions = [
    "Image 1 Description",
    "Image 2 Description",
    "Image 3 Description",
    "Image 4 Description",
    "Image 5 Description",
    "Image 6 Description",
    "Image 7 Description",
    "Image 8 Description",
    "Image 9 Description",
    "Image 10 Description",
    "Image 11 Description"
];

// Shuffle the images and select 8 random images
function getRandomImages(imageArray) {
    const shuffled = imageArray.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 8); // Select 8 images
}

function loadImages() {
    const imageGrid = document.getElementById("image-grid");
    const selectedImages = getRandomImages(imageArray);

    // Add each image to the grid
    selectedImages.forEach((image, index) => {
        const imageElement = document.createElement("img");
        imageElement.src = `img/${image}`; // Path to the image
        
        const gridItem = document.createElement("div");
        gridItem.classList.add("grid-item"); // Add class to apply grid styling

        // Create an overlay for the text
        const overlay = document.createElement("div");
        overlay.classList.add("overlay");
        overlay.textContent = imageDescriptions[imageArray.indexOf(image)]; // Set overlay text based on image index

        // Assign different classes for sizes based on index
        if (index === 0) {
            gridItem.classList.add("large"); // First image is large
        } else {
            gridItem.classList.add("small"); // Other images are small
        }

        gridItem.appendChild(imageElement);
        gridItem.appendChild(overlay); // Add overlay to the grid item
        imageGrid.appendChild(gridItem);
    });
}

window.onload = loadImages;

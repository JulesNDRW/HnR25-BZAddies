const grid = document.querySelector(".grid")
const resultDisplay = document.querySelector(".results")
const width = 15

//turtle
const turtle = document.getElementById('moving-turtle');
        let position = 0; // Starting position in pixels

        function moveRight() {
            position += 5; // Increase position by 5px (adjust speed as needed)
            image.style.left = position + 'px';

            // Stop the image if it goes off the screen
            if (position > window.innerWidth) {
                position = -image.width; // Reset to the left of the screen
            }
        }

        // Move the image every 16ms (~60 frames per second)
        setInterval(moveRight, 16);
//
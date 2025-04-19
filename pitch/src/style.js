document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const slideCounter = document.getElementById('slideCounter');
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    // Create speaker notes container
    const notesContainer = document.createElement('div');
    notesContainer.id = 'speakerNotes';
    notesContainer.style.display = 'none'; // Hidden by default
    document.body.appendChild(notesContainer);
    
    // Create help tooltip
    const helpTooltip = document.createElement('div');
    helpTooltip.id = 'helpTooltip';
    helpTooltip.innerHTML = `
        <div class="helpContent">
            <h3>Presentation Controls</h3>
            <p><strong>Next slide:</strong> Right arrow, Space, or Next button</p>
            <p><strong>Previous slide:</strong> Left arrow or Previous button</p>
            <p><strong>Toggle speaker notes:</strong> Press 'N' key</p>
            <p><strong>Show/hide this help:</strong> Press 'H' key</p>
        </div>
    `;
    helpTooltip.style.display = 'none'; // Hidden by default
    document.body.appendChild(helpTooltip);
    
    // Toggle help with 'H' key
    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'h') {
            if (helpTooltip.style.display === 'none') {
                helpTooltip.style.display = 'block';
            } else {
                helpTooltip.style.display = 'none';
            }
        }
    });
    
    // Extract speaker notes from comments
    const extractSpeakerNotes = () => {
        slides.forEach((slide, index) => {
            // Look for HTML comments that contain speaker notes
            const slideHtml = slide.innerHTML;
            const notesMatch = slideHtml.match(/<!--\s*Speaker Notes:\s*(.+?)\s*-->/i);
            
            if (notesMatch && notesMatch[1]) {
                // Store the speaker notes with the slide
                slide.setAttribute('data-notes', notesMatch[1].trim());
            }
        });
    };
    
    // Toggle speaker notes with 'N' key
    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'n') {
            if (notesContainer.style.display === 'none') {
                const currentNotes = slides[currentSlide].getAttribute('data-notes');
                if (currentNotes) {
                    notesContainer.textContent = 'SPEAKER NOTES: ' + currentNotes;
                    notesContainer.style.display = 'block';
                }
            } else {
                notesContainer.style.display = 'none';
            }
        }
    });
    
    // Call the function to extract notes
    extractSpeakerNotes();

    function showSlide(index) {
        // Hide all slides
        slides.forEach((slide) => {
            slide.classList.remove('active');
        });

        // Show the target slide
        if (slides[index]) {
            slides[index].classList.add('active');
            
            // Update speaker notes if they're visible
            if (notesContainer.style.display !== 'none') {
                const currentNotes = slides[index].getAttribute('data-notes');
                if (currentNotes) {
                    notesContainer.textContent = 'SPEAKER NOTES: ' + currentNotes;
                } else {
                    notesContainer.textContent = 'No speaker notes for this slide';
                }
            }
        }

        // Update counter
        slideCounter.textContent = `${index + 1} / ${totalSlides}`;

        // Update button states
        prevBtn.disabled = index === 0;
        nextBtn.disabled = index === totalSlides - 1;
    }

    // Event Listeners for buttons
    nextBtn.addEventListener('click', () => {
        if (currentSlide < totalSlides - 1) {
            currentSlide++;
            showSlide(currentSlide);
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentSlide > 0) {
            currentSlide--;
            showSlide(currentSlide);
        }
    });
    
    // Help button event listener
    const helpBtn = document.getElementById('helpBtn');
    helpBtn.addEventListener('click', () => {
        if (helpTooltip.style.display === 'none') {
            helpTooltip.style.display = 'block';
        } else {
            helpTooltip.style.display = 'none';
        }
    });

    // Keyboard navigation (Optional)
    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight' || event.key === ' ') { // Space bar also advances
            if (currentSlide < totalSlides - 1) {
                nextBtn.click(); // Trigger button click logic
            }
        } else if (event.key === 'ArrowLeft') {
            if (currentSlide > 0) {
                prevBtn.click(); // Trigger button click logic
            }
        }
    });


    // Initial setup
    showSlide(currentSlide);
});
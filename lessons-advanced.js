// lessons-advanced.js

// Load lessons from JSON

const fs = require('fs');

// Function to load lessons
function loadLessons(filePath) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the file:', err);
            return;
        }
        try {
            const lessons = JSON.parse(data);
            console.log('Lessons loaded:', lessons);
        } catch (parseErr) {
            console.error('Error parsing JSON:', parseErr);
        }
    });
}

// Example usage
loadLessons('path/to/lessons.json');

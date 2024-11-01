// document.addEventListener('DOMContentLoaded', function() {
//     const socket = io('http://127.0.0.1:5000');
    
//     // Listen for new events and update the feed
//     socket.on('new_event', function(event) {
//         // Update team score
//         const teamScore = document.querySelector(`#${event['Team Name']} .score`);
//         if (teamScore) {
//             const currentScore = parseInt(teamScore.textContent);
//             teamScore.textContent = currentScore + event['Points'];
//         }

//         // Add to event feed
//         const feedList = document.getElementById('feed-list');
//         const listItem = document.createElement('li');
//         listItem.textContent = `${event['Team Name']} - ${event['Individual Name'] || 'Team'}: ${event['Event Name']} (+${event['Points']})`;
//         feedList.prepend(listItem);
//     });
// });


document.addEventListener('DOMContentLoaded', function() {
    const socket = io.connect('http://127.0.0.1:5000');

    // Listen for new events and update the feed
    socket.on('new_event', function(event) {
        // Update team score
        const teamScore = document.querySelector(`#${event['Team Name']} .score`);
        if (teamScore) {
            const currentScore = parseInt(teamScore.textContent);
            teamScore.textContent = currentScore + event['Points'];
        }

        // Add to event feed
        const feedList = document.getElementById('feed-list');
        const listItem = document.createElement('li');
        listItem.textContent = `${event['Team Name']} - ${event['Individual Name'] || 'Team'}: ${event['Event Name']} (+${event['Points']})`;
        feedList.prepend(listItem);
    });

    // Form submission for adding points
    const form = document.getElementById('points-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        fetch('/update_points', {
            method: 'POST',
            body: new URLSearchParams(formData)
        })
        .then(response => {
            if (response.ok) {
                console.log("Points updated successfully.");
                form.reset(); // Reset form after submission
            } else {
                console.error("Failed to update points.");
            }
        })
        .catch(error => console.error('Error:', error));
    });
});

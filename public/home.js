// Toggle Navbar on Hamburger Click
document.getElementById('hamburger').addEventListener('click', function () {
    document.getElementById('navlinks').classList.toggle('active');
    document.getElementById('close-icon').style.display = 'block'; // Show the close icon when menu is open
});

// Close Navbar on Close Icon Click
document.getElementById('close-icon').addEventListener('click', function () {
    document.getElementById('navlinks').classList.remove('active');
    document.getElementById('close-icon').style.display = 'none'; // Hide the close icon when menu is closed
});

// Close Navbar when a Link is Clicked
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function () {
        document.getElementById('navlinks').classList.remove('active');
        document.getElementById('close-icon').style.display = 'none'; // Hide the close icon when menu is closed
    });
});

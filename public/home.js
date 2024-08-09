document.getElementById('hamburger').addEventListener('click', function () {
    document.getElementById('navlinks').classList.toggle('active');
    document.getElementById('close-icon').style.display = 'block';
});

document.getElementById('close-icon').addEventListener('click', function () {
    document.getElementById('navlinks').classList.remove('active');
    document.getElementById('close-icon').style.display = 'none';
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function () {
        document.getElementById('navlinks').classList.remove('active');
        document.getElementById('close-icon').style.display = 'none';
    });
});

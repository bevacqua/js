    const navLinks = document.querySelectorAll("nav a");

    navLinks.forEach(function (link) {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            alert(`You clicked on ${link.textContent}`);
        });
    });
});

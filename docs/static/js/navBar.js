$(document).ready(function(){
    $.get(
        "./static/html/navbar.html", 
        (html_string) => {
            let navbar = document.getElementById("navbar");
            navbar.innerHTML = html_string
        }, 
        'html'
    );
});

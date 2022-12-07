$(document).ready(function(){
    $.get(
        "./static/html/homeMenu.html", 
        (html_string) => {
            let sidemenu = document.getElementById("navbarToggleHomeSideMenu");
            sidemenu.innerHTML = html_string
        }, 
        'html'
    );
});

var sel = document.getElementById('mail_type');
sel.addEventListener("change", function() {
    if (sel.value == "retail") {
        document.getElementById("zones").style.display = "inline";
    } else { 
        document.getElementById("zones").style.display = "none";
    }
});

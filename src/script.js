// Reference the color shape that was drawn over the image
//var overlay = document.getElementsByClassName("linework");
// Click on a color

/*var el = document.getElementsByClassName("color");
for (var i = 0; i < el.length; i++) {
  el[i].onclick = changeColor;
}*/

function changeColor(e, element) {
    var overlay = document.getElementsByClassName(element);
    // get the hex color
    //let hex = e.target.getAttribute("data-hex");
    // set the hex color
    //overlay.style.fill = hex;
    for (var i = 0; i < overlay.length; i++) {
        console.log(e);
        overlay[i].setAttribute('style', `fill: ${e}`);
    };
}
//var image = new Image();
//image.src = "img/Capilano Suspension Bridge Park, Vancouver.jpg";
var paused = true;
var imageObj = {};
var imgkeys = [];
var currPic = 0;
var image;
var index;
var timing = 0;
var delayIntervel = 1250;
    

function loadimgs() {
    //$.ajax({
    //    url: "img/img.json",
    //    dataType: 'json',
    //    async: false,

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var myObj = JSON.parse(this.responseText);
            console.log(myObj);
            var images = myObj["images"];
            for (var i = 0; i < images.length; i++) {
                var img = new Image();
                var src = images[i]['src'];
                img.src = src
               
                imageObj[i] = img;
                console.log(imageObj[i]);
                imageObj[i].caption = images[i]['caption'];
            }
        };
       
    }
    xmlhttp.open("GET", "img/img.json", false);
    xmlhttp.send();
}

var transition = "normal";

function displayPic(image, caption, transition) {
    var canvas = document.getElementById("mypic");
    var ctx = canvas.getContext("2d");
    var canvas = ctx.canvas;
    var hScale = canvas.width / image.width;
    var vScale = canvas.height / image.height;
    var ratio = Math.min(hScale, vScale);
    var centerShifted = (canvas.width - image.width * ratio) / 2;
   // ctx.strokeRect(400, 0, canvas.width, canvas.height);
    if (transition == "normal") {
        cancelAnimationFrame(animation);
        ctx.globalAlpha = 1;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, centerShifted, 0, image.width * ratio, image.height * ratio);
    }
    else if (transition == "fadein") {
        ctx.globalAlpha = alpha;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, centerShifted, 0, image.width * ratio, image.height * ratio);
        fadeIn(image, caption);
    }
    document.getElementById("cap").innerHTML = caption;
}


var alpha = 0;
var change = 0.01;
var animation;

function fadeIn(image, caption) {
    alpha = alpha + change;
    if (alpha < 1) {
        window.clearInterval(displayInt);
        animation = requestAnimationFrame(function () {
            displayPic(image, caption, transition);
        });
    }
    else {
        alpha = 0;
        if (!paused) {
            displayInt = window.setInterval(function () {
                picIndex();
                displayPic(imageObj[index], imageObj[index].caption, transition);
            }, 1000);
        }
    }
}

function pauseorPlay() {
    paused = !paused;
    $("#playpause").toggleClass('glyphicon-play glyphicon-pause');

    if (paused) {
        window.clearInterval(displayInt);
        cancelAnimationFrame(animation);
    }
    else {
        displayInt = window.setInterval(function () {
            picIndex();
            displayPic(imageObj[index], imageObj[index].caption, transition);
        }, delayIntervel);
    }
}


function picIndex() {
    var seq = document.getElementById('seqen').checked;
    var rand = document.getElementById('random').checked;
    if (seq) {
        currPic = (currPic + 1) % imgkeys.length;
       
    }
    // random
    else if (rand){
        currPic = Math.floor(Math.random() * imgkeys.length);
    }
    index = imgkeys[currPic];
}

$("#normal").click(function () {
    transition = "normal";
});
$("#fade").click(function () {
    transition = "fadein";
});

function transitionChange() {

    if (!paused) {
        window.clearInterval(displayInt);
        displayInt = window.setInterval(function () {
            picIndex();
            displayPic(imageObj[index], imageObj[index].caption, transition);
        }, 1000);
    }
}

$(window).load(function () {
 
    loadimgs();
    imgkeys = Object.keys(imageObj);
    document.getElementById("playbtn").addEventListener("click", pauseorPlay);

    $(".dropdown-menu").on('click', 'li a', function () {
        $("#dropdownBtn:first-child").text($(this).text());
        $("#dropdownBtn:first-child").val($(this).text());
        $("#dropdownBtn:first-child").append("&nbsp;&nbsp;<span class='caret'></span>");
    });
});

function nextImg() {
    var rand = document.getElementById('random').checked;
    if (rand) {
        $("#next").attr('disabled', true);
    }
    else {
        currPic = (currPic + 1) % imgkeys.length;
        index = imgkeys[currPic];
        displayPic(imageObj[index], imageObj[index].caption, transition);
    }
}

function prevImg() {
    var rand = document.getElementById('random').checked;
    if (rand) {
        $("#pre").attr('disabled', true);
    }
    else {
        currPic--;
        if (currPic < 0) {
            currPic = imgkeys.length - 1;
        }
        index = imgkeys[currPic];
        displayPic(imageObj[index], imageObj[index].caption, transition);
    }
}

//function draw() {
//    var canvas = document.getElementById("mypic");
//    var context = canvas.getContext("2d")
//    context.drawImage(img, 75, 0, 450, 600);

//} // end function draw

//window.addEventListener("load", draw, false);
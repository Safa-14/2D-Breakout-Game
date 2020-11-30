function animateSubmarine() {
    let startPage = document.querySelector('#startPage');
    startPage.style.visibility = 'hidden'
    
    let submarine = document.querySelector('#submarine');
    let submarineWidth = 200;
    let submarineHeight = 200;
    let start = Date.now(); // to remember start time
    
    let timer = setInterval(function () {

        //HOW MUCH TIME PASSED FROM THE START
        let timePassed = Date.now() - start;
        submarineWidth = submarineWidth - 2.5;
        submarineHeight = submarineHeight - 2.5;
        submarine.style.top = timePassed / 2 + 'px';
        submarine.style.width = submarineWidth + 'px';
        submarine.style.height = submarineHeight + 'px';

        if (submarine.style.top == '400px' || timePassed > 700) {
        
            submarine.style.visibility = 'hidden';
            clearInterval(timer);
            window.location.assign("./game.html");
        }

    }, 20);
}
let subMarine1= document.querySelector('#animateSubmarine');
subMarine1.addEventListener('click',function (e) {
    animateSubmarine()
})


let highScores= document.querySelector('#highScores');
highScores.addEventListener('click',function (e) {
    window.location.assign("./highScores.html");
})

let Exit= document.querySelector('#Exit');
Exit.addEventListener('click',function (e) {
    window.location.assign("https://www.google.com/");
})
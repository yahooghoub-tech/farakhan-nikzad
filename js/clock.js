/*========================================
School Call
Clock Manager
========================================*/


let clockTimer;



/*
شروع ساعت
*/

function startClock(){


    const clockElement = document.getElementById("clock");



    if(!clockElement){


        console.log("المان ساعت پیدا نشد");

        return;

    }



    function updateClock(){



        const now = new Date();



        let hours = now.getHours();

        let minutes = now.getMinutes();

        let seconds = now.getSeconds();



        hours = String(hours).padStart(2,"0");

        minutes = String(minutes).padStart(2,"0");

        seconds = String(seconds).padStart(2,"0");



        clockElement.innerHTML =

        hours + ":" + minutes + ":" + seconds;



    }



    updateClock();



    clockTimer = setInterval(

        updateClock,

        1000

    );


}



/*
توقف ساعت

در صورت نیاز
*/

function stopClock(){


    if(clockTimer){


        clearInterval(clockTimer);


    }


}
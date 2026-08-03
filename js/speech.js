/*========================================
School Call
Speech Recognition Manager
========================================*/


let recognition;


/*
فعال سازی سیستم تشخیص صدا
*/

function initSpeech(){


    const micButton = document.querySelector(".voice-box");


    if(!micButton){

        console.log("دکمه میکروفون پیدا نشد");

        return;

    }



    // بررسی پشتیبانی مرورگر

    const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;



    if(!SpeechRecognition){


        console.log("تشخیص گفتار پشتیبانی نمی‌شود");

        return;

    }



    recognition = new SpeechRecognition();



    // زبان فارسی

    recognition.lang="fa-IR";



    // فقط یک جمله کوتاه

    recognition.continuous=false;



    recognition.interimResults=false;



    /*
    شروع ضبط صدا
    */

    micButton.addEventListener("click",()=>{


        try{


            recognition.start();



            micButton.classList.add("recording");



        }

        catch(error){


            console.log(error);


        }



    });





    /*
    دریافت متن
    */

    recognition.onresult=function(event){



        let text =
        event.results[0][0].transcript;



        console.log("متن تشخیص داده شده:",text);



        // قرار دادن متن داخل جستجو

        const input=document.querySelector(".search input");



        if(input){


            input.value=text;



            input.dispatchEvent(
                new Event("input")
            );


        }



    };





    /*
    پایان ضبط
    */

    recognition.onend=function(){


        micButton.classList.remove("recording");


    };





    /*
    خطا
    */

    recognition.onerror=function(event){


        console.log(
            "Speech Error:",
            event.error
        );


        micButton.classList.remove("recording");


    };


}
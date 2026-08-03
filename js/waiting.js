/*========================================
School Call
Waiting Calls Manager
========================================*/


let waitingCalls = [];



/*
افزودن فراخوان جدید به لیست انتظار
*/

function addWaitingCall(call){


    waitingCalls.push(call);



    renderWaitingCalls();


}



/*
نمایش لیست فراخوان‌ها
*/

function renderWaitingCalls(){


    const box=document.querySelector(".waiting");



    if(!box){

        return;

    }



    let html = `

    <h2>
    فراخوان‌های فعال
    </h2>

    `;



    if(waitingCalls.length===0){


        html += `

        <div class="waiting-item">

        <span>
        هیچ فراخوانی وجود ندارد
        </span>

        </div>

        `;


    }



    else{


        waitingCalls.forEach(call=>{


            let statusText="";

            let statusIcon="";



            if(call.status==="waiting"){


                statusIcon="🟡";

                statusText="در انتظار معلم";


            }



            if(call.status==="coming"){


                statusIcon="🔵";

                statusText="در مسیر دفتر";


            }



            if(call.status==="done"){


                statusIcon="🟢";

                statusText="تحویل شد";


            }





            html += `


            <div class="waiting-item">


            <span>

            ${statusIcon}

            ${call.name}

            <br>

            <small>
            ${call.time}
            </small>

            </span>


            <span>

            ${call.className}

            <br>

            ${statusText}

            </span>


            </div>


            `;



        });



    }



    box.innerHTML=html;



}



/*
دریافت لیست فعلی

بعداً از سرور می‌آید
*/

function loadWaitingCalls(){


    renderWaitingCalls();


}





/*
تغییر وضعیت فراخوان

مثلا:
معلم دانش‌آموز را ارسال کرد
*/

function updateCallStatus(id,status){



    let call = waitingCalls.find(item=>

        item.id===id

    );



    if(call){


        call.status=status;


        renderWaitingCalls();


    }



}





/*
گرفتن همه فراخوان‌ها

برای ارسال به سرور
*/

function getWaitingCalls(){


    return waitingCalls;


}
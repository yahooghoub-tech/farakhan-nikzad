/*========================================
School Call
Call Manager
========================================*/


let activeCalls = [];

let selectedStudent = students[0];



/*
انتخاب دانش آموز
بعداً از ui.js صدا زده می‌شود
*/

function selectStudent(student){

    selectedStudent = student;

}



/*
فعال سازی سیستم فراخوان
*/

function initCallSystem(){


    const button = document.querySelector(".student-card button");


    if(!button){

        console.log("دکمه فراخوان پیدا نشد");

        return;

    }



    button.addEventListener("click",()=>{


        if(!selectedStudent){


            alert("ابتدا دانش آموز را انتخاب کنید");

            return;


        }


        createCall(selectedStudent);


    });


}





/*
ساخت فراخوان جدید
*/

function createCall(student){


    const call = {


        id:Date.now(),


        studentId:student.id,


        name:student.name,


        grade:student.grade,


        className:student.class,


        status:"waiting",


        time:new Date().toLocaleTimeString("fa-IR")


    };



    activeCalls.push(call);



    console.log("فراخوان جدید:",call);



    // نمایش در لیست انتظار

    if(typeof addWaitingCall === "function"){


        addWaitingCall(call);


    }



    alert(

        "فراخوان ارسال شد\n\n"+
        student.name+
        "\nکلاس "+student.class

    );



    /*
    در آینده اینجا ارسال به سرور قرار می‌گیرد:

    fetch("/api/call",{
        method:"POST",
        body:JSON.stringify(call)
    })

    */


}



/*
دریافت فراخوان‌های فعال

بعداً از دیتابیس می‌آید
*/

function getActiveCalls(){


    return activeCalls;


}
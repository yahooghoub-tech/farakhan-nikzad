// ======================================
// سیستم مدیریت فراخوان صفحه ناظم
// نسخه آزمایشی قبل از اتصال به Supabase
// ======================================



// لیست آزمایشی دانش آموزان

const students = [

    {
        name: "محمد احمدی",
        className: "6-2"
    },

    {
        name: "علی رضایی",
        className: "5-1"
    },

    {
        name: "سارا کریمی",
        className: "4-2"
    },

    {
        name: "امیر حسینی",
        className: "3-1"
    }

];




// ======================================
// تابع اصلی فراخوان دانش آموز
// ======================================


function callStudent(studentName){


    // پیدا کردن دانش آموز

    const student = students.find(
        item => item.name === studentName
    );



    if(!student){

        console.log(
            "دانش آموز پیدا نشد:",
            studentName
        );

        return;

    }



    // نمایش آخرین دانش آموز


    const lastStudent =
    document.getElementById("lastStudent");


    if(lastStudent){

        lastStudent.innerHTML =
        student.name;

    }




    // پیدا کردن کارت کلاس


    const classId =
    "class-" + student.className;



    const classBox =
    document.getElementById(classId);



    if(!classBox){

        console.log(
            "کلاس پیدا نشد:",
            classId
        );

        return;

    }





    // بخش لیست دانش آموزان کلاس


    const list =
    classBox.querySelector(
        ".student-list"
    );



    // حذف پیام خالی

    list.classList.remove("empty");



    // جلوگیری از تکراری شدن

    if(
        list.innerHTML.includes(student.name)
    ){

        return;

    }




    // اضافه کردن دانش آموز


    list.innerHTML += `

        <div class="student">

            <span>
            ${student.name}
            </span>


            <span class="waiting">
            منتظر معلم
            </span>

        </div>

    `;


}




// ======================================
// تست اولیه
// ======================================


window.onload = function(){


    // تست فراخوان

    callStudent(
        "محمد احمدی"
    );


};
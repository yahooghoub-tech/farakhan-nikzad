/*========================================
School Call
User Interface Manager
========================================*/


/*
المان‌های صفحه
*/

const studentCardName = document.querySelector(".info h3");

const studentCardGrade = document.querySelectorAll(".info span")[0];

const studentCardClass = document.querySelectorAll(".info span")[1];

const resultBox = document.querySelector(".result");





/*
نمایش یک دانش‌آموز روی کارت اصلی
*/

function showStudentCard(student){


    if(!student){

        return;

    }


    if(studentCardName){

        studentCardName.innerHTML = student.name;

    }


    if(studentCardGrade){

        studentCardGrade.innerHTML = 
        "پایه " + student.grade;

    }


    if(studentCardClass){

        studentCardClass.innerHTML =
        "کلاس " + student.className;

    }



    // ذخیره دانش‌آموز انتخاب شده

    if(typeof selectStudent === "function"){

        selectStudent(student);
        console.log(
            "دانش آموز انتخاب شد:",
            student.name
            );

    }


}





/*
نمایش لیست نتایج جستجو
*/

function renderSearchResults(list){


    if(!resultBox){

        return;

    }



    let html = `

    <h2>
    نتیجه جستجو
    </h2>

    `;



    if(list.length===0){


        html += `

        <div class="student-card">

        دانش‌آموزی پیدا نشد

        </div>

        `;


    }


    else{


        list.forEach(student=>{


            html += `


            <div class="student-card">


            <div class="photo">

            <i class="fa-solid fa-user"></i>

            </div>



            <div class="info">


            <h3>
            ${student.name}
            </h3>


            <span>
            پایه ${student.grade}
            </span>


            <span>
            کلاس ${student.className}
            </span>


            </div>



            <button 
            onclick="chooseStudent(${student.id})">

            انتخاب

            </button>



            </div>


            `;


        });


    }



    resultBox.innerHTML = html;


}





/*
انتخاب دانش‌آموز از نتایج
*/

function chooseStudent(id){


    const student = getStudentById(id);


    if(student){


        showStudentCard(student);


    }


}





/*
نمایش پیام سیستم
*/

function showMessage(text,type="info"){


    console.log(type,text);


}
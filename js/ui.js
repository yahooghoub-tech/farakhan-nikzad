/*========================================
School Call
User Interface Manager
========================================*/


/*
نمایش نتایج جستجو
*/

function renderSearchResults(list){


    const resultBox = document.querySelector(".result");


    if(!resultBox){

        return;

    }



    let html = `

    <h2>
    نتیجه جستجو
    </h2>

    `;



    if(list.length === 0){


        html += `

        <div class="student-card">

        <div class="info">

        <h3>
        دانش‌آموزی پیدا نشد
        </h3>

        </div>

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
                    ${student.grade}
                    </span>


                    <span>
                    کلاس ${student.className}
                    </span>


                    <span>
                    ${student.teacher}
                    </span>


                </div>



                <button
                onclick="callStudent(${student.id})">

                📢 فراخوان

                </button>



            </div>


            `;



        });


    }



    resultBox.innerHTML = html;


}






/*
فراخوان مستقیم از کارت نتیجه
*/

function callStudent(id){



    const student = getStudentById(id);



    if(!student){

        alert("دانش‌آموز پیدا نشد");

        return;

    }



    selectStudent(student);



    createCall(student);



}






/*
نمایش دانش آموز انتخاب شده
*/

function showStudentCard(student){



    if(!student){

        return;

    }



    const name =
    document.querySelector(".info h3");


    const spans =
    document.querySelectorAll(".info span");



    if(name){

        name.innerHTML=student.name;

    }


    if(spans[0]){

        spans[0].innerHTML =
        student.grade;

    }


    if(spans[1]){

        spans[1].innerHTML =
        "کلاس "+student.className;

    }



    if(typeof selectStudent==="function"){


        selectStudent(student);


    }


}





/*
انتخاب دانش‌آموز
*/

function chooseStudent(id){



    const student =
    getStudentById(id);



    if(student){


        showStudentCard(student);


    }


}
/*========================================
School Call
Search Manager
========================================*/


let searchInput;


/*
فعال سازی جستجو
*/

function initSearch(){


    searchInput = document.querySelector(".search input");



    if(!searchInput){

        console.log("کادر جستجو پیدا نشد");

        return;

    }



    searchInput.addEventListener("input",function(){


        let value=this.value.trim();



        if(value===""){


            clearSearch();


            return;

        }



        let results = searchStudents(value);



        if(typeof renderSearchResults==="function"){


            renderSearchResults(results);


        }



    });


}





/*
پاک کردن نتیجه جستجو
*/

function clearSearch(){


    const resultBox=document.querySelector(".result");


    if(resultBox){


        resultBox.innerHTML=`

        <h2>
        نتیجه جستجو
        </h2>


        <div class="student-card">


        <div class="photo">

        <i class="fa-solid fa-user"></i>

        </div>


        <div class="info">


        <h3>
        نام دانش‌آموز
        </h3>


        <span>
        پایه
        </span>


        <span>
        کلاس
        </span>


        </div>


        <button>

        فراخوان

        </button>


        </div>


        `;


    }


}
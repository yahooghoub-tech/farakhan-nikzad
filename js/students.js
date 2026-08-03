/*========================================
School Call
Students Database Test
100 Students
========================================*/


const students = [];


/*
ساخت 100 دانش آموز آزمایشی
*/

const firstNames = [
"محمد","علی","امیر","حسین","رضا",
"سینا","پارسا","آرین","کیان","ماهان",
"یاسین","آراد","ابوالفضل","متین","سام",
"سجاد","بردیا","نیما","دانیال","آریا"
];


const lastNames = [
"احمدی","رضایی","کریمی","محمدی","حسینی",
"مرادی","اکبری","موسوی","جعفری","قاسمی",
"نوری","رستمی","صادقی","کاظمی","نجفی"
];


const classes = [
"1-1","1-2",
"2-1","2-2",
"3-1","3-2",
"4-1","4-2",
"5-1","5-2",
"6-1","6-2"
];



for(let i=1;i<=100;i++){


    let gradeClass =
    classes[(i-1)%classes.length];


    let grade =
    gradeClass.split("-")[0];



    students.push({

        id:i,

        name:
        firstNames[(i-1)%firstNames.length]
        +" "
        +
        lastNames[(i-1)%lastNames.length],


        grade:
        "پایه "+grade,


        className:
        gradeClass,


        teacher:
        "معلم کلاس "+gradeClass


    });


}





/*
دریافت همه دانش آموزان
*/

function getStudents(){

    return students;

}





/*
جستجوی دانش آموز در کل مدرسه
*/

function searchStudents(value){


    value=value.trim();



    if(value===""){

        return [];

    }



    return students.filter(student =>


        student.name.includes(value)

    );


}





/*
دریافت دانش آموز با شناسه
*/

function getStudentById(id){


    return students.find(student =>

        student.id===id

    );


}





/*
دانش آموزان یک کلاس
*/

function getStudentsByClass(className){


    return students.filter(student =>

        student.className===className

    );


}
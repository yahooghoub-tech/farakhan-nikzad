/*==========================================
سامانه فراخوان دانش‌آموز
پنل ناظم
==========================================*/


/*==============================
ساعت
==============================*/

const clock=document.getElementById("clock");

function updateClock(){

const now=new Date();

let h=String(now.getHours()).padStart(2,"0");

let m=String(now.getMinutes()).padStart(2,"0");

clock.innerHTML=h+":"+m;

}

updateClock();

setInterval(updateClock,1000);



/*==============================
اطلاعات دانش آموزان
فعلاً آزمایشی
بعداً از دیتابیس خوانده می‌شود
==============================*/

const students=[

{
id:1,
name:"محمد احمدی",
grade:"ششم",
class:"6-2",
status:"در کلاس"
},

{
id:2,
name:"علی رضایی",
grade:"پنجم",
class:"5-1",
status:"در کلاس"
},

{
id:3,
name:"امیر محمدی",
grade:"چهارم",
class:"4-2",
status:"در کلاس"
},

{
id:4,
name:"حسین کریمی",
grade:"ششم",
class:"6-1",
status:"در کلاس"
}

];



/*==============================
المان ها
==============================*/

const searchInput=document.querySelector(".search input");

const studentName=document.querySelector(".info h3");

const studentGrade=document.querySelectorAll(".info span")[0];

const studentClass=document.querySelectorAll(".info span")[1];

const callButton=document.querySelector(".student-card button");

const waitingBox=document.querySelector(".waiting");



/*==============================
دانش آموز انتخاب شده
==============================*/

let selectedStudent=students[0];



/*==============================
نمایش دانش آموز
==============================*/

function showStudent(student){

selectedStudent=student;

studentName.innerHTML=student.name;

studentGrade.innerHTML="پایه "+student.grade;

studentClass.innerHTML="کلاس "+student.class;

}

showStudent(selectedStudent);



/*==============================
جستجو
==============================*/

searchInput.addEventListener("keyup",()=>{

let value=searchInput.value.trim();

if(value===""){

showStudent(students[0]);

return;

}

const result=students.find(item=>

item.name.includes(value)

);

if(result){

showStudent(result);

}

});



/*==============================
فراخوان
==============================*/

callButton.addEventListener("click",()=>{

addWaiting(selectedStudent);

});



/*==============================
افزودن به لیست انتظار
==============================*/

function addWaiting(student){

const div=document.createElement("div");

div.className="waiting-item";

div.innerHTML=`

<span>

🟡 ${student.name}

</span>

<span>

${student.class}

</span>

`;

waitingBox.appendChild(div);

alert(

"فراخوان ارسال شد\n\n"+

student.name

);

}



/*==============================
میکروفون
فعلاً آماده
==============================*/

const mic=document.querySelector(".voice-box");

mic.addEventListener("click",()=>{

alert("در بخش بعدی قابلیت تشخیص گفتار فعال می‌شود.");

});
const micStatus=document.getElementById("micStatus");
const micIcon=document.getElementById("micIcon");
const speechText=document.getElementById("speechText");

let recognition;
let isListening=true;


if("webkitSpeechRecognition" in window){

recognition=new webkitSpeechRecognition();

recognition.lang="fa-IR";

recognition.continuous=true;

recognition.interimResults=true;


recognition.onstart=function(){

micStatus.innerText="میکروفون فعال است و در حال شنیدن...";

micIcon.classList.add("mic-active");

};


recognition.onresult=function(event){

let text="";

for(let i=event.resultIndex;i<event.results.length;i++){

text+=event.results[i][0].transcript;

}


speechText.innerText=text;


/* ادامه پردازش نام دانش‌آموز در بخش بعد */

};



recognition.onerror=function(){

micStatus.innerText="خطا در میکروفون - تلاش مجدد";

restartMic();

};



recognition.onend=function(){

if(isListening){

restartMic();

}

};



recognition.start();


}else{

micStatus.innerText=
"مرورگر شما از تشخیص گفتار پشتیبانی نمی‌کند";

}



function restartMic(){

setTimeout(()=>{

try{

recognition.start();

}catch(e){}

},1000);

}
const students=[
    {name:"علی احمدی",className:"ششم 1"},
    {name:"رضا محمدی",className:"پنجم 2"},
    {name:"محمد رضایی",className:"سوم 1"},
    {name:"امیر حسینی",className:"اول 2"}
    ];
    
    
    function findStudentFromText(text){
    
    const result=students.find(student=>{
    
    return text.includes(student.name);
    
    });
    
    
    if(result){
    
    addStudentToClass(result);
    
    sendTeacherMessage(result);
    
    }
    
    }
    
    
    
    recognition.onresult=function(event){
    
    let text="";
    
    for(let i=event.resultIndex;i<event.results.length;i++){
    
    text+=event.results[i][0].transcript;
    
    }
    
    
    speechText.innerText=text;
    
    
    findStudentFromText(text);
    
    };
    
    
    
    
    function addStudentToClass(student){
    
    const classBox=document.getElementById(
    "class-"+student.className
    );
    
    
    const countBox=document.getElementById(
    "count-"+student.className
    );
    
    
    
    if(!classBox){
    return;
    }
    
    
    
    const card=document.createElement("div");
    
    card.className="student-card";
    
    
    card.innerHTML=`
    
    <div class="student-name">
    ${student.name}
    </div>
    
    <div class="student-status status-called">
    فراخوان شد
    </div>
    
    <div class="student-time">
    ${new Date().toLocaleTimeString("fa-IR")}
    </div>
    
    `;
    
    
    
    classBox.appendChild(card);
    
    
    
    countBox.innerText=
    classBox.children.length;
    
    
    }
    function sendTeacherMessage(student){

        const message={
        
        studentName:student.name,
        
        className:student.className,
        
        status:"فراخوان شد",
        
        time:new Date().toISOString()
        
        };
        
        
        /*
        در مرحله اتصال به Supabase
        این پیام به جدول پیام‌ها ارسال می‌شود
        و پنل معلم مربوطه آن را دریافت می‌کند
        */
        
        
        console.log(
        "ارسال پیام به معلم:",
        message
        );
        
        
        }
        
        
        
        
        const resetButton=
        document.getElementById("resetCalls");
        
        
        resetButton.addEventListener("click",function(){
        
        
        const confirmReset=
        confirm("تمام فراخوان‌ها پاک شوند؟");
        
        
        if(!confirmReset){
        return;
        }
        
        
        
        document.querySelectorAll(".students-list")
        .forEach(box=>{
        
        box.innerHTML="";
        
        });
        
        
        
        document.querySelectorAll(".class-header span")
        .forEach(count=>{
        
        count.innerText="0";
        
        });
        
        
        
        speechText.innerText=
        "منتظر شنیدن نام دانش‌آموز...";
        
        
        micStatus.innerText=
        "میکروفون فعال است و در حال شنیدن...";
        
        
        
        console.log(
        "تمام فراخوان‌ها پاک شدند"
        );
        
        
        });
        
        
        
        /*
        تابع تغییر وضعیت دانش‌آموز
        بعد از دریافت پاسخ معلم
        */
        
        
        function updateStudentStatus(
        studentCard,
        newStatus,
        statusClass
        ){
        
        
        const status=
        studentCard.querySelector(
        ".student-status"
        );
        
        
        if(status){
        
        status.innerText=newStatus;
        
        status.className=
        "student-status "+statusClass;
        
        }
        
        }
   
           
const SUPABASE_URL="https://ghnpiijihybuhfetnxjp.supabase.co";

const SUPABASE_KEY="sb_publishable_SEGca8-w1pAO3_TQgMd-qA_vOvkj6jq";

const supabaseClient=supabase.createClient(
SUPABASE_URL,
SUPABASE_KEY
);
let calledStudents=[];
console.log("Supabase connected");
loadCalls();
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
    {name:"علی احمدی",className:"ششم-1"},
    {name:"رضا محمدی",className:"پنجم-2"},
    {name:"محمد رضایی",className:"سوم-1"},
    {name:"امیر حسینی",className:"اول-2"}
    ];
    
    function findStudentFromText(text){
    
    const result=students.find(student=>{
    
    return text.includes(student.name);
    
    });
    
    
    if(result){
    
    
    
    sendTeacherMessage(result);
    
    }
    
    }
    
    function findMultipleStudents(text){


        students.forEach(student=>{
        
        
        if(text.includes(student.name)){
        
        
        sendTeacherMessage(student);
        
        
        }
        
        
        });
        
        
        }
    
    recognition.onresult=function(event){
    
    let text="";
    
    for(let i=event.resultIndex;i<event.results.length;i++){
    
    text+=event.results[i][0].transcript;
    
    }
    
    
    speechText.innerText=text;
    
    
    findMultipleStudents(text);
    
    };
    
    
    
    function addStudentToClass(student){
        if(calledStudents.includes(student.name)){
            return;
            }
            
            calledStudents.push(student.name);

        const classBox=document.getElementById(
        "class-"+student.className
        );
        
        
        const countBox=document.getElementById(
        "count-"+student.className
        );
        
        
        if(!classBox){
        return;
        }
        
        
        const now=new Date();
        
        
        const date=
        new Intl.DateTimeFormat(
        "fa-IR",
        {
        year:"numeric",
        month:"2-digit",
        day:"2-digit"
        }
        ).format(now);
        
        
        
        const time=
        now.toLocaleTimeString(
        "fa-IR",
        {
        hour:"2-digit",
        minute:"2-digit",
        second:"2-digit"
        }
        );
        
        
        
        const card=document.createElement("div");
        
        card.className="student-card";
        
        card.innerHTML=`

        <div class="student-row">
        
        <span class="student-name">
        ${student.name}
        </span>
        
        <span class="student-status status-called">
        فراخوان شد
        </span>
        
        <span class="student-time">
        ${date} ${time}
        </span>
        
        </div>
        
        `;
        
        
        classBox.appendChild(card);
        
        
        
        countBox.innerText=
        classBox.children.length;
        
        
        }
   
        async function sendTeacherMessage(student){


            const {data:exist,error:checkError}=await supabaseClient
            .from("calls")
            .select("id")
            .eq("student_name",student.name)
            .eq("class_name",student.className)
            .eq("status","فراخوان شد");
            
            
            if(checkError){
            
            console.error(checkError);
            return;
            
            }
            
            
            if(exist.length>0){
            
            console.log("این دانش آموز قبلا فراخوان شده");
            
            return;
            
            }
            
            
            
            const now=new Date();
            
            
            
            const calledDate=
            new Intl.DateTimeFormat(
            "fa-IR",
            {
            year:"numeric",
            month:"2-digit",
            day:"2-digit"
            }
            ).format(now);
            
            
            
            const calledTime=
            now.toLocaleTimeString(
            "fa-IR",
            {
            hour:"2-digit",
            minute:"2-digit",
            second:"2-digit"
            }
            );
            
            
            
            const {data,error}=await supabaseClient
            .from("calls")
            .insert([
            
            {
            student_name:student.name,
            class_name:student.className,
            status:"فراخوان شد",
            called_date:calledDate,
            called_time:calledTime
            }
            
            ])
            .select();
            
            
            
            if(error){
            
            console.error(
            "خطا در ثبت فراخوان:",
            error
            );
            
            }else{
            
            console.log(
            "فراخوان ثبت شد:",
            data
            );
            
            
            // نمایش در کلاس
            addStudentToClass(student);
            
            
            }
            
            
            }
        
        
        
        
            const resetButton =
            document.getElementById("resetCalls");
            
            
            resetButton.addEventListener(
            "click",
            async function(){
            
            
            const confirmReset=
            confirm("تمام فراخوان‌ها پاک شوند؟");
            
            
            if(!confirmReset){
            return;
            }
            
            
            // حذف از دیتابیس calls
            
            const {error}=await supabaseClient
            .from("calls")
            .delete()
            .gte("id",0);
            
            
            
            if(error){
            
            console.error(
            "خطا در حذف فراخوان‌ها:",
            error
            );
            
            return;
            
            }
            
            
            
            // پاک کردن کارت‌ها
            
            document.querySelectorAll(".students-list")
            .forEach(box=>{
            
            box.innerHTML="";
            
            });
            
            
            
            // صفر کردن تعدادها
            
            document.querySelectorAll(".class-header span")
            .forEach(count=>{
            
            count.innerText="0";
            
            });
            
            
            speechText.innerText=
            "منتظر شنیدن نام دانش‌آموز...";
            
            
            micStatus.innerText=
            "میکروفون فعال است و در حال شنیدن...";
            
            
            console.log(
            "تمام فراخوان‌ها از دیتابیس حذف شدند"
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
   
        async function loadCalls(){

            const {data,error}=await supabaseClient
            .from("calls")
            .select("*")
            .eq("status","فراخوان شد")
            .order("id",{ascending:true});
            
            
            if(error){
            
            console.error(
            "خطا در دریافت فراخوان‌ها:",
            error
            );
            
            return;
            
            }
            
            
            
            data.forEach(call=>{
            
            
                const student={

                    name:call.student_name,
                    
                    className:call.class_name.replaceAll(" ","-")
                    
                    };
            
            addStudentToClass(student);
            
            
            });
            
            
            }
            
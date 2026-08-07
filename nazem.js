const supabaseClient = supabase.createClient(

    "https://ghnpiijihybuhfetnxjp.supabase.co",
    
    "sb_publishable_SEGca8-w1pAO3_TQgMd-qA_vOvkj6jq"
    
    );
    
    
    console.log("Supabase connected");
    
    
    
    let students=[];
    
    let lastStudent="";
    
    let isListening=false;
    
    
    
    
    
    // تبدیل متن برای مقایسه بهتر نام‌ها
    
    function normalizeText(text){
    
    return text
    
    .replace(/\s+/g,"")
    
    .replace(/ي/g,"ی")
    
    .replace(/ك/g,"ک")
    
    .trim();
    
    }
    
    
    
    
    
    // دریافت لیست دانش آموزان از API
    
    async function loadStudents(){
    
    
    try{
    
    
    const response =
    await fetch("/api/get-students");
    
    
    
    students =
    await response.json();
    
    
    
    console.log(
    "Students Loaded:",
    students
    );
    
    
    
    }catch(error){
    
    
    console.log(
    "Load Students Error:",
    error
    );
    
    
    }
    
    
    }
    
    
    
    
    
    
    // پیدا کردن دانش آموز از روی صدا
    
    function findStudent(text){
    
    
    
    const cleanText =
    normalizeText(text);
    
    
    
    return students.find(student=>{
    
    
    const name =
    normalizeText(
    student.name
    );
    
    
    
    return cleanText.includes(name);
    
    
    
    });
    
    
    }
    
    
    
    
    
    
    
    // اضافه کردن دانش آموز به کارت کلاس
    
    function addStudentToClass(student){
    
    
    
    let className =
    
    student.class_name ||
    
    student.className;
    
    
    
    if(!className){
    
    return;
    
    }
    
    
    
    
    
    const classBox =
    
    document.getElementById(
    
    "class-"+className
    
    );
    
    
    
    
    
    if(!classBox){
    
    
    console.log(
    
    "کلاس پیدا نشد:",
    
    className
    
    );
    
    
    return;
    
    
    }
    
    
    
    
    
    
    const list =
    
    classBox.querySelector(
    
    ".student-list"
    
    );
    
    
    
    
    
    if(list.classList.contains("empty")){
    
    
    list.innerHTML="";
    
    list.classList.remove("empty");
    
    
    }
    
    
    
    
    
    const id =
    
    "student-"+normalizeText(student.name);
    
    
    
    
    
    if(document.getElementById(id)){
    
    
    console.log(
    
    "دانش آموز قبلا نمایش داده شده"
    
    );
    
    
    return;
    
    
    }
    
    
    
    
    
    const div =
    
    document.createElement("div");
    
    
    
    div.className="student-item";
    
    div.id=id;
    
    
    
    
    
    div.innerHTML=`
    
    <div class="student-name">
    
    🔔 ${student.name}
    
    </div>
    
    
    <div class="student-status">
    
    در انتظار دریافت
    
    </div>
    
    
    <div class="student-time">
    
    </div>
    
    `;
    
    
    
    
    
    list.appendChild(div);
    
    
    
    }
    
    
    
    
    
    
    
    
    // ثبت فراخوان در دیتابیس
    
    async function sendCall(student){
    
    
    
    try{
    
    
    
    
    
    const {data:oldCalls,error:checkError}=
    
    await supabaseClient
    
    .from("calls")
    
    .select("*")
    
    .eq(
    
    "student_name",
    
    student.name
    
    )
    
    .eq(
    
    "class_name",
    
    student.class_name
    
    )
    
    .eq(
    
    "status",
    
    "فراخوان شد"
    
    );
    
    
    
    
    
    
    
    if(checkError){
    
    
    console.log(checkError);
    
    return;
    
    
    }
    
    
    
    
    
    
    if(oldCalls.length>0){
    
    
    
    console.log(
    
    "این دانش آموز قبلا فراخوان شده"
    
    );
    
    
    
    return;
    
    
    }
    
    
    
    
    
    
    
    
    const {data,error}=
    
    await supabaseClient
    
    .from("calls")
    
    .insert({
    
    
    student_name:
    
    student.name,
    
    
    
    class_name:
    
    student.class_name,
    
    
    
    status:
    
    "فراخوان شد",
    
    
    
    called_date:
    
    new Date().toLocaleDateString("fa-IR"),
    
    
    
    called_time:
    
    new Date().toLocaleTimeString("fa-IR")
    
    
    
    })
    
    .select();
    
    
    
    
    
    
    
    
    if(error){
    
    
    console.log(
    
    "خطا در ثبت فراخوان:",
    
    error
    
    );
    
    
    return;
    
    
    }
    
    
    
    
    
    
    console.log(
    
    "فراخوان ثبت شد:",
    
    data
    
    );
    
    
    
    
    
    }catch(error){
    
    
    console.log(
    
    "Send Call Error:",
    
    error
    
    );
    
    
    }
    
    
    
    }
    
    
    
    
    
    
    
    
    
    // نمایش وضعیت فراخوان
    
    function updateStudentStatus(call){
    
    
    
    const id =
    
    "student-"+normalizeText(call.student_name);
    
    
    
    
    
    const box =
    
    document.getElementById(id);
    
    
    
    
    
    if(!box)return;
    
    
    
    
    
    const status =
    
    box.querySelector(
    
    ".student-status"
    
    );
    
    
    
    
    
    if(call.status==="received"){
    
    
    status.innerHTML=
    
    "📥 فراخوانی شد توسط معلم";
    
    
    status.className=
    
    "student-status received";
    
    
    }
    
    
    
    
    
    if(call.status==="sent"){
    
    
    status.innerHTML=
    
    "🚶 فرستاده شد";
    
    
    status.className=
    
    "student-status sent";
    
    
    }
    
    
    
    
    
    }
    
    
    
    
    
    
    // بارگذاری فراخوان های قبلی
    
    async function loadActiveCalls(){
    
    
    
    const {data,error}=
    
    await supabaseClient
    
    .from("calls")
    
    .select("*")
    
    .in(
    
    "status",
    
    [
    
    "فراخوان شد",
    
    "received"
    
    ]
    
    )
    
    .order(
    
    "created_at",
    
    {
    
    ascending:true
    
    }
    
    );
    
    
    
    
    
    if(error){
    
    
    console.log(error);
    
    return;
    
    
    }
    
    
    
    
    
    data.forEach(call=>{
    
    
    addStudentToClass({
    
    name:
    
    call.student_name,
    
    
    class_name:
    
    call.class_name
    
    
    });
    
    
    
    updateStudentStatus(call);
    
    
    
    });
    
    
    
    console.log(
    
    "Active Calls:",
    
    data
    
    );
    
    
    
    }
    const startButton =
document.getElementById("startVoice");


const voiceStatus =
document.getElementById("voiceStatus");


const voiceText =
document.getElementById("voiceText");


const mainStatus =
document.getElementById("mainStatus");


const lastStudentBox =
document.getElementById("lastStudent");





const SpeechRecognition =

window.SpeechRecognition ||

window.webkitSpeechRecognition;





let recognition = null;






if(!SpeechRecognition){


alert(
"مرورگر شما از تشخیص صدا پشتیبانی نمی‌کند"
);



}else{



recognition = new SpeechRecognition();



recognition.lang =
"fa-IR";



recognition.continuous =
true;



recognition.interimResults =
true;



recognition.maxAlternatives =
3;





recognition.onstart=function(){


isListening=true;



voiceStatus.innerHTML=

"🎤 میکروفون فعال است";



mainStatus.innerHTML=

"در حال شنیدن اسامی دانش‌آموزان";



};







recognition.onresult=function(event){



let text="";



for(
let i=event.resultIndex;
i<event.results.length;
i++
){


if(event.results[i].isFinal){


text +=

event.results[i][0].transcript;



}


}





text=text.trim();





if(!text)return;





voiceText.innerHTML=text;





const student =

findStudent(text);






if(student){



if(
student.name !== lastStudent
){



lastStudent =
student.name;



lastStudentBox.innerHTML =
student.name;





addStudentToClass(student);



sendCall(student);




mainStatus.innerHTML =

"📢 فراخوان ثبت شد";



playAlert();



}



}




};







recognition.onerror=function(event){



console.log(

"Speech Error:",

event.error

);





voiceStatus.innerHTML =

"خطا: "+event.error;



};







recognition.onend=function(){



console.log(

"Speech End"

);





voiceStatus.innerHTML=

"🔄 تلاش برای اتصال دوباره";






if(isListening){



setTimeout(()=>{


try{


recognition.start();



}catch(error){



console.log(error);


}



},800);



}



};




}









startButton.onclick=function(){



if(isListening)return;



try{



recognition.start();



}catch(error){



console.log(error);



}



};









// ===============================
// دریافت لحظه ای فراخوان ها
// ===============================



supabaseClient

.channel("calls-insert")

.on(

"postgres_changes",

{

event:"INSERT",

schema:"public",

table:"calls"

},


(payload)=>{



const call =
payload.new;



console.log(

"New Call:",

call

);





addStudentToClass({


name:
call.student_name,


class_name:
call.class_name


});





updateStudentStatus(call);





}


)

.subscribe();









supabaseClient

.channel("calls-update")

.on(

"postgres_changes",

{

event:"UPDATE",

schema:"public",

table:"calls"

},


(payload)=>{


const call =
payload.new;



updateStudentStatus(call);



}


)

.subscribe();










// ===============================
// صدای هشدار
// ===============================


function playAlert(){



let audio =

new Audio(

"https://actions.google.com/sounds/v1/alarms/beep_short.ogg"

);



audio.play()

.catch(()=>{});



}









// ===============================
// شروع برنامه
// ===============================


async function init(){



console.log(

"پنل ناظم آماده شد"

);



await loadStudents();



await loadActiveCalls();



}



init();
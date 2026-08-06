//====================================
// تنظیمات Supabase
//====================================

const SUPABASE_URL =
"https://ghnpiijihybuhfetnxjp.supabase.co";

const SUPABASE_KEY =
"sb_publishable_SEGca8-w1pAO3_TQgMd-qA_vOvkj6jq";

const supabaseClient =
supabase.createClient(
SUPABASE_URL,
SUPABASE_KEY
);

console.log("Supabase connected");


//====================================
// متغیرهای اصلی
//====================================

let recognition;
let isListening = true;

let lastCalledStudent = "";
let lastCalledTime = 0;


const micStatus =
document.getElementById("micStatus");

const micIcon =
document.getElementById("micIcon");

const speechText =
document.getElementById("speechText");

const resetButton =
document.getElementById("resetCalls");


//====================================
// لیست دانش آموزان
//====================================

const students = [

{
name:"مهان احمدی",
className:"ششم-1"
},

{
name:"پارسا بکایی",
className:"ششم-1"
},

{
name:"مهدی حسین زاده سیف",
className:"ششم-1"
},

{
name:"آرین خلج زاده",
className:"ششم-1"
},

{
name:"محسن دمرچلی",
className:"ششم-1"
},

{
name:"آرتین رضایی",
className:"ششم-1"
},

{
name:"علیسان صفیاری",
className:"ششم-1"
},

{
name:"آرتین عابدی",
className:"ششم-1"
},

{
name:"آراد عبدالله کرمی",
className:"ششم-1"
},

{
name:"مهیار غلامی",
className:"ششم-1"
},

{
name:"امیرپارسا فخرآبادی",
className:"ششم-1"
},

{
name:"سپهر فرج نژاد",
className:"ششم-1"
},

{
name:"رایان فرهبد",
className:"ششم-1"
},

{
name:"مهراد فخری",
className:"ششم-1"
},

{
name:"امیرحسین قابضی",
className:"ششم-1"
},

{
name:"آراد قیاسی",
className:"ششم-1"
},

{
name:"آرشا کیاپاشا",
className:"ششم-1"
},

{
name:"مهربد کاهانی",
className:"ششم-1"
},

{
name:"مهراد مظفر",
className:"ششم-1"
},

{
name:"عماد مظلومی نیا",
className:"ششم-1"
},

{
name:"آرتین محمدبیگی",
className:"ششم-1"
},

{
name:"میثم نگهداری",
className:"ششم-1"
},

{
name:"مازیار نگهداری",
className:"ششم-1"
},


//====================================
// کلاس سوم 1
//====================================

{
name:"ساتیار امیری",
className:"سوم-1"
},

{
name:"پارسا تقی زاده",
className:"سوم-1"
},

{
name:"رایان جمشیدی",
className:"سوم-1"
},

{
name:"رادین جمشیدی",
className:"سوم-1"
},

{
name:"کارن جهانی",
className:"سوم-1"
},

{
name:"بهراد حسینی نژاد",
className:"سوم-1"
},

{
name:"نویان خدامرادی",
className:"سوم-1"
},

{
name:"فرداد خدایاری",
className:"سوم-1"
},

{
name:"آدرین سلاجقه",
className:"سوم-1"
},

{
name:"شهریار سلگی",
className:"سوم-1"
},

{
name:"آراد شریفی",
className:"سوم-1"
},

{
name:"آرین صفری",
className:"سوم-1"
},

{
name:"رایان عیسی زاده",
className:"سوم-1"
},

{
name:"آرشان عیوض نژاد",
className:"سوم-1"
},

{
name:"کارن کاردان",
className:"سوم-1"
},

{
name:"رادمان کامکار",
className:"سوم-1"
},

{
name:"آرمان کرمیان",
className:"سوم-1"
},

{
name:"رهام ماندگارمقدم",
className:"سوم-1"
},

{
name:"رادمان مرادیان نژاد",
className:"سوم-1"
},

{
name:"مهراد ناصری",
className:"سوم-1"
},

{
name:"آریا نصیرمحمدی",
className:"سوم-1"
},

{
name:"آریا نعمتی",
className:"سوم-1"
}

];

//====================================
// نرمال سازی متن فارسی
//====================================

function normalizeText(text){

    return text
    .replace(/ي/g,"ی")
    .replace(/ى/g,"ی")
    .replace(/ك/g,"ک")
    .replace(/‌/g,"")
    .replace(/\s+/g,"")
    .trim();
    
    }
    
    
    //====================================
    // الگوریتم فاصله و شباهت متن
    //====================================
    
    function levenshtein(a,b){
    
    const matrix=[];
    
    for(let i=0;i<=b.length;i++){
    matrix[i]=[i];
    }
    
    for(let j=0;j<=a.length;j++){
    matrix[0][j]=j;
    }
    
    for(let i=1;i<=b.length;i++){
    
    for(let j=1;j<=a.length;j++){
    
    if(b[i-1]===a[j-1]){
    
    matrix[i][j]=matrix[i-1][j-1];
    
    }else{
    
    matrix[i][j]=Math.min(
    matrix[i-1][j-1]+1,
    matrix[i][j-1]+1,
    matrix[i-1][j]+1
    );
    
    }
    
    }
    
    }
    
    return matrix[b.length][a.length];
    
    }
    
    
    
    function similarity(a,b){
    
    let longer =
    a.length>b.length ? a:b;
    
    let shorter =
    a.length>b.length ? b:a;
    
    
    if(longer.length===0){
    
    return 1;
    
    }
    
    
    let distance =
    levenshtein(
    longer,
    shorter
    );
    
    
    return (
    longer.length-distance
    )
    / longer.length;
    
    }
    
    
    
    //====================================
    // جلوگیری از فراخوان تکراری
    //====================================
    
    function canCall(student){
    
    const now =
    Date.now();
    
    
    if(
    lastCalledStudent===student.name
    &&
    now-lastCalledTime < 5000
    ){
    
    return false;
    
    }
    
    
    lastCalledStudent =
    student.name;
    
    lastCalledTime =
    now;
    
    
    return true;
    
    }
    
    
    
    //====================================
    // پیدا کردن دانش آموز از متن
    //====================================
    
    function findMultipleStudents(text){
    
    
    console.log(
    "متن تشخیص داده شده:",
    text
    );
    
    
    const input =
    normalizeText(text);
    
    
    
    students.forEach(student=>{
    
    
    const studentName =
    normalizeText(
    student.name
    );
    
    
    
    const score =
    similarity(
    input,
    studentName
    );
    
    
    
    console.log(
    student.name,
    score
    );
    
    
    
    if(score>=0.75){
    
    
    if(canCall(student)){
    
    
    sendTeacherMessage(student);
    
    
    }
    
    
    }
    
    
    });
    
    
    }
    
    
    
    //====================================
    // فعال سازی میکروفون
    //====================================
    
    if(
    "webkitSpeechRecognition"
    in window
    ){
    
    
    recognition =
    new webkitSpeechRecognition();
    
    
    recognition.lang =
    "fa-IR";
    
    
    recognition.continuous =
    true;
    
    
    recognition.interimResults =
    false;
    
    
    recognition.maxAlternatives =
    3;
    
    
    
    recognition.onstart=function(){
    
    
    if(micStatus){
    
    micStatus.innerText =
    "میکروفون فعال است و در حال شنیدن...";
    
    }
    
    
    if(micIcon){
    
    micIcon.classList.add(
    "mic-active"
    );
    
    }
    
    
    };
    
    
    
    recognition.onerror=function(error){
    
    
    console.log(
    "خطای میکروفون:",
    error
    );
    
    
    if(micStatus){
    
    micStatus.innerText =
    "خطا در میکروفون - تلاش مجدد";
    
    }
    
    
    restartMic();
    
    
    };
    
    
    
    recognition.onend=function(){
    
    
    if(isListening){
    
    restartMic();
    
    }
    
    
    };
    
    
    
    recognition.onresult=function(event){
    
    
    let text="";
    
    
    for(
    let i=event.resultIndex;
    i<event.results.length;
    i++
    ){
    
    text +=
    event.results[i][0].transcript;
    
    }
    
    
    
    if(speechText){
    
    speechText.innerText =
    text;
    
    }
    
    
    
    findMultipleStudents(text);
    
    
    };
    
    
    
    recognition.start();
    
    
    
    }else{
    
    
    if(micStatus){
    
    micStatus.innerText =
    "مرورگر شما از تشخیص گفتار پشتیبانی نمی‌کند";
    
    }
    
    
    }
    
    
    
    
    //====================================
    // راه اندازی دوباره میکروفون
    //====================================
    
    function restartMic(){
    
    
    setTimeout(()=>{
    
    
    try{
    
    recognition.start();
    
    }
    catch(e){}
    
    
    },1000);
    
    
    }
    //====================================
// ارسال فراخوان به Supabase
//====================================

async function sendTeacherMessage(student){


    console.log(
    "ثبت فراخوان:",
    student.name
    );
    
    
    
    const {data:exist,error:checkError}=
    
    await supabaseClient
    
    .from("calls")
    
    .select("id")
    
    .eq(
    "student_name",
    student.name
    )
    
    .eq(
    "class_name",
    student.className
    )
    
    .neq(
    "status",
    "ارسال شد"
    );
    
    
    
    
    
    if(checkError){
    
    console.error(
    "خطا در بررسی فراخوان:",
    checkError
    );
    
    return;
    
    }
    
    
    
    
    if(exist && exist.length>0){
    
    console.log(
    "این دانش آموز قبلا فراخوان شده است"
    );
    
    return;
    
    }
    
    
    
    
    
    //====================================
    // زمان ثبت فراخوان
    //====================================
    
    const now =
    new Date();
    
    
    
    const calledDate =
    
    new Intl.DateTimeFormat(
    "fa-IR",
    {
    year:"numeric",
    month:"2-digit",
    day:"2-digit"
    }
    ).format(now);
    
    
    
    
    const calledTime =
    
    now.toLocaleTimeString(
    "fa-IR",
    {
    hour:"2-digit",
    minute:"2-digit",
    second:"2-digit"
    }
    );
    
    
    
    
    
    //====================================
    // ثبت در جدول calls
    //====================================
    
    const {data,error}=
    
    await supabaseClient
    
    .from("calls")
    
    .insert([
    
    {
    
    student_name:
    student.name,
    
    class_name:
    student.className,
    
    status:
    "فراخوان شد",
    
    called_date:
    calledDate,
    
    called_time:
    calledTime
    
    }
    
    ])
    
    .select();
    
    
    
    
    
    if(error){
    
    console.error(
    "خطا در ثبت فراخوان:",
    error
    );
    
    return;
    
    }
    
    
    
    
    console.log(
    "✅ فراخوان ثبت شد:",
    data
    );
    
    
    
    }
    //====================================
// افزودن کارت دانش آموز
//====================================

function addStudentToClass(student){


    const classBox =
    document.getElementById(
    "class-"+student.className
    );
    
    
    
    const countBox =
    document.getElementById(
    "count-"+student.className
    );
    
    
    
    if(!classBox){
    
    return;
    
    }
    
    
    
    
    const oldCard =
    document.querySelector(
    `.student-card[data-id="${student.id}"]`
    );
    
    
    
    if(oldCard){
    
    return;
    
    }
    
    
    
    
    const card =
    document.createElement("div");
    
    
    
    card.className =
    "student-card";
    
    
    
    card.dataset.id =
    student.id;
    
    
    
    card.innerHTML = `
    
    <div class="student-row">
    
    <span class="student-name">
    ${student.name}
    </span>
    
    
    <span class="student-status ${getStatusClass(student.status)}">
    ${student.status || "فراخوان شد"}
    </span>
    
    
    <span class="student-time">
    ⏰ ${student.called_time || ""}
    <br>
    📥 ${student.received_time || ""}
    <br>
    📤 ${student.sent_time || ""}
    </span>
    
    </div>
    
    `;
    
    
    
    classBox.appendChild(card);
    
    
    
    if(countBox){
    
    countBox.innerText =
    classBox.children.length;
    
    }
    
    
    }
    
    
    
    
    //====================================
    // کلاس وضعیت
    //====================================
    
    function getStatusClass(status){
    
    
    if(status==="فراخوان شد"){
    
    return "status-called";
    
    }
    
    
    if(status==="دریافت فراخوان"){
    
    return "status-received";
    
    }
    
    
    if(status==="ارسال شد"){
    
    return "status-sent";
    
    }
    
    
    return "";
    
    }
    
    
    
    
    //====================================
    // بروزرسانی کارت
    //====================================
    
    function updateNazemCard(call){
    
    
    const card =
    document.querySelector(
    `.student-card[data-id="${call.id}"]`
    );
    
    
    
    if(!card){
    
    return;
    
    }
    
    
    
    
    const status =
    card.querySelector(
    ".student-status"
    );
    
    
    
    if(status){
    
    
    status.innerText =
    call.status;
    
    
    status.className =
    "student-status "+
    getStatusClass(
    call.status
    );
    
    
    }
    
    
    
    
    
    const time =
    card.querySelector(
    ".student-time"
    );
    
    
    
    if(time){
    
    
    time.innerHTML = `
    
    ⏰ ${call.called_time || ""}
    
    <br>
    
    📥 ${call.received_time || ""}
    
    <br>
    
    📤 ${call.sent_time || ""}
    
    `;
    
    }
    
    
    }
    
    
    
    
    //====================================
    // دریافت فراخوان های قبلی
    //====================================
    
    async function loadCalls(){
    
    
    const {data,error}=
    
    await supabaseClient
    
    .from("calls")
    
    .select("*")
    
    .order(
    "id",
    {
    ascending:true
    }
    );
    
    
    
    
    
    if(error){
    
    console.error(
    "خطا در دریافت فراخوان ها:",
    error
    );
    
    return;
    
    }
    
    
    
    
    
    data.forEach(call=>{
    
    
    const student={
    
    
    id:
    call.id,
    
    
    name:
    call.student_name,
    
    
    className:
    call.class_name.replaceAll(
    " ",
    "-"
    ),
    
    
    status:
    call.status,
    
    
    called_time:
    call.called_time,
    
    
    received_time:
    call.received_time,
    
    
    sent_time:
    call.sent_time
    
    
    };
    
    
    
    
    addStudentToClass(student);
    
    
    
    });
    
    
    }
    
    
    
    loadCalls();
    
    
    
    
    //====================================
    // Realtime تغییر وضعیت معلم
    //====================================
    
    supabaseClient
    
    .channel(
    "nazem-status-update"
    )
    
    .on(
    "postgres_changes",
    {
    
    event:"UPDATE",
    
    schema:"public",
    
    table:"calls"
    
    },
    
    payload=>{
    
    
    console.log(
    "تغییر وضعیت:",
    payload.new
    );
    
    
    
    updateNazemCard(
    payload.new
    );
    
    
    
    }
    
    )
    
    .subscribe(
    status=>{
    
    
    console.log(
    "Nazem status realtime:",
    status
    );
    
    
    }
    
    );
    
    //====================================
// Realtime ثبت فراخوان جدید
//====================================

supabaseClient
.channel("nazem-new-call")
.on(
"postgres_changes",
{
event:"INSERT",
schema:"public",
table:"calls"
},
(payload)=>{


console.log(
"فراخوان جدید:",
payload.new
);



const student={

id:payload.new.id,

name:payload.new.student_name,

className:
payload.new.class_name.replaceAll(
" ",
"-"
),

status:payload.new.status,

called_time:
payload.new.called_time,

received_time:
payload.new.received_time,

sent_time:
payload.new.sent_time

};



addStudentToClass(student);


}
)
.subscribe();




//====================================
// حذف فراخوان از پنل ناظم
//====================================

supabaseClient
.channel("nazem-delete-update")
.on(
"postgres_changes",
{
event:"DELETE",
schema:"public",
table:"calls"
},
(payload)=>{


console.log(
"حذف شد:",
payload.old
);



const card =
document.querySelector(
`.student-card[data-id="${payload.old.id}"]`
);



if(card){

card.remove();

}



}
)
.subscribe();




//====================================
// پاک کردن همه فراخوان ها
//====================================

if(resetButton){


resetButton.onclick =
async ()=>{


const ok =
confirm(
"تمام فراخوان‌ها پاک شوند؟"
);



if(!ok){

return;

}



const {error}=

await supabaseClient
.from("calls")
.delete()
.gte(
"id",
1
);



if(error){

console.error(
error
);

return;

}




document
.querySelectorAll(".students-list")
.forEach(box=>{

box.innerHTML="";

});



document
.querySelectorAll(".class-header span")
.forEach(span=>{

span.innerText="0";

});



speechText.innerText =
"منتظر شنیدن نام دانش‌آموز...";



console.log(
"Reset انجام شد"
);



};


}



console.log(
"nazem.js آماده اجرا شد"
);
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

let recognition = null;

let isListening = true;

let speechBuffer = "";

let restartTimer = null;

let lastDetectedText = "";




//====================================
// عناصر HTML
//====================================


const micStatus =
document.getElementById("micStatus");


const micIcon =
document.getElementById("micIcon");


const speechText =
document.getElementById("speechText");


const resetButton =
document.getElementById("resetCalls");



//====================================
// یکسان سازی متن فارسی
//====================================

function normalizeText(text){


return text

.replace(/ي/g,"ی")

.replace(/ى/g,"ی")

.replace(/ك/g,"ک")

.replace(/ۀ/g,"ه")

.replace(/‌/g," ")

.replace(/\s+/g," ")

.trim();


}





//====================================
// لیست دانش آموزان
//====================================


const students=[


{name:"مهان احمدی",className:"ششم-1"},

{name:"پارسا بکایی",className:"ششم-1"},

{name:"مهدی حسین زاده سیف",className:"ششم-1"},

{name:"آرین خلج زاده",className:"ششم-1"},

{name:"محسن دمرچلی",className:"ششم-1"},

{name:"آرتین رضایی",className:"ششم-1"},

{name:"علیسان صفیاری",className:"ششم-1"},

{name:"آرتین عابدی",className:"ششم-1"},

{name:"آراد عبدالله کرمی",className:"ششم-1"},

{name:"مهیار غلامی",className:"ششم-1"},

{name:"امیرپارسا فخرآبادی",className:"ششم-1"},

{name:"سپهر فرج نژاد",className:"ششم-1"},

{name:"رایان فرهبد",className:"ششم-1"},

{name:"مهراد فخری",className:"ششم-1"},

{name:"امیرحسین قابضی",className:"ششم-1"},

{name:"آراد قیاسی",className:"ششم-1"},

{name:"آرشا کیاپاشا",className:"ششم-1"},

{name:"مهربد کاهانی",className:"ششم-1"},

{name:"مهراد مظفر",className:"ششم-1"},

{name:"عماد مظلومی نیا",className:"ششم-1"},

{name:"آرتین محمدبیگی",className:"ششم-1"},

{name:"میثم نگهداری",className:"ششم-1"},

{name:"مازیار نگهداری",className:"ششم-1"},



{name:"ساتیار امیری",className:"سوم-1"},

{name:"پارسا تقی زاده",className:"سوم-1"},

{name:"رایان جمشیدی",className:"سوم-1"},

{name:"رادین جمشیدی",className:"سوم-1"},

{name:"کارن جهانی",className:"سوم-1"},

{name:"بهراد حسینی نژاد",className:"سوم-1"},

{name:"نویان خدامرادی",className:"سوم-1"},

{name:"فرداد خدایاری",className:"سوم-1"},

{name:"آدرین سلاجقه",className:"سوم-1"},

{name:"شهریار سلگی",className:"سوم-1"},

{name:"آراد شریفی",className:"سوم-1"},

{name:"آرین صفری",className:"سوم-1"},

{name:"رایان عیسی زاده",className:"سوم-1"},

{name:"آرشان عیوض نژاد",className:"سوم-1"},

{name:"کارن کاردان",className:"سوم-1"},

{name:"رادمان کامکار",className:"سوم-1"},

{name:"آرمان کرمیان",className:"سوم-1"},

{name:"رهام ماندگارمقدم",className:"سوم-1"},

{name:"رادمان مرادیان نژاد",className:"سوم-1"},

{name:"مهراد ناصری",className:"سوم-1"},

{name:"آریا نصیرمحمدی",className:"سوم-1"},

{name:"آریا نعمتی",className:"سوم-1"}

];





//====================================
// ساخت نسخه قابل مقایسه
//====================================


const normalizedStudents =

students.map(student=>{


return {


...student,


normalizedName:

normalizeText(student.name)

.replace(/\s+/g,"")


};


});



console.log(
"Students loaded:",
normalizedStudents.length
);
//====================================
// الگوریتم Levenshtein
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
    
    
    
    if(
    b[i-1]===a[j-1]
    ){
    
    
    matrix[i][j]=
    matrix[i-1][j-1];
    
    
    }
    
    else{
    
    
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
    
    
    
    
    
    
    
    //====================================
    // درصد شباهت دو متن
    //====================================
    
    
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
    /longer.length;
    
    
    }
    
    
    
    
    
    
    
    //====================================
    // جلوگیری از فراخوان اضافی
    //====================================
    
    
    function canCall(student){
    
    return true;
    
    }
    
    
    
    
    
    
    
    //====================================
    // پیدا کردن دانش آموز
    //====================================
    
    
    function findMultipleStudents(text){
    
    
    
    console.log(
    "متن برای بررسی:",
    text
    );
    
    
    
    let input =
    normalizeText(text);
    
    
    
    // حذف فاصله برای مقایسه
    
    let compareInput =
    input.replace(/\s+/g,"");
    
    
    
    
    // اگر متن خیلی کوتاه بود
    // بررسی نکن
    
    if(compareInput.length<4){
    
    return;
    
    }
    
    
    
    
    
    for(let student of normalizedStudents){
    
    
    
    let studentName =
    student.normalizedName;
    
    
    
    
    
    
    //===============================
    // تشخیص دقیق
    //===============================
    
    
    if(
    compareInput.includes(studentName)
    ){
    
    
    console.log(
    "تشخیص مستقیم:",
    student.name
    );
    
    
    
    if(canCall(student)){
    
    
    sendTeacherMessage(student);
    
    
    
    }
    
    
    
    speechBuffer="";
    
    
    
    if(speechText){
    
    speechText.innerText =
    "منتظر شنیدن نام دانش‌آموز...";
    
    }
    
    
    
    return;
    
    
    
    }
    
    
    
    
    
    
    
    //===============================
    // تشخیص با غلط املایی
    //===============================
    
    
    
    let score =
    similarity(
    compareInput,
    studentName
    );
    
    
    
    if(score>=0.78){
    
    
    
    console.log(
    "تشخیص مشابه:",
    student.name,
    score
    );
    
    
    
    if(canCall(student)){
    
    
    sendTeacherMessage(student);
    
    
    }
    
    
    
    speechBuffer="";
    
    
    
    if(speechText){
    
    speechText.innerText =
    "منتظر شنیدن نام دانش‌آموز...";
    
    }
    
    
    
    return;
    
    
    
    }
    
    
    
    }
    
    
    
    
    
    console.log(
    "دانش آموز پیدا نشد"
    );
    
    
    
    }
    //====================================
// راه اندازی Speech Recognition
//====================================


if(
    "webkitSpeechRecognition" in window
    ){
    
    
    recognition =
    new webkitSpeechRecognition();
    
    
    
    recognition.lang =
    "fa-IR";
    
    
    
    recognition.continuous =
    true;
    
    
    
    recognition.interimResults = false;
    
    
    
    recognition.maxAlternatives =
    3;
    
    
    
    
    
    //====================================
    // شروع میکروفون
    //====================================
    
    
    recognition.onstart=function(){
    
    
    
    console.log(
    "Microphone Started"
    );
    
    
    
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
    
    
    
    
    
    
    
    //====================================
    // دریافت نتیجه صدا
    //====================================
    
    
    recognition.onresult=function(event){
    
    
    
    let text="";
    
    
    
    // گرفتن متن حتی از نتیجه موقت
    
    for(
    let i=event.resultIndex;
    i<event.results.length;
    i++
    ){
    
    
    text +=
    event.results[i][0].transcript;
    
    
    }
    
    
    
    let cleanText =
    text.trim();
    
    
    
    
    if(cleanText!==""){
    
    
    
    console.log(
    "متن تشخیص داده شده:",
    cleanText
    );
    
    
    
    
    //--------------------------------
    // نمایش فوری در کادر
    //--------------------------------
    
    
    if(speechText){
    
    
    speechText.innerText =
    cleanText;
    
    
    }
    
    
    
    // جلوگیری از پردازش تکراری
    
    if(
    cleanText === lastDetectedText
    ){
    
    return;
    
    }
    
    
    
    lastDetectedText =
    cleanText;
    
    
    
    speechBuffer =
    cleanText;
    
    
    
    
    // ارسال برای تشخیص نام
    
    
    findMultipleStudents(
    cleanText
    );
    
    
    
    }
    
    
    
    };
    
    
    
    
    
    
    
    //====================================
    // خطای میکروفون
    //====================================
    
    recognition.onerror=function(event){


        console.log(
        "Speech Error:",
        event.error
        );
        
        
        
        if(event.error==="no-speech"){
        
        return;
        
        }
        
        
        
        restartMic();
        
        
        };
    
    
    
    
    
    
    
    
    //====================================
    // پایان خودکار میکروفون
    //====================================
    
    
    recognition.onend=function(){


        console.log(
        "Microphone Ended"
        );
        
        
        
        if(isListening){
        
        
        setTimeout(()=>{
        
        
        try{
        
        recognition.start();
        
        console.log(
        "Microphone Restarted"
        );
        
        
        }
        catch(e){}
        
        
        
        },300);
        
        
        }
        
        
        
        };
    
    
    
    
    
    
    // شروع اولیه
    
    try{
    
    
    recognition.start();
    
    
    
    }
    
    catch(e){
    
    
    console.log(e);
    
    
    }
    
    
    
    }
    
    else{
    
    
    if(micStatus){
    
    micStatus.innerText =
    "مرورگر شما از تشخیص گفتار پشتیبانی نمی‌کند";
    
    }
    
    
    }
    
    
    
    
    
    
    
    //====================================
    // راه اندازی دوباره میکروفون
    //====================================
    
    
    function restartMic(){
    
    
    
    clearTimeout(
    restartTimer
    );
    
    
    
    restartTimer =
    setTimeout(()=>{
    
    
    
    if(
    isListening &&
    recognition
    ){
    
    
    try{
    
    
    recognition.start();
    
    
    
    console.log(
    "Microphone Restarted"
    );
    
    
    
    }
    
    catch(e){
    
    
    
    console.log(
    "Already started"
    );
    
    
    
    }
    
    
    
    }
    
    
    
    },100);
    
    
    
    }
    //====================================
// ارسال فراخوان به Supabase
//====================================


async function sendTeacherMessage(student){



    console.log(
    "ارسال فراخوان:",
    student.name
    );
    
    
    
    
    // بررسی اینکه قبلا فراخوان نشده باشد
    
    
    const {
    data:exist,
    error:checkError
    }=await supabaseClient
    
    
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
    
    
    .limit(1);
    
    
    
    
    
    if(checkError){
    
    
    console.error(
    "خطا در بررسی تکرار:",
    checkError
    );
    
    
    return;
    
    
    }
    
    
    
    
    
    
    if(
    exist &&
    exist.length>0
    ){
    
    
    console.log(
    "این دانش آموز قبلا فراخوان شده"
    );
    
    
    return;
    
    
    }
    
    
    
    
    
    
    
    // تاریخ و ساعت
    
    
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
    
    
    
    
    
    
    // ثبت در جدول calls
    
    
    const {
    data,
    error
    }=await supabaseClient
    
    
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
    "ثبت شد:",
    data
    );
    
    
    
    }
    
    
    
    
    
    
    
    //====================================
    // کلاس CSS وضعیت
    //====================================
    
    
    function getStatusClass(status){
    
    
    
    switch(status){
    
    
    
    case "فراخوان شد":
    
    return "status-called";
    
    
    
    case "دریافت فراخوان":
    
    return "status-received";
    
    
    
    case "ارسال شد":
    
    return "status-sent";
    
    
    
    default:
    
    return "";
    
    
    
    }
    
    
    
    }
    
    
    
    
    
    
    
    
    
    //====================================
    // ساخت کارت دانش آموز
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
    
    console.log(
    "کلاس پیدا نشد:",
    student.className
    );
    
    return;
    
    }
    
    
    
    
    
    
    // جلوگیری از کارت تکراری
    
    
    const oldCard =
    document.querySelector(
    
    `.student-card[data-id="${student.id}"]`
    
    );
    
    
    
    if(oldCard){
    
    return;
    
    }
    
    
    
    
    
    
    const card =
    document.createElement(
    "div"
    );
    
    
    
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
    
    
    
    
    
    classBox.appendChild(
    card
    );
    
    
    
    
    
    
    if(countBox){
    
    countBox.innerText =
    classBox.children.length;
    
    }
    
    
    
    }
    
    
    
    
    
    
    
    
    
    //====================================
    // بروزرسانی کارت هنگام تغییر وضعیت
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


    const {
    data,
    error
    }=await supabaseClient
    
    
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
    "خطا در دریافت فراخوان‌ها:",
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
    
    
    called_date:
    call.called_date,
    
    
    called_time:
    call.called_time,
    
    
    received_time:
    call.received_time,
    
    
    sent_time:
    call.sent_time
    
    
    
    };
    
    
    
    addStudentToClass(
    student
    );
    
    
    
    });
    
    
    }
    
    
    
    loadCalls();
    
    
    
    
    
    
    
    
    //====================================
    // Realtime ثبت فراخوان جدید
    //====================================
    
    
    supabaseClient
    
    
    .channel(
    "nazem-insert-call"
    )
    
    
    .on(
    
    "postgres_changes",
    
    {
    
    event:"INSERT",
    
    schema:"public",
    
    table:"calls"
    
    },
    
    
    payload=>{
    
    
    console.log(
    "فراخوان جدید:",
    payload.new
    );
    
    
    
    
    const student={
    
    
    id:
    payload.new.id,
    
    
    name:
    payload.new.student_name,
    
    
    className:
    payload.new.class_name.replaceAll(
    " ",
    "-"
    ),
    
    
    status:
    payload.new.status,
    
    
    called_time:
    payload.new.called_time,
    
    
    received_time:
    payload.new.received_time,
    
    
    sent_time:
    payload.new.sent_time
    
    
    
    };
    
    
    
    addStudentToClass(
    student
    );
    
    
    
    }
    
    
    
    )
    
    
    .subscribe(
    status=>{
    
    
    console.log(
    "Realtime INSERT:",
    status
    );
    
    
    
    });
    
    
    
    
    
    
    
    
    
    //====================================
    // Realtime تغییر وضعیت
    //====================================
    
    
    supabaseClient
    
    
    .channel(
    "nazem-update-call"
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
    "UPDATE:",
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
    "Realtime UPDATE:",
    status
    );
    
    
    
    });
    
    
    
    
    
    
    
    
    
    //====================================
    // Realtime حذف فراخوان
    //====================================
    
    
    supabaseClient
    
    
    .channel(
    "nazem-delete-call"
    )
    
    
    .on(
    
    "postgres_changes",
    
    {
    
    event:"DELETE",
    
    schema:"public",
    
    table:"calls"
    
    },
    
    
    payload=>{
    
    
    console.log(
    "DELETE:",
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
    
    
    .subscribe(
    status=>{
    
    
    console.log(
    "Realtime DELETE:",
    status
    );
    
    
    
    });
    
    
    
    
    
    
    
    
    
    //====================================
    // حذف همه فراخوان ها
    //====================================
    
    
    if(resetButton){
    
    
    
    resetButton.addEventListener(
    
    "click",
    
    async()=>{
    
    
    
    const ok =
    confirm(
    "تمام فراخوان‌ها پاک شوند؟"
    );
    
    
    
    if(!ok){
    
    return;
    
    }
    
    
    
    
    
    const {
    error
    }=await supabaseClient
    
    
    .from("calls")
    
    
    .delete()
    
    
    .gte(
    "id",
    0
    );
    
    
    
    
    
    if(error){
    
    
    console.error(
    "خطا در حذف:",
    error
    );
    
    
    return;
    
    
    }
    
    
    
    
    
    
    document
    
    .querySelectorAll(
    ".students-list"
    )
    
    .forEach(box=>{
    
    
    box.innerHTML="";
    
    
    });
    
    
    
    
    
    
    
    document
    
    .querySelectorAll(
    ".class-header span"
    )
    
    .forEach(item=>{
    
    
    item.innerText="0";
    
    
    });
    
    
    
    
    
    
    
    speechBuffer="";
    
    
    lastDetectedText="";
    
    
    
    if(speechText){
    
    
    speechText.innerText =
    "منتظر شنیدن نام دانش‌آموز...";
    
    
    }
    
    
    
    console.log(
    "همه فراخوان‌ها حذف شدند"
    );
    
    
    
    }
    
    
    );
    
    
    
    }
    
    
    
    
    
    
    
    
    
    //====================================
    // مدیریت خروج صفحه
    //====================================
    
    
    window.addEventListener(
    
    "beforeunload",
    
    ()=>{
    
    
    isListening=false;
    
    
    
    if(recognition){
    
    
    try{
    
    
    recognition.stop();
    
    
    
    }
    
    catch(e){}
    
    
    
    }
    
    
    
    }
    
    
    
    );
    
    
    
    
    
    
    
    
    
    //====================================
    // برگشت دوباره به صفحه
    //====================================
    
    
    document.addEventListener(
    
    "visibilitychange",
    
    ()=>{
    
    
    if(
    
    document.visibilityState==="visible"
    
    &&
    
    isListening
    
    ){
    
    
    restartMic();
    
    
    
    }
    
    
    
    }
    
    
    
    );
    
    
    
    
    
    
    
    
    console.log(
    "Nazem JS Loaded Successfully"
    );
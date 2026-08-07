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
// متغیرهای اصلی سیستم
//====================================

let recognition;

let isListening=true;


const micStatus =
document.getElementById("micStatus");

const micIcon =
document.getElementById("micIcon");

const speechText =
document.getElementById("speechText");


const resetButton =
document.getElementById("resetCalls");


//====================================
// تابع استانداردسازی متن
//====================================
// این تابع باعث می‌شود اختلاف‌های زیر حل شود:
//
// علیسان صفیاری
// علیسان صفاری
//
// امیرپارسا فخرآبادی
// امیر پارسا فخر آبادی
//
// همه به شکل قابل مقایسه تبدیل می‌شوند.


function normalizeText(text){

return text

// تبدیل حروف عربی به فارسی
.replace(/ي/g,"ی")
.replace(/ك/g,"ک")

// حذف فاصله‌ها بین کلمات
.replace(/\s+/g,"")

// حذف علائم اضافی
.replace(/[^\u0600-\u06FFa-zA-Z]/g,"")

// کوچک کردن حروف انگلیسی احتمالی
.toLowerCase()

.trim();

}


//====================================
// محاسبه شباهت دو متن
//====================================
// برای قبول غلط‌های کوچک گفتاری استفاده می‌شود.
//
// مثال:
//
// رضایی
// رزایی
//
// شباهت بالایی دارند.


function textSimilarity(a,b){

a=normalizeText(a);
b=normalizeText(b);


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
)/
longer.length;

}


//====================================
// الگوریتم فاصله ویرایشی
//====================================
// تعداد تغییر لازم برای تبدیل یک کلمه
// به کلمه دیگر را محاسبه می‌کند.


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
b.charAt(i-1)
===
a.charAt(j-1)
){

matrix[i][j]=
matrix[i-1][j-1];


}

else{

matrix[i][j]=
Math.min(

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
// بررسی اسم دانش آموز
//====================================
// اگر:
// - فاصله وجود داشته باشد
// - فاصله حذف شده باشد
// - یک یا دو حرف اشتباه گفته شود
//
// دانش آموز پیدا می‌شود.


function isSameStudent(
spoken,
realName
){


const similarity =
textSimilarity(
spoken,
realName
);


// حداقل شباهت قابل قبول
// 75 درصد


return similarity >= 0.75;


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


// ادامه لیست دانش‌آموزان شما در بخش بعدی قرار می‌گیرد...


];
//====================================
// ادامه لیست دانش آموزان
//====================================


students.push(


    // ششم-1
    
    {name:"آراد قیاسی",className:"ششم-1"},
    {name:"آرشا کیاپاشا",className:"ششم-1"},
    {name:"مهربد کاهانی",className:"ششم-1"},
    {name:"مهراد مظفر",className:"ششم-1"},
    {name:"عماد مظلومی نیا",className:"ششم-1"},
    {name:"آرتین محمدبیگی",className:"ششم-1"},
    {name:"میثم نگهداری",className:"ششم-1"},
    {name:"مازیار نگهداری",className:"ششم-1"},
    
    
    // سوم-1
    
    {name:"ساتیار امیری",className:"سوم-1"},
    {name:"پارسا تقی زاده",className:"سوم-1"},
    {name:"رایان جمشیدی",className:"سوم-1"},
    {name:"رادین جمشیدی",className:"سوم-1"},
    {name:"کارن جهانی",className:"سوم-1"},
    {name:"بهراد حسینی نژاد",className:"سوم-1"},
    {name:"نویان خدامرادی",className:"سوم-1"},
    {name:"فرداد خدایاری",className:"سوم-1"},
    {name:"آدرین سلاجقه",className:"سوم-1"},
    
    
    // سوم-2
    
    {name:"مهرسام اسدرخت",className:"سوم-2"},
    {name:"آریا اسماعیلی",className:"سوم-2"},
    {name:"امیرعلی اکبرآبادی",className:"سوم-2"},
    {name:"دانیال اکبری مهر",className:"سوم-2"},
    
    
    // اول-1
    
    {name:"آرسام ابهری",className:"اول-1"},
    {name:"هومان باوی",className:"اول-1"},
    {name:"سامراد دمیرچلی",className:"اول-1"},
    
    
    // چهارم-1
    
    {name:"محمدطاها احمدی",className:"چهارم-1"},
    {name:"آریا آزاد پیما",className:"چهارم-1"},
    {name:"رادمهر بشیری",className:"چهارم-1"},
    
    
    // چهارم-2
    
    {name:"سید محمد اجاقی",className:"چهارم-2"},
    {name:"امیرمحمد امانی",className:"چهارم-2"},
    {name:"کارن امانی",className:"چهارم-2"},
    
    
    // پنجم-1
    
    {name:"محمدمهدی ابیض",className:"پنجم-1"},
    {name:"ماهان اجتهادی",className:"پنجم-1"},
    {name:"سامیار اسکندری",className:"پنجم-1"},
    
    
    // پنجم-2
    
    {name:"کیان امامقلی",className:"پنجم-2"},
    {name:"مهراد امانی پور",className:"پنجم-2"},
    {name:"هیوا بهرامی",className:"پنجم-2"}
    
    );
    
    
    
    //====================================
    // فعال کردن میکروفون
    //====================================
    
    
    if(
    "webkitSpeechRecognition"
    in window
    ){
    
    
    recognition =
    new webkitSpeechRecognition();
    
    
    
    recognition.lang =
    "fa-IR";
    
    
    // بدون توقف گوش می‌دهد
    
    recognition.continuous =
    true;
    
    
    // نتیجه‌های موقت هم گرفته می‌شود
    
    recognition.interimResults =
    true;
    
    
    
    recognition.onstart=function(){
    
    
    micStatus.innerText =
    "میکروفون فعال است و در حال شنیدن...";
    
    
    micIcon.classList.add(
    "mic-active"
    );
    
    
    };
    
    
    
    // اگر خطا رخ دهد دوباره تلاش می‌کند
    
    recognition.onerror=function(error){
    
    
    console.log(
    "Speech Error:",
    error
    );
    
    
    micStatus.innerText =
    "خطا در میکروفون - تلاش مجدد";
    
    
    restartMic();
    
    
    };
    
    
    
    // کروم بعد از مدتی میکروفون را می‌بندد
    // این قسمت دوباره آن را روشن می‌کند
    
    recognition.onend=function(){
    
    
    if(isListening){
    
    restartMic();
    
    }
    
    
    };
    
    
    
    // شروع اولیه
    
    recognition.start();
    
    
    
    }
    else{
    
    
    micStatus.innerText =
    "مرورگر شما پشتیبانی نمی‌کند";
    
    
    }
    
    
    
    //====================================
    // راه‌اندازی دوباره میکروفون
    //====================================
    
    
    function restartMic(){
    
    
    setTimeout(()=>{
    
    
    try{
    
    
    recognition.start();
    
    
    
    }
    catch(e){
    
    
    console.log(
    "Mic already running"
    );
    
    
    }
    
    
    },1000);
    
    
    }
    
    
    
    
    //====================================
    // دریافت متن از میکروفون
    //====================================
    
    
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
    
    
    
    speechText.innerText =
    text;
    
    
    
    // ارسال متن برای بررسی اسم‌ها
    
    findMultipleStudents(text);
    
    
    
    };
    
    
    
    
    //====================================
    // پیدا کردن دانش‌آموز در متن
    //====================================
    // قبلاً اینجا:
    // text.includes(student.name)
    //
    // بود.
    //
    // الان:
    // فاصله، نیم فاصله و غلط کوچک
    // هم قبول می‌شود.
    
    
    function findMultipleStudents(text){
    
    
    
    students.forEach(student=>{
    
    
    
    if(
    isSameStudent(
    text,
    student.name
    )
    ){
    
    
    
    console.log(
    "دانش‌آموز پیدا شد:",
    student.name
    );
    
    
    
    sendTeacherMessage(
    student
    );
    
    
    
    }
    
    
    
    });
    
    
    
    }
    //====================================
// ارسال فراخوان به دیتابیس Supabase
//====================================
// این تابع وقتی دانش‌آموز تشخیص داده شد
// اجرا می‌شود.
//
// مثال:
// ناظم می‌گوید:
// امیر پارسا فخر آبادی
//
// سیستم پیدا می‌کند:
// امیرپارسا فخرآبادی
//
// سپس در جدول calls ثبت می‌کند.


async function sendTeacherMessage(student){



    //------------------------------------
    // بررسی می‌کنیم آیا قبلاً فراخوان شده
    // یا نه
    //------------------------------------
    
    
    const {
    data:exist,
    error:checkError
    
    }
    =
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
    
    
    
    
    // اگر خطایی در بررسی بود
    
    if(checkError){
    
    
    console.error(
    "خطا در بررسی فراخوان قبلی:",
    checkError
    );
    
    
    return;
    
    
    }
    
    
    
    
    // اگر قبلاً وجود داشت
    // دوباره ثبت نمی‌کنیم
    
    
    if(
    exist &&
    exist.length>0
    ){
    
    
    console.log(
    "این دانش آموز قبلا فراخوان شده:",
    student.name
    );
    
    
    return;
    
    
    }
    
    
    
    
    
    //------------------------------------
    // گرفتن تاریخ و ساعت فعلی
    //------------------------------------
    
    
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
    )
    .format(now);
    
    
    
    const calledTime =
    now.toLocaleTimeString(
    "fa-IR",
    {
    hour:"2-digit",
    minute:"2-digit",
    second:"2-digit"
    }
    );
    
    
    
    
    
    //------------------------------------
    // ثبت فراخوان در جدول calls
    //------------------------------------
    
    
    const {
    
    data,
    error
    
    }
    
    =
    await supabaseClient
    .from("calls")
    .insert([
    
    
    {
    
    
    // نام دانش‌آموز
    
    student_name:
    student.name,
    
    
    
    // کلاس دانش‌آموز
    
    class_name:
    student.className,
    
    
    
    // وضعیت اولیه
    
    status:
    "فراخوان شد",
    
    
    
    // تاریخ فراخوان
    
    called_date:
    calledDate,
    
    
    
    // ساعت فراخوان
    
    called_time:
    calledTime
    
    
    }
    
    
    
    ])
    .select();
    
    
    
    
    
    // بررسی خطای ثبت
    
    
    if(error){
    
    
    console.error(
    "خطا در ثبت فراخوان:",
    error
    );
    
    
    return;
    
    
    }
    
    
    
    
    console.log(
    "فراخوان ثبت شد:",
    data
    );
    
    
    
    }
    
    
    
    //====================================
    // دریافت فراخوان‌های قبلی
    //====================================
    // هنگام باز شدن صفحه ناظم
    // فراخوان‌های قبلی را نمایش می‌دهد.
    
    
    async function loadCalls(){
    
    
    
    const {
    
    data,
    error
    
    }
    
    =
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
    
    
    
    // اجرای اولیه بارگذاری
    
    loadCalls();
//====================================
// اضافه کردن دانش آموز به کارت کلاس
//====================================
// این تابع یک کارت برای دانش‌آموز می‌سازد
// و داخل کلاس مربوطه نمایش می‌دهد.


function addStudentToClass(student){


    const classBox =
    document.getElementById(
    "class-"+student.className
    );
    
    
    
    const countBox =
    document.getElementById(
    "count-"+student.className
    );
    
    
    
    // اگر کلاس وجود نداشت
    // کاری انجام نمی‌دهیم
    
    if(!classBox){
    
    return;
    
    }
    
    
    
    // جلوگیری از ایجاد کارت تکراری
    
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
    
    
    
    
    // بروزرسانی تعداد دانش‌آموزان
    
    if(countBox){
    
    
    countBox.innerText =
    classBox.children.length;
    
    
    }
    
    
    }
    
    
    
    
    
    
    
    //====================================
    // تعیین کلاس رنگ وضعیت
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
    // تغییر وضعیت کارت
    //====================================
    // وقتی معلم روی دریافت یا ارسال می‌زند
    // این قسمت اجرا می‌شود.
    
    
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
    // Realtime تغییر وضعیت
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
    "Nazem UPDATE:",
    status
    );
    
    
    });
    
    
    
    
    
    
    
    
    //====================================
    // Realtime حذف فراخوان
    //====================================
    // وقتی ریست یا حذف دستی انجام شود
    // کارت همزمان حذف می‌شود.
    
    
    supabaseClient
    .channel(
    "nazem-delete-update"
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
    "حذف فراخوان:",
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
    "Nazem DELETE:",
    status
    );
    
    
    });
    
    
    
    
    
    
    
    //====================================
    // Realtime اضافه شدن فراخوان جدید
    //====================================
    
    
    supabaseClient
    .channel(
    "nazem-new-call"
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
    
    
    
    const student = {
    
    
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
    "Nazem INSERT:",
    status
    );
    
    
    });
    //====================================
// دکمه ریست تمام فراخوان‌ها
//====================================
// با زدن این دکمه:
// 1- تمام رکوردهای calls پاک می‌شود
// 2- کارت‌های صفحه ناظم حذف می‌شوند
// 3- شمارنده کلاس‌ها صفر می‌شود
// 4- صفحه به حالت آماده شنیدن برمی‌گردد


if(resetButton){


    resetButton.addEventListener(
    "click",
    async function(){
    
    
    
    const confirmReset =
    confirm(
    "تمام فراخوان‌ها پاک شوند؟"
    );
    
    
    
    if(!confirmReset){
    
    return;
    
    }
    
    
    
    
    //------------------------------------
    // حذف همه رکوردهای جدول calls
    //------------------------------------
    
    
    const {
    
    error
    
    }
    
    =
    await supabaseClient
    .from("calls")
    .delete()
    .not(
    "id",
    "is",
    null
    );
    
    
    
    
    
    
    if(error){
    
    
    console.error(
    "خطا در حذف فراخوان‌ها:",
    error
    );
    
    
    alert(
    "خطا در پاک کردن فراخوان‌ها"
    );
    
    
    return;
    
    
    }
    
    
    
    
    
    //------------------------------------
    // پاک کردن کارت‌های روی صفحه
    //------------------------------------
    
    
    document
    .querySelectorAll(
    ".students-list"
    )
    .forEach(
    box=>{
    
    
    box.innerHTML="";
    
    
    }
    
    );
    
    
    
    
    
    
    //------------------------------------
    // صفر کردن تعداد کلاس‌ها
    //------------------------------------
    
    
    document
    .querySelectorAll(
    ".class-header span"
    )
    .forEach(
    count=>{
    
    
    count.innerText =
    "0";
    
    
    }
    
    );
    
    
    
    
    
    
    
    //------------------------------------
    // بازگرداندن متن‌ها
    //------------------------------------
    
    
    if(speechText){
    
    
    speechText.innerText =
    "منتظر شنیدن نام دانش‌آموز...";
    
    
    }
    
    
    
    
    if(micStatus){
    
    
    micStatus.innerText =
    "میکروفون فعال است و در حال شنیدن...";
    
    
    }
    
    
    
    
    
    
    console.log(
    "تمام فراخوان‌ها حذف شدند"
    );
    
    
    
    
    }
    
    );
    
    
    }
    
    
    
    //====================================
    // جلوگیری از توقف میکروفون
    //====================================
    // اگر مرورگر میکروفون را قطع کرد
    // دوباره فعال می‌شود.
    
    
    window.addEventListener(
    "beforeunload",
    ()=>{
    
    
    isListening=false;
    
    
    }
    
    );
    
    
    
    //====================================
    // پایان nazem.js
    //====================================
    
    console.log(
    "nazem.js loaded successfully"
    );    
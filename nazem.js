//====================================
// تنظیمات Supabase
//====================================
const SUPABASE_URL="https://ghnpiijihybuhfetnxjp.supabase.co";
const SUPABASE_KEY="sb_publishable_SEGca8-w1pAO3_TQgMd-qA_vOvkj6jq";
const supabaseClient=supabase.createClient(SUPABASE_URL,SUPABASE_KEY);

//====================================
// متغیرهای اصلی
//====================================
let students=[];
let normalizedStudents=[];
let activeCalls=[];
let recognition;
let isListening=false;
let isRestarting=false;
let restartTimer=null;
let lastRecognizedText="";
let lastCallTime=0;
let callLock=false;

//====================================
// نرمال سازی سریع متن فارسی
//====================================
function normalizeText(text){
if(!text)return"";
return text
.toString()
.trim()
.toLowerCase()
.replace(/ي/g,"ی")
.replace(/ى/g,"ی")
.replace(/ك/g,"ک")
.replace(/‌/g,"")
.replace(/\s+/g,"")
.replace(/[،,.!?]/g,"");
}

//====================================
// آماده سازی نام دانش آموزان
// فقط یک بار بعد از دریافت لیست اجرا می شود
//====================================
function prepareStudentSearch(){
normalizedStudents=students.map(student=>{
let name=student.name||student.student_name||"";
let normalized=normalizeText(name);
return{
id:student.id,
name:name,
class_name:student.class_name,
searchName:normalized,
length:normalized.length
};
});
console.log("Student search ready:",normalizedStudents.length);
}
//====================================
// Levenshtein سریع و کم مصرف
//====================================
function levenshtein(a,b){
    if(a===b)return 0;
    if(!a)return b.length;
    if(!b)return a.length;
    if(Math.abs(a.length-b.length)>5)return 99;
    let prev=[];
    let curr=[];
    for(let i=0;i<=b.length;i++)prev[i]=i;
    for(let i=1;i<=a.length;i++){
    curr[0]=i;
    for(let j=1;j<=b.length;j++){
    let cost=a[i-1]===b[j-1]?0:1;
    curr[j]=Math.min(
    curr[j-1]+1,
    prev[j]+1,
    prev[j-1]+cost
    );
    }
    let temp=prev;
    prev=curr;
    curr=temp;
    }
    return prev[b.length];
    }
    //====================================
    // درصد شباهت اسم
    //====================================
    function similarity(a,b){
    if(!a|| !b)return 0;
    if(a===b)return 100;
    let max=Math.max(a.length,b.length);
    let distance=levenshtein(a,b);
    let percent=Math.round((1-distance/max)*100);
    return percent;
    }
    //====================================
    // بررسی سریع مشابه بودن اسم
    //====================================
    function isSimilarName(input,name){
    if(!input||!name)return false;
    if(input.includes(name)||name.includes(input))return true;
    if(Math.abs(input.length-name.length)>5)return false;
    return similarity(input,name)>=85;
    }
    //====================================
// پیدا کردن یک دانش آموز
//====================================
function findStudent(text){
    let input=normalizeText(text);
    if(!input||input.length<4)return null;
    for(let student of normalizedStudents){
    if(input===student.searchName)return student;
    }
    for(let student of normalizedStudents){
    if(input.includes(student.searchName)||student.searchName.includes(input)){
    return student;
    }
    }
    let best=null;
    let bestScore=0;
    for(let student of normalizedStudents){
    if(Math.abs(input.length-student.length)>5)continue;
    let score=similarity(input,student.searchName);
    if(score>bestScore){
    bestScore=score;
    best=student;
    }
    }
    if(bestScore>=85)return best;
    return null;
    }
    //====================================
    // پیدا کردن چند دانش آموز داخل جمله
    //====================================
    function findMultipleStudents(text){
    if(!text)return[];
    let result=[];
    let original=text.split(/\s+/);
    let checked=new Set();
    for(let i=0;i<original.length;i++){
    let part="";
    for(let j=i;j<original.length&&j<i+3;j++){
    part+=original[j];
    let clean=normalizeText(part);
    if(clean.length<4)continue;
    if(checked.has(clean))continue;
    checked.add(clean);
    let student=findStudent(clean);
    if(student&&!result.find(x=>x.id===student.id)){
    result.push(student);
    }
    }
    }
    return result;
    }
    //====================================
// راه اندازی تشخیص صدا
//====================================
function initSpeech(){
    const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SpeechRecognition){
    alert("مرورگر شما از تشخیص صدا پشتیبانی نمی کند");
    return;
    }
    recognition=new SpeechRecognition();
    recognition.lang="fa-IR";
    recognition.continuous=true;
    recognition.interimResults=false;
    recognition.maxAlternatives=5;
    
    recognition.onstart=()=>{
    isListening=true;
    console.log("Microphone started");
    };
    
    recognition.onresult=(event)=>{
    let result=event.results[event.results.length-1];
    let text=result[0].transcript.trim();
    
    if(!text||text.length<4)return;
    
    console.log("Voice:",text);
    
    if(text===lastRecognizedText)return;
    
    lastRecognizedText=text;
    
    let studentsFound=findMultipleStudents(text);
    
    if(studentsFound.length){
    studentsFound.forEach(student=>{
    sendCall(student);
    });
    }
    };
    
    recognition.onerror=(event)=>{
    console.log("Speech error:",event.error);
    
    if(event.error==="not-allowed"){
    isListening=false;
    }
    };
    
    recognition.onend=()=>{
    isListening=false;
    
    if(!isRestarting){
    isRestarting=true;
    
    clearTimeout(restartTimer);
    
    restartTimer=setTimeout(()=>{
    try{
    recognition.start();
    }
    catch(e){
    console.log(e);
    }
    isRestarting=false;
    },500);
    }
    };
    
    }
    //====================================
    // شروع میکروفون
    //====================================
    function startListening(){
    if(!recognition)initSpeech();
    
    try{
    recognition.start();
    }
    catch(e){
    console.log(e);
    }
    }
    //====================================
    // توقف میکروفون
    //====================================
    function stopListening(){
    if(recognition){
    recognition.stop();
    }
    isListening=false;
    }
    //====================================
// ارسال فراخوان
//====================================
async function sendCall(student){
    if(!student)return;
    let now=Date.now();
    
    if(callLock)return;
    
    if(lastCallTime&&now-lastCallTime<1200)return;
    
    lastCallTime=now;
    callLock=true;
    
    try{
    let callData={
    student_name:student.name,
    class_name:student.class_name,
    status:"waiting"
    };
    
    let{data,error}=await supabaseClient
    .from("calls")
    .insert([callData])
    .select()
    .single();
    
    if(error){
    console.log("Call error:",error);
    return;
    }
    
    console.log("Call sent:",data);
    
    activeCalls.push(data);
    
    }
    catch(error){
    console.log(error);
    }
    finally{
    setTimeout(()=>{
    callLock=false;
    },300);
    }
    }
    //====================================
    // اضافه کردن دانش آموز به وضعیت فراخوان
    //====================================
    function setLastStudent(student){
    if(!student)return;
    
    let element=document.querySelector("#lastStudent");
    
    if(element){
    element.innerHTML=
    `${student.name} - ${student.class_name}`;
    }
    }

    //====================================
// دریافت فراخوان های جدید Realtime
//====================================
function subscribeCalls(){

    supabaseClient
    .channel("calls-realtime")
    .on(
    "postgres_changes",
    {
    event:"INSERT",
    schema:"public",
    table:"calls"
    },
    payload=>{
    
    let call=payload.new;
    
    if(!call)return;
    
    console.log("New call:",call);
    
    if(activeCalls.find(x=>x.id===call.id)){
    return;
    }
    
    activeCalls.push(call);
    
    showCall(call);
    
    }
    )
    .subscribe(status=>{
    console.log("Realtime status:",status);
    });
    
    }
    //====================================
    // نمایش فراخوان
    //====================================
    function showCall(call){
    
    let box=document.querySelector("#callsContainer");
    
    if(!box)return;
    
    let card=document.createElement("div");
    
    card.className="student-card";
    
    card.dataset.id=call.id;
    
    card.innerHTML=`
    <div class="student-name">
    ${call.student_name}
    </div>
    <div class="student-class">
    ${call.class_name}
    </div>
    `;
    
    box.prepend(card);
    
    }
    //====================================
    // حذف فراخوان از لیست داخلی
    //====================================
    function removeCall(id){
    
    activeCalls=
    activeCalls.filter(call=>call.id!==id);
    
    let card=document.querySelector(
    `.student-card[data-id="${id}"]`
    );
    
    if(card){
    card.remove();
    }
    
    }
    //====================================
// دریافت لیست دانش آموزان
//====================================
async function loadStudents(){
    try{
    let{data,error}=await supabaseClient
    .from("students")
    .select("*");
    
    console.log("DATA:",data);
    console.log("ERROR:",error);
    
    students=data||[];
    
    console.log("Students loaded:",students.length);
    
    prepareStudentSearch();
    
    }
    catch(error){
    console.log("Load students error:",error);
    }
    }
    
    //====================================
    // دریافت دانش آموزان یک کلاس
    //====================================
    function getStudentsByClass(className){
    
    return normalizedStudents.filter(
    student=>
    student.class_name===className
    );
    
    }
    
    //====================================
    // پیدا کردن کلاس دانش آموز
    //====================================
    function getClassId(className){
    
    return classMap[className]||null;
    
    }
    
    //====================================
    // شروع اولیه سیستم
    //====================================
    async function initNazem(){
    
    await loadStudents();
    
    subscribeCalls();
    
    initSpeech();
    
    console.log(
    "Nazem system ready"
    );
    
    }

    //====================================
// حذف همه فراخوان ها
//====================================
async function resetAllCalls(){

    try{
    
    let{error}=await supabaseClient
    .from("calls")
    .delete()
    .neq("id",0);
    
    if(error){
    console.log(
    "Reset error:",
    error
    );
    return;
    }
    
    activeCalls=[];
    
    let box=document.querySelector("#callsContainer");
    
    if(box){
    box.innerHTML="";
    }
    
    console.log(
    "All calls removed"
    );
    
    }
    catch(error){
    
    console.log(error);
    
    }
    
    }
    
    //====================================
    // حذف یک فراخوان
    //====================================
    async function deleteCall(id){
    
    if(!id)return;
    
    try{
    
    let{error}=await supabaseClient
    .from("calls")
    .delete()
    .eq("id",id);
    
    if(error){
    console.log(error);
    return;
    }
    
    removeCall(id);
    
    }
    catch(error){
    
    console.log(error);
    
    }
    
    }
    
    //====================================
    // صدای هشدار
    //====================================
    function playAlert(){
    
    let audio=document.querySelector("#alertSound");
    
    if(audio){
    
    audio.currentTime=0;
    audio.play();
    
    }
    
    }
    
    //====================================
    // اجرای نهایی سیستم
    //====================================
    document.addEventListener(
    "DOMContentLoaded",
    ()=>{
    
    initNazem();
    
    }
    );
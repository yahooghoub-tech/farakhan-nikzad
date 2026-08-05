//====================================
// Supabase
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



console.log(
"Supabase connected"
);




//====================================
// Vosk Variables
//====================================


let voskModel;

let recognizer;


let audioContext;

let microphoneStream;

let processor;

let audioSource;


let isListening=true;




//====================================
// DOM
//====================================


const micStatus =
document.getElementById(
"micStatus"
);


const micIcon =
document.getElementById(
"micIcon"
);


const speechText =
document.getElementById(
"speechText"
);



const resetButton =
document.getElementById(
"resetCalls"
);





//====================================
// Students
//====================================


const students=[


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
}


];
//====================================
// Load Vosk Model
//====================================


async function loadVosk(){


    try{
    
    
    micStatus.innerText =
    "⏳ در حال بارگذاری مدل صدا...";
    
    
    
    voskModel =
    await Vosk.createModel(
    "./model"
    );
    
    
    
    recognizer =
    new voskModel.KaldiRecognizer(
    16000
    );
    
    
    
    micStatus.innerText =
    "✅ مدل آماده است";
    
    
    
    startVoskMicrophone();
    
    
    
    }
    
    catch(error){
    
    
    console.error(
    "Vosk Error:",
    error
    );
    
    
    
    micStatus.innerText =
    "❌ خطا در بارگذاری Vosk";
    
    
    }
    
    
    
    }
    
    
    
    
    
    //====================================
    // Start Microphone
    //====================================
    
    
    async function startVoskMicrophone(){
    
    
    
    try{
    
    
    microphoneStream =
    await navigator.mediaDevices
    .getUserMedia({
    
    audio:{
    
    echoCancellation:true,
    
    noiseSuppression:true,
    
    autoGainControl:true
    
    }
    
    });
    
    
    
    audioContext =
    new AudioContext({
    
    sampleRate:16000
    
    });
    
    
    
    audioSource =
    audioContext
    .createMediaStreamSource(
    microphoneStream
    );
    
    
    
    processor =
    audioContext
    .createScriptProcessor(
    4096,
    1,
    1
    );
    
    
    
    audioSource.connect(
    processor
    );
    
    
    
    processor.connect(
    audioContext.destination
    );
    
    
    
    
    processor.onaudioprocess =
    (event)=>{
    
    
    if(!isListening)
    return;
    
    
    
    const audioData =
    event.inputBuffer
    .getChannelData(0);
    
    
    
    processVoskAudio(
    audioData
    );
    
    
    
    };
    
    
    
    micStatus.innerText =
    "🎤 میکروفون فعال است و Vosk در حال شنیدن است";
    
    
    
    micIcon.classList.add(
    "mic-active"
    );
    
    
    
    }
    
    
    catch(error){
    
    
    console.error(
    "Microphone Error:",
    error
    );
    
    
    
    micStatus.innerText =
    "❌ خطا در دسترسی میکروفون";
    
    
    }
    
    
    
    }
    
    
    
    
    
    //====================================
    // Send Audio To Vosk
    //====================================
    
    
    function processVoskAudio(data){
    
    
    
    if(!recognizer)
    return;
    
    
    
    const result =
    recognizer.acceptWaveform(
    data
    );
    
    
    
    if(result){
    
    
    
    const output =
    JSON.parse(
    recognizer.result()
    );
    
    
    
    if(output.text){
    
    
    
    let text =
    output.text;
    
    
    
    speechText.innerText =
    text;
    
    
    
    console.log(
    "Vosk:",
    text
    );
    
    
    
    findMultipleStudents(
    text
    );
    
    
    
    }
    
    
    }
    
    
    
    }
    
    
    
    
    
    loadVosk();
    //====================================
// Normalize Text
//====================================


function normalizeText(text){


    return text
    
    .replace(/ي/g,"ی")
    
    .replace(/ك/g,"ک")
    
    .replace(/\s+/g," ")
    
    .trim();
    
    
    }
    
    
    
    
    
    //====================================
    // Similarity
    //====================================
    
    
    function similarity(a,b){
    
    
    a =
    normalizeText(a);
    
    
    b =
    normalizeText(b);
    
    
    
    let longer =
    a.length>b.length ? a:b;
    
    
    
    let shorter =
    a.length>b.length ? b:a;
    
    
    
    let distance=0;
    
    
    
    for(
    let i=0;
    i<shorter.length;
    i++
    ){
    
    
    if(shorter[i]!==longer[i]){
    
    
    distance++;
    
    
    }
    
    
    }
    
    
    
    return 1 -
    (distance / longer.length);
    
    
    
    }
    
    
    
    
    
    
    //====================================
    // Find Student
    //====================================
    
    
    function findMultipleStudents(text){
    
    
    text =
    normalizeText(text);
    
    
    
    let bestStudent=null;
    
    
    let bestScore=0;
    
    
    
    students.forEach(student=>{
    
    
    let score =
    similarity(
    text,
    student.name
    );
    
    
    
    if(score>bestScore){
    
    
    bestScore=score;
    
    
    bestStudent=student;
    
    
    }
    
    
    
    });
    
    
    
    
    
    if(
    
    bestStudent &&
    
    bestScore>0.80 &&
    
    text.length >=
    bestStudent.name.length-2
    
    ){
    
    
    
    console.log(
    
    "دانش آموز پیدا شد:",
    
    bestStudent,
    
    bestScore
    
    );
    
    
    
    
    setTimeout(()=>{
    
    
    sendTeacherMessage(
    bestStudent
    );
    
    
    
    },1500);
    
    
    
    
    }
    
    
    
    }
    
    
    
    
    
    //====================================
    // Send Teacher Message
    //====================================
    
    
    async function sendTeacherMessage(student){
    
    
    
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
    checkError
    );
    
    
    return;
    
    
    }
    
    
    
    
    if(exist.length>0){
    
    
    
    console.log(
    "این دانش آموز قبلا فراخوان شده"
    );
    
    
    
    return;
    
    
    }
    
    
    
    
    
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
    
    "فراخوان ثبت شد:",
    
    data
    
    );
    
    
    
    }
    //====================================
// Add Student Card
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
    
    
    
    if(!classBox)
    return;
    
    
    
    const oldCard =
    document.querySelector(
    `.student-card[data-id="${student.id}"]`
    );
    
    
    
    if(oldCard)
    return;
    
    
    
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
    // Status Class
    //====================================
    
    
    function getStatusClass(status){
    
    
    if(status==="فراخوان شد")
    return "status-called";
    
    
    if(status==="دریافت فراخوان")
    return "status-received";
    
    
    if(status==="ارسال شد")
    return "status-sent";
    
    
    return "";
    
    }
    
    
    
    
    
    
    //====================================
    // Update Card
    //====================================
    
    
    function updateNazemCard(call){
    
    
    
    const card =
    document.querySelector(
    `.student-card[data-id="${call.id}"]`
    );
    
    
    
    if(!card)
    return;
    
    
    
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
    // Load Calls
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
    "خطا در دریافت فراخوان‌ها:",
    error
    );
    
    
    return;
    
    
    }
    
    
    
    data.forEach(call=>{
    
    
    const student={
    
    
    id:call.id,
    
    
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
    // Realtime Update
    //====================================
    
    
    supabaseClient
    
    .channel("nazem-status-update")
    
    .on(
    
    "postgres_changes",
    
    {
    
    event:"UPDATE",
    
    schema:"public",
    
    table:"calls"
    
    },
    
    payload=>{
    
    
    updateNazemCard(
    payload.new
    );
    
    
    }
    
    )
    
    .subscribe();
    
    
    
    
    
    //====================================
    // Realtime New Call
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
    
    payload=>{
    
    
    const student={
    
    
    id:payload.new.id,
    
    
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
    payload.new.called_time
    
    
    };
    
    
    
    addStudentToClass(student);
    
    
    
    }
    
    )
    
    .subscribe();
    
    
    
    
    
    //====================================
    // Reset Calls
    //====================================
    
    
    resetButton.addEventListener(
    
    "click",
    
    async()=>{
    
    
    const confirmReset =
    confirm(
    "تمام فراخوان‌ها پاک شوند؟"
    );
    
    
    
    if(!confirmReset)
    return;
    
    
    
    const {error}=
    
    await supabaseClient
    
    .from("calls")
    
    .delete()
    
    .gte(
    "id",
    0
    );
    
    
    
    if(error){
    
    
    console.error(error);
    
    return;
    
    
    }
    
    
    
    document
    
    .querySelectorAll(
    ".students-list"
    )
    
    .forEach(box=>{
    
    
    box.innerHTML="";
    
    
    });
    
    
    
    speechText.innerText =
    
    "منتظر شنیدن نام دانش‌آموز...";
    
    
    
    micStatus.innerText =
    
    "🎤 Vosk فعال است و در حال شنیدن...";
    
    
    
    }
    
    );
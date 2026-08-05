const SUPABASE_URL="https://ghnpiijihybuhfetnxjp.supabase.co";
const SUPABASE_KEY="sb_publishable_SEGca8-w1pAO3_TQgMd-qA_vOvkj6jq";

const supabaseClient=supabase.createClient(
SUPABASE_URL,
SUPABASE_KEY
);


console.log("Supabase connected");


let recognition;
let isListening=true;


const micStatus=document.getElementById("micStatus");
const micIcon=document.getElementById("micIcon");
const speechText=document.getElementById("speechText");


const resetButton=
document.getElementById("resetCalls");



const students=[

{name:"علی احمدی",className:"ششم-1"},
{name:"رضا محمدی",className:"پنجم-2"},
{name:"محمد رضایی",className:"سوم-1"},
{name:"امیر حسینی",className:"اول-2"}

];



if("webkitSpeechRecognition" in window){


recognition=new webkitSpeechRecognition();


recognition.lang="fa-IR";

recognition.continuous=true;

recognition.interimResults=true;



recognition.onstart=function(){

micStatus.innerText=
"میکروفون فعال است و در حال شنیدن...";


micIcon.classList.add(
"mic-active"
);

};



recognition.onerror=function(){

micStatus.innerText=
"خطا در میکروفون - تلاش مجدد";


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
recognition.onresult=function(event){

    let text="";
    
    
    for(
    let i=event.resultIndex;
    i<event.results.length;
    i++
    ){
    
    text+=event.results[i][0].transcript;
    
    }
    
    
    
    speechText.innerText=text;
    
    
    
    findMultipleStudents(text);
    
    
    
    };
    
    
    
    function findMultipleStudents(text){
    
    
    students.forEach(student=>{
    
    
    if(text.includes(student.name)){
    
    
    sendTeacherMessage(student);
    
    
    }
    
    
    });
    
    
    }
    
    
    
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
    
    
    
    
    const {data,error}=
    
    await supabaseClient
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
    
    
    return;
    
    
    }
    
    
    
    console.log(
    "فراخوان ثبت شد:",
    data
    );
    
    
    
    }
    function addStudentToClass(student){


        const classBox=
        document.getElementById(
        "class-"+student.className
        );
        
        
        
        const countBox=
        document.getElementById(
        "count-"+student.className
        );
        
        
        
        if(!classBox){
        
        return;
        
        }
        
        
        
        
        const oldCard=
        document.querySelector(
        `.student-card[data-id="${student.id}"]`
        );
        
        
        
        if(oldCard){
        
        return;
        
        }
        
        
        
        
        const card=document.createElement("div");
        
        
        card.className=
        "student-card";
        
        
        card.dataset.id=
        student.id;
        
        
        
        card.innerHTML=`
        
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
        
        countBox.innerText=
        classBox.children.length;
        
        }
        
        
        }
        
        
        
        
        
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
        
        
        
        
        
        
        function updateNazemCard(call){
        
        
        
        const card=
        document.querySelector(
        `.student-card[data-id="${call.id}"]`
        );
        
        
        
        if(!card){
        
        return;
        
        }
        
        
        
        
        const status=
        card.querySelector(
        ".student-status"
        );
        
        
        
        if(status){
        
        
        status.innerText=
        call.status;
        
        
        
        status.className=
        "student-status "+
        getStatusClass(
        call.status
        );
        
        
        }
        
        
        
        
        const time=
        card.querySelector(
        ".student-time"
        );
        
        
        
        if(time){
        
        
        time.innerHTML=`
        
        ⏰ ${call.called_time || ""}
        
        <br>
        
        📥 ${call.received_time || ""}
        
        <br>
        
        📤 ${call.sent_time || ""}
        
        `;
        
        }
        
        
        
        }
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
                    
                    
                    name:call.student_name,
                    
                    
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
            
            
            
            addStudentToClass(student);
            
            
            
            });
            
            
            
            }
            
            
            
            
            loadCalls();
            
            
            
            
            
            
            // Realtime تغییر وضعیت توسط معلم
            
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
            
            
            console.log(
            "تغییر وضعیت دریافت شد:",
            payload.new
            );
            
            
            
            updateNazemCard(
            payload.new
            );
            
            
            
            }
            )
            .subscribe(
            (status)=>{
            
            
            console.log(
            "Nazem Realtime:",
            status
            );
            
            
            });

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


console.log(
"فراخوان جدید ثبت شد:",
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


status:
payload.new.status,


called_date:
payload.new.called_date,


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
.subscribe(
(status)=>{


console.log(
"Nazem INSERT Realtime:",
status
);


});

            resetButton.addEventListener(
                "click",
                async function(){
                
                
                const confirmReset=
                confirm(
                "تمام فراخوان‌ها پاک شوند؟"
                );
                
                
                
                if(!confirmReset){
                
                return;
                
                }
                
                
                
                
                const {error}=
                
                await supabaseClient
                .from("calls")
                .delete()
                .gte(
                "id",
                0
                );
                
                
                
                
                if(error){
                
                
                console.error(
                "خطا در حذف فراخوان‌ها:",
                error
                );
                
                
                return;
                
                }
                
                
                
                
                document
                .querySelectorAll(
                ".students-list"
                )
                .forEach(
                box=>{
                
                
                box.innerHTML="";
                
                
                }
                );
                
                
                
                
                
                document
                .querySelectorAll(
                ".class-header span"
                )
                .forEach(
                count=>{
                
                
                count.innerText="0";
                
                
                }
                );
                
                
                
                
                
                speechText.innerText=
                "منتظر شنیدن نام دانش‌آموز...";
                
                
                
                micStatus.innerText=
                "میکروفون فعال است و در حال شنیدن...";
                
                
                
                console.log(
                "تمام فراخوان‌ها از دیتابیس حذف شدند"
                );
                
                
                
                });
                
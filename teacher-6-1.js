const SUPABASE_URL="https://ghnpiijihybuhfetnxjp.supabase.co";

const SUPABASE_KEY="sb_publishable_SEGca8-w1pAO3_TQgMd-qA_vOvkj6jq";
const supabaseClient=supabase.createClient(
SUPABASE_URL,
SUPABASE_KEY
);


const teacherClass="ششم-1";


const studentsList=
document.getElementById("studentsList");


const resetButton=
document.getElementById("resetTeacherCalls");


console.log(
"پنل معلم ششم 1 متصل شد"
);
async function loadTeacherCalls(){

    const {data,error}=await supabaseClient
    .from("calls")
    .select("*")
    .eq("class_name",teacherClass)
    .order("id",{ascending:true});
    
    
    if(error){
    
    console.error(
    "خطا در دریافت فراخوان‌ها:",
    error
    );
    
    return;
    
    }
    
    
    
    if(data.length===0){
    
    studentsList.innerHTML=
    `
    <div class="empty-box">
    هنوز فراخوانی ثبت نشده است
    </div>
    `;
    
    return;
    
    }
    
    
    
    studentsList.innerHTML="";
    
    
    data.forEach(call=>{
    
    
    createStudentCard(call);
    
    
    });
    
    
    }
    
    
    
    loadTeacherCalls();
    function createStudentCard(call){


        const card=document.createElement("div");
        
        card.className="student-card";
        
        
        card.dataset.id=call.id;
        
        
        
        card.innerHTML=`
        
        <div class="student-row">
        
        <div class="student-name">
        ${call.student_name}
        </div>
        
        
        <div class="student-status ${getStatusClass(call.status)}">
        ${call.status}
        </div>
        
        
        <div class="student-time">
        ${getTimes(call)}
        </div>
        
        </div>
        
        
        <div class="action-buttons">
        
        <button class="receive-btn">
        دریافت فراخوان
        </button>
        
        
        <button class="send-btn">
        ارسال دانش‌آموز
        </button>
        
        </div>
        
        `;
        
        
        
        const receiveButton=
        card.querySelector(".receive-btn");
        
        
        const sendButton=
        card.querySelector(".send-btn");
        
        
        
        receiveButton.onclick=function(){
        
        updateCallStatus(
        call.id,
        "دریافت فراخوان"
        );
        
        };
        
        
        
        sendButton.onclick=function(){
        
        updateCallStatus(
        call.id,
        "ارسال شد"
        );
        
        };
        
        
        
        studentsList.appendChild(card);
        
        
        }
        async function updateCallStatus(id,newStatus){


            const now=
            new Date().toLocaleTimeString(
            "fa-IR",
            {
            hour:"2-digit",
            minute:"2-digit",
            second:"2-digit"
            }
            );
            
            
            
            let updateData={
            status:newStatus
            };
            
            
            
            if(newStatus==="دریافت فراخوان"){
            
            updateData.received_time=now;
            
            }
            
            
            
            if(newStatus==="ارسال شد"){
            
            updateData.sent_time=now;
            
            }
            
            
            
            const {error}=await supabaseClient
            .from("calls")
            .update(updateData)
            .eq("id",id);
            
            
            
            if(error){
            
            console.error(
            "خطا در تغییر وضعیت:",
            error
            );
            
            return;
            
            }
            
            
            
            console.log(
            "وضعیت تغییر کرد:",
            newStatus
            );
            
            
            
            loadTeacherCalls();
            
            
            }
            supabaseClient
.channel("teacher-calls")
.on(
"postgres_changes",
{
event:"INSERT",
schema:"public",
table:"calls",
filter:`class_name=eq.${teacherClass}`
},
payload=>{


console.log(
"فراخوان جدید:",
payload.new
);


createStudentCard(
payload.new
);


}
)
.subscribe((status)=>{

    console.log(
    "Realtime Status:",
    status
    );
    
    });
resetButton.addEventListener(
    "click",
    async function(){
    
    
    const confirmReset=
    confirm(
    "تمام فراخوان‌های کلاس ششم 1 پاک شوند؟"
    );
    
    
    if(!confirmReset){
    
    return;
    
    }
    
    
    
    const {error}=await supabaseClient
    .from("calls")
    .delete()
    .eq("class_name",teacherClass);
    
    
    
    if(error){
    
    console.error(
    "خطا در حذف فراخوان‌ها:",
    error
    );
    
    return;
    
    }
    
    
    
    studentsList.innerHTML=
    `
    <div class="empty-box">
    هنوز فراخوانی ثبت نشده است
    </div>
    `;
    
    
    
    console.log(
    "فراخوان‌های کلاس ششم 1 حذف شدند"
    );
    
    
    });
    function getTimes(call){

        let html="";
        
        
        if(call.called_time){
        
        html+=`
        <div>
        ⏰ فراخوان:
        ${call.called_time}
        </div>
        `;
        
        }
        
        
        if(call.received_time){
        
        html+=`
        <div>
        📥 دریافت:
        ${call.received_time}
        </div>
        `;
        
        }
        
        
        if(call.sent_time){
        
        html+=
        `
        <div>
        📤 ارسال:
        ${call.sent_time}
        </div>
        `;
        
        }
        
        
        return html;
        
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
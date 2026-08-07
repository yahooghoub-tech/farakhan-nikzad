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
    
    
    // لیست دانش‌آموزان کلاس سوم-1


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
    {name:"آریا نعمتی",className:"سوم-1"},
    
    // ==========================
// دانش‌آموزان کلاس سوم-2
// ==========================

    {name:"مهرسام اسدرخت",className:"سوم-2"},
    {name:"آریا اسماعیلی",className:"سوم-2"},
    {name:"امیرعلی اکبرآبادی",className:"سوم-2"},
    {name:"دانیال اکبری مهر",className:"سوم-2"},
    {name:"سید محمدامیر انوری",className:"سوم-2"},
    {name:"جانیار ایرجی",className:"سوم-2"},
    {name:"ایلیا آغباشلو",className:"سوم-2"},
    {name:"پندار خوش طینتان",className:"سوم-2"},
    {name:"آروین سوری",className:"سوم-2"},
    {name:"آبهان شهرتی",className:"سوم-2"},
    {name:"رادین طلایی پناه",className:"سوم-2"},
    {name:"آرمان عبدی",className:"سوم-2"},
    {name:"سامیار عزیزی مقدم",className:"سوم-2"},
    {name:"رادین فرشچین",className:"سوم-2"},
    {name:"ایلیا قاسمی",className:"سوم-2"},
    {name:"محمد مهدی کاظمی",className:"سوم-2"},
    {name:"پویا کرمی",className:"سوم-2"},
    {name:"نیکان گنجه",className:"سوم-2"},
    {name:"حسین محمدی مهر",className:"سوم-2"},
    {name:"ویهان منصوری",className:"سوم-2"},
    {name:"میثم نظری",className:"سوم-2"},

    // ==========================
// دانش‌آموزان کلاس اول-1
// ==========================
    {name:"آرسام ابهری",className:"اول-1"},
    {name:"هومان باوی",className:"اول-1"},
    {name:"سامراد دمیرچلی",className:"اول-1"},
    {name:"آرش عبدی",className:"اول-1"},
    {name:"میلان غلامی آبادانی",className:"اول-1"},
    {name:"آیهان قاسمی",className:"اول-1"},
    {name:"ویهان کاملی",className:"اول-1"},
    {name:"رایان محرابی",className:"اول-1"},
    {name:"آرشا محمودی",className:"اول-1"},
    {name:"رایان مقدم",className:"اول-1"},
    {name:"سبدصدرا منصورزاده",className:"اول-1"},
    {name:"جاوید نصرالهی",className:"اول-1"},
    
    // ==========================
// دانش‌آموزان کلاس چهارم-1
// ==========================

    {name:"محمدطاها احمدی",className:"چهارم-1"},
    {name:"آریا آزاد پیما",className:"چهارم-1"},
    {name:"رادمهر بشیری",className:"چهارم-1"},
    {name:"مهراد بیاتی",className:"چهارم-1"},
    {name:"پوریا توکلیان",className:"چهارم-1"},
    {name:"رادین حسنی",className:"چهارم-1"},
    {name:"اوتانا درویشی",className:"چهارم-1"},
    {name:"امیرعباس دهقان",className:"چهارم-1"},
    {name:"سام زندمقدم",className:"چهارم-1"},
    {name:"مهراد سفارزاد",className:"چهارم-1"},
    {name:"نویان علیشاهی",className:"چهارم-1"},
    {name:"مهراد عموحسن",className:"چهارم-1"},
    {name:"کوروش قاسمی",className:"چهارم-1"},
    {name:"محمدحسین قرابیگلو",className:"چهارم-1"},
    {name:"رهام لطفی",className:"چهارم-1"},
    {name:"امیرعلی ناعمی",className:"چهارم-1"},
    
    // ==========================
// دانش‌آموزان کلاس اول-2
// ==========================
    {name:"یونا ایازیان",className:"اول-2"},
    {name:"علی اینانلو گنجی",className:"اول-2"},
    {name:"رادوین برادری هم پا",className:"اول-2"},
    {name:"مانیاد رسام",className:"اول-2"},
    {name:"امیرعلی صفاوردی",className:"اول-2"},
    {name:"آروین عباسی",className:"اول-2"},
    {name:"شاهان فراهانی",className:"اول-2"},
    {name:"حسین فخیمی شایسته",className:"اول-2"},
    {name:"صدرا قنبری",className:"اول-2"},
    {name:"رادمهر کارشناس",className:"اول-2"},
    {name:"رادمان نادمی",className:"اول-2"},
    {name:"کسری نعمت زاده",className:"اول-2"},
    {name:"نامی هاشمی",className:"اول-2"},
    
    // ==========================
// دانش‌آموزان کلاس پنجم-3
// ==========================


    {name:"آراد احمدیان",className:"پنجم-3"},
    {name:"رادین امیری",className:"پنجم-3"},
    {name:"آران جهانبانی",className:"پنجم-3"},
    {name:"آوش حسینبکی",className:"پنجم-3"},
    {name:"علی خادم",className:"پنجم-3"},
    {name:"ماهان دیلمقانی زاده",className:"پنجم-3"},
    {name:"سپهر رجاء",className:"پنجم-3"},
    {name:"آرسیین رضایی",className:"پنجم-3"},
    {name:"آرسیس رضایی",className:"پنجم-3"},
    {name:"همایون رفیعی",className:"پنجم-3"},
    {name:"میعاد زمانی",className:"پنجم-3"},
    {name:"راستین زهدی",className:"پنجم-3"},
    {name:"مهبد شکری",className:"پنجم-3"},
    {name:"آرتا شیرازی",className:"پنجم-3"},
    {name:"محمدامین صیادنورد",className:"پنجم-3"},
    {name:"بردیا ضیایی",className:"پنجم-3"},
    {name:"سید آیین عظیمی",className:"پنجم-3"},
    {name:"مهرسام علیزاده",className:"پنجم-3"},
    {name:"بردیا قلعه گلاب",className:"پنجم-3"},
    {name:"رادمان مرسلی",className:"پنجم-3"},
    {name:"آریا میرزاده",className:"پنجم-3"},
    {name:"هومان نصرتی",className:"پنجم-3"},
    {name:"رادمان نوروزی",className:"پنجم-3"},
    {name:"محمدرضا یارلو",className:"پنجم-3"},
    
    // ==========================
// دانش‌آموزان کلاس چهارم-3
// ==========================
    {name:"آرسام حسینی",className:"چهارم-3"},
    {name:"لیام رحمانی",className:"چهارم-3"},
    {name:"ایلیا سبزپوش",className:"چهارم-3"},
    {name:"ماهان سمنارشاد",className:"چهارم-3"},
    {name:"آروین عابدی",className:"چهارم-3"},
    {name:"ایلیا عرشی",className:"چهارم-3"},
    {name:"آراد عطاییان",className:"چهارم-3"},
    {name:"آرتین علمی",className:"چهارم-3"},
    {name:"مهرسام غضنفری",className:"چهارم-3"},
    {name:"نیکان فرجی",className:"چهارم-3"},
    {name:"دانیال کشاورز",className:"چهارم-3"},
    {name:"کارن کوهی",className:"چهارم-3"},
    {name:"علی گرجایی",className:"چهارم-3"},
    {name:"رایان مننظری",className:"چهارم-3"},
    {name:"آرین نیک پی",className:"چهارم-3"},
    {name:"ویهان وهابی",className:"چهارم-3"},
    
    // ==========================
// دانش‌آموزان کلاس چهارم-2
// ==========================

    {name:"سید محمد اجاقی",className:"چهارم-2"},
    {name:"امیرمحمد امانی",className:"چهارم-2"},
    {name:"کارن امانی",className:"چهارم-2"},
    {name:"بنیامین حسین زاده",className:"چهارم-2"},
    {name:"سید سینا حسینی",className:"چهارم-2"},
    {name:"مبین دمرچلی",className:"چهارم-2"},
    {name:"سپهر ذوالفقاری",className:"چهارم-2"},
    {name:"علیسام رمضانی",className:"چهارم-2"},
    {name:"کیان علیا",className:"چهارم-2"},
    {name:"آرتین کوچاری",className:"چهارم-2"},
    {name:"سام لوحی خسروشاهی",className:"چهارم-2"},
    {name:"برکان محمدخانی",className:"چهارم-2"},
    {name:"مهراد منصفی",className:"چهارم-2"},
    {name:"سورنا منصوری",className:"چهارم-2"},
    {name:"ارسام مهری نژاد",className:"چهارم-2"},
    
    // ==========================
// دانش‌آموزان کلاس سوم-3
// =========================
    {name:"فرهام احمدی نژاد",className:"سوم-3"},
    {name:"آرشا تابع",className:"سوم-3"},
    {name:"نیکان تورجی",className:"سوم-3"},
    {name:"پارسا تهامی پور",className:"سوم-3"},
    {name:"حافظ جعفربیگی",className:"سوم-3"},
    {name:"رادوین دزیانی",className:"سوم-3"},
    {name:"نویان رنجبر",className:"سوم-3"},
    {name:"مهدیار رهبر",className:"سوم-3"},
    {name:"رادمان سلیمانیه",className:"سوم-3"},
    {name:"کیان سهرابی",className:"سوم-3"},
    {name:"شایان شاوردین",className:"سوم-3"},
    {name:"آرشا طیبی",className:"سوم-3"},
    {name:"امیرپارسا عباسی",className:"سوم-3"},
    {name:"ارس علوی",className:"سوم-3"},
    {name:"فرهام فرقانی",className:"سوم-3"},
    {name:"آریانمهر محمداکبری",className:"سوم-3"},
    {name:"کیاراد مرادی",className:"سوم-3"},
    {name:"بردیا میرشفیعی",className:"سوم-3"},
    // ==========================
// دانش‌آموزان کلاس اول-3
// ==========================

    {name:"مهربد بلند همت",className:"اول-3"},
    {name:"آدار جهانبانی",className:"اول-3"},
    {name:"علیسان جهانی",className:"اول-3"},
    {name:"سامیار سلیمی",className:"اول-3"},
    {name:"لیام شریفی",className:"اول-3"},
    {name:"آرشا شریفی",className:"اول-3"},
    {name:"عرفان علیزاده",className:"اول-3"},
    {name:"رادین عموحسن",className:"اول-3"},
    {name:"سپهراد مرادی",className:"اول-3"},
    {name:"آدرین نجارزاده",className:"اول-3"},
    {name:"کیاراد هوشی",className:"اول-3"},
    {name:"یزدان یوسفی",className:"اول-3"},
    
    // ==========================
// دانش‌آموزان کلاس دوم-2
// ==========================
    {name:"دیان احمدی",className:"دوم-2"},
    {name:"رایبد آتش بهار",className:"دوم-2"},
    {name:"آرمان تقی ماهانی",className:"دوم-2"},
    {name:"مهرسام جلائیان",className:"دوم-2"},
    {name:"مهدیار حسنی",className:"دوم-2"},
    {name:"مانی حسینی",className:"دوم-2"},
    {name:"آروین خانی",className:"دوم-2"},
    {name:"رایان خمسه",className:"دوم-2"},
    {name:"آرتا خدابنده",className:"دوم-2"},
    {name:"کوروش درگاهی",className:"دوم-2"},
    {name:"رادین سعیدی",className:"دوم-2"},
    {name:"رهام سلطانزاده",className:"دوم-2"},
    {name:"پرهام صادقی",className:"دوم-2"},
    {name:"آرتین طاهری مقدم",className:"دوم-2"},
    {name:"آبتین عابدی",className:"دوم-2"},
    {name:"آیریک عباسی",className:"دوم-2"},
    {name:"محمدامین قدرتی",className:"دوم-2"},
    {name:"باربد قصابی",className:"دوم-2"},
    {name:"مانی کریمی",className:"دوم-2"},
    {name:"وبهان کمالپور",className:"دوم-2"},
    {name:"رهام منصوری",className:"دوم-2"},
    {name:"محمد پارسا نبوی زاده",className:"دوم-2"},
    {name:"رادین هادیان",className:"دوم-2"},
    // ==========================
// دانش‌آموزان کلاس دوم-1
// ==========================

    {name:"رادمان احمدی طباطبایی",className:"دوم-1"},
    {name:"آراد بزرگی",className:"دوم-1"},
    {name:"آراد ثبوتی",className:"دوم-1"},
    {name:"رادمان حیدری",className:"دوم-1"},
    {name:"شنتیا درویشی",className:"دوم-1"},
    {name:"امیررضا دوادانگه",className:"دوم-1"},
    {name:"رایان رادمنش",className:"دوم-1"},
    {name:"رامان رحیمی",className:"دوم-1"},
    {name:"رهام صناعت گر",className:"دوم-1"},
    {name:"سامیار طاهرزاده",className:"دوم-1"},
    {name:"شاهان علی آبادی",className:"دوم-1"},
    {name:"بردیا فاضل",className:"دوم-1"},
    {name:"یونا فیض دار",className:"دوم-1"},
    {name:"آرتا قلخانی",className:"دوم-1"},
    {name:"نیما کاکاسلطانی",className:"دوم-1"},
    {name:"ویهان لک",className:"دوم-1"},
    {name:"ارسلان معینی",className:"دوم-1"},
    {name:"ماهور منصوری",className:"دوم-1"},
    {name:"نیهاد نجاری",className:"دوم-1"},
    {name:"یونا هاتف",className:"دوم-1"},
    
    // ==========================
// دانش‌آموزان کلاس ششم-2
// ==========================
   {name:"فرهاد احمدی نژاد",className:"ششم-2"},
    {name:"روهان حیدری",className:"ششم-2"},
    {name:"دانیال زارع قمشه",className:"ششم-2"},
    {name:"ماهان زند",className:"ششم-2"},
    {name:"آدرین سعیدی",className:"ششم-2"},
    {name:"محمدعلی شهبازی",className:"ششم-2"},
    {name:"متین عباسی",className:"ششم-2"},
    {name:"لرستانی عماد",className:"ششم-2"},
    {name:"آرشام عمرانی",className:"ششم-2"},
    {name:"رادین فروغی",className:"ششم-2"},
    {name:"پدرام قربانی",className:"ششم-2"},
    {name:"آرکا کامیار",className:"ششم-2"},
    {name:"رایان کلانتری",className:"ششم-2"},
    {name:"دانا کاظمی",className:"ششم-2"},
    {name:"عرفان مقدم لو",className:"ششم-2"},
    {name:"ماهان مجیدی",className:"ششم-2"},
    {name:"حسام مظلومی نیا",className:"ششم-2"},
    {name:"آدرین مهدی زاده",className:"ششم-2"},
    {name:"سپنتا محبی",className:"ششم-2"},
    {name:"فراز نعمت طلب",className:"ششم-2"},
    {name:"امیرحسین وقار",className:"ششم-2"},
    
    // ==========================
// دانش‌آموزان کلاس پنجم-1
// ==========================


    {name:"محمدمهدی ابیض",className:"پنجم-1"},
    {name:"ماهان اجتهادی",className:"پنجم-1"},
    {name:"سامیار اسکندری",className:"پنجم-1"},
    {name:"آرشا افتخاری",className:"پنجم-1"},
    {name:"کارن آتش بهار",className:"پنجم-1"},
    {name:"شهراد چم",className:"پنجم-1"},
    {name:"مهراد حسینی",className:"پنجم-1"},
    {name:"رهام روشنی صبح",className:"پنجم-1"},
    {name:"پارسا سعیدی نیا",className:"پنجم-1"},
    {name:"مهراد سفیدگران",className:"پنجم-1"},
    {name:"محمد سیف الهی",className:"پنجم-1"},
    {name:"سروش شمسیان",className:"پنجم-1"},
    {name:"آتیلا صفری",className:"پنجم-1"},
    {name:"رادین عباسی",className:"پنجم-1"},
    {name:"آرشام فتحی زاده",className:"پنجم-1"},
    {name:"آرسام کاظمی",className:"پنجم-1"},
    {name:"امیرعلی کریمی راد",className:"پنجم-1"},
    {name:"محمد کهتری",className:"پنجم-1"},
    {name:"ماهان مختاری",className:"پنجم-1"},
    {name:"آرشین مقدسی",className:"پنجم-1"},
    {name:"امیرمهدی میرزاآقایی",className:"پنجم-1"},
    {name:"فربد ناطقی",className:"پنجم-1"},
    {name:"کارن نعمتی",className:"پنجم-1"},
    {name:"فرهام هاشمی",className:"پنجم-1"},
    {name:"یاسین یوسفی",className:"پنجم-1"},
    // ==========================
// دانش‌آموزان کلاس پنجم-2
// ==========================
    {name:"کیان امامقلی",className:"پنجم-2"},
    {name:"مهراد امانی پور",className:"پنجم-2"},
    {name:"هیوا بهرامی",className:"پنجم-2"},
    {name:"اهورا تاتلاری",className:"پنجم-2"},
    {name:"کیان چابکی",className:"پنجم-2"},
    {name:"آرتین خدمتلو",className:"پنجم-2"},
    {name:"ویهان داداشعلی",className:"پنجم-2"},
    {name:"ماجد رسولی",className:"پنجم-2"},
    {name:"طاها زرگر",className:"پنجم-2"},
    {name:"ایلیا عباسی",className:"پنجم-2"},
    {name:"یزدان عبدالهی",className:"پنجم-2"},
    {name:"مهرسام علایی",className:"پنجم-2"},
    {name:"آرن فلاح",className:"پنجم-2"},
    {name:"مهراد فلاحتی",className:"پنجم-2"},
    {name:"امیرحافظ قمی",className:"پنجم-2"},
    {name:"امیرعلی کازرانی",className:"پنجم-2"},
    {name:"کیاراد کاظمی",className:"پنجم-2"},
    {name:"یاسان لشگری نژاد",className:"پنجم-2"},
    {name:"آریا لطیفی",className:"پنجم-2"},
    {name:"برسام محمداسماعیل",className:"پنجم-2"},
    {name:"سامیار مرادی",className:"پنجم-2"},
    {name:"سورنا مرادی",className:"پنجم-2"},
    {name:"یاسین مولایی",className:"پنجم-2"},
    {name:"محمد صدرا میرصادقی",className:"پنجم-2"},
    {name:"رادین یاهو",className:"پنجم-2"}
    
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
    
    
  // این تابع متن گفته شده توسط ناظم را با اسامی دانش آموزان مقایسه می‌کند
function findMultipleStudents(text){


    // متن گفته شده توسط میکروفون را فقط برای مقایسه آماده می‌کنیم
    // خود متن اصلی تغییر نمی‌کند
    let cleanText = normalizeText(text);



    // تمام دانش آموزان را بررسی می‌کنیم
    students.forEach(student=>{


        // اسم دانش آموز داخل لیست را هم برای مقایسه آماده می‌کنیم
        let cleanName = normalizeText(student.name);



        // اگر بعد از حذف فاصله‌ها دو متن یکی بودند
        // یعنی همان دانش آموز گفته شده است
        if(cleanText.includes(cleanName)){


            // ارسال فراخوان
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
.channel("nazem-delete-update")
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



})
.subscribe(
(status)=>{


console.log(
"Nazem Delete Realtime:",
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
                
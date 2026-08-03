/*========================================
School Call
Admin Panel - App Controller
========================================*/


// وقتی صفحه کاملاً آماده شد

document.addEventListener("DOMContentLoaded",()=>{


    console.log("سامانه فراخوان دانش آموز آماده شد");


    // راه اندازی ساعت
    if(typeof startClock === "function"){
        startClock();
    }


    // نمایش اولیه دانش آموزان
    if(typeof loadStudents === "function"){
        loadStudents();
    }


    // آماده سازی جستجو
    if(typeof initSearch === "function"){
        initSearch();
    }


    // آماده سازی میکروفون
    if(typeof initSpeech === "function"){
        initSpeech();
    }


    // آماده سازی دکمه فراخوان
    if(typeof initCallSystem === "function"){
        initCallSystem();
    }


    // بارگذاری فراخوان‌های فعال
    if(typeof loadWaitingCalls === "function"){
        loadWaitingCalls();
    }


});
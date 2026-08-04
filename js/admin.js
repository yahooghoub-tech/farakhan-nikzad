document.addEventListener("DOMContentLoaded", () => {


    fetch("/api/get-students")
    
    .then(res => res.json())
    
    .then(students => {
    
    
        console.log(students);
    
    
    
        students.forEach(student => {
    
    
            // تبدیل نام کلاس برای پیدا کردن کارت
            let className = student.class_name
            .replace(" ", "-")
            .replace("اول","1")
            .replace("دوم","2")
            .replace("سوم","3")
            .replace("چهارم","4")
            .replace("پنجم","5")
            .replace("ششم","6");
    
    
    
            let classBox = document.querySelector(
                "#class-" + className
            );
    
    
    
            if(classBox){
    
    
                let list = classBox.querySelector(".student-list");
    
    
                // حذف متن اولیه
                list.classList.remove("empty");
    
    
                list.innerHTML += `
    
                <div class="student">
                    ${student.name}
                </div>
    
                `;
    
    
            }
    
    
        });
    
    
    })
    
    
    .catch(error => {
    
    console.log(
    "خطا در دریافت دانش‌آموزان:",
    error
    );
    
    });
    
    
    });
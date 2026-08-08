self.addEventListener("push", function(event) {

    console.log("Push دریافت شد");

    let data = {};

    try {

        if (event.data) {

            try {

                data = event.data.json();

            } catch (error) {

                data = {
                    title: "🔔 فراخوان دانش‌آموز",
                    body: event.data.text()
                };

            }

        }

    } catch (error) {

        console.error(
            "خطا در خواندن Push:",
            error
        );

    }


    const title =
        data.title ||
        "🔔 فراخوان دانش‌آموز";


    const options = {

        body:
            data.body ||
            "یک فراخوان جدید دریافت شد",

        icon:
            "/icon-192.png",

        badge:
            "/icon-192.png",

        vibrate: [
            300,
            100,
            300,
            100,
            500
        ],

        tag:
            "student-call",

        renotify:
            true,

        requireInteraction:
            true
            ,
            silent: false

    };


    event.waitUntil(

        self.registration.showNotification(
            title,
            options
        )

    );

});
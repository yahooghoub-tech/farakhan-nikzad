self.addEventListener("push", function(event) {

    const data = event.data
        ? event.data.json()
        : {};

    const title =
        data.title || "فراخوان خروج";

    const options = {

        body:
        data.body || "فراخوان جدید دریافت شد",

        icon:
        "icon-192.png",

        badge:
        "icon-192.png",

        vibrate: [
            200,
            100,
            200,
            100,
            500
        ],

        requireInteraction: true

    };

    event.waitUntil(

        self.registration.showNotification(
            title,
            options
        )

    );

});
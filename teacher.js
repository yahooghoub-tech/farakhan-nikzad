if ("serviceWorker" in navigator) {

    navigator.serviceWorker.register(
        "service-worker.js"
    )
    .then(function(registration) {

        console.log(
            "Service Worker فعال شد:",
            registration
        );

    })
    .catch(function(error) {

        console.error(
            "خطا در Service Worker:",
            error
        );

    });

}
async function registerPushSubscription() {

    try {

        if (!("serviceWorker" in navigator)) {

            console.log(
                "Service Worker پشتیبانی نمی‌شود"
            );

            return;
        }


        if (!("PushManager" in window)) {

            console.log(
                "Push Notification پشتیبانی نمی‌شود"
            );

            return;
        }


        const permission =
            await Notification.requestPermission();


        if (permission !== "granted") {

            console.log(
                "اجازه اعلان داده نشد"
            );

            return;
        }


        const registration =
            await navigator.serviceWorker.ready;


        const subscription =
            await registration.pushManager.subscribe({

                userVisibleOnly: true,

                applicationServerKey:
                    urlBase64ToUint8Array(
                        "BGXK8_09Z7XoTpt1PDaMmra88f8LvxyRFjnV7W36XGQSMVNRTdjpGtEHzhevjTJ5V4AtiIWsZSG0TyIO5VCgPRE"
                    )

            });


        console.log(
            "Push Subscription ساخته شد:",
            subscription
        );


        const { data, error } =
            await supabaseClient
                .from("teacher_devices")
                .insert([{

                    class_name: "ششم-1",

                    subscription:
                        subscription.toJSON()

                }])
                .select();


        if (error) {

            console.error(
                "خطا در ذخیره Subscription:",
                error
            );

            return;
        }


        console.log(
            "گوشی معلم ششم-1 ثبت شد:",
            data
        );


    } catch (error) {

        console.error(
            "خطا در Push Subscription:",
            error
        );

    }

}


function urlBase64ToUint8Array(base64String) {

    const padding =
        "=".repeat(
            (4 - base64String.length % 4) % 4
        );

    const base64 =
        (
            base64String
            + padding
        )
        .replace(/-/g, "+")
        .replace(/_/g, "/");


    const rawData =
        window.atob(base64);


    return Uint8Array.from(
        [...rawData].map(
            char => char.charCodeAt(0)
        )
    );

}
registerPushSubscription();
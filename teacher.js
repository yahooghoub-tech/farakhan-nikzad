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

const webpush = require("web-push");
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async function handler(req, res) {

    if (req.method !== "POST") {

        return res.status(405).json({
            error: "Method not allowed"
        });

    }

    try {

        webpush.setVapidDetails(
            "mailto:admin@example.com",
            process.env.VAPID_PUBLIC_KEY,
            process.env.VAPID_PRIVATE_KEY
        );

        const { data: devices, error } =
            await supabase
                .from("teacher_devices")
                .select("subscription")
                .eq("class_name", "ششم-1");

        if (error) {

            console.error(
                "خطا در دریافت دستگاه:",
                error
            );

            return res.status(500).json({
                error: error.message
            });

        }

        if (!devices || devices.length === 0) {

            return res.status(404).json({
                error: "دستگاه معلم ششم-1 پیدا نشد"
            });

        }

        const payload = JSON.stringify({

            title: "🔔 تست فراخوان",

            body: "این یک اعلان آزمایشی برای معلم ششم-1 است",

            vibrate: [
                300,
                100,
                300,
                100,
                500
            ]

        });

        const results = [];

        for (const device of devices) {

            try {

                await webpush.sendNotification(
                    device.subscription,
                    payload
                );

                results.push({
                    success: true
                });

            } catch (error) {

                console.error(
                    "خطا در ارسال Push:",
                    error
                );

                console.error(
                    "Status Code:",
                    error.statusCode
                );

                console.error(
                    "Response Body:",
                    error.body
                );

                results.push({

                    success: false,

                    error: error.message,

                    statusCode:
                        error.statusCode || null,

                    body:
                        error.body || null

                });

            }

        }

        return res.status(200).json({

            success: true,

            sent: results

        });

    } catch (error) {

        console.error(
            "Test Push Error:",
            error
        );

        return res.status(500).json({

            success: false,

            error: error.message

        });

    }

};
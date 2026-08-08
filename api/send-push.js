const webpush = require("web-push");

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


        const {
            subscription,
            title,
            body
        } = req.body;


        if (!subscription) {

            return res.status(400).json({
                error: "Subscription is required"
            });

        }


        const payload = JSON.stringify({

            title:
                title || "فراخوان خروج",

            body:
                body || "فراخوان جدید دریافت شد"

        });


        await webpush.sendNotification(
            subscription,
            payload
        );


        return res.status(200).json({

            success: true

        });


    } catch (error) {

        console.error(
            "Push Error:",
            error
        );


        return res.status(500).json({

            error:
                error.message

        });

    }

};
import { createClient } from "@supabase/supabase-js";


const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);


// تست اتصال به متغیر محیطی Vercel
console.log(
  "SUPABASE_URL:",
  process.env.SUPABASE_URL
);



export default async function handler(req, res) {


  // فقط درخواست GET قبول شود
  if (req.method !== "GET") {

    return res.status(405).json({
      error: "Method Not Allowed"
    });

  }



  try {


    const { data, error } = await supabase
      .from("students")
      .select("*")
      .order("id", { ascending: true });



    if (error) {

      return res.status(500).json({
        error: error.message
      });

    }



    return res.status(200).json(data);



  } catch (err) {


    return res.status(500).json({
      error: err.message
    });


  }

}
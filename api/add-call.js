import { createClient } from "@supabase/supabase-js";


const supabase = createClient(

process.env.SUPABASE_URL,

process.env.SUPABASE_SERVICE_KEY

);



export default async function handler(req,res){


if(req.method !== "POST"){

return res.status(405).json({

error:"Method Not Allowed"

});

}



try{


const {

student_name,

class_name,

status

}=req.body;



const {data,error}=await supabase

.from("calls")

.insert([

{

student_name,

class_name,

status

}

])

.select();



if(error){

return res.status(500).json({

error:error.message

});

}



return res.status(200).json(data);



}

catch(err){


return res.status(500).json({

error:err.message

});


}


}
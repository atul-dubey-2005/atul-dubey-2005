// Supabase REST integration. Secrets are used only by the serverless function.
const clean = (value, max) => typeof value === 'string' ? value.trim().slice(0,max) : '';
const responseHeaders = {
  'Content-Type':'application/json',
  'Prefer':'return=minimal'
};
export default async function handler(req,res) {
  res.setHeader('Cache-Control','no-store');
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow','GET, POST');
    return res.status(405).json({error:'Method not allowed'});
  }
  const base = process.env.SUPABASE_URL?.replace(/\/$/,'');
  const key = process.env.SUPABASE_KEY;
  if (!base || !/^https:\/\//.test(base) || !key) {
    return res.status(503).json({error:'Feedback service has not been configured.'});
  }
  const headers = {...responseHeaders,apikey:key,Authorization:`Bearer ${key}`};
  try {
    if (req.method === 'GET') {
      const response = await fetch(`${base}/rest/v1/feedbacks?select=id,name,role,rating,message,date&order=id.desc&limit=24`,{headers});
      if (!response.ok) throw new Error(`Supabase read: ${response.status}`);
      const data = await response.json();
      return res.status(200).json(data);
    }
    const input = req.body || {};
    const newEntry = {
      name:clean(input.name,60),role:clean(input.role,60),
      rating:Number(input.rating),message:clean(input.message,400),
      date:new Date().toLocaleDateString('en-IN',{timeZone:'Asia/Kolkata'})
    };
    if (!newEntry.name || !newEntry.message || !Number.isInteger(newEntry.rating) || newEntry.rating<1 || newEntry.rating>5) {
      return res.status(400).json({error:'Please provide a name, message and a rating from 1 to 5.'});
    }
    const response = await fetch(`${base}/rest/v1/feedbacks`,{
      method:'POST',headers,body:JSON.stringify(newEntry)
    });
    if (!response.ok) throw new Error(`Supabase write: ${response.status}`);
    return res.status(201).json({success:true});
  } catch(error) {
    console.error('Feedback API failed:',error?.message);
    return res.status(502).json({error:'Feedback service unavailable.'});
  }
}

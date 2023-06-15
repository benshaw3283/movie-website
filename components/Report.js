import React, {useState} from "react";
import { useSession } from "next-auth/react";
import { useRef } from "react";
import { FadeLoader } from "react-spinners";

const Report = () => {
  const { data: session } = useSession();
  const reportRef = useRef("");
  const [loading, setLoading] = useState(false)

  async function reportBug() {
    let input = reportRef.current.value;
    const response = await fetch("/api/userActions/reportBug", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: session.user.username,
        report: input,
      }),
    });
    
    if (!session)  {
      alert('Please sign in') 
  } else {
    setLoading(false)
    reportRef.current.value = ''
    
  }
  
  return response;
  }


  return (
    <div>
      <div >
      <div className=" absolute left-3/4 top-1/4">
      <FadeLoader color='blue' loading={loading} aria-label="loading" height={10}
      />
      </div>
        <h2 className="flex justify-center text-lg">Report Bugs</h2>
        <textarea
          ref={reportRef}
          className="bg-slate-800  rounded-lg h-16 border border-slate-700 text-sm resize-none p-1 "
          maxLength="400"
          wrap="soft"
        />
        <div className="  flex justify-end">
          <button
            onClick={() => setLoading(true) & reportBug()}
            type="text"
            className="flex place-self-center border rounded-lg px-1 bg-slate-800 border-slate-700"
          >
            Submit
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default Report;

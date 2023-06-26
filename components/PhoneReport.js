import React, {useState} from "react";
import { useSession } from "next-auth/react";
import { useRef } from "react";
import { FadeLoader } from "react-spinners";

const PhoneReport = () => {
  const { data: session } = useSession();
  const reportRef = useRef("");
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState(false)

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

  const handleShow = ()=> {
    setShow(!show)
  }


  return (
    <div>
        {show ? (
      <div className="mr-20">
    
      <div className=" absolute left-3/4 top-1/4">
      <FadeLoader color='grey' loading={loading} aria-label="loading" height={10}
      />
      </div>
      <div className="flex justify-center" onClick={()=> handleShow()}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
</svg>
</div>
    <div className="bg-slate-800 w-fit h-fit rounded-lg border-2 border-slate-700 px-1 absolute z-10">
        <h2 className="flex justify-center text-lg">Report Bugs</h2>
        <textarea
          ref={reportRef}
          className="bg-slate-800  rounded-lg h-16 border border-slate-700 text-sm resize-none p-1 "
          maxLength="400"
          wrap="soft"
        />
        <div className="  flex justify-end">
          <button
            onClick={() => !session ? alert('Please sign in') : setLoading(true) & reportBug()}
            type="text"
            className="flex place-self-center border rounded-lg px-1 bg-slate-800 border-slate-700"
          >
            Submit
          </button>
        </div>
        </div>
      </div>
      ) : (
        <div>
            <h2 className="text-xs ">Report Bugs</h2>
        <div className="flex justify-center " onClick={()=> handleShow()}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
</svg>

        </div>
        </div>
    )
    }
    </div>
  );
};

export default PhoneReport;

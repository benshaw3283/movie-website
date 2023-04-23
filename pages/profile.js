import React from "react";
import { useSession, signOut, getSession } from "next-auth/react";

const Profile = () => {
  const { data: session, status } = useSession();

  if (status === "authenticated") {
    return (
      <div >
        <div className='bg-slate-900  w-screen h-screen' >
          <div className="flex flex-col items-center w-full h-full">
            <div className="order-1 ">
              <br></br>
              <br></br>
              <br></br>
            </div>
            <div className="bg-slate-800 border-2 border-slate-700 rounded-lg container justify-center flex w-1/2 h-1/4 order-2 ">

            </div>

            <div className="order-3 ">
              <br></br>
              
            </div>

            <div className="bg-slate-800 border-2 border-slate-700 rounded-lg container justify-center flex w-5/6 h-1/4 order-4 pt-6">

            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <p>You are not signed in.</p>
      </div>
    );
  }
};

export default Profile;

export const getServerSideProps = async (context) => {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
};

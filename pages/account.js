import React from "react";
import { useSession, signOut, getSession } from "next-auth/react";

const Account = () => {
  const { data: session, status } = useSession();

  if (status === "authenticated") {
    return (
      <div>
        <p style={{ color: "black" }}>Welcome {session.user.email} </p>
        <p style={{ color: "black" }}>
          Welcome {session.user.name || session.user.username}
        </p>
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

export default Account;

export const getServerSideProps = async (context) => {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
};

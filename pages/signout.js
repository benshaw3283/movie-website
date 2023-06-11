import React from "react";
import { signOut } from "next-auth/react";

const Signout = () => {
  return (
    <div>
      <button onClick={() => signOut()}>Sign Out!</button>
    </div>
  );
};

export default Signout;

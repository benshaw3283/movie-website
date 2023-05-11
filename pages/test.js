import Image from "next/image";
import { useRef, useEffect } from "react";
//import UserAvatar from ;
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import UserImage from "../components/UserImage";
import CommentSection from "../components/CommentSection";

const Fuck = () => {
  return <div >
    <div className="w-full h-screen bg-black ">
      <div className="flex justify-center">

    <CommentSection/>
      </div>
    </div>
  </div>;
};

export default Fuck;

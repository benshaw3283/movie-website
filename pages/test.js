
import Image from "next/image";
import { useRef, useEffect, } from "react";
//import UserAvatar from ;
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import UserImage from "../components/UserImage";


//const UserImage = dynamic(()=> import("../components/UserImage"), {
 // ssr: false,
//  loading: () => <p>Loading...</p>
//})

const Fuck = () => {

  const { data: session, status } = useSession();

 return (
  <div>
    <UserImage width={50} height={50}/>
  </div>
 )

};

export default Fuck;



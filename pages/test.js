
import Image from "next/image";
import { useRef, useEffect, } from "react";
//import UserAvatar from ;
import dynamic from "next/dynamic";

const UserAvatar = dynamic(()=> import("../components/Avatar"), {
  ssr: false,
  loading: () => <p>Loading...</p>
})


const Fuck = () => {

 return (
  <div>
    <UserAvatar/>
  </div>
 )

};

export default Fuck;



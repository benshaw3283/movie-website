import Link from "next/link";
import navBar from "../styles/nav.module.css";
import { RadixDialogSign, RadixDialogLog } from "./RadixSign";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { AvatarIcon, Dropdown } from "./RadixComponents";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import radixStyle from "../styles/radixSign.module.css";
import { useEffect } from "react";
import UserImage from "./UserImage";



const Nav = () => {
  const { data: session } = useSession();

  

  if (!session) {
    return (
      <div className='flex flex-row items-center w-full bg-gray-900 border-b-2 border-slate-800 sticky py-2 top-0 z-[20]'>
        <div className={navBar.nav1}>
          <h1>LOGO</h1>
        </div>

        <div className={navBar.nav2}>
          <div style={{ display: "inline-block" }}>
            <nav className={navBar.home}>
              <Link href="/">Home</Link>
            </nav>
          </div>
          <div
            style={{
              display: "inline-block",
              float: "right",
              paddingRight: "25px",
            }}
          >
            <nav>
              <ul className={navBar.sign}>
                <li style={{ display: "inline-block", paddingRight: " 10px" }}>
                  <RadixDialogSign />
                </li>
                <li style={{ display: "inline-block", paddingLeft: "10px" }}>
                  <RadixDialogLog />
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className={navBar.nav3}></div>
      </div>
    );
  } else {
    return (
      <div className='flex flex-row items-center w-full bg-gray-900 border-b-2 pt-2 border-slate-800 sticky top-0 z-[20]'>
        <div className={navBar.nav1}>

        </div>
        <div id='nav2' className='w-3/5 order-2 justify-between flex align-middle place-items-center'>

        
        <nav className='pl-24  flex'>
          <Link href="/">Home</Link>
          
        </nav>

        <nav className='pr-24 '>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <div style={{ position: "center", cursor: "pointer"}}>
                <div style={{ display: "inline-block" , alignItems: 'center'}}>
                  <p> {session.user.name || session.user.username} </p>
                </div>

                <div className="inline-block pl-5 align-middle">
                  <UserImage height={50} width={50}/>
                </div>
              </div>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content className={radixStyle.DropdownMenuContent}>
                <DropdownMenu.Item className={radixStyle.DropdownMenuItem}>
                  <Link href={`/user/${session.user.username}`} >Profile</Link>
                </DropdownMenu.Item>

                
                <div>
                  <DropdownMenu.Item
                    className={radixStyle.DropdownMenuItem}
                    onClick={() => signOut()}
                  >
                    Sign Out
                  </DropdownMenu.Item>
                </div>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </nav>
        </div>
        <div className={navBar.nav3}></div>
      </div>
    );
  }
};

export default Nav;

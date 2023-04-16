import Link from "next/link";
import navBar from "../styles/nav.module.css";
import { RadixDialogSign, RadixDialogLog } from "./RadixSign";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { AvatarIcon, Dropdown } from "./RadixComponents";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import radixStyle from "../styles/radixSign.module.css";

const Nav = () => {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className='flex flex-row items-center top-0 bg-gray-900 border-b-2 w-full border-slate-800 fixed'>
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
      <div className='flex flex-row items-center fixed top-0 w-full bg-gray-900 border-b-2 border-slate-800'>
        <div className={navBar.nav1}>

        </div>
        <div className={navBar.nav2}>

        
        <nav className={navBar.home}>
          <Link href="/">Home</Link>
        </nav>

        <nav className={navBar.account}>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <div style={{ position: "center", cursor: "pointer" }}>
                <div style={{ display: "inline-block" }}>
                  <p> {session.user.email} </p>
                </div>

                <div style={{ display: "inline-block", paddingLeft: "10px" }}>
                  <AvatarIcon />
                </div>
              </div>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content className={radixStyle.DropdownMenuContent}>
                <DropdownMenu.Item className={radixStyle.DropdownMenuItem}>
                  <Link href="/account">Account</Link>
                </DropdownMenu.Item>

                <DropdownMenu.Item className={radixStyle.DropdownMenuItem}>
                  Settings
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

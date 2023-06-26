import Link from "next/link";
import navBar from "../styles/nav.module.css";
import { RadixDialogSign, RadixDialogLog } from "./RadixSign";
import { useSession, signIn, signOut } from "next-auth/react";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import radixStyle from "../styles/radixSign.module.css";
import UserImage from "./UserImageNav";
import Search from "./Search";

const Nav = () => {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="flex flex-row items-center w-full bg-gray-900 border-b-2 border-slate-800 sticky py-2 top-0 z-[20] ">
        <div className={navBar.nav1}>

        <Link href="/" className="pl-8 font-mono font-bold text-xl">Home</Link>
        </div>

        <div className={navBar.nav2}>
          <div style={{ display: "inline-block" }}>
            <nav className={navBar.home}>
              
            </nav>
          </div>
          
        </div>

        <div className={navBar.nav3}>
        <div
            style={{
              display: "inline-block",
              float: "right",
              paddingRight: "25px",
            }}
          >
            <nav>
              <ul className='font-semibold flex'>
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
      </div>
    );
  } else {
    return (
      <div className="flex flex-row items-center w-full bg-gray-900 border-b-2 pt-2 border-slate-800 sticky top-0 z-[20] ">
        <div className="flex order-1 w-1/5">
          <nav className="lg:pl-24 pl-2  flex font-mono font-bold text-lg">
            <Link href="/">Home</Link>
          </nav>
        </div>
        <div
          id="nav2"
          className="lg:w-3/5 w-3/5 order-2 justify-between flex align-middle place-items-center"
        >
          <div className="flex  lg:ml-2 mb-1">
            <Search />
          </div>

          
        </div>
        <div className={navBar.nav3}>
        <nav className="lg:pr-10 ">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <div style={{ position: "center", cursor: "pointer" }}>

                  <div className="flex lg:pl-5 pl-8 align-middle place-self-center">
                    <UserImage height={40} width={42} />
                  </div>
                </div>
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className={radixStyle.DropdownMenuContent}
                >
                  <DropdownMenu.Item className={radixStyle.DropdownMenuItem}>
                    <Link
                      href={`/user/${
                        session.user.username || session.user.name
                      }`}
                    >
                      Profile
                    </Link>
                  </DropdownMenu.Item>

                  <div>
                    <DropdownMenu.Item
                      className={radixStyle.DropdownMenuItem}
                      onClick={() => signOut({ callbackUrl: "/login" })}
                    >
                      Sign Out
                    </DropdownMenu.Item>
                  </div>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </nav>
        </div>
      </div>
    );
  }
};

export default Nav;

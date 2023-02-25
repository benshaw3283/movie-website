import Link from 'next/link'
import navBar from '../styles/nav.module.css'
import { RadixDialogSign, RadixDialogLog } from './RadixSign'
import { useSession, signIn, signOut } from 'next-auth/react'
import Image from 'next/image'
import { AvatarIcon,Dropdown } from './RadixComponents'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import radixStyle from '../styles/radixSign.module.css'

const Nav = () => {
    const {data: session} = useSession();
             
    
    if (!session) {
        
        return (
        <div className={navBar.nav}>
            <nav className={navBar.home}>
            <Link href='/' >Home</Link>
            </nav>
            <nav>
            <ul className={navBar.sign}>
                <li><RadixDialogSign/></li>
                <li><RadixDialogLog/></li>
            </ul>         
            </nav>
            </div>
    )
    } else {
        return (
            <div className={navBar.nav}>
            

            
            <nav className={navBar.home}>
            <Link href='/' >Home</Link>
            </nav>              
           
            <nav className={navBar.account}>
            
            
            
            
            <DropdownMenu.Root >
    <DropdownMenu.Trigger asChild>
    <div style={{position: 'center', cursor:'pointer'}} >
                <div style={{display: 'inline-block'}}>
                    <p> {session.user.name} </p>
                </div>

                <div style={{display:'inline-block', paddingLeft: '10px'}}>
                    
                    <AvatarIcon/>
                                      
                </div>            
            </div>
    </DropdownMenu.Trigger>

    <DropdownMenu.Portal>
      <DropdownMenu.Content className={radixStyle.DropdownMenuContent}>
        <DropdownMenu.Item className={radixStyle.DropdownMenuItem}>
            Account
        </DropdownMenu.Item>
        
        <DropdownMenu.Item className={radixStyle.DropdownMenuItem}>
            Settings
        </DropdownMenu.Item>
    <div >
        <DropdownMenu.Item className={radixStyle.DropdownMenuItem} onClick={()=> signOut()}>
           Sign Out
        </DropdownMenu.Item>
    </div>


      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  </DropdownMenu.Root>
    
    
            </nav>
            </div>
            
        )
    }
}

export default Nav


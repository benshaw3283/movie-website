import Link from 'next/link'
import navBar from '../styles/nav.module.css'
import { RadixDialogSign, RadixDialogLog } from './RadixSign'
import { useSession, signIn, signOut } from 'next-auth/react'
import Image from 'next/image'

const Nav = () => {
    const {data: session} = useSession();

    if (!session) {
    return (
        <div className={navBar.nav}>
            <nav className={navBar.a}>
            <Link href='/' className={navBar.home}>Home</Link>
            <Link href='../about' className={navBar.about}>About</Link>
            <Link href='../contact' className={navBar.contact}>Contact</Link>
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
            <nav className={navBar.a}>
            <Link href='/' className={navBar.home}>Home</Link>
            <Link href='../about' className={navBar.about}>About</Link>
            <Link href='../contact' className={navBar.contact}>Contact</Link>
            <div style={{position: 'center'}}>
                <div style={{display: 'inline-block'}}>
                    <p> {session.user.name} </p>
                </div>
                <div style={{display:'inline-block', paddingLeft: '10px'}}>
                    <picture>              
                    <img alt ='userImage' src={session.user.image} width={50} height={50}/>
                    </picture>
                </div>
                <div style={{display:'flex', position:'absolute'}}>

                <button onClick={()=> signOut()}>Sign Out</button>
                </div>
            </div>        
            </nav>
            </div>
        )
    }
}

export default Nav


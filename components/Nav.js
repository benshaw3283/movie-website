import Link from 'next/link'
import navBar from '../styles/nav.module.css'
import { RadixDialogSign, RadixDialogLog } from './RadixSign'

const Nav = () => {

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
}

export default Nav
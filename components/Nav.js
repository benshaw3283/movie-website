import Link from 'next/link'
import navBar from '../styles/nav.module.css'
import { Signup, Login } from './Sign'
import { PageWithJSbasedForm } from './Sign'

const Nav = () => {

    return (
        <div className={navBar.nav}>
            <nav className={navBar.a}>
            <Link href='/' className={navBar.home}>Home</Link>
            <Link href='../about' className={navBar.about}>About</Link>
            <Link href='../contact' className={navBar.contact}>Contact</Link>
            <ul className={navBar.sign}>
                <li><PageWithJSbasedForm/></li>
                <li><Login/></li>
            </ul>
            </nav>
            </div>
    )
}

export default Nav
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { Signup } from '../components/Sign'
import Createreviews from '../components/Reviews'
import { RadixDialog } from '../components/RadixSign'



export default function Home() {
  return (

    <div>
      <title>Movie Website</title>
      <h1>Homepage</h1>
      <Createreviews/>     
      <RadixDialog/>    
    </div>
  )
  

}





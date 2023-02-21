import '../styles/globals.css'
import Nav from '../components/Nav'
import Layout from '../components/Layout'
import { SessionProvider } from "next-auth/react";
import { StreamApp, StatusUpdateForm, FlatFeed } from 'react-activity-feed';
import 'react-activity-feed/dist/index.css';
import stream from 'getstream';
import {connect} from 'getstream'

function MyApp({ Component, pageProps: {session, ...pageProps}, }) {


  return (
    <SessionProvider session={session}>
    <Layout>
    <Component {...pageProps}  />
    
    </Layout>
    </SessionProvider>
    )
}



export default MyApp

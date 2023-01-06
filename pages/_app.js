import '../styles/globals.css'
import Nav from '../components/Nav'
import Layout from '../components/Layout'

function MyApp({ Component, pageProps }) {
  return (
  
    <Layout>
    <Component {...pageProps} />
    </Layout>
    )
}

export default MyApp

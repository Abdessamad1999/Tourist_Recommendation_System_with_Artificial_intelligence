import Header from './header/Header'
import Popular from './popular/Popular'
import About from './about/About'
import Offers from './offers/Offers'
import './home.css'

function Home() {
  return (
    <div>
        <Header/>
        <Popular/>
        <Offers/>
        <About/>
    </div>
  )
}

export default Home
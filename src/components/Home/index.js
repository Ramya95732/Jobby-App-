import {Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

const Home = props => {
  const onClickJobtn = () => {
    const {history} = props
    history.push('/jobs')
  }
  return (
    <div className="home-div1">
      <Header />
      <div className="home-div2">
        <h1 className="head">Find The Job That Fits Your Life</h1>
        <p className="para">
          Millions of people are searching for jobs, salary information, company
          reviews.
        </p>
        <Link to="/jobs">
          <button type="button" className="button" onClick={onClickJobtn}>
            Find Jobs
          </button>
        </Link>
      </div>
    </div>
  )
}
export default Home

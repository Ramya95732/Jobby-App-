import {withRouter, Link} from 'react-router-dom'

import Cookies from 'js-cookie'

import './index.css'

const Header = props => {
  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }
  return (
    <nav className="nav-el">
      <ul className="ul">
        <li className="li">
          <Link to="/">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="logo"
            />
          </Link>
        </li>
        <li className="lii">
          <Link to="/">
            <h1 className="hee">Home</h1>
          </Link>
          <Link to="/jobs">
            <h1 className="hee">Jobs</h1>
          </Link>
        </li>
        <li>
          <button type="button" className="button" onClick={onClickLogout}>
            Logut
          </button>
        </li>
      </ul>
    </nav>
  )
}
export default withRouter(Header)

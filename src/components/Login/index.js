import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import './index.css'

class Login extends Component {
  state = {username: '', password: '', errorMsg: '', showErrMsg: false}

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePswd = event => {
    this.setState({password: event.target.value})
  }

  onSuccessSubmit = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    const {history} = this.props
    history.replace('/')
  }

  onFailureSubmit = errorMsg => {
    this.setState({showErrMsg: true, errorMsg})
  }

  submitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok === true) {
      this.onSuccessSubmit(data.jwt_token)
    } else {
      this.onFailureSubmit(data.error_msg)
    }
  }

  render() {
    const {showErrMsg, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    console.log(jwtToken)
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="outer">
        <div className="login-div">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="logo"
          />
          <form className="formClass" onSubmit={this.submitForm}>
            <label htmlFor="usernameInput" className="inputLabel">
              USERNAME
            </label>
            <input
              type="text"
              placeholder="Username"
              className="usernameInput"
              id="usernameInput"
              onChange={this.onChangeUsername}
            />
            <label htmlFor="pswdInput" className="inputLabel">
              PASSWORD
            </label>
            <input
              type="text"
              placeholder="Password"
              className="usernameInput"
              id="pswdInput"
              onChange={this.onChangePswd}
            />
            <button type="submit" className="button">
              Login
            </button>
          </form>
          {showErrMsg && <p className="err">*{errorMsg}</p>}
        </div>
      </div>
    )
  }
}

export default Login

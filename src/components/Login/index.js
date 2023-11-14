import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {
    userId: '',
    userPin: '',
    errorMsg: '',
  }

  onChangeUserId = event => {
    this.setState({userId: event.target.value})
  }

  onChangePin = event => {
    this.setState({userPin: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({errorMsg, userId: '', userPin: ''})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {userId, userPin} = this.state

    const userDetails = {
      user_id: userId,
      pin: userPin,
    }

    const url = 'https://apis.ccbp.in/ebank/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const res = await fetch(url, options)
    const resBody = await res.json()
    console.log(res)
    if (res.ok === true) {
      this.onSubmitSuccess(resBody.jwt_token)
    } else {
      this.onSubmitFailure(resBody.error_msg)
    }
  }

  render() {
    const {userId, userPin, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    console.log(jwtToken)

    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-container">
        <div className="image-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/ebank-login-img.png"
            alt="website login"
            className="website-login-image"
          />
        </div>
        <div className="card-container">
          <h1 className="form-header">Welcome Back!</h1>
          <form onSubmit={this.onSubmitForm}>
            <label htmlFor="user-id">User ID</label>
            <br />
            <input
              type="text"
              className="user-id"
              id="user-id"
              value={userId}
              placeholder="Enter User Id"
              onChange={this.onChangeUserId}
            />
            <br />
            <label htmlFor="pin">PIN</label>
            <br />
            <input
              type="password"
              className="pin"
              id="pin"
              placeholder="Enter PIN"
              value={userPin}
              onChange={this.onChangePin}
            />
            <br />
            <button type="submit" className="login-button">
              Login
            </button>
            <p className="error-msg">{errorMsg}</p>
          </form>
        </div>
      </div>
    )
  }
}

export default Login

import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { cloudinaryService } from '../services/cloudinaryService'
import { setUser, clearUser } from '../store/actions/userAction'
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import { GoogleLogin } from 'react-google-login';
import { GoogleLogout } from 'react-google-login';

import { refreshTokenSetup } from '../services/googleService';

const clientId = '996251564221-qedkti8vudlin8md60j8dllv408gqodo.apps.googleusercontent.com';
const absoluteURI = (process.env.NODE_ENV === 'production') ? 'http://herokupath' : 'http://localhost:3031'

class _LoginSignup extends Component {

    state = {
        signupCred: {
            username: '',
            fullname: '',
            password: '',
            imgUrl: ''
        },
        loginCred: {
            username: '',
            password: ''
        },
        googleCreds: {},
        isNewUser: true,
        msg: '',
        isUploading: false,
        isGoogle: false
    }



    // -------------------------------------------------GOOGLE----------------------------------------
    onSuccessGoogleLogin = (res) => {
        const user = res.profileObj
        this.setState({
            signupCred: {
                username: user.email,
                fullname: user.name,
                password: user.googleId,
                imgUrl: user.imageUrl
            }, isGoogle: true
        })
        refreshTokenSetup(res);

    };

    onFailureGoogleLogin = (res) => {
        console.log('Login failed: res:', res);

    };
    //-------------------------------------------------------------------------------------------------------------

    onSubmit = async (ev) => {
        ev.preventDefault()
        ev.stopPropagation()
        const { signupCred, loginCred, isNewUser, isGoogle } = this.state

        var userCreds;
        if (isNewUser) userCreds = signupCred
        else userCreds = loginCred

        if (!userCreds.password || !userCreds.username) {
            this.setState({ msg: 'you need to fill all the feilds' })
            return
        }

        try {
            const { setUser } = this.props
            await setUser(userCreds, isNewUser, isGoogle)
            const { user } = this.props
            if (!user) return
            this.setState({ msg: '' })
            if (this.props.user) this.props.history.push(`/board`)//then gos to the boards page
            else this.props.history.push(`/login`)

        } catch (err) {
            console.log(err, 'inside catch');
            this.setState({ msg: 'somthing went worng!' })
            this.props.history.push(`/login`)
        }

    }

    handleInput = ({ target }) => {
        const value = target.value
        const field = target.name
        var typeOfForm = this.state.isNewUser ? 'signupCred' : 'loginCred'
        this.setState(prevState => {
            return {
                [typeOfForm]: {
                    ...prevState[typeOfForm],
                    [field]: value
                }
            }
        })
    }

    toggleForms = (ev) => {
        ev.preventDefault()
        this.setState(prevState => {
            return {
                isNewUser: !prevState.isNewUser,
                msg: ''
            }
        })
    }


    onUploadImg = async ev => {
        this.setState({ isUploading: true })
        try {
            const { secure_url } = await cloudinaryService.uploadImg(ev.target.files[0])
            this.setState({ signupCred: { ...this.state.signupCred, imgUrl: secure_url }, isUploading: false }
                , console.log('imgUrl', this.state.signupCred))

        } catch (err) {
            this.setState({ msg: 'Couldnt upload your image try again' })
        }
    }

    onLogout = async () => {
        await this.props.clearUser()
        this.setState({
            signupCred: {
                username: '',
                fullname: '',
                password: '',
                imgUrl: ''
            },
            loginCred: {
                username: '',
                password: ''
            },
            isNewUser: true,
            msg: '',
            isUploading: false,
            isGoogle: false

        })

    }



    render() {
        const { signupCred, loginCred, isNewUser, isUploading, msg } = this.state
        const { user } = this.props
        return (

            <Fragment>
                <div className="login-bg-screen" > </div>
                <div className="login-container flex justify-center ">


                    <div className={`login-signup-wrapper flex  ${isUploading && 'uploadStage'}`} >




                        {user && <div className="glass-form ">
                            <h2>Welcome {user.fullname}</h2>
                            <div className="avatar" style={{ backgroundImage: `url(${user.imgUrl})` }}> </div>
                            <button className="primary-btn"> <Link to="/board"> Start Now </Link> </button>
                            <a onClick={this.onLogout}> <GoogleLogout
                                clientId={clientId}
                                buttonText="Logout"
                                onLogoutSuccess={this.onLogout}
                            ></GoogleLogout></a>



                        </div>}


                        {!user && isNewUser && <div className="inputs-container">
                            <form className={`glass-form`} onSubmit={this.onSubmit}>


                                <h1>Sign Up</h1>
                                <label> <div className="avatar flex justify-center align-center" style={{
                                    backgroundImage: ` url(${signupCred.imgUrl})`
                                }}> <AddAPhotoIcon style={{ color: ' #dadbdb' }} className={signupCred.imgUrl && 'hidden'} />  </div>
                                    <input onChange={this.onUploadImg} type="file" hidden /></label>


                                <GoogleLogin
                                    className="with-btn"
                                    clientId={clientId}
                                    clientSecret="dFOQhDq1oIii5Tv7Z1QxMDRV"
                                    proxy={true}
                                    callbackURL={absoluteURI + "/auth/google/callback"}

                                    buttonText="Login with Google"
                                    onSuccess={this.onSuccessGoogleLogin}
                                    onFailure={this.onFailureGoogleLogin}
                                    cookiePolicy={'single_host_origin'}

                                    isSignedIn={user === true}
                                />



                                <input type="text" value={signupCred.fullname} name="fullname" placeholder="Name" onChange={this.handleInput} />
                                <input type="text" value={signupCred.username} name="username" placeholder="Username" onChange={this.handleInput} />
                                <input type="password" className="password" value={signupCred.password} name="password" placeholder="Password" onChange={this.handleInput} />

                                <div className="actions-container">

                                    <button className="primary-btn" onClick={this.onSubmit}><ArrowForwardIcon /></button>
                                    <span style={{ display: 'block' }}>{msg}</span>
                                    <p>Already have an account? <span onClick={this.toggleForms} >Sign In</span> </p>
                                </div>
                            </form>

                        </div>
                        }
                        {!user && !isNewUser && <div>
                            < form className={`glass-form  login`} onSubmit={this.onSubmit}>


                                <h1 >Log In</h1>

                                <input type="text" name="username" value={loginCred.username} placeholder="Username" onChange={this.handleInput} />
                                <input type="password" name="password" value={loginCred.password} placeholder="Password" onChange={this.handleInput} />


                                <span style={{ display: 'block' }}>{msg}</span>
                            </form>
                            <button type="submit" className="primary-btn" onClick={this.onSubmit}><ArrowForwardIcon /></button>
                            <p>Dont have an account? <span onClick={this.toggleForms} >Sign Up</span> </p>

                        </div>
                        }
                        <div className="SVG" ></div>
                    </div>


                </div>
            </Fragment >
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.userReducer.user
    }
}

const mapDispatchToProps = {
    setUser,
    clearUser
}

export const LoginSignup = connect(mapStateToProps, mapDispatchToProps)(_LoginSignup)
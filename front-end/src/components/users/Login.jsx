import React, { Component } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/auth'
import './user.css'
import { AiOutlineUser, AiFillLock, AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai'



export class Login extends Component {

    state = {
        email: '',
        password: '',
        visible: false,
        errors: null,
    }


    static propTypes = {
        login: PropTypes.func.isRequired,
        isAuthenticated: PropTypes.bool,
    };

    onSubmit = e => {
        e.preventDefault();
        this.props.login(this.state.email, this.state.password);
    }

    onChange = e => this.setState({ [e.target.name]: e.target.value });


    showPassword = e => this.state.visible ? this.setState({ ['visible']: false }) : this.setState({ ['visible']: true })


    render() {
        if (this.props.isAuthenticated) {
            return <Navigate to="/" />;
        }
        const { email, password, visible } = this.state;

        return (
            <div className="main">
                <div className="container">
                    <div className="row justify-content-center align-items-center">
                        <div className="col-lg-5 col-md-7">
                            <div className="panel border">
                                <div className="panel-heading">
                                    <h3 className="pt-3">Login</h3>
                                </div>
                                <div className="panel-body p-3">
                                    <form onSubmit={this.onSubmit}>
                                        <div className="form-group py-2">
                                            <div className="input-field">
                                                <AiOutlineUser className='icon p-2' />
                                                <input type="email" placeholder="Email" name='email' onChange={this.onChange} value={email} />
                                            </div>
                                        </div>
                                        <div className="form-group py-1 pb-2">
                                            <div className="input-field">
                                                <AiFillLock className='icon px-2' />
                                                <input id='password' type={visible ? "text" : "password"} placeholder="Enter your Password" name='password' onChange={this.onChange} value={password} />
                                                <button type='button' onClick={this.showPassword} className="btn bg-white border-0 text-muted">
                                                    {!visible && <AiOutlineEyeInvisible className='icon-eye-invisible' />}
                                                    {visible && <AiOutlineEye className='icon-eye' />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="form-inline d-flex justify-content-between">
                                            <div>
                                                <input type="checkbox" name="remember" id="remember" />
                                                <label htmlFor="remember" className="text-muted">Remember me</label>
                                            </div>
                                            <a href="/" id="forgot" className="font-weight-bold">Forgot password?</a>
                                        </div>
                                        <button disabled={!email || !password} type="submit" className="btn btn-primary-cust mt-3">
                                            Login
                                        </button>

                                        <div className="text-center pt-4 text-muted">
                                            Don't have an account? <Link to='/register'>Sign up</Link>
                                        </div>
                                    </form>
                                </div>
                                <div className="mx-3 my-2 py-2 bordert">
                                    <div className="text-center py-3">
                                        <a href="https://wwww.facebook.com" target="_blank" className="px-2">
                                            <img src="https://www.dpreview.com/files/p/articles/4698742202/facebook.jpeg" alt="" />
                                        </a>
                                        <a href="https://www.google.com" target="_blank" className="px-2">
                                            <img src="https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-suite-everything-you-need-know-about-google-newest-0.png" alt="" />
                                        </a>
                                        <a href="https://www.github.com" target="_blank" className="px-2">
                                            <img src="https://www.freepnglogos.com/uploads/512x512-logo-png/512x512-logo-github-icon-35.png" alt="" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { login })(Login);
import React from 'react'
import { useSelector } from 'react-redux';
import FormUserSignup from './singUpForm/FormUserSignup';
import FormUserInfo from './singUpForm/FormUserInfo';
import FormUserCompleted from './singUpForm/FormUserCompleted';
import './user.css';

function Singup() {
    const pageStage = useSelector(state => state.auth.formStage);

    return (
        <div className='main'>
            <div className="container">
                <div className="row justify-content-center align-items-center">
                    <div className="col-lg-8 col-md-12">
                        <div className="panel border">
                            <div className="panel-heading">
                                <h3 className="pt-3">Sing Up</h3>
                            </div>
                            <div className="panel-body p-3">
                                <div className="progressbar">
                                    <div className={pageStage === 1 ? 'progress-step progress-step-active' : 'progress-step'} data-title="User"></div>
                                    <div className={pageStage === 2 ? 'progress-step progress-step-active' : 'progress-step'} data-title="Favorite categories"></div>
                                    <div className={pageStage === 3 ? 'progress-step progress-step-active' : 'progress-step'} data-title="Confirme"></div>
                                </div>
                                <div class="card-body p-3 p-md-5 pb-md-0 pb-0">
                                    {(pageStage === 1) &&
                                        // Signup user info
                                        <div className="wrap">
                                            <FormUserSignup />
                                        </div>
                                    }

                                    {(pageStage === 2) &&
                                        // Signup category
                                        <div className="wrap">
                                            <FormUserInfo />
                                        </div>
                                    }

                                    {(pageStage === 3) &&
                                        // Signup success
                                        <div className="wrap">
                                            <FormUserCompleted />
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Singup;
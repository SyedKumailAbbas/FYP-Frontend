import React, { useContext, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import commonContext from '../../contexts/common/commonContext';
import useForm from '../../hooks/useForm';
import useOutsideClose from '../../hooks/useOutsideClose';
import useScrollDisable from '../../hooks/useScrollDisable';
import {createNewUser, logIn} from '../../firebase/auth'
const AccountForm = () => {

    const { isFormOpen, toggleForm } = useContext(commonContext);
    const { inputValues, handleInputValues } = useForm();

    const formRef = useRef();

    useOutsideClose(formRef, () => {
        toggleForm(false);
    });

    useScrollDisable(isFormOpen);

    const [isSignupVisible, setIsSignupVisible] = useState(false);
    const [loading, setLoading] = useState(false);


    // Signup-form visibility toggling
    const handleIsSignupVisible = () => {
        setIsSignupVisible(prevState => !prevState);
    };


    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const { mail, password, username, conf_password } = inputValues;
    
        setLoading(true); // ⏳ start loading
    
        try {
            if (isSignupVisible) {
               if (password !== conf_password) {
    throw new Error("Passwords do not match!");
}
    
                await createNewUser(mail, password, username);
                alert("Signup successful!");
                toggleForm(false);
            } else {
                await logIn(mail, password);
                alert("Login successful!");
                toggleForm(false);
            }
    
            setTimeout(() => {
                Object.keys(inputValues).forEach(key =>
                    handleInputValues({ target: { name: key, value: '' } })
                );
            }, 300);
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false); // ✅ stop loading
        }
    };
    
    return (
        <>
            {
                isFormOpen && (
                    <div className="backdrop">
                        <div className="modal_centered">
                            <form id="account_form" ref={formRef} onSubmit={handleFormSubmit}>

                                {/*===== Form-Header =====*/}
                                <div className="form_head">
                                    <h2>{isSignupVisible ? 'Signup' : 'Login'}</h2>
                                    <p>
                                        {isSignupVisible ? 'Already have an account ?' : 'New to Bachat ?'}
                                        &nbsp;&nbsp;
                                        <button type="button" onClick={handleIsSignupVisible}>
                                            {isSignupVisible ? 'Login' : 'Create an account'}
                                        </button>
                                    </p>
                                </div>

                                {/*===== Form-Body =====*/}
                                <div className="form_body">
                                    {
                                        isSignupVisible && (
                                            <div className="input_box">
                                                <input
                                                    type="text"
                                                    name="username"
                                                    className="input_field"
                                                    value={inputValues.username || ''}
                                                    onChange={handleInputValues}
                                                    required
                                                />
                                                <label className="input_label">Username</label>
                                            </div>
                                        )
                                    }

                                    <div className="input_box">
                                        <input
                                            type="email"
                                            name="mail"
                                            className="input_field"
                                            value={inputValues.mail || ''}
                                            onChange={handleInputValues}
                                            required
                                        />
                                        <label className="input_label">Email</label>
                                    </div>

                                    <div className="input_box">
                                        <input
                                            type="password"
                                            name="password"
                                            className="input_field"
                                            value={inputValues.password || ''}
                                            onChange={handleInputValues}
                                            required
                                        />
                                        <label className="input_label">Password</label>
                                    </div>

                                    {
                                        isSignupVisible && (
                                            <div className="input_box">
                                                <input
                                                    type="password"
                                                    name="conf_password"
                                                    className="input_field"
                                                    value={inputValues.conf_password || ''}
                                                    onChange={handleInputValues}
                                                    required
                                                />
                                                <label className="input_label">Confirm Password</label>
                                            </div>
                                        )
                                    }

<button
    type="submit"
    className="btn login_btn"
    disabled={loading}
>
    {loading ? 'Please wait...' : isSignupVisible ? 'Signup' : 'Login'}
</button>


                                </div>

                                {/*===== Form-Footer =====*/}
                                <div className="form_foot">
                                    <p>or login with</p>
                                    <div className="login_options">
                                        <Link to="/">Facebook</Link>
                                        <Link to="/">Google</Link>
                                        <Link to="/">Twitter</Link>
                                    </div>
                                </div>

                                {/*===== Form-Close-Btn =====*/}
                                <div
                                    className="close_btn"
                                    title="Close"
                                    onClick={() => toggleForm(false)}
                                >
                                    &times;
                                </div>

                            </form>
                        </div>
                    </div>
                )
            }
        </>
    );
};

export default AccountForm;
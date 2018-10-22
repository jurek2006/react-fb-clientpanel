import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import { firebaseConnect } from "react-redux-firebase";
import { notifyUser } from "../../actions/notifyActions";
import Alert from "../layout/Alert";

export class Login extends Component {
    state = {
        email: "",
        password: ""
    };

    componentWillUnmount() {
        // message or message type is not null, reset notification
        const { message, messageType } = this.props.notify;
        if (message || messageType) {
            this.props.notifyUser(null, null);
        }
    }

    onSubmit = e => {
        e.preventDefault();
        const { firebase, notifyUser } = this.props;
        const { email, password } = this.state;

        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(user => {
                this.props.history.push("/");
            })
            .catch(error => notifyUser("Invalid login credentials", "error"));
    };

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    render() {
        const { message, messageType } = this.props.notify;
        return (
            <div>
                <div className="row">
                    <div className="col-md-6 mx-auto">
                        <div className="card">
                            <div className="card-body">
                                {message && (
                                    <Alert
                                        message={message}
                                        messageType={messageType}
                                    />
                                )}
                                <h1 className="text-center pb-4 pt-3">
                                    <span className="text-primary">
                                        <i className="fas fa-lock" /> Login
                                    </span>
                                </h1>
                                <form onSubmit={this.onSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="email">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            className="form-control"
                                            required
                                            value={this.state.email}
                                            onChange={this.onChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="password">
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            name="password"
                                            className="form-control"
                                            required
                                            value={this.state.password}
                                            onChange={this.onChange}
                                        />
                                    </div>
                                    <input
                                        type="submit"
                                        value="Login"
                                        className="btn btn-primary btn-block"
                                    />
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Login.propTypes = {
    firebase: PropTypes.object.isRequired
};

export default compose(
    firebaseConnect(),
    connect(
        (state, props) => ({
            notify: state.notify
        }),
        { notifyUser }
    )
)(Login);

import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import Spinner from "../layout/Spinner";

export class EditClient extends Component {
    constructor(props) {
        super(props);
        // Create refs
        this.firstNameInput = React.createRef();
        this.lastNameInput = React.createRef();
        this.emailInput = React.createRef();
        this.phoneInput = React.createRef();
        this.balanceInput = React.createRef();
    }

    onSubmit = e => {
        e.preventDefault();

        const { client, firestore, history } = this.props;

        // Updated Client
        const updClient = {
            firstName: this.firstNameInput.current.value,
            lastName: this.lastNameInput.current.value,
            email: this.emailInput.current.value,
            phone: this.phoneInput.current.value,
            balance:
                this.balanceInput.current.value === ""
                    ? 0
                    : this.balanceInput.current.value
        };

        // Update client in firestore
        firestore
            .update({ collection: "clients", doc: client.id }, updClient)
            .then(history.push("/"));
    };

    render() {
        const { client } = this.props;
        const { disableBalanceOnEdit } = this.props.settings;
        if (client) {
            return (
                <div>
                    <div className="row">
                        <div className="col-md-6">
                            <Link to="/" className="btn btn-link">
                                <i className="fas fa-arrow-circle-left" /> Back
                                to Dashboard
                            </Link>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header">Edit Client</div>
                        <div className="card-body">
                            <form onSubmit={this.onSubmit}>
                                <div className="form-group">
                                    <label htmlFor="firstName">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="firstName"
                                        minLength="2"
                                        required
                                        onChange={this.onChange}
                                        defaultValue={client.firstName}
                                        ref={this.firstNameInput}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="lastName">Last Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="lastName"
                                        minLength="2"
                                        required
                                        onChange={this.onChange}
                                        defaultValue={client.lastName}
                                        ref={this.lastNameInput}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        onChange={this.onChange}
                                        defaultValue={client.email}
                                        ref={this.emailInput}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="phone">Phone</label>
                                    <input
                                        type="tel"
                                        className="form-control"
                                        name="phone"
                                        onChange={this.onChange}
                                        defaultValue={client.phone}
                                        ref={this.phoneInput}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="balance">Balance</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="balance"
                                        onChange={this.onChange}
                                        defaultValue={client.balance}
                                        ref={this.balanceInput}
                                        disabled={disableBalanceOnEdit}
                                    />
                                </div>

                                <input
                                    type="submit"
                                    value="Submit"
                                    className="btn btn-primary btn-block"
                                />
                            </form>
                        </div>
                    </div>
                </div>
            );
        } else {
            return <Spinner />;
        }
    }
}

EditClient.propTypes = {
    firestore: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
};
export default compose(
    firestoreConnect(props => [
        { collection: "clients", storeAs: "client", doc: props.match.params.id }
    ]),
    connect(({ firestore: { ordered }, settings }, props) => ({
        client: ordered.client && ordered.client[0],
        settings: settings
    }))
)(EditClient);

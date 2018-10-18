import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import Spinner from "../layout/Spinner";
import classnames from "classnames";

export class ClientDetails extends Component {
    state = {
        showBalanceUpdate: false,
        balanceUpdateAmount: "",
        error: {}
    };

    onChange = (validation, e) => {
        //onChange handler with possible validation
        this.setState({ [e.target.name]: e.target.value });

        // it gets validation function and error message in validation object
        const { isValid, validationErrMessage } = validation;

        // if there is validation function given checks value and sets
        // error[fieldName] to errorMessage or to null
        if (isValid) {
            this.setState({
                error: {
                    [e.target.name]: isValid(e.target.value)
                        ? null
                        : validationErrMessage
                }
            });
        }
    };

    balanceSubmit = e => {
        e.preventDefault();
        const { client, firestore } = this.props;
        const { balanceUpdateAmount } = this.state;

        const clientUpdate = { balance: parseFloat(balanceUpdateAmount) };

        // Update in firestore
        firestore.update(
            { collection: "clients", doc: client.id },
            clientUpdate
        );

        this.setState({ showBalanceUpdate: false });
    };

    // Delete Client
    onDeleteClick = () => {
        const { client, firestore, history } = this.props;

        firestore
            .delete({ collection: "clients", doc: client.id })
            .then(history.push("/"));
    };

    render() {
        const { client } = this.props;
        const { showBalanceUpdate, balanceUpdateAmount, error } = this.state;

        let balanceForm = "";
        // If balance form should display
        if (showBalanceUpdate) {
            balanceForm = (
                <form onSubmit={this.balanceSubmit}>
                    <div className="input-group">
                        <input
                            type="number"
                            className={classnames("form-control border", {
                                "border-danger": error.balanceUpdateAmount
                            })}
                            name="balanceUpdateAmount"
                            placeholder="Add New Balance"
                            value={balanceUpdateAmount}
                            onChange={this.onChange.bind(this, {
                                isValid: fieldValue =>
                                    fieldValue.trim().length > 0 &&
                                    !isNaN(fieldValue),
                                validationErrMessage: "Value is not a number"
                            })}
                        />

                        <div className="input-group-append">
                            <input
                                type="submit"
                                value="Update"
                                className="btn btn-outline-darl"
                                disabled={error.balanceUpdateAmount}
                                data-toggle="tooltip"
                                data-placement="bottom"
                                title={
                                    error.balanceUpdateAmount
                                        ? error.balanceUpdateAmount
                                        : "Update balance"
                                }
                            />
                        </div>
                    </div>
                    {error.balanceUpdateAmount && (
                        <div className="text-danger">
                            {error.balanceUpdateAmount}
                        </div>
                    )}
                </form>
            );
        } else {
            balanceForm = null;
        }
        if (client) {
            return (
                <React.Fragment>
                    <div className="row">
                        <div className="col-md-6">
                            <Link to="/" className="btn btn-link">
                                <i className="fas fa-arrow-cirlce-left" /> Back
                                to Dashboard
                            </Link>
                        </div>
                        <div className="col-md-6">
                            <div className="btn-group float-right">
                                <Link
                                    to={`/client/edit/${client.id}`}
                                    className="btn btn-dark"
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={this.onDeleteClick}
                                    className="btn btn-danger"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div className="card">
                        <h3 className="card-header">
                            {client.firstName} {client.lastName}
                        </h3>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md8 col-sm-6">
                                    <h4>
                                        Client ID:{" "}
                                        <span className="text-secondary">
                                            {client.id}
                                        </span>
                                    </h4>
                                </div>
                                <div className="col-md4 col-sm-6">
                                    <h3 className="pull-right">
                                        Balance:{" "}
                                        <span
                                            className={classnames({
                                                "text-danger":
                                                    parseFloat(client.balance) >
                                                    0,
                                                "text-success":
                                                    parseFloat(
                                                        client.balance
                                                    ) <= 0
                                            })}
                                        >
                                            $
                                            {parseFloat(client.balance).toFixed(
                                                2
                                            )}
                                        </span>{" "}
                                        <small>
                                            <a
                                                href="#!"
                                                onClick={() =>
                                                    this.setState({
                                                        showBalanceUpdate: !this
                                                            .state
                                                            .showBalanceUpdate,
                                                        balanceUpdateAmount:
                                                            client.balance,
                                                        error: {
                                                            balanceUpdateAmount: false
                                                        }
                                                    })
                                                }
                                            >
                                                <i className="fas fa-pencil-alt" />
                                            </a>
                                        </small>
                                    </h3>
                                    {balanceForm}
                                </div>
                            </div>
                            <hr />
                            <ul className="list-group">
                                <li className="list-group-item">
                                    Contact Email: {client.email}
                                </li>
                                <li className="list-group-item">
                                    Contact Phone: {client.phone}
                                </li>
                            </ul>
                        </div>
                    </div>
                </React.Fragment>
            );
        } else {
            return <Spinner />;
        }
    }
}

ClientDetails.propTypes = {
    firestore: PropTypes.object.isRequired
};
export default compose(
    firestoreConnect(props => [
        { collection: "clients", storeAs: "client", doc: props.match.params.id }
    ]),
    connect(({ firestore: { ordered } }, props) => ({
        client: ordered.client && ordered.client[0]
    }))
)(ClientDetails);

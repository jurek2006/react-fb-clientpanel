import React, { Component } from "react";
import { Link } from "react-router-dom";

export class Clients extends Component {
    render() {
        const clients = [
            {
                id: "4353464",
                firstName: "Jan",
                lastName: "Skrzetuski",
                email: "jan@skrz.pl",
                phone: "43546",
                balance: "30"
            },
            {
                id: "4353364",
                firstName: "Onufry",
                lastName: "Zagłoba",
                email: "onufry@skrz.pl",
                phone: "435463",
                balance: "30000"
            }
        ];
        if (clients) {
            return (
                <div>
                    <div className="row">
                        <div className="col-md-6">
                            <h2>
                                {" "}
                                <i className="fas fa-users" /> Clients{" "}
                            </h2>
                        </div>
                        <div className="col-md-6" />
                    </div>
                    <table className="table table-striped">
                        <thead className="thead-inverse">
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Balance</th>
                                <th />
                            </tr>
                        </thead>
                        <tbody>
                            {clients.map(client => (
                                <tr key="client.id">
                                    <td>
                                        {client.firstName} {client.lastName}
                                    </td>
                                    <td>{client.email}</td>
                                    <td>
                                        ${parseFloat(client.balance).toFixed(2)}
                                    </td>
                                    <td>
                                        <Link
                                            to={`/clients/${client.id}`}
                                            className="btn btn-secondary"
                                        >
                                            <i class="fas fa-arrow-circle-right" />{" "}
                                            Details
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        } else {
            return <h1>Loading...</h1>;
        }
    }
}

export default Clients;

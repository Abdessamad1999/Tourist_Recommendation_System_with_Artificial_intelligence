import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { getItems, deleteItem } from '../../actions/items'
import Form from "./Form";

export class Items extends Component {

    constructor(props) {
        super(props);
        this.state = {
          isEdit: false
        };
      }

    static propTypes = {
        items: PropTypes.array.isRequired,
        getItems: PropTypes.func.isRequired,
        deleteItem: PropTypes.func.isRequired,
    }

    componentDidMount() {
        this.props.getItems();
    }

    render() {
        return (
            <div className="container">
                <Form info={this.state}/>
                <h1>Items List</h1>
                <table className="table table-striped text-center">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Description</th>
                            <th>Action</th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.items && this.props.items.map((item, index) => (
                            <tr key={index}>
                                <td>{index+1}</td>
                                <td>{item.name}</td>
                                <td>{item.category}</td>
                                <td>{item.description}</td>
                                <td>
                                    <button
                                        onClick={this.props.deleteItem.bind(this, item._id)}
                                        className="btn btn-danger btn-sm mx-2"
                                    >
                                        Delete
                                    </button>
                                    <button
                                        onClick={() => this.setState({ isEdit: true, data: item})}
                                        className="btn btn-secondary btn-sm"
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    items: state.items.items,
});

export default connect(mapStateToProps, { getItems, deleteItem })(Items);
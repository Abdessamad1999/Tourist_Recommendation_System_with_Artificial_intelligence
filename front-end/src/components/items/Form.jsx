import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addItem, editItem } from '../../actions/items';

export class Form extends React.Component {

  state = {
    name: '',
    category: '',
    description: ''
  };


  static propTypes = {
    addItem: PropTypes.func.isRequired,
  };

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  onSubmit = (e) => {
    e.preventDefault();
    const { name, category, description } = this.state;
    const item = { name, category, description };
    this.props.addItem(item);
    this.setState({
      name: '',
      category: '',
      description: ''
    });
  };

  onSubmitEdit = (e) => {
  
    this.state._id = this.props.info.data._id
    console.log(this.state)
    this.state1.isEdit= false
    this.state1.method = this.onSubmit
    e.preventDefault();
    const { _id, name, category, description } = this.state;
    const item = { _id, name, category, description};
    this.props.editItem(item);
    this.setState({
      _id: '',
      name: '',
      category: '',
      description: ''
    });
  };

  state1 = {
    isEdit: false,
    method: this.onSubmit
  }

render() {

  if (!this.state1.isEdit) {
    if (this.props.info.isEdit){
      this.props.info.isEdit = false
      this.state = this.props.info.data
      console.log(this.state)
      this.state1.isEdit = true
      this.state1.method = this.onSubmitEdit
    }
  }

  const { name, category, description } = this.state;

  return (
    <div className="card card-body mt-4 mb-4">
      {this.state1.isEdit && (<h2>Edit Item</h2>)}
      {!this.state1.isEdit && (<h2>Add Item</h2>)}
      <form onSubmit={this.state1.method}>
        <div className="form-group">
          <label>Name</label>
          <input
            className="form-control"
            type="text"
            name="name"
            onChange={this.onChange}
            value={name}
          />
        </div>
        <div className="form-group">
          <label>Category</label>
          <input
            className="form-control"
            type="text"
            name="category"
            onChange={this.onChange}
            value={category}
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <input
            className="form-control"
            type="text"
            name="description"
            onChange={this.onChange}
            value={description}
          />
        </div>
        <div className="form-group">
          <button type="submit" className="btn btn-primary my-3">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
}

export default connect(null, { addItem, editItem })(Form);
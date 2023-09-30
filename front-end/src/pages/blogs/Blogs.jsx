import React, { Component } from 'react'
import './blogs.css'

import { Rating } from '@smastrom/react-rating'
import '@smastrom/react-rating/style.css'

import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { getItems, getPopularItems, getItemsWithCategory, search } from '../../actions/items'
import { categories } from '../../data';
import { Link } from 'react-router-dom';


export class Blogs extends Component {

  state = {
    query: '',
  }


  static propTypes = {
    items: PropTypes.array.isRequired,
    links: PropTypes.object,
    items_popular: PropTypes.array.isRequired,
    getItems: PropTypes.func.isRequired,
    getPopularItems: PropTypes.func.isRequired,
    getItemsWithCategory: PropTypes.func.isRequired,
    search: PropTypes.func.isRequired,
  }

  componentDidMount() {
    this.props.getItems();
    this.props.getPopularItems();
  }

  filter_with_categiry = (category) => {
    if (category === 'All') {
      this.props.getItems();
    } else {
      this.props.getItemsWithCategory(category);
    }
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  check_query = (query, item) => {
    let text = item.name + ' ' + item.city + ' Morocco ' + item.category + ' ' + item.categories + ' ' + item.description;
    text = text.toLowerCase();
    return text.includes(query);
  }

  search = (e) => {
    e.preventDefault();
    let { query } = this.state;
    query = query.toLowerCase();
    let filtred_data = this.props.items.filter(item => this.check_query(query, item));

    let items = []
    for (let i = 0; i < filtred_data.length; i++) {
      items[i] = filtred_data[i]._id
    }

    this.props.search({ 'item_list': items })
  }

  prevPage = () => {
    let toPage = this.props.links.previous
    this.props.getItems(toPage);
  }

  nextPage = () => {
    let toPage = this.props.links.next
    this.props.getItems(toPage);
  }


  render() {

    const links = this.props.links;
    const { query } = this.state;

    return (
      <div>
        <section className="hero">
          <div className="container">
            <h2 className="h1 hero-title">Journey to explore world</h2>
            <p className="hero-text">
              What's your favorite thing to do when you're traveling? 
              Find the best things to see and do based on your interests or type of travel.
            </p>
            <div className="hero-search">
              <form className="search-form" onSubmit={this.search}>
                <input type="text" className="form-control" id="in" placeholder='Search ...' name='query' value={query} onChange={this.onChange} />
                <button type='submit' disabled={!query} className='search btn'>Search</button>
              </form>
            </div>
          </div>
        </section>

        <section className='blog-page'>
          <div className="container">
            <div className="row">
              <div className="col-md-12 col-lg-8">
                <div className="title-page">Blogs</div>

                {this.props.items && this.props.items.map((item, index) => (
                  <div className="item-post" key={index}>
                    <div className="image-post">
                      <img src={item.images && item.images[0].image} alt={item.name} />
                    </div>
                    <div className="body-post">
                      <h2 className="title">{item.name}</h2>
                      <div className="info-post">
                        <p className="city">{item.city}, Morocco</p>
                        <Rating className='rating'
                          style={{ maxWidth: 80 }}
                          value={item.stars}
                          readOnly
                        />
                      </div>
                      <div className="description-post">
                        {item.description}
                      </div>
                      <div className="footer-post">
                        <Link to={'/blog/' + item._id} className='btn'>
                          Read more
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}

                {!this.props.items.length && (<p className='text-center'>No results found</p>)}

                <ul className="pagination">


                  <li className="page-item"><button className="page-link" disabled={links && !links.previous} onClick={this.prevPage}>Previous</button></li>
                  <li className="page-item"><button className="page-link" disabled={links && !links.next} onClick={this.nextPage}>Next</button></li>
                </ul>

              </div>
              <div className="col-md-12 col-lg-4">
                <div className="title-page">Popular Blogs</div>
                <div className="popular-post">
                  <div className="row">
                    {this.props.items_popular && this.props.items_popular.map((item, index) => (
                      <div key={index} className="col-lg-12">
                        <Link to={'/blog/' + item._id} className='text-decoration-none'>
                          <div className="single_post">
                            <p className="m-b-0">{item.name}</p>
                            <div className="img-post">
                              <img src={item.images && item.images[0].image} alt={item.name} />
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="title-page mt-3">Categories</div>
                <div className="categories">
                  <ul className="list-unstyled">
                    {categories && categories.map((categorie, index) => (
                      <li key={index}><button type='button' onClick={() => this.filter_with_categiry(categorie)} className='btn btn-categ'>{categorie}</button></li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  items: state.items.items,
  links: state.items.links,
  items_popular: state.items.items_popular,
});

export default connect(mapStateToProps, { getItems, getPopularItems, getItemsWithCategory, search })(Blogs)
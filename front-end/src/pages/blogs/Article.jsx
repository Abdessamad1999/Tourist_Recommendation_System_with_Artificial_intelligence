import React, { Component } from 'react';
import './blogs.css';
import withRouter from '../../components/common/withRouter';
import { LiaMapMarkerSolid } from 'react-icons/lia';
import { TbWorld } from 'react-icons/tb';
import { BiPhone, BiTimeFive } from 'react-icons/bi';
import { MdOutlineRateReview } from 'react-icons/md';
import { BsTicketPerforated } from 'react-icons/bs';
import { AiOutlineCopy } from 'react-icons/ai'
import { Rating, ThinStar } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { settingsArticle } from '../../data';

import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { getItem, getSimilarItemStatique, getSimilarItemIA, getItemsWithCategory } from '../../actions/items';
import { addReview, getReviewsItem, getStatisticReviews } from '../../actions/reviews';
// import { categories } from '../../data';
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";

const customStyles = {
    itemShapes: ThinStar,
    activeBoxColor: ['#e7040f', '#ff6300', '#ffde37', '#61bb00', '#19a974'],
    activeFillColor: 'white',
    inactiveBoxColor: '#C7C7C7',
    inactiveFillColor: 'white',
};


export class Article extends Component {

    state = {
        item: this.props.params.blogId,
        rating: 0,
        comment: '',
    }

    static propTypes = {
        item: PropTypes.object,
        user: PropTypes.object,
        isAuthenticated: PropTypes.bool.isRequired,
        links: PropTypes.object,
        items_content: PropTypes.array.isRequired,
        statistic: PropTypes.object,
        getItem: PropTypes.func.isRequired,
        addReview: PropTypes.func.isRequired,
        getReviewsItem: PropTypes.func.isRequired,
        getSimilarItemStatique: PropTypes.func.isRequired,
        getSimilarItemIA: PropTypes.func.isRequired,
        getItemsWithCategory: PropTypes.func.isRequired,
        getStatisticReviews: PropTypes.func.isRequired,
    }

    onClick_cancel = (e) => {
        document.getElementById('add-review').className = 'add-review hide';
    }

    onClick_show = (e) => {
        document.getElementById('add-review').className = 'add-review';
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    setRating = (rating) => {
        // eslint-disable-next-line
        this.setState({ ['rating']: rating })
    }

    onSubmit = (e) => {
        e.preventDefault();
        const { item, rating, comment } = this.state;
        const review = { item, rating, comment };
        // add review
        this.props.addReview(review);
        this.setState({
            item: review.item,
            rating: 0,
            comment: '',
        });
        document.getElementById('add-review').className = 'add-review hide';
        let id = this.props.params.blogId;
        this.props.getReviewsItem(id);
    }

    componentDidMount() {
        let id = this.props.params.blogId;
        this.props.getItem(id);
        this.props.getReviewsItem(id);
        this.props.getStatisticReviews(id);
        if (this.props.isAuthenticated) {
            this.props.getSimilarItemIA(id);
        } else {
            this.props.getSimilarItemStatique(id);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.reviews !== prevProps.reviews) {
            let id = this.props.params.blogId;
            this.props.getItem(id)
            this.props.getStatisticReviews(id);
        }
    }

    copyToClipboard = (field, text) => {
        navigator.clipboard.writeText(text);
        toast.info(`${field} copied to clibboard`, {
            icon: <AiOutlineCopy />
        });
    }

    filter_with_categiry = (category) => {
        if (category === 'All') {
            this.props.getItems();
        } else {
            this.props.getItemsWithCategory(category);
        }
    }

    prevPage = () => {
        let id = this.props.params.blogId;
        let toPage = this.props.links.previous
        this.props.getReviewsItem(id, toPage);
    }

    nextPage = () => {
        let id = this.props.params.blogId;
        let toPage = this.props.links.next
        this.props.getReviewsItem(id, toPage);
    }

    formatDate = (inp) => {
        const options = { month: 'long', day: 'numeric', year: 'numeric' };
        const date = new Date(inp);
        return date.toLocaleDateString(undefined, options);
    }

    render() {
        const { rating, comment } = this.state;
        const links = this.props.links;

        return (
            <div>
                <section className="hero">
                    <div className="container">
                        <h2 className="h1 hero-title">Journey to explore world</h2>
                        <p className="hero-text">
                            AWhat's your favorite thing to do when you're traveling?
                            Find the best things to see and do based on your interests or type of travel.
                        </p>
                        <div className="hero-search">
                            <form className="search-form">
                                <input type="text" className="form-control" id="in" placeholder='Search ...' />
                                <button type='button' className='search btn'>Search</button>
                            </form>
                        </div>
                    </div>
                </section>

                <section className='blog-page'>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12 col-lg-8">
                                <div className="title-page">Blog</div>

                                <div className="single-post">
                                    <div className="images-post">
                                        <Slider {...settingsArticle}>
                                            {this.props.item && this.props.item.images.map((obj, index) => (
                                                <div key={index} className="image">
                                                    <img src={obj.image} alt={`${this.props.item.name} - ${index}`} />
                                                </div>

                                            ))}
                                        </Slider>

                                    </div>
                                    <div className="body-single-post">
                                        <div className="title">
                                            <h2>{this.props.item && this.props.item.name}</h2>
                                        </div>
                                        <div className="info-single-post">
                                            <div className="w-100 d-flex justify-content-between">
                                                <div className="location">
                                                    <LiaMapMarkerSolid className='icon' />
                                                    {this.props.item && this.props.item.adress}
                                                </div>
                                                <div className="contact">
                                                    {this.props.item && this.props.item.site && (
                                                        <button type="button" className="btn" onClick={() => { this.copyToClipboard('Site', this.props.item.site) }}
                                                            data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Tooltip on top">
                                                            <TbWorld className='icon' />
                                                        </button>)}
                                                    {this.props.item && this.props.item.phoneNumber && (
                                                        <button type='button' className='btn' onClick={() => { this.copyToClipboard('PhoneNumber', this.props.item.phoneNumber) }}
                                                            data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Tooltip on top">
                                                            <BiPhone className='icon' />
                                                        </button>)}
                                                </div>
                                            </div>

                                            <div className="mt-2 w-100 d-flex justify-content-between">
                                                {this.props.item && this.props.item.timetable && (<button className='timetabel btn'>
                                                    <BiTimeFive className='icon' />
                                                    {this.props.item.timetable}
                                                </button>)}
                                                <div className="price">
                                                    <BsTicketPerforated className='icon' />
                                                    {this.props.item && (this.props.item.price) ? (this.props.item.price + ' MAD') : 'Free'}
                                                </div>
                                            </div>

                                        </div>
                                        <div className='bar-dash'></div>
                                        <div className="article-body">
                                            {this.props.item && this.props.item.description}
                                            <br /><br />
                                            Eget aenean tellus venenatis. Donec odio tempus. Felis arcu pretium metus nullam quam aenean sociis quis sem neque vici libero. Venenatis nullam fringilla pretium magnis aliquam nunc vulputate integer augue ultricies cras. Eget viverra feugiat cras ut. Sit natoque montes tempus ligula eget vitae pede rhoncus maecenas consectetuer commodo condimentum aenean.
                                            Aenean eleifend ante maecenas pulvinar montes lorem et pede dis dolor pretium donec dictum. Vici consequat justo enim. Venenatis eget adipiscing luctus lorem. Adipiscing veni amet luctus enim sem libero tellus viverra venenatis aliquam. Commodo natoque quam pulvinar elit.
                                            <br /><br />
                                            Eget aenean tellus venenatis. Donec odio tempus. Felis arcu pretium metus nullam quam aenean sociis quis sem neque vici libero. Venenatis nullam fringilla pretium magnis aliquam nunc vulputate integer augue ultricies cras. Eget viverra feugiat cras ut. Sit natoque montes tempus ligula eget vitae pede rhoncus maecenas consectetuer commodo condimentum aenean.
                                        </div>
                                        <div className="nav tag-cloud">
                                            {this.props.item && this.props.item.categories.map((categorie, index) => (
                                                <a key={index} href="/">{categorie}</a>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="comments">
                                    <div className="header-comments">
                                        <div className="statistique">
                                            <div className="left-statistique">
                                                <div className='line-progress'>
                                                    5
                                                    <div className="progress">
                                                        <div className={`progress-bar w-${this.props.statistic ? this.props.statistic['5'] : 10}`}>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='line-progress'>
                                                    4
                                                    <div className="progress">
                                                        <div className={`progress-bar w-${this.props.statistic ? this.props.statistic['4'] : 50}`}>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='line-progress'>
                                                    3
                                                    <div className="progress">
                                                        <div className={`progress-bar w-${this.props.statistic ? this.props.statistic['3'] : 70}`}>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='line-progress'>
                                                    2
                                                    <div className="progress">
                                                        <div className={`progress-bar w-${this.props.statistic ? this.props.statistic['2'] : 20}`}>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='line-progress'>
                                                    1
                                                    <div className="progress">
                                                        <div className={`progress-bar w-${this.props.statistic ? this.props.statistic['1'] : 5}`}>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="right-statistique">
                                                <div className="number-reviews">
                                                    {this.props.item ? this.props.item.stars : 5}
                                                </div>
                                                <Rating className='rating'
                                                    style={{ maxWidth: 80 }}
                                                    value={this.props.item ? this.props.item.stars : 5}
                                                    readOnly
                                                />
                                                <div className="reviews-count">
                                                    {this.props.item && this.props.item.review_count}
                                                </div>
                                            </div>
                                        </div>

                                        {this.props.isAuthenticated && (<>
                                            <button type='button' onClick={this.onClick_show} className='btn btn-add-review'>
                                                <MdOutlineRateReview className='icon' />
                                                Write a review
                                            </button>
                                            <div className='add-review' id='add-review'>
                                                <form onSubmit={this.onSubmit}>
                                                    <div className="user">
                                                        <img src={this.props.user && this.props.user.image} alt={this.props.user.first_name} className='rounded-circle avatar' />
                                                        <div className="name">
                                                            {this.props.user && (this.props.user.first_name) + ' ' + (this.props.user.last_name)}
                                                            <div className="city">
                                                                {this.props.user && (this.props.user.city) + ', ' + (this.props.user.country)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="review">
                                                        <Rating className='rating'
                                                            style={{ maxWidth: 200 }}
                                                            value={rating}
                                                            itemStyles={customStyles}
                                                            onChange={this.setRating}
                                                            spaceBetween="small"
                                                            spaceInside="medium"
                                                            isRequired
                                                        />
                                                        <div className="form-floating">
                                                            <textarea onChange={this.onChange}
                                                                className="form-control" placeholder="Leave a comment here"
                                                                id="floatingTextarea" name='comment' value={comment}>
                                                            </textarea>
                                                            <label htmlFor="floatingTextarea">Comments</label>
                                                        </div>
                                                    </div>
                                                    <div className="footer-review">
                                                        <button type='button' onClick={this.onClick_cancel} className='btn btn-cancel'>Cancel</button>
                                                        <button type='submit' disabled={!rating || !comment} className='btn btn-post' >Post</button>
                                                    </div>
                                                </form>
                                            </div>
                                        </>)}

                                    </div>

                                    <div className='bar-dash'></div>
                                    <div className="body-comments">
                                        <h3 className="title mb-2">Riviews</h3>

                                        {this.props.reviews && this.props.reviews.map((review, index) => (
                                            <div key={index} className="single-comment">
                                                <div className="user">
                                                    <img src={review.user.image} alt={review.user.first_name} className='rounded-circle avatar' />
                                                    <div className="name">
                                                        {review.user.first_name} {review.user.last_name}
                                                        <div className="city">
                                                            {review.user.city}, {review.user.country}
                                                        </div>
                                                    </div>
                                                </div>
                                                <Rating className='rating-comment'
                                                    style={{ maxWidth: 80 }}
                                                    value={review.rating}
                                                    readOnly
                                                />
                                                <p className="comment">
                                                    {review.comment}
                                                </p>
                                                <span className='date'>Written on {this.formatDate(review.date)}</span>
                                            </div>
                                        ))}

                                        <ul className="pagination">
                                            <li className="page-item"><button className="page-link" disabled={!links || !links.previous} onClick={this.prevPage}>Previous</button></li>
                                            <li className="page-item"><button className="page-link" disabled={!links || !links.next} onClick={this.nextPage}>Next</button></li>
                                        </ul>
                                    </div>

                                </div>

                            </div>

                            <div className="col-md-12 col-lg-4">
                                <div className="title-page">Similar Blogs</div>
                                <div className="popular-post">
                                    <div className="row">
                                        {this.props.items_content && this.props.items_content.map((item, index) => (
                                            <div key={index} className="col-lg-12">
                                                <Link to={'/blog/' + item._id} target="_blank" className='text-decoration-none'>
                                                    <div className="single_post">
                                                        <p className="m-b-0">{item.name}</p>
                                                        <div className="img-post">
                                                            <img src={item.images[0].image} alt={item.name} />
                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* <div className="title-page mt-3">Categories</div>
                                <div className="categories">
                                    <ul className="list-unstyled">
                                        {categories && categories.map((categorie, index) => (
                                            <li key={index}><button type='button' onClick={() => this.filter_with_categiry(categorie)} className='btn btn-categ'>{categorie}</button></li>
                                        ))}
                                    </ul>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )
    }
}


const mapStateToProps = (state) => ({
    item: state.items.item,
    user: state.auth.user,
    isAuthenticated: state.auth.isAuthenticated,
    reviews: state.reviews.reviews,
    links: state.reviews.links,
    items_content: state.items.items_content,
    statistic: state.reviews.statistic,
});

export default connect(mapStateToProps, { getItem, getSimilarItemStatique, getSimilarItemIA, getItemsWithCategory, addReview, getReviewsItem, getStatisticReviews })(withRouter(Article));
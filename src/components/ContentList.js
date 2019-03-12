import React, { Component } from 'react';
import { connect } from 'react-redux';
import { contentsFetchData } from '../actions/contents';
import { ListGroup, ListGroupItem } from 'reactstrap';
import { properties } from '../config/properties.js';
import PropTypes from 'prop-types'
import ProblemContentForm from "./ProblemContentForm";
import defaultuser from './default-avatar.png';
import {FaThumbsUp, FaShare} from "react-icons/fa";

import   './content.css';
import {
    Row,
    Col } from 'reactstrap';
import InfiniteScroll from "react-infinite-scroll-component";
var amount=9;
class ContentList extends Component {

    componentDidUpdate(prevProps) {
        // only update chart if the data has changed
        console.log(this.props.searchCriteria);
        if (prevProps.searchCriteria !== this.props.searchCriteria) {
            this.props.fetchData(properties.serverUrl+ properties.getTitle + this.props.searchCriteria.title+ "/"+ amount);
        }

    }
    fetchMoreData = () => {
        this.props.fetchData(properties.serverUrl+ properties.getTitle + this.props.searchCriteria.title+ "/"+ (10 + amount));
    };


    render() {

        if (this.props.hasErrored) {
            return <p>Sorry! There was an error loading the contents</p>;
        }

        if (this.props.isLoading) {
            return <p>Loading…</p>;
        }
        const list=<ListGroup>
            {this.props.contents.map((content) => (
                <ListGroupItem key={content.id}>

                    <Row>
                        <Col xs="2" sm="1">
                            <img  className="picture align-baseline"  src={defaultuser} alt="Generic placeholder image" />
                        </Col>
                        <Col xs="9">
                            <Row>
                                <Col>
                                    <p className="text-left align-text-top"><b>{content.username}</b></p>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <p className="text-justify align-middle">{content.text}</p>
                                </Col>
                            </Row>

                            <Row>
                                <Col>

                                    9 <FaThumbsUp/>

                                    {' '}

                                    9 <FaShare/>
                                </Col>
                            </Row>

                        </Col>
                    </Row>

                </ListGroupItem>
            ))}
        </ListGroup>;

        return (
            <div>
                <b>  {this.props.match.params.title} </b>
            <ProblemContentForm title={this.props.match.params.title}/>
                <div id="scrollableDiv" style={{ height: 700, overflow: "auto" }}>

                    <InfiniteScroll
                        dataLength={this.props.contents.length}
                        next={this.fetchMoreData}
                        hasMore={true}
                        loader={<br/>}
                        scrollableTarget="scrollableDiv"
                    >
                        {list}
                    </InfiniteScroll>
                </div>
            </div>
        );
    }
}

ContentList.propTypes = {
    searchCriteria:  PropTypes.object.isRequired,
    fetchData: PropTypes.func.isRequired,
    contents: PropTypes.array.isRequired,
    hasErrored: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => {
    return {
        searchCriteria: state.searchCriteria,
        contents: state.contents,
        hasErrored: state.contentsHasErrored,
        isLoading: state.contentsIsLoading
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchData: (url) => dispatch(contentsFetchData(url))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ContentList);

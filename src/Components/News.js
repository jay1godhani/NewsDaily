import React, { useState, useEffect } from 'react';
import NewsItem from './NewsItem';
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';

const News = (props) => {
    const { country, pageSize, category, setProgress, apikey } = props;

    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);

    // Set document title
    useEffect(() => {
        document.title = `${capsFirstLetter(category)} - NewsDaily`;
    }, [category]);

    // Fetch articles on mount and when page changes
    useEffect(() => {
        fetchArticles();
    }, [page]);

    const capsFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const fetchArticles = async () => {
        setProgress(10);
        const APIURL = `https://newsapi.org/v2/top-headlines?country=${country}&page=${page}&pageSize=${pageSize}&category=${category}&apikey=${apikey}`;
        setLoading(true);

        try {
            const data = await fetch(APIURL);
            setProgress(30);
            const parsedData = await data.json();
            setProgress(50);
            setArticles(parsedData.articles);
            setTotalResults(parsedData.totalResults);
            setLoading(false);
            setProgress(100);
        } catch (error) {
            console.error("Error fetching articles:", error);
            setLoading(false);
        }
    };

    const fetchMoreData = async () => {
        const APIURL = `https://newsapi.org/v2/top-headlines?country=${country}&page=${page + 1}&pageSize=${pageSize}&category=${category}&apikey=${apikey}`;
        
        const data = await fetch(APIURL);
        const parsedData = await data.json();
        setArticles(prevArticles => prevArticles.concat(parsedData.articles));
        setTotalResults(parsedData.totalResults);
        setPage(prevPage => prevPage + 1);
        setLoading(false);
    };

    return (
        <div className="container my-3">
            <h2 className="text-center" style={{marginTop:'70px'}}>NewsDaily - {capsFirstLetter(category)}</h2>
            {loading && <Spinner />}
            <InfiniteScroll
                dataLength={articles.length}
                next={fetchMoreData}
                hasMore={articles.length < totalResults}
                loader={<Spinner />}
            >
                <div className="container">
                    <div className="row">
                        {articles.map((element) => (
                            <div className="col-md-4" key={element.url}>
                                <NewsItem
                                    imageUrl={!element.imageUrl ? element.urlToImage : "https://cdn.mos.cms.futurecdn.net/KFYK597DSUUZPofW9dyiL5-1200-80.jpg"}
                                    title={element.title ? element.title.slice(0, 44) : ""}
                                    description={element.description ? element.description.slice(0, 88) : ""}
                                    newsUrl={element.url} 
                                    author={element.author} 
                                    date={element.publishedAt} 
                                    source={element.source.name}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </InfiniteScroll>
        </div>
    );
};

News.defaultProps = {
    country: 'us',
    pageSize: 6,
    category: 'general'
};

News.propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
    setProgress: PropTypes.func.isRequired,
    apikey: PropTypes.string.isRequired,
};

export default News;

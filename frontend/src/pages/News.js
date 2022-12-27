import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import NewsCard from '../components/NewsCard';

function News({ authorization }) {
    const [data, setData] = useState([{
        title: 'Loading...',
        description: 'Please wait while we load the news...',
        author: 'Server'
    }]);

    useEffect(() => {
        getNews();
    }, []);

    function getNews() {
        fetch('https://localhost:3001/news/' + authorization)
            .then((res) => {
                return res.json();
            })
            .then((res) => {
                setData(res);
                
                if (res.length === 0) {
                    const error = {
                        title: 'No news found',
                        description: 'Ops, we couldn\'t find any news for you!',
                        author: 'Server'
                    }

                    setData([error]);
                }
            })
            .catch((err) => {
                const error = {
                    title: 'Error',
                    description: 'Ops, something went wrong! Please try again later or check your authentication certificate.',
                    author: 'Server'
                }

                setData([error]);
            });
    }

    return (
        <div className='news flex flex-col h-screen justify-between'>
            <Navbar />

            <h1 className="text-4xl font-bold text-center my-10">{authorization.charAt(0).toUpperCase() + authorization.slice(1) + " News"}</h1>

            <div className="w-20 h-1 bg-gray-700 mx-auto mb-10"></div>

            <div className="px-20 grid gap-10 mb-8 rounded-lg shadow-sm dark:border-gray-700 md:mb-12 md:grid-cols-1">
                { 
                    data.map((item, index) => {
                        return (
                            <NewsCard title={item.title}
                                description={item.description}
                                author={item.author}
                                job={item.job}
                                key={index} />
                        )
                    })
                }
            </div>

            <Footer />

        </div>
    )
}

export default News
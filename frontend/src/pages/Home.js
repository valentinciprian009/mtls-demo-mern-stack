import '../styles/Home.css';

import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Footer from '../components/Footer';

function Home() {
    return (
        <div className="home flex flex-col h-screen justify-between">
            <Navbar />

            <h1 className="text-4xl font-bold text-center my-10">Home</h1>

            <div className="w-20 h-1 bg-gray-700 mx-auto mb-10"></div>

            <div className="cards px-10 mb-20 grid md:grid-cols-3 gap-10 sm:grid-cols-2">
                <Card image='https://www.svgrepo.com/show/91541/newspaper.svg' 
                        title='Public news'
                        description='Latest news accessible by every employee of our organization...'
                        link='/news/public' />
                <Card image='https://www.svgrepo.com/show/91541/newspaper.svg' 
                        title='Private news'
                        description='Latest news accessible by a selected group of employees of our organization...'
                        link='/news/private' />
                <Card image='https://www.svgrepo.com/show/91541/newspaper.svg' 
                        title='Admin news'
                        description='Latest news accessible only by the admin of our organization...'
                        link='/news/admin' />
            </div>

            <Footer />
        </div>
    );
}

export default Home;
import Footer from "../components/Footer"
import Navbar from "../components/Navbar"

function E404() {
    return (
        <div className="e404 flex flex-col h-screen justify-between">
            <Navbar />
            <section className="flex items-center h-full p-16 bg-gray-100 light:bg-gray-100 light:text-gray-600">
                <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
                    <div className="max-w-md text-center">
                        <h2 className="mb-8 font-extrabold text-9xl light:text-gray-900">
                            <span className="sr-only">Error</span>404
                        </h2>
                        <p className="text-2xl font-semibold md:text-3xl">Sorry, we couldn't find this page.</p>
                        <p className="mt-4 mb-8 light:text-gray-400">But don't worry, you can find plenty of other things on our homepage.</p>
                        <a href="/" type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 light:bg-blue-600 light:hover:bg-blue-700 light:focus:ring-blue-800">Back to homepage</a>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    )
}   

export default E404
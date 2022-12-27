function NewsCard({ title, description, author, job}) {
    return (
        <figure className="flex flex-col items-center justify-center p-8 text-center bg-white border-b border-gray-200 rounded md:border-r dark:bg-gray-800 dark:border-gray-700">
            <blockquote className="max-w-2xl mx-auto mb-4 text-gray-500 lg:mb-8 dark:text-gray-400">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
                <p className="my-4 font-light">{description}</p>
            </blockquote>
            <figcaption className="flex items-center justify-center space-x-3">
                <img className="rounded-full w-9 h-9" src="https://w7.pngwing.com/pngs/527/663/png-transparent-logo-person-user-person-icon-rectangle-photography-computer-wallpaper.png" alt="profile picture" />
                <div className="space-y-0.5 font-medium dark:text-white text-left">
                    <div>{author}</div>
                    <div className="text-sm font-light text-gray-500 dark:text-gray-400">{job}</div>
                </div>
            </figcaption>
        </figure>
    )
}

export default NewsCard
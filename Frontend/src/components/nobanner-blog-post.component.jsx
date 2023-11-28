import { Link } from "react-router-dom";
import { getDay } from "../common/date";
const MinimalBlogPost = ({ blog, index }) => {
    let { title, blog_id : id, author: { personal_info : { fullname, username, profile_img } }, publishedAt } = blog
    return(
        <Link to={`/blog/${id}`} className="flex items-start  gap-6 mb-5">
            <div>
                <h1 className="text-5xl opacity-10 font-bold">{index < 10 ? "0" + (index + 1) : index}</h1>
            </div>
            <div>
                <div className="flex items-center mb-5 gap-2">
                    <img className="w-6 h-6 rounded-full" src={profile_img} alt="prof_img" />
                    <p className="line-clamp-1">{fullname} @{username}</p>
                    <p className='min-w-fit'>{getDay(publishedAt)}</p>
                </div>
                <h1 className="blog-title line-clamp-2">{title}</h1>
            </div>
        </Link>
    )
}

export default MinimalBlogPost;
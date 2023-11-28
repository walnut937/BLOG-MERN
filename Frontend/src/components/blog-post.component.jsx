import { getDay } from '../common/date.jsx';
import { Link } from 'react-router-dom';
const BlogPostCard = ({ content, author }) => {

    let { publishedAt, tags, title, des, banner, activity : { total_likes }, blog_id: id } = content;
    let { personal_info: {fullname, profile_img, username} } = author 

    return(
        <Link to={`/blog/${id}`} className='flex  items-center gap-8 border-b border-grey bg-5'>
            <div className="w-full my-4">
                <div className="flex gap-2 items-center mb-7">
                    <img src={profile_img} alt="prof_img" className="w-6 h-6 rounded-full" />
                    <p className="line-clamp-1">{fullname} @{username}</p>
                    <p className='min-w-fit'>{getDay(publishedAt)}</p>
                </div>

                <h1 className='blog-title mb-2 md:mb-0'>{title}</h1>
                <p className='my-3 text-xl font-gelasio leading-7 max-sm:hidden md:max-[1100px]:hidden line-clamp-2'>{des}</p>

                <div className='flex items-center'>
                    <span className='btn-light py-1 px-4 text-sm'>{tags[0]}</span>
                    <span className='ml-3 flex items-center gap-2'>
                    <i className="fi fi-rr-heart"></i>
                        {
                            total_likes
                        }
                    </span>
                </div>
            </div>
            <div className='h-28 aspect-square'>
                <img src={banner} alt="banner" className='w-full h-full aspect-square rounded-md' />
            </div>
        </Link>
    )
}

export default BlogPostCard;
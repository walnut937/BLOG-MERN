import React, { useState } from 'react'
import Pageanimation from '../common/Pageanimation'
import InpageNavigationComponent from '../components/InpageNavigationComponent'
import axios from 'axios'
import { useEffect } from 'react'
import Loader from '../components/loader.component'
import BlogPostCard from '../components/blog-post.component'
import MinimalBlogPost from '../components/nobanner-blog-post.component'
import { activeTabRef } from '../components/InpageNavigationComponent'
import NoDataMessage from '../components/nodata.component'

function HomePage() {

  const [ blogdata, setBlogdata ] = useState(null);
  const [ trendingblogdata, setTrendingBlogs ] = useState(null);
  const [ pageState, setPageState ] = useState('home')

  let categories = ["programming", "hollywood", "film making", "social media", "cooking", "travel", "poem", "coding" , "supercars", "manga", "anime", "computer"];


  //fetching blogs by tags
  const FetchBlogByCategory = () => {
    axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", { tag: pageState })
    .then( blog => {
      setBlogdata(blog.data.blog)
    })
    .catch(err => {
      console.log(err)
    })
  }


  //loadBlogbyCategoty
  const loadBlogbyCategoty = (e) => {
    let category = e.target.innerText.toLowerCase();
    setBlogdata(null);
    if(pageState == category){
      setPageState("home")
      return ;
    }
    setPageState(category)
  }


  // fetching blogs
  const FetchLatestBlogs = () => {
    axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/latest-blogs")
    .then( blog => {
      setBlogdata(blog.data.blog)
    })
    .catch(err => {
      console.log(err)
    })
  }


  //fetching trending blogs
  const FetchTrendingBlogs = () => {
    axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/trending-blogs")
    .then( blog => {
      setTrendingBlogs(blog.data.blog)
    })
    .catch(err => {
      console.log(err)
    })
  }


  // call func by rerendering
  useEffect(() => {

    activeTabRef.current.click();

    if(pageState == 'home'){
      FetchLatestBlogs()
    }else{
      FetchBlogByCategory()
    }
    if(trendingblogdata == null){
      FetchTrendingBlogs() 
    }
  }, [pageState])
  

  return (
    <Pageanimation>
        <section className='md:h-screen md:flex md:justify-center gap-10'>
            {/* latest blogs */}
            <div className='w-full'>
                <InpageNavigationComponent routes={[ pageState, "Trending Blogs"]} defaultHidden={["Trending Blogs"]}>
                    <>
                    {

                      blogdata === null ? <Loader /> : 
                      blogdata.length ? 
                      blogdata.map((blog, i) => {
                        return <Pageanimation key={i} transition={{duration : 1, delay: i*.8}}>
                                    <BlogPostCard content={blog} author={blog.author} />
                              </Pageanimation>
                      }) : <NoDataMessage message={"No Blog Found!"} />

                    }
                    </>
                    {
                      trendingblogdata === null ? <Loader /> : 
                      trendingblogdata.length ? 
                      trendingblogdata.map((blog, i) => {
                        return <Pageanimation key={i} transition={{duration : 1, delay: i*.8}}>
                                    <MinimalBlogPost blog={blog} index={i} />
                              </Pageanimation>
                      }) : <NoDataMessage message={"No Trending Blog Found!"} />
                    }
                </InpageNavigationComponent>
            </div>


            {/* filters and trending blogs */}
            <div className='max-w-[40%] border-l border-grey pl-8 hidden md:block'>
                <div className='flex flex-col gap-7'>

                  {/* Tags */}
                    <h1 className='font-medium text-xl mb-2'>Stories from all interest</h1>

                    <div className='flex flex-wrap gap-3 mb-10'>
                      {
                          categories.map((category, i) => {
                              return (
                                <button key={i} className={`tag ${pageState == category ? 'bg-black text-white' : ''}`} onClick={loadBlogbyCategoty}>{category}</button>
                              )
                          })
                      }
                    </div>
                </div>

                {/* Trending Blogs */}
                <div className='font-medium text-xl mb-8'>
                  <h1 className='mb-5'>Trending <span><i className='fi fi-rr-arrow-trend-up'></i></span></h1>

                  { 
                    trendingblogdata === null ? <Loader /> : 
                    trendingblogdata.length ? 
                    trendingblogdata.map((blog, i) => {
                      return <Pageanimation key={i} transition={{duration : 1, delay: i*.8}}>
                                  <MinimalBlogPost blog={blog} index={i} />
                            </Pageanimation>
                    }) : <NoDataMessage message={"No Trending Blog Found!"} />
                  }
                </div>
            </div>
        </section>
    </Pageanimation>
  )
}

export default HomePage
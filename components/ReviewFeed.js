import { useEffect, useState } from "react";
//import { AvatarIcon } from "./RadixComponents";
import Image from "next/dist/client/image";
import {useSession} from 'next-auth/react'
import Avatar from '../public/Avatar.jpg'

const ReviewFeed = () => {
  const [reviews, setReviews] = useState([]);
  const {data: session} = useSession();

  useEffect(() => {
    async function fetchReview() {
      const response = await fetch("/api/reviews/getReview");
      const data = await response.json();
      setReviews(data);
      
    }
    fetchReview();
  }, []);

    console.log(reviews)
    return (
        <div>
          {reviews.length ? (
            reviews.map((review, index) => (
              <div key={index}>
               
        <div className="bg-neutral-50 container rounded-lg flex flex-col h-2/5 w-2/3 ">
          <div className="order-1  w-100% h-12 rounded-t-lg  bg-green-400">
            <h1 className="text-red-400 flex inset-x-0 top-0 justify-start float-left">
              <h1>avatar</h1>
            </h1>
            <h1 className="text-black">email</h1>
            <p className="text-blue-400 px-16">{new Date(review.createdAt).toString()}</p>
          </div>
          <div className="order-2 flex w-full h-3/4 overflow-hidden ">
            <div id='main-left' className="flex w-2/3">

            <Image alt="Avatar" src={Avatar}></Image>
            </div>
            <div id='main-right' className=" bg-black w-full">
              <div className=" bg-blue-400 flex justify-center">
            <h1 className="text-black text-2xl">{review.movieTitle}</h1>
            
              </div>
              <div className="bg-white flex justify-start">
                <h2 className="text-gray-500" >Release Date || Genre</h2>
              </div>

              <div className="bg-black h-5/6 flex flex-row">
                <div className="self-center order-1">
                  <h1 className="text-white text-3xl pl-2 ">{review.sliderRating}</h1> 
                  
                  
                </div>

                <div className="self-center order-2 pl-10">
                <p className="text-white ">TEXT REVIEW</p>
                </div>
              </div>
            </div>
          </div>
          <div className="order-3 w-full h-12 rounded-b-lg bg-red-500">

          <div className="flex flex-row w-full h-12 justify-around">

            <p className="text-black self-center">Like</p>
            <p className="text-black self-center">Comment</p>
            <p className="text-black self-center">Share</p>
            
         </div>

          </div>
        
      </div>
              </div>
            ))
          ) : (
            <p>Loading reviews...</p>
          )}
        </div>
      );
    };

export default ReviewFeed;

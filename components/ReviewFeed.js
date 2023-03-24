
import { useState, useRef, useEffect } from "react";




const ReviewFeed = () => {

    async function fuck(){
        const data = await fetch('api/reviews/postReviews', {
            method: 'GET',
            body:{movieTitle, sliderRating},

        })
        return data
    }
    

    return (
        <div>
            {data}
        </div>  
    )
 }
export default ReviewFeed;
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useQuery } from "@tanstack/react-query";
import Autoplay from "embla-carousel-autoplay";

function TopMovies() {
  const router = useRouter();

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return "0.0"; // handle undefined, null, or empty reviews

    const totalRating = reviews.reduce((sum, title) => {
      if (typeof title.sliderRating !== "number") return sum; // skip invalid ratings
      return sum + title.sliderRating;
    }, 0); // provide initial value of 0
    const averageRating = totalRating / reviews.length;
    const averageString = averageRating.toFixed(1).toString();
    const lastChar = averageString.charAt(averageString.length - 1);
    return lastChar === "0"
      ? averageRating.toFixed(0)
      : averageRating.toFixed(1);
  };

  async function getHighestReviews() {
    const data = await fetch("./api/mongoReviews/mongoGetHighestReviews");
    const response = await data.json();

    try {
      // Sort the reviews based on average sliderRating in descending order
      const sortedReviews = response.sort((a, b) => {
        const ratingDiff =
          calculateAverageRating(b.reviews) - calculateAverageRating(a.reviews);
        if (ratingDiff !== 0) return ratingDiff;
        return a._id.localeCompare(b._id); // secondary sort by _id for stability
      });

      const top10Reviews = sortedReviews.slice(0, 10);

      return top10Reviews;
    } catch (err) {
      console.log(err);
    }
  }

  const { data, isSuccess, isPending, isError } = useQuery({
    queryKey: ["topMovies"],
    queryFn: getHighestReviews,
  });

  if (isPending) {
    return <span>loading...</span>;
  }

  if (isError) {
    console.log(isError);
    return <span>Error: {isError.message}</span>;
  }

  return (
    <div className=" w-fit  p-2 ">
      {!isSuccess ? (
        <div className="h-[760px] flex flex-col">
          <div className=" h-[240px] border-b-2 border-l-2 border-slate-600 w-[400px] flex flex-col pt-2 pl-4 ml-[34px] rounded-lg mt-6">
            <div className="w-[350px] bg-slate-600 h-6  rounded-lg mb-3"></div>
            <div className="flex flex-row  ">
              <div className="w-[120px] h-[185px] bg-slate-600 mb-4"></div>
              <div className="flex flex-col self-center items-center ml-2 w-fit  font-semibold justify-center  h-fit">
                <div className="w-28 h-4 bg-slate-600 rounded-lg "></div>
                <div className="w-14 mr-3 h-8 bg-slate-600 rounded-lg mt-1"></div>
              </div>
            </div>
          </div>

          <div className=" h-[240px] border-b-2 border-l-2 border-slate-600 w-[400px] flex flex-col pt-2 pl-4 ml-[34px] rounded-lg mt-6">
            <div className="w-[350px] bg-slate-600 h-6  rounded-lg mb-3"></div>
            <div className="flex flex-row  ">
              <div className="w-[120px] h-[185px] bg-slate-600 mb-4"></div>
              <div className="flex flex-col self-center items-center ml-2 w-fit  font-semibold justify-center  h-fit">
                <div className="w-28 h-4 bg-slate-600 rounded-lg "></div>
                <div className="w-14 mr-3 h-8 bg-slate-600 rounded-lg mt-1"></div>
              </div>
            </div>
          </div>

          <div className="h-[240px] border-b-2 border-l-2 border-slate-600 w-[400px] flex flex-col pt-2 pl-4 ml-[34px] rounded-lg mt-6">
            <div className="w-[350px] bg-slate-600 h-6  rounded-lg mb-3"></div>
            <div className="flex flex-row  ">
              <div className="w-[120px] h-[185px] bg-slate-600 mb-4"></div>
              <div className="flex flex-col self-center items-center ml-2 w-fit  font-semibold justify-center  h-fit">
                <div className="w-28 h-4 bg-slate-600 rounded-lg "></div>
                <div className="w-14 mr-3 h-8 bg-slate-600 rounded-lg mt-1"></div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Carousel
          orientation="vertical"
          opts={{
            align: "start",
            loop: true,
            slidesToScroll: 3,
          }}
          plugins={[
            Autoplay({
              delay: 3000,
              stopOnInteraction: true,
            }),
          ]}
        >
          <CarouselContent className="h-[760px]">
            {data?.map((title, index) => (
              <CarouselItem
                key={index}
                className=" mt-2 basis-1/3 flex flex-row items-center justify-end  gap-4"
              >
                <div>{index + 1}</div>
                <div className="flex-col flex items-start">
                  <div className="border-l-2 border-b-2 border-slate-800 p-1 rounded-lg w-[400px]">
                    <h1 className="text-2xl font-semibold text-white flex justify-start pl-3 ">
                      {title._id}
                    </h1>

                    <div className="flex flex-row">
                      <div className="flex justify-start p-2 cursor-pointer">
                        <Image
                          alt="g"
                          src={title.Poster}
                          height={175}
                          width={125}
                          onClick={() => router.push(`../titles/${title._id}`)}
                        />
                      </div>
                      <div className=" self-center">
                        <p>Average Rating</p>
                        <p className="flex self-center pl-6 text-3xl font-semibold">
                          {calculateAverageRating(title.reviews)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      )}
    </div>
  );
}

export default TopMovies;

import React, { useState } from "react";
import Image from "next/image";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useQuery } from "@tanstack/react-query";

const calculateAverageRating = (reviews) => {
  if (!reviews || reviews.length === 0) return "0.0"; // handle undefined, null, or empty reviews

  const totalRating = reviews.reduce((sum, title) => {
    if (typeof title.sliderRating !== "number") return sum; // skip invalid ratings
    return sum + title.sliderRating;
  }, 0); // provide initial value of 0
  const averageRating = totalRating / reviews.length;

  return averageRating.toFixed(1);
};

function PhoneTopMovies() {
  const [titleClicked, setTitleClicked] = useState(false);
  const [clickedIndex, setClickedIndex] = useState(-1);
  // Function to calculate the average sliderRating for a group of reviews

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

  const { data, isPending, isError } = useQuery({
    queryKey: ["topMovies"],
    queryFn: getHighestReviews,
  });

  if (isPending) {
    return <span>Loading...</span>;
  }

  if (isError) {
    console.log(isError);
    return <span>Error: {isError.message}</span>;
  }

  return (
    <div className="  ">
      <Drawer>
        <DrawerTrigger className="flex text-base bg-slate-800 px-1 rounded-b-lg border-2 border-slate-700 ">
          Top Rated
        </DrawerTrigger>
        <DrawerContent className="bg-slate-900 text-white">
          <DrawerHeader>
            <DrawerTitle className="text-2xl">Top Rated Films</DrawerTitle>
          </DrawerHeader>
          <div className="flex flex-row h-96 overflow-x-scroll gap-2">
            {data?.map((title, index) => (
              <div
                key={index}
                className=" mt-2  flex flex-col items-center  cursor-pointer "
              >
                <p className="font-semibold">{index + 1 + "."}</p>
                <div className="border-2 border-slate-800 p-1 rounded-lg w-40 ">
                  <h1
                    className={`text-xl font-semibold text-white  w-36 relative overflow-hidden text-ellipsis ${
                      title._id.length > 14
                        ? "justify-start inline-block h-7"
                        : "justify-center flex h-8"
                    } text-nowrap ${
                      titleClicked &&
                      clickedIndex === index &&
                      "absolute overflow-visible bg-slate-900 border-2 border-white z-20 w-fit scale-110 px-2"
                    }`}
                    onClick={() => {
                      setTitleClicked(!titleClicked);
                      setClickedIndex(index);
                    }}
                  >
                    {title._id}
                  </h1>

                  <a
                    className="flex justify-center"
                    href={`../titles/${title._id}`}
                  >
                    <Image
                      alt="g"
                      src={title.Poster}
                      height={175}
                      width={125}
                    />
                  </a>
                  <p className="text-xl font-bold flex justify-center">
                    {calculateAverageRating(title?.reviews)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export default PhoneTopMovies;

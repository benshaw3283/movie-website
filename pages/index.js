import MovieAutocomplete from "../components/Autocomplete";
import ReviewFeed from "../components/ReviewFeed";

import TopMovies from "../components/TopMovies";
import Report from "../components/Report";
import ComingSoon from "../components/ComingSoon";
import PhoneTopMovies from "../components/PhoneTopMovies";
import PhoneReport from "../components/PhoneReport";

export default function Home() {
  return (
    <div>
      <title>ShawReviews</title>

      <div className="lg:flex flex-row  justify-between  h-fit lg:h-full bg-slate-950">
        <div className="bg-slate-950  lg:w-1/3 w-0 text-slate-500 lg:sticky top-0 lg:h-full invisible lg:visible grid place-items-center">
          <br></br>
          <br></br>

          <TopMovies />
        </div>

        <div
          //mainDivMiddle
          className="bg-slate-950  flex flex-col container items-center lg:w-full  h-fit "
        >
          <div className="flex flex-row justify-center gap-4 place-items-start w-full pb-2">
            <div className="flex order-1 visible lg:invisible text-slate-500 font-semibold">
              <PhoneTopMovies />
            </div>

            <div className="order-2 flex visible lg:invisible text-slate-500 font-semibold">
              <PhoneReport />
            </div>
          </div>

          <div className="bg-slate-800 border-2 border-slate-700 rounded-lg container justify-center  flex lg:w-3/5 w-5/6 lg:h-2/5 py-1 order-1 ">
            <MovieAutocomplete />
          </div>

          <div className="order-2 ">
            <br></br>
          </div>

          <div className="bg-slate-950 lg:w-3/5 w-full h-2/5 flex justify-center container items-center rounded-lg order-3  ">
            <div className="w-full">
              <ReviewFeed />
            </div>
          </div>

          <div className="order-4 ">
            <br></br>
            <br></br>
          </div>
        </div>

        <div className="bg-slate-950 text-slate-500 lg:w-1/3 w-0 lg:sticky shadow-inner shadow-slate-700 rounded-lg pb-10 mt-4 right-6  lg:top-0 bottom-0 lg:h-full h-0 lg:visible collapse lg:grid place-items-center absolute">
          <br></br>
          <br></br>
          <br></br>

          <Report />

          <br></br>
          <br></br>
          <ComingSoon />
        </div>
      </div>
    </div>
  );
}

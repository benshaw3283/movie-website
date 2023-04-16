
import MovieAutocomplete from "../components/Autocomplete";
import ReviewFeed from "../components/ReviewFeed";

export default function Home() {
  return (
    <div>
      <title>Movie Website</title>

      <div className="flex flex-row justify-between align-center h-screen pt-12">
        <div className="bg-slate-900 w-1/3 ">
          <p>gg</p>
        </div>

        <div
          id="mainDivMiddle"
          className="bg-slate-900 flex flex-col container items-center w-full h- "
        >
         

          <div className="bg-slate-800 border-2 border-slate-700 rounded-lg container justify-center flex w-1/2 h-2/5 py-1 order-1 ">
           

            <MovieAutocomplete />
      

          </div>
<br></br>
          <div className="bg-white w-1/2 h-2/5 flex justify-center container items-center rounded-lg order-3  ">
              
              <div className="w-full">
              <ReviewFeed />
              </div>
            </div>
           
            

          <div className="order-2 h-1/6"></div>

          <div className="bg-white w-1/2 h-2/5 flex justify-center container items-center rounded-lg order-3 ">
              
              <div className="w-full">
              <ReviewFeed />
              </div>
            </div>

        </div>

        <div className="bg-slate-900 w-1/3 ">
          <p>dsggs</p>
        </div>
      </div>
    </div>
  );
}

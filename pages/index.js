
import MovieAutocomplete from "../components/Autocomplete";
import ReviewFeed from "../components/ReviewFeed";


export default function Home() {


  return (
    <div>
      <title>Movie Website</title>

      <div className="flex flex-row justify-between  h-full bg-slate-900">
        <div className="bg-slate-900 w-1/3 text-slate-500 sticky top-0 h-full grid place-items-center">
        <br></br>
          <br></br>
          <br></br>
          <br></br>
          
          <p>agfafajsfajsf</p>
          <p>agfafajsfajsf</p>
          <p>agfafajsfajsf</p>
          <p>agfafajsfajsf</p>
          <p>agfafajsfajsf</p>
          <p>agfafajsfajsf</p>
          <p>agfafajsfajsf</p>
          <p>agfafajsfajsf</p>
        </div>

        

        <div
          //mainDivMiddle
          className="bg-slate-900  flex flex-col container items-center w-full  h-fit "
        >
         
         <br></br>

          <div className="bg-slate-800 border-2 border-slate-700 rounded-lg container justify-center flex w-1/2 h-2/5 py-1 order-1 ">
           

            <MovieAutocomplete />
      

          </div>

          <div className="order-2 ">
            <br></br>
            <br></br>
          </div>

          <div className="bg-slate-900 w-1/2 h-2/5 flex justify-center container items-center rounded-lg order-3  ">
              
              <div className="w-full">
              <ReviewFeed  />
              </div>
            </div>

            <div className="order-4 ">
            <br></br>
            <br></br>
          </div>

            <div className="bg-slate-900 w-1/2 h-2/5 flex justify-center container items-center rounded-lg order-5  ">
              
              <div className="w-full">
              <ReviewFeed />
              </div>
            </div>
           

        </div>

        <div className="bg-slate-900 text-slate-500 w-1/3 sticky top-0 h-full grid place-items-center ">
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          
          

          
          <p>agfafajsfajsf</p>
          <p>agfafajsfajsf</p>
          <p>agfafajsfajsf</p>
          <p>agfafajsfajsf</p>
          <p>agfafajsfajsf</p>
          <p>agfafajsfajsf</p>
          <p>agfafajsfajsf</p>
          <p>agfafajsfajsf</p>

          

        </div>
      </div>
    </div>
  );
}

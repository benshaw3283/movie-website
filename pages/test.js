
import Avatar from "../public/Avatar.jpg";
import Image from "next/image";
import { useRef, useEffect } from "react";


const Fuck = () => {

  const movieInput = useRef('');

  async function fetchTitles(){

    const url = 'http://www.omdbapi.com/?apikey=4f46879e&r=json&t=the+dark+knight';
const options = {
  method: 'GET',
  
};
  
  try {
    const response = await fetch(url, options);
    const result = await response.json();
   console.log(result.Title, result.Year)
  } catch (error) {
    console.error(error);
  }

  }

  useEffect(() => {
    movieInput.current
  }, []);

  return (
    <div className="bg-black h-screen">
      <input ref={movieInput} value={movieInput.current} type='text'/>
      <button onClick={()=> alert(movieInput.current)}>FETCH TITLES</button>
    </div>
  );
};

export default Fuck;



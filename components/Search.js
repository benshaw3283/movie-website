
import React, {useState, useRef, useEffect} from 'react'
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import tvList from "./TvList";
import movieList from '../pages/movieList';
import { makeStyles } from "@material-ui/core/styles";
import { useRouter } from "next/router";

const Search = () => {
    const [switchSearchType, setSwitchSearchType] = useState(true)
    const [selected, setSelected] = useState(null)
    const [userList, setUserList] = useState([])
    const router = useRouter()

    const useStyles = makeStyles({
        paper: {
          border: "4px white",
    
          backgroundColor: "rgb(100 116 139)",
        },
      });
    
      const classes = useStyles();

      useEffect(()=> {

      async function fetchUsers(){
        const data = await fetch('/api/mongoReviews/mongoGetUsers');
        const users = await data.json()

        setUserList(()=> users)
        
        
      }
      fetchUsers()
    }, [])

      const handleSwitchSearch = () => {
        setSwitchSearchType(!switchSearchType)
      }

      const handleSearch = ()=> {
        selected ? (
        switchSearchType ? router.push(`../titles/${selected}`) : router.push(`../user/${selected}`)
        ) : (null)
      }

      const titles = [...tvList, ...movieList]

  return (
    <div>
        
      <div className='flex flex-row container'>
      <div className="flex   justify-center mr-1">
        {switchSearchType ? (
          <div className="flex flex-col justify-center bg-slate-700 rounded-lg border-2 border-slate-600">
            <button className="flex order-1 px-1 bg-slate-800 text-sm rounded-lg">
              Movies/TV
            </button>

            <button
              className="flex order-2 text-sm px-1 "
              onClick={() =>
                 handleSwitchSearch()
              }
            >
              Users
            </button>
          </div>
        ) : (
          <div className="flex flex-col justify-center bg-slate-700 rounded-lg border-2 border-slate-600">
            <button
              className="flex order-1 px-1  text-sm rounded-lg"
              onClick={() => handleSwitchSearch()}
            >
              Movies/TV
            </button>

            <button className="flex order-2 text-sm px-1 bg-slate-800 rounded-lg">
              Users
            </button>
          </div>
        )}
      </div>
        <div className='flex order-1 place-self-center'>
      {switchSearchType ? (
        <Autocomplete
                  options={ titles }
                  id="titles"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={'Search'}
                      variant="outlined"
                      className="bg-slate-700 rounded-lg "
                      size='small'
                      onKeyDown={(e) =>
                        e.key === "Enter" ? router.push(`../titles/${selected}`) : null
                      }
                    />
                  )}
                  getOptionLabel_={(option) => option.name}
                  classes={{ paper: classes.paper }}
                  style={{ width: 200 }}
                  
                  freeSolo={true}
                  autoSelect={true}
                  value={selected}
                  onChange={(_event, newValue) => {
                    setSelected(newValue);
                  }}
                />
                ) : (
                    <Autocomplete
                  options={ userList }
                  id="users"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={'Search'}
                      variant="outlined"
                      className="bg-slate-700 rounded-lg "
                      size='small'
                    />
                  )}
                  getOptionLabel_={(option) => option.name}
                  classes={{ paper: classes.paper }}
                  style={{ width: 200 }}
                  freeSolo={true}
                  autoSelect={true}
                  value={selected}
                  onChange={(_event, newValue) => {
                    setSelected(newValue);
                  }}
                />
                )}
                </div>
                <div className='flex order-2 place-self-center cursor-pointer' onClick={()=> handleSearch()}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-whitefloat-right ml-1">
  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
</svg>
</div>
</div>
    </div>
  )
}

export default Search
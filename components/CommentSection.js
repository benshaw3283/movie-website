import React from 'react'
import * as Popover from '@radix-ui/react-popover';
import styles from '../styles/commentSection.module.css'
import {useState, useEffect} from 'react'

const CommentSection =  (props) => {
  const [comments, setComments] = useState([]);

  useEffect(()=> {
    async function fetchComments(){
      const response = await fetch(`api/mongoReviews/mongoGetComments?${props.postId}`);
      const data = await response.json();
      console.log(data)
      const unsorted = data.map((comment) => ({...comment}));
      const sorted = unsorted.reverse()
    
    setComments(()=> {
      const updatedComments = [...sorted];
      return updatedComments;
    })
  }
  fetchComments()

  }, [props])

  return (
    <Popover.Root >
    <Popover.Trigger asChild>
        <button>Comment</button>
    </Popover.Trigger>
    
    <Popover.Portal>
      <Popover.Content className={styles.PopoverContent} sideOffset={5}>
        <div className='flex justify-center '>
        <h1 className=' bg-black'>Comments</h1>
        </div>
        <div className='flex flex-col gap-8'>
        
        </div>
        <Popover.Close />
        <Popover.Arrow />
      </Popover.Content>
    </Popover.Portal>
  </Popover.Root>
  )
}

export default CommentSection
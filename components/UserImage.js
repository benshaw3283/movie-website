import React, { useEffect, useState } from "react";
import Image from "next/image";

const UserImage = (props) => {
  const [image, setImage] = useState(null);

  useEffect(() => {
    async function fetchUserImage() {
      try {
        const response = await fetch("/api/mongoReviews/mongoGetUserImage");
        const data = await response.json();
        setImage(data.image);
      } catch (error) {
        console.error("Error fetching user image:", error);
      }
    }

    fetchUserImage();
  }, []);

  return (
    <div>
      {image && <Image alt="userImage" src={image} width={props.width} height={props.height} />}
    </div>
  );
};

export default UserImage;

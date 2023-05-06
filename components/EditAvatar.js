import React, { useEffect, useRef, useState } from "react";
import Avatar from "react-avatar-edit";
import Image from "next/image";
import { useRouter } from "next/router";

const EditAvatar = (props) => {
  const [src, setSrc] = useState(null);
  const [preview, setPreview] = useState();
  const previewRef = useRef();

  const onClose = () => {
    setPreview(null);
   
  };

  const onCrop = (view) => {
    setPreview(view);
  };

  const router = useRouter();

 
    async function updateUserImage(props) {
      const response = await fetch("/api/mongoReviews/updateUserAvatar", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: props.username,
          avatar64: preview,
        }),
      });
      return response;
    }
   

  return (
    <div>
      <div className="flex ">
        <div className="inline-block px-2">
          <Avatar
            width={200}
            height={200}
            onCrop={onCrop}
            onClose={onClose}
            src={src}
          />
        </div>
        <div className="inline-block">
          {preview && (
            <Image
              src={preview}
              alt="profilePicPreview"
              width={200}
              height={200}
            />
          )}
        </div>
      </div>

      <button
        onClick={() => updateUserImage(props) &&  router.reload() }
        className="text-black"
      >
        Change profile picture!
      </button>
    </div>
  );
};

export default EditAvatar;

import React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import radixStyle from "../styles/radixSign.module.css";

const Notifications = () => {
  return (
    <div>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <div style={{ position: "center", cursor: "pointer" }}>
            <div className="flex align-middle place-self-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6 -z-10"
              >
                <path
                  fillRule="evenodd"
                  d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="w-5 h-5 rounded-full bg-red-600 absolute top-2 ml-2">
                <p className=" text-white font-semibold ml-[6px] -mt-[3px]">
                  1
                </p>
              </div>
            </div>
          </div>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content className={radixStyle.DropdownMenuContent}>
            <DropdownMenu.Item
              className={radixStyle.DropdownMenuItem}
            ></DropdownMenu.Item>

            <div>
              <DropdownMenu.Item></DropdownMenu.Item>
            </div>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
};

export default Notifications;

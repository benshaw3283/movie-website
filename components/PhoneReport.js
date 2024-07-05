import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const PhoneReport = () => {
  const { data: session } = useSession();
  const reportRef = useRef("");
  const { toast } = useToast();

  async function reportBug() {
    let input = reportRef.current.value;
    const response = await fetch("/api/userActions/reportBug", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: session.user.username,
        report: input,
      }),
    });

    if (!session) {
      toast({
        title: "Please sign in to report a bug!",
        className: "bg-slate-900 text-white",
      });
    } else {
      reportRef.current.value = "";
    }

    return response;
  }

  return (
    <div>
      <div className="bg-slate-800 w-fit h-fit rounded-b-lg border-2 border-slate-700 px-1  z-10">
        <Dialog>
          <DialogTrigger>
            <h2 className="flex text-base">Report Bugs</h2>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 rounded-lg">
            <DialogHeader>
              <DialogTitle className="text-white pb-1">
                Report a bug
              </DialogTitle>
              <DialogDescription>
                <textarea
                  ref={reportRef}
                  className="bg-slate-800 w-full  rounded-lg h-16 border border-slate-700 text-sm resize-none p-1 "
                  maxLength="400"
                  wrap="soft"
                />
                <button
                  onClick={() => {
                    !session
                      ? toast({
                          title: "Please sign in to report a bug!",
                          className: "bg-slate-900 text-white",
                        })
                      : reportBug();
                  }}
                  className="flex place-self-center border rounded-lg px-1 bg-slate-800 border-slate-700"
                >
                  Submit
                </button>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default PhoneReport;

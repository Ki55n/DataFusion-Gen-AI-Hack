import Image from "next/image";
import { Toaster, toast } from "react-hot-toast";

export default function Answer({ answer }: { answer: string }) {
  return (
    <div className="container flex h-auto w-full shrink-0 gap-4 rounded-lg border border-solid border-[#C2C2C2] bg-slate-300 p-5 lg:p-10">
      <div className="hidden lg:block">
        <Image
          unoptimized
          src="/img/Info.svg"
          alt="footer"
          width={24}
          height={24}
        />
      </div>
      <div className="w-full">
        <div className="flex items-center font-semibold justify-between pb-3">
          <div className="flex gap-4">
            <Image
              unoptimized
              src="/img/Info.svg"
              alt="footer"
              width={24}
              height={24}
              className="block lg:hidden"
            />
            <h3 className="text-base font-bold uppercase text-black">
              Solution:{" "}
            </h3>
          </div>
          {answer && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(answer.trim());
                  toast("Copied", {
                    icon: "✂️",
                  });
                }}
              >
                <Image
                  unoptimized
                  src="/img/copy.svg"
                  alt="footer"
                  width={20}
                  height={20}
                  className="cursor-pointer"
                />
              </button>
              
            </div>
          )}
          
        </div>
        <div className="flex flex-wrap content-center items-center gap-[15px]">
          <div className="w-full whitespace-pre-wrap text-base font-light leading-[152.5%] text-black">
            {answer ? (
              answer.trim()
            ) : (
              <div className="flex w-full flex-col gap-2">
                <div className="h-6 w-full animate-pulse rounded-md bg-gray-300" />
                <div className="h-6 w-full animate-pulse rounded-md bg-gray-300" />
                <div className="h-6 w-full animate-pulse rounded-md bg-gray-300" />
                <div className="h-6 w-full animate-pulse rounded-md bg-gray-300" />
              </div>
            )}
          </div>
        </div>
        <footer className="bottom-4 left-2 mt-6 ml-0">
              <div className="flex bottom-4 left-4">
                <div className="cursor-pointer outline outline-offset-1 mx-2 rounded-none px-2 bg-slate-400 hover:bg-slate-600 hover:text-gray-300">Details</div>
                <div className="cursor-pointer outline outline-offset-1 mx-2 rounded-none px-2 bg-slate-400 hover:bg-slate-600 hover:text-gray-300">Summary</div>
                <div className="cursor-pointer outline outline-offset-1 mx-2 rounded-none px-2 bg-slate-400 hover:bg-slate-600 hover:text-gray-300">Visualisation</div>
              </div>
            </footer>
      </div>
      
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{ duration: 2000 }}
      />
    </div>
  );
}

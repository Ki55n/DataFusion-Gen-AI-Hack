import Image from "next/image";
import { FC } from "react";
import InputArea from "./InputArea";
import Asidebar from "./Asidebar";

type THeroProps = {
  promptValue: string;
  setPromptValue: React.Dispatch<React.SetStateAction<string>>;
  handleDisplayResult: () => void;
};

const Hero: FC<THeroProps> = ({
  promptValue,
  setPromptValue,
  handleDisplayResult,
}) => {
  const handleClickSuggestion = (value: string) => {
    setPromptValue(value);
  };

  return (
<div className="flex h-screen">
      <Asidebar 
    
        />
   
      <div className="ml-2 flex flex-col bg-gray-900 items-center justify-center">
        <h2 className="bg-custom-gradient bg-clip-text pb-7 pt-20 text-gray-100 text-center text-4xl font-semibold leading-[normal] lg:text-[64px]">
        Analyse smarter & Deeper
      </h2>

      {/* Suggestions section */}
      <div className="flex flex-wrap mx-auto items-center text-gray-100 font-bold px-4 justify-center gap-6 ">
        {suggestions.map((item) => (
          <div
            className="flex h-[35px] cursor-pointer items-center justify-center gap-[5px] rounded-lg text-white border border-gray-600 bg-gray-800 px-6 py-10 shadow-sm transition-colors hover:bg-gray-100 hover:text-black"
            onClick={() => handleClickSuggestion(item?.name)}
            key={item.id}
          >
            <Image
              unoptimized
              src={item.icon}
              alt={item.name}
              width={18}
              height={16}
              className="w-[18px]"
            />
            <div className=" flex">
            <div className="text-sm font-light leading-[normal]">
              {item.name}
            </div>
            
            </div>
            
          </div>
          
        ))}
      </div>
      {/* input section */}
      
      <div className="w-full pb-2 ml-2 py-14">
        <InputArea
          promptValue={promptValue}
          setPromptValue={setPromptValue}
          handleDisplayResult={handleDisplayResult}
        />
        </div>
      </div>
    </div>
  );
};

type suggestionType = {
  id: number;
  name: string;
  icon: string;
};

const suggestions: suggestionType[] = [
  {
    id: 1,
    name: "What is data-fusion?",
    icon: "/img/icon _leaf_.svg",
  },
  {
    id: 2,
    name: "How can I shedule my work?",
    icon: "/img/icon _dumbell_.svg",
  },
  {
    id: 3,
    name: "Can you explain more about my project?",
    icon: "/img/icon _atom_.svg",
  },
  {
    id: 4,
    name: "What is the owner of Ferrari?",
    icon: "/img/ferrari-logo.svg",
  },

  
];

export default Hero;
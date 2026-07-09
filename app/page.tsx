"use client";

import Image from "next/image";
import { PrimaryButton, SuccessButton } from "./components/core/Button";
import { useRouter } from "next/navigation";
import { delay, motion } from "framer-motion";


const parentVariants = {
  animate: {
    transition: {
      staggerChildren: 0.3, 
    },
  },
};



export default function Home() {
  
  const router = useRouter();
  
  return (
    <div className=" m-24 grid grid-cols-12 ">
        <HeroLeftSection/>
        <HeroRightSection/>
        
    </div>
  );
}

const childVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const childVariantsDown = {
  initial: { opacity: 0, y: 0 },
  animate: { opacity: 1, y: 20, transition: { duration: 0.7 } },
};





const HeroLeftSection = () =>
{
  const router = useRouter();
  return(
    <motion.div className=" col-span-5" 
      variants={parentVariants}
      initial="initial"
      animate="animate"
      >
        <div className="">
          <motion.div
              className="text-white font-bold"
              style={{ fontSize: "5rem" }}
              variants={childVariants}
          >
            Look First/
          </motion.div>
        
          <motion.div
            className="text-white font-bold"
            style={{ fontSize: "5rem" }}
            variants={childVariants}
          >
            Then Leap.
          </motion.div>

          <motion.div
            className="text-white font-bold"
            style={{ fontSize: "1.5rem" }}
            variants={childVariants}
          >
            <p className="pt-5 text-slate-500 text-lg leading-snug">The best trades require research, then <br />commitment.</p>
          </motion.div>
            
          <motion.div className="py-10 mr-2 flex" 
          variants={childVariantsDown}
          >
            <SuccessButton onClick={() => router.push("/markets")}>
              Explore Markets
            </SuccessButton>
            <PrimaryButton onClick={() => router.push("/trade/SOL_USDC")}>
              Solana
            </PrimaryButton>
          </motion.div>
      </div>
    </motion.div>
  )
}


const HeroRightSection = () =>
{


  const imageVariants = {
    initial: { opacity: 0, y: 0 },
    animate: { opacity: 1, y: 20, transition: { duration: 0.6  , delay : 1} },
  };


  return(
    <div className="col-span-7   flex flex-col">
          <motion.div className="flex justify-center"
          initial="initial"
          animate="animate"
          variants={imageVariants}
          >
            <Image
              src="/crypto3.png"
              width={700}
              height={600}
              alt=""
              className="border-4 border-gray-800 rounded-lg"
            />  
           
          </motion.div>
          <motion.div className="flex-1 flex justify-end items-center" 
            initial="initial"
            animate="animate"
            variants={imageVariants}
          >
              <div>
                <div className="text-white" style={{fontSize:"1.5rem"}}>Xchange.inc</div>
              <div className="text-gray-400 flex justify-end pr-20" style={{fontSize:"1rem"}}>CEO: Ritik Bora</div>
              </div>
          </motion.div>
        </div>
  )
}



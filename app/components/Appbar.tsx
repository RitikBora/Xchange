"use client";

import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

export const Appbar = () => {
    const route = usePathname();
    const router = useRouter();

    return (
        <div className="text-white border-b border-slate-800">
            <div className="flex justify-between items-center py-3 px-5">
           
                <div className="flex">
                     <div
                        className={` pl-4 flex  justify-center cursor-pointer text-white`}
                        onClick={() => router.push('/')}
                        style={{fontSize:'2rem'}}
                    >
                        <span className="text-green-500">X</span>Change
                    </div>
                    <div
                        className={`text-2xl pt-1 flex flex-col justify-center pl-8 cursor-pointer ${
                            route.startsWith('/markets') ? 'text-blue-500' : 'text-white'
                        } hover:text-blue-500`} 
                        onClick={() => router.push('/markets')}
                        style={{fontSize: "1.25rem"}}
                    >
                        Markets
                    </div>
                    <div
                        className={`text-2xl pt-1 flex flex-col justify-center pl-8 cursor-pointer ${
                            route.startsWith('/trade') ? 'text-blue-500' : 'text-white'
                        } hover:text-blue-500`} 
                        onClick={() => router.push('/trade/SOL_USDC')}
                        style={{fontSize: "1.25rem"}}
                    >
                        Trade
                    </div>
                </div>
            </div>
        </div>
    );
};

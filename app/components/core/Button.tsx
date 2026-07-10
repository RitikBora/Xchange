type ButtonProps = {
    children: string;
    onClick?: () => void;
    className?: string;
    textSize?: string;
};

export const PrimaryButton = ({ children, onClick, className = "h-[60px] w-[128px]", textSize = "1.3rem" }: ButtonProps) => {
    return <button type="button" className={`text-center font-semibold rounded-lg focus:ring-blue-200 focus:none focus:outline-none hover:opacity-90 disabled:opacity-80 disabled:hover:opacity-80 relative overflow-hidden px-3 py-1.5 mr-4 ${className}`} onClick={onClick} style={{fontSize : textSize}}>
        <div className="absolute inset-0 bg-blue-500 opacity-[16%]"></div>
        <div className="flex flex-row items-center justify-center gap-4"><p className="text-blue-500">{children}</p></div>
    </button>

}

export const SuccessButton = ({ children, onClick, className = "h-[60px] w-[220px]", textSize = "1.3rem" }: ButtonProps) => {
    return <button type="button" className={`text-center font-semibold rounded-lg focus:ring-green-200 focus:none focus:outline-none hover:opacity-90 disabled:opacity-80 disabled:hover:opacity-80 relative overflow-hidden px-3 py-1.5 mr-4 ${className}`}
    onClick={onClick} style={{fontSize : textSize}}>
        <div className="absolute inset-0 bg-green-500 opacity-[16%]"></div>
        <div className="flex flex-row items-center justify-center gap-4"><p className="text-green-500">{children}</p></div>
    </button>

} 
const Background = () => {
    return (
        <div className="fixed inset-0 -z-10 bg-black">

            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#1e1b4b_0%,_#0f0c29_40%,_#000000_100%)]" />

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-900/20 rounded-full blur-3xl" />
        </div>
    );
};

export default Background;
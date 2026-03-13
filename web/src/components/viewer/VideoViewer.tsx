export const VideoViewer = ({ endPoint }: any) => {
    return (
        <div className="p-5 w-full h-full">
            <div className="w-full rounded-xl  flex items-center justify-center">
                <video
                    src={endPoint}
                    controls
                    className="w-full h-full object-contain"
                />
            </div>
        </div>
    );
};

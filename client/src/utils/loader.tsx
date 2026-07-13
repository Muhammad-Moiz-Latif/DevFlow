import loader from './../assets/sync.png';

export const GeneralLoader = ({ label }: { label: string }) => {
    return (
        <div
            className="w-full h-screen bg-black/50 backdrop-blur-sm absolute z-30 translate top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center"
        >
            <div className="flex gap-2 items-center">
                <h1 className='text-2xl'>{label}</h1>
                <div className='animate-spin align-middle size-8'>
                    <img src={loader} className='' />
                </div>
            </div>
        </div>
    )
}
export default function Gallery({ images = [] }) {
    if (!images.length) return null;
    const [first, ...rest] = images;
    return (
        <div className="grid grid-cols-4 grid-rows-2 gap-2 h-80 sm:h-96">
            <div className="col-span-2 row-span-2 overflow-hidden rounded group">
                <img src={first} alt="" className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105" />
            </div>
            {rest.slice(0, 4).map((src, i) => (
                <div key={i} className="relative overflow-hidden rounded group">
                    <img src={src} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105" />
                </div>
            ))}
        </div>
    );
}



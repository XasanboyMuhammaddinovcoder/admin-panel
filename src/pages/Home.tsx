import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <div className="flex justify-between p-20 flex-wrap gap-8">
        <div className="border-[1px] flex flex-col justify-between  w-96 h-96  rounded-lg p-12">
          <h2 className="uppercase text-center text-2xl">NEW ARRIVALS</h2>
          <div className="flex justify-center">
            <Link to={'/dashboard/new'} className="w-80 flex justify-center items-center h-12 text-white bg-black rounded-[42px]">
              See Products
            </Link>
          </div>
        </div>
        <div className="border-[1px] flex flex-col justify-between   w-96 h-96  rounded-lg p-12">
          <div>
            <h2 className="uppercase text-center text-2xl">top selling</h2>
          </div>
          <div className="flex justify-end flex-col items-center">
            <Link to={'/dashboard/top'} className="w-80 flex justify-center items-center h-12 text-white bg-black rounded-[42px]">
              See Products
            </Link>
          </div>
        </div>
        <div className="border-[1px] flex flex-col justify-between   w-96 h-96  rounded-lg p-12">
          <div>
            <h2 className="uppercase text-center text-2xl">You might also like</h2>
          </div>
          <div className="flex justify-end flex-col items-center">
            <Link to={'/dashboard/might'} className="w-80 flex justify-center items-center h-12 text-white bg-black rounded-[42px]">
              See Products
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

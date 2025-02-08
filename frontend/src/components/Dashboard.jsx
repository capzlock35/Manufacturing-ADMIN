
import React, { PureComponent } from "react";
import { HiOutlineCurrencyDollar } from "react-icons/hi";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { RiPassPendingLine } from "react-icons/ri";
import { MdOutlinePeopleAlt, MdRemoveRedEye } from "react-icons/md";
import { GrMoney } from "react-icons/gr";
import { IoCodeDownloadOutline } from "react-icons/io5";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { CiTrash } from "react-icons/ci";
import { MdOutlineChat } from "react-icons/md";
import { Bell } from 'lucide-react';
import BGAdmin from "../assets/ADMIN.jpg"
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  Rectangle,
} from "recharts";
import { BsEye } from "react-icons/bs";

const data = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
];

const announcements = [
  { id: 1, title: 'Maintenance Schedule', message: 'Planned maintenance on Production Line A this weekend.' },
  { id: 2, title: 'New Safety Protocol', message: 'Updated safety guidelines for chemical handling.' },
  { id: 3, title: 'Production Milestone', message: 'Reached 1 million units milestone!' }
];

const Dashboard = () => {
  return (
    <div className="bg-gray-200 text-black h-auto p-5 bg-cover bg-center" style={{backgroundImage: `url(${BGAdmin})`}}>
      {/* 4 cards */}
        <p className="font-semibold">Overview</p>
        {/* cards */}
        <div className="flex gap-4 p-4 overflow-x-auto flex-wrap">
          {/* Revenue Card */}
          <div className="bg-white shadow-lg w-[280px] p-5 rounded-lg mt-3 transition-transform transform hover:scale-105 hover:shadow-xl">
            <div className="flex items-center justify-between">
              <p className="text-gray-600 font-semibold text-sm">Revenue</p>
              <HiOutlineCurrencyDollar className="text-gray-600 text-xl" />
            </div>
            <div className="flex gap-3 my-3">
              <p className="text-3xl font-bold">₱4,560.75</p>
              <p className="flex items-center gap-1 bg-green-100 text-green-700 rounded-full px-3 py-1 text-sm font-semibold">
                <IoIosArrowUp className="text-green-700" /> 8.2%
              </p>
            </div>
            <div className="my-3">
              <p className="text-green-700 font-semibold">
              +₱450.00 <span className="text-gray-500">than last week</span>
              </p>
            </div>
          </div>

          

          {/* Sales Card */}
          <div className="bg-white shadow-lg w-[280px] p-5 rounded-lg mt-3 transition-transform transform hover:scale-105 hover:shadow-xl">
            <div className="flex items-center justify-between">
              <p className="text-gray-600 font-semibold text-sm">Sales</p>
              <GrMoney className="text-gray-600 text-xl" />
            </div>
            <div className="flex gap-3 my-3">
              <p className="text-3xl font-bold">₱13,890.50</p>
              <p className="flex items-center gap-1 bg-green-100 text-green-700 rounded-full px-3 py-1 text-sm font-semibold">
                <IoIosArrowUp className="text-green-700" /> 15.5%
              </p>
            </div>
            <div className="my-3">
              <p className="text-green-700 font-semibold">
              +32 <span className="text-gray-500">than last week</span>
              </p>
            </div>
          </div>

          {/* Customer Card */}
          <div className="bg-white shadow-lg w-[280px] p-5 rounded-lg mt-3 transition-transform transform hover:scale-105 hover:shadow-xl">
            <div className="flex items-center justify-between">
              <p className="text-gray-600 font-semibold text-sm">Customer</p>
              <MdOutlinePeopleAlt className="text-gray-600 text-xl" />
            </div>
            <div className="flex gap-3 my-3">
              <p className="text-3xl font-bold">1,850</p>
              <p className="flex items-center gap-1 bg-red-100 text-red-700 rounded-full px-3 py-1 text-sm font-semibold">
                <IoIosArrowDown className="text-red-700" /> 10.5%
              </p>
            </div>
            <div className="my-3">
              <p className="text-red-700 font-semibold">
                -120 <span className="text-gray-500">than last week</span>
              </p>
            </div>
          </div>

          {/* Spending Card */}
          <div className="bg-white shadow-lg w-[280px] p-5 rounded-lg mt-3 transition-transform transform hover:scale-105 hover:shadow-xl">
            <div className="flex items-center justify-between">
              <p className="text-gray-600 font-semibold text-sm">Spending</p>
              <RiPassPendingLine className="text-gray-600 text-xl" />
            </div>
            <div className="flex gap-3 my-3">
              <p className="text-3xl font-bold">₱247.30</p>
              <p className="flex items-center gap-1 bg-green-100 text-green-700 rounded-full px-3 py-1 text-sm font-semibold">
                <IoIosArrowUp className="text-green-700" /> 7.0%
              </p>
            </div>
            <div className="my-3">
              <p className="text-green-700 font-semibold">
              +₱36.50 <span className="text-gray-500">than last week</span>
              </p>
            </div>
          </div> 
          
        </div>
              {/* Announcements */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Announcements</h2>
          <Bell className="h-5 w-5 text-gray-500" />
        </div>
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="border-l-4 border-blue-500 pl-4 py-2">
              <h3 className="font-semibold text-gray-800">{announcement.title}</h3>
              <p className="text-gray-600 text-sm mt-1">{announcement.message}</p>
            </div>
          ))}
        </div>
      </div>

        {/* charts */}
        <div className="flex  gap-4 p-4 overflow-x-auto   justify-between">
          <div className="border bg-white/70 p-2 rounded-lg flex-shrink-0 md:flex-1 bg-opacity-50">
            <LineChart 
              width={500}
              height={300}
              data={data}
              margin={{
                top: 5,
                right: 50,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="pv"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
              <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
            </LineChart>
          </div>

          {/* Bar charts */}
          {/* w-full max-w-[430px] max-md:hidden */}
          <div className="border bg-white/70 p-2 rounded-lg flex-shrink-0  md:flex-1 bg-opacity-100">
            <BarChart
              width={430}
              height={300}
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="pv"
                fill="#8884d8"
                activeBar={<Rectangle fill="pink" stroke="blue" />}
              />
              <Bar
                dataKey="uv"
                fill="#82ca9d"
                activeBar={<Rectangle fill="gold" stroke="purple" />}
              />
            </BarChart>
          </div>
        </div>

        {/* 3 cards */}
        <div className="flex gap-5 flex-wrap">
          {/* Recent Orders */}
          <div className="mt-5 rounded-lg bg-white w-[500px] h-auto md:h-[100%] p-4  ">
            <div className="flex justify-between">
              <p className="font-semibold text-black/90">Recent Orders</p>
              <p className="flex gap-1 items-center p-1 rounded-lg bg-gray-200 cursor-pointer">
                <IoCodeDownloadOutline className="text-lg" />
                Report
              </p>
            </div>

            <div className="flex justify-between mt-4 text-black/75">
              <div className="flex gap-12 items-center">
                <input type="checkbox" />
                <p>Product</p>
              </div>
              <p>Price</p>
              <p>Date</p>
              <p className="ml-14">Status</p>
              <p className="mr-1">Action</p>
            </div>

            <hr className="mt-2" />
            <div>
              <div className="flex justify-between items-center gap-2 mt-2">
                <div className="flex gap-2 items-center">
                  <input type="checkbox" />
                  <img
                    src="https://www.byrdie.com/thmb/2_StIwiboKhwe6WiQW3A5_PCjpc=/3000x3000/filters:no_upscale():max_bytes(150000):strip_icc()/1cfaad9e-be47-4755-8d89-9dd27eaf0095_1.3ecc0d85625d5020c4f9807b4d5e7c96-520e913cbf7448878006fb529447fed2.jpg"
                    alt="Product"
                    className="w-7 h-7 rounded-full"
                  />
                  <p className="font-semibold">Shampoo</p>
                </div>
                <p className="font-semibold">₱111.46</p>
                <p>18 Sept 2024</p>
                <p className="border border-green-600 w-20 text-center rounded-full text-green-600 bg-green-100 text-sm font-medium">
                  Delivered
                </p>
                <div className="flex gap-2 items-center">
                  <MdRemoveRedEye className="cursor-pointer text-lg" />
                  <CiTrash className="cursor-pointer text-lg text-red-500" />
                </div>
              </div>
              <hr className="mt-2" />
              <div className="flex justify-between items-center gap-2 mt-2">
                <div className="flex gap-2 items-center">
                  <input type="checkbox" />
                  <img
                    src="https://plazavea.vteximg.com.br/arquivos/ids/23016863-1000-1000/imageUrl_1.jpg?v=638060295883870000"
                    alt="Product"
                    className="w-7 h-7 rounded-full"
                  />
                  <p className="font-semibold">perfume</p>
                </div>
                <p className="font-semibold">₱111.46</p>
                <p>18 Sept 2024</p>
                <p className="border border-blue-600 w-20 text-center rounded-full text-blue-600 bg-blue-100 text-sm font-medium">
                  On Going
                </p>
                <div className="flex gap-2 items-center">
                  <MdRemoveRedEye className="cursor-pointer text-lg" />
                  <CiTrash className="cursor-pointer text-lg text-red-500" />
                </div>
              </div>
              <hr className="mt-2" />
              <div className="flex justify-between items-center gap-2 mt-2">
                <div className="flex gap-2 items-center">
                  <input type="checkbox" />
                  <img
                    src="https://cdn.shopify.com/s/files/1/0314/8555/8922/products/DinnerLady-NicShot-NicShot-100VG-18mg-3pk-UK_1024x1024@2x.jpg?v=1585150206"
                    alt="Product"
                    className="w-7 h-7 rounded-full"
                  />
                  <p className="font-semibold">E-juice</p>
                </div>
                <p className="font-semibold">₱89.05</p>
                <p>18 Sept 2024</p>
                <p className="border border-green-600 w-20 text-center rounded-full text-green-600 bg-green-100 text-sm font-medium">
                  Delivered
                </p>
                <div className="flex gap-2 items-center">
                  <MdRemoveRedEye className="cursor-pointer text-lg" />
                  <CiTrash className="cursor-pointer text-lg text-red-500" />
                </div>
              </div>
              <hr className="mt-2" />
              <div className="flex justify-between items-center gap-2 mt-2">
                <div className="flex gap-2 items-center">
                  <input type="checkbox" />
                  <img
                    src="https://i0.wp.com/www.babypromv.com/wp-content/uploads/2019/07/4e2bc5c3-077e-476a-9408-5f06ab2c73bf_1.7f26f2b8c0ccad58fc2a50bd471589f3-1.jpeg?fit=2642,2642&ssl=1"
                    alt="Product"
                    className="w-7 h-7 rounded-full"
                  />
                  <p className="font-semibold">Lotion</p>
                </div>
                <p className="font-semibold">₱142.82</p>
                <p>18 Sept 2024</p>
                <p className="border border-red-600 w-20 text-center rounded-full text-red-600 bg-red-100 text-sm font-medium">
                  Canceled
                </p>
                <div className="flex gap-2 items-center">
                  <MdRemoveRedEye className="cursor-pointer text-lg" />
                  <CiTrash className="cursor-pointer text-lg text-red-500" />
                </div>
              </div>
              <hr className="mt-2" />
            </div>
          </div>
          {/* chat */}

          {/* Top Countries */}
          <div className="mt-5 bg-white rounded-xl max-md:hidden">
            <AreaChart
              width={430}
              height={300}
              data={data}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="uv"
                stackId="1"
                stroke="#8884d8"
                fill="#8884d8"
              />
              <Area
                type="monotone"
                dataKey="pv"
                stackId="1"
                stroke="#82ca9d"
                fill="#82ca9d"
              />
              <Area
                type="monotone"
                dataKey="amt"
                stackId="1"
                stroke="#ffc658"
                fill="#ffc658"
              />
            </AreaChart>
          </div>

          
        </div>
        
      
    </div>
  );
};

export default Dashboard;

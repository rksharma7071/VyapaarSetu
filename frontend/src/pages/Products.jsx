import React from 'react'
import { FiDownload } from "react-icons/fi";
import { FiPlusCircle } from "react-icons/fi";
import { IoSearch } from 'react-icons/io5';
import { FaChevronDown } from "react-icons/fa";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin5Line } from "react-icons/ri";
import { Link } from 'react-router-dom';
import { FaCheck } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import { GoChevronDown } from "react-icons/go";

function Products() {

    const products = [
        {
            "_id": "6970b4eca969849f1a512a95",
            "slug": "margherita-pizza",
            "name": "Margherita Pizza",
            "sku": "FOOD-PIZZA-001",
            "description": "Classic margherita pizza with fresh mozzarella, tomatoes, and basil.",
            "type": "food",
            "category": "Pizza",
            "price": 299,
            "taxRate": 5,
            "trackStock": true,
            "stockQty": 50,
            "unit": "pcs",
            "image": "https://res.cloudinary.com/drfpaxoyx/image/upload/v1768994027/uploads/nripei2egzmkr1cpu6kn.jpg",
            "publicId": "uploads/nripei2egzmkr1cpu6kn",
            "isActive": true,
            "createdAt": "2026-01-21T11:13:48.240Z",
            "updatedAt": "2026-01-21T11:13:48.240Z",
            "__v": 0
        },
        {
            "_id": "6970b5fea969849f1a512a98",
            "slug": "chicken-biryani",
            "name": "Chicken Biryani",
            "sku": "FOOD-RICE-002",
            "description": "Aromatic basmati rice cooked with tender chicken and traditional spices.",
            "type": "food",
            "category": "Rice",
            "price": 199,
            "taxRate": 5,
            "trackStock": true,
            "stockQty": 30,
            "unit": "plates",
            "image": "https://res.cloudinary.com/drfpaxoyx/image/upload/v1768994301/uploads/nixcpvjbihhls46ubipp.jpg",
            "publicId": "uploads/nixcpvjbihhls46ubipp",
            "isActive": true,
            "createdAt": "2026-01-21T11:18:22.255Z",
            "updatedAt": "2026-01-21T11:18:22.255Z",
            "__v": 0
        },
        {
            "_id": "6970b671a969849f1a512a9b",
            "slug": "veg-burger",
            "name": "Veg Burger",
            "sku": "FOOD-BURGER-003",
            "description": "Grilled vegetable patty with lettuce, tomato, and special sauce.",
            "type": "food",
            "category": "Burger",
            "price": 50,
            "taxRate": 5,
            "trackStock": true,
            "stockQty": 40,
            "unit": "pcs",
            "image": "https://res.cloudinary.com/drfpaxoyx/image/upload/v1768994416/uploads/rzv9di3zw7epg6yetjis.jpg",
            "publicId": "uploads/rzv9di3zw7epg6yetjis",
            "isActive": true,
            "createdAt": "2026-01-21T11:20:17.258Z",
            "updatedAt": "2026-01-21T11:20:17.258Z",
            "__v": 0
        },
        {
            "_id": "6970b6cca969849f1a512a9d",
            "slug": "paneer-butter-masala",
            "name": "Paneer Butter Masala",
            "sku": "FOOD-CURRY-004",
            "description": "Soft paneer cubes cooked in rich buttery tomato gravy.",
            "type": "food",
            "category": "Curry",
            "price": 220,
            "taxRate": 5,
            "trackStock": true,
            "stockQty": 25,
            "unit": "bowls",
            "image": "https://res.cloudinary.com/drfpaxoyx/image/upload/v1768994508/uploads/z9ansthqeorl9wh8emyo.jpg",
            "publicId": "uploads/z9ansthqeorl9wh8emyo",
            "isActive": true,
            "createdAt": "2026-01-21T11:21:48.826Z",
            "updatedAt": "2026-01-21T11:21:48.826Z",
            "__v": 0
        },
        {
            "_id": "6970b71ca969849f1a512a9f",
            "slug": "chocolate-brownie",
            "name": "Chocolate Brownie",
            "sku": "FOOD-DESSERT-005",
            "description": "Rich and fudgy chocolate brownie topped with chocolate sauce.",
            "type": "food",
            "category": "Dessert",
            "price": 150,
            "taxRate": 5,
            "trackStock": true,
            "stockQty": 25,
            "unit": "pcs",
            "image": "https://res.cloudinary.com/drfpaxoyx/image/upload/v1768994588/uploads/myhyyj6urlh49ce3giaa.jpg",
            "publicId": "uploads/myhyyj6urlh49ce3giaa",
            "isActive": true,
            "createdAt": "2026-01-21T11:23:08.496Z",
            "updatedAt": "2026-01-21T11:23:08.496Z",
            "__v": 0
        }
    ];

    return (
        <div className=' bg-gray-50 px-8 py-6 space-y-6'>
            <div className='flex justify-between items-center'>
                <div className='text-xl font-semibold text-gray-900'>Products</div>
                <div className='flex gap-3 items-center font-semibold text-gray-900'>
                    <Link to={'/create-products'} className="flex justify-between items-center gap-2 w-auto rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-primary/90 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary/30" type='submit'><FiPlusCircle className='text-lg' /> Add Product</Link>
                    <button className="flex justify-between items-center gap-2 w-40 rounded-lg bg-secondary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-secondary/90 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-secondary/30" type='submit'><FiDownload className='text-lg' /> Import Product</button>
                </div>
            </div>
            <div className='rounded-lg border border-gray-200 bg-white text-gray-600'>
                <div className='flex justify-between p-5'>
                    <div className="relative flex items-center w-full max-w-sm">
                        <label htmlFor="search" className="sr-only">Search</label>
                        <span className="absolute left-3 text-gray-500"><IoSearch className="text-lg" /></span>
                        <input id="search" type="text" placeholder="Search here..."
                            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-5 text-sm text-gray-700 placeholder-gray-400 transition focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                        />
                    </div>
                    <div className='flex items-center gap-3'>
                        <div className="relative w-full">
                            <select
                                name="category"
                                id="brand"
                                className="w-36 appearance-none rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-3 text-sm text-gray-700 transition focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                            >
                                <option value="">Select category</option>
                                <option value="Pizza">Pizza</option>
                                <option value="Rice">Rice</option>
                                <option value="Burger">Burger</option>
                                <option value="Curry">Curry</option>
                                <option value="Dessert">Dessert</option>
                            </select>
                            <GoChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        </div>
                        <div className="relative w-full">
                            <select
                                name="category"
                                id="category"
                                className="w-36 appearance-none rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-3 text-sm text-gray-700 transition focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                            >
                                <option value="">Select category</option>
                                <option value="Pizza">Pizza</option>
                                <option value="Rice">Rice</option>
                                <option value="Burger">Burger</option>
                                <option value="Curry">Curry</option>
                                <option value="Dessert">Dessert</option>
                            </select>
                            <GoChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>
                </div>
                <div>
                    <div className="overflow-x-auto bg-white">
                        <table className="w-full border-collapse text-sm">
                            <thead className="bg-gray-200 text-gray-900">
                                <tr>
                                    <th className="px-4 py-3 text-center">
                                        <label className="flex items-center gap-2 cursor-pointer select-none">
                                            <input type="checkbox" id="rememberme" className="peer hidden" />
                                            <div className=" h-4 w-4 rounded border border-gray-300 bg-white flex items-center justify-center transition peer-checked:border-primary peer-checked:bg-primary peer-focus:ring-2 peer-focus:ring-primary/20">
                                                <FaCheck className="h-3 w-3 text-white peer-checked:block" />
                                            </div>
                                        </label>
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold">SKU</th>
                                    <th className="px-4 py-3 text-left font-semibold">Product</th>
                                    <th className="px-4 py-3 text-left font-semibold">Category</th>
                                    <th className="px-4 py-3 text-left font-semibold">Brand</th>
                                    <th className="px-4 py-3 text-left font-semibold">Price</th>
                                    <th className="px-4 py-3 text-left font-semibold">Unit</th>
                                    <th className="px-4 py-3 text-left font-semibold">Qty</th>
                                    <th className="px-4 py-3 text-center font-semibold">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-300">
                                {products.length > 0 ? (
                                    products.map((product) => (
                                        <tr
                                            key={product._id}
                                            className="transition hover:bg-gray-50"
                                        >
                                            <td className="px-4 py-3 text-center">
                                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                                    <input type="checkbox" id="rememberme" className="peer hidden" />
                                                    <div
                                                        className=" h-4 w-4 rounded border border-gray-300 bg-white flex items-center justify-center transition peer-checked:border-primary peer-checked:bg-primary peer-focus:ring-2 peer-focus:ring-primary/20"
                                                    >
                                                        <svg
                                                            className="h-3 w-3 text-white peer-checked:block"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="3"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                </label>
                                            </td>
                                            <td className="px-4 py-3 text-gray-700">{product.sku}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-12 w-12 overflow-hidden rounded-lg border border-gray-300 bg-gray-100">
                                                        <img
                                                            src={product.image}
                                                            alt={product.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="font-medium text-gray-800">{product.name}</div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-gray-600">{product.category}</td>
                                            <td className="px-4 py-3 text-gray-600">{product.type}</td>
                                            <td className="px-4 py-3 font-medium text-gray-800">₹{product.price}</td>
                                            <td className="px-4 py-3 text-gray-600">{product.unit}</td>
                                            <td className="px-4 py-3">
                                                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">{product.stockQty}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Link
                                                        to={product.slug}
                                                        title="View"
                                                        className="group rounded-lg border border-gray-200 bg-white p-2 text-gray-500 transition hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600"
                                                    >
                                                        <LuEye className="text-lg group-hover:scale-110 transition" />
                                                    </Link>

                                                    <Link
                                                        title="Edit"
                                                        className="group rounded-lg border border-gray-200 bg-white p-2 text-gray-500 transition hover:border-amber-500 hover:bg-amber-50 hover:text-amber-600"
                                                    >
                                                        <CiEdit className="text-lg group-hover:scale-110 transition" />
                                                    </Link>

                                                    <Link
                                                        title="Delete"
                                                        className="group rounded-lg border border-gray-200 bg-white p-2 text-gray-500 transitionhover:border-red-500 hover:bg-red-50 hover:text-red-600"
                                                    >
                                                        <RiDeleteBin5Line className="text-lg group-hover:scale-110 transition" />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={9}
                                            className="px-4 py-10 text-center text-gray-500"
                                        >
                                            No products found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Products
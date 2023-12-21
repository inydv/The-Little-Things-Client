// REACT AND REACT ROUTER DOM
import { Children, useEffect, useState } from "react";
import { Link } from "react-router-dom";

// CUSTOM IMPORTS
import { GETMYORDERS } from "../Services/index";
import header from "../Constants/TableHeader.json";
import { NotAvailable } from "../Components/index";
import DateSplice from "../Pipes/Date.Pipe";
import Images from "../Assets/index";
import RoutesConstant from "../Constants/Routes.Constant.json";

// REACT ICONS
import RSCoversion from "../Pipes/RSConversion.Pipe";

// MY ORDER
export default function MyOrders() {
  // STATES
  const [orders, setOrders] = useState([]);
  const [open, setOpen] = useState(false);

  // CUSTOM FUNCTION
  const fetchMyOrders = async () => {
    const { data } = await GETMYORDERS();
    if (data && data.SUCCESS) {
      setOrders(data.DATA);
    }
  };

  // USE EFFECT
  useEffect(() => {
    window.scrollTo(0, 0);

    fetchMyOrders();
  }, []);

  // JSX ELEMENT
  return (
    <div className="p-5 sm:px-10">
      <div className="overflow-x-auto pb-2">
        <table className="min-w-[800px] w-full">
          <thead>
            <tr>
              {Children.toArray(
                header?.myOrder?.map((name) => (
                  <th className="border border-gray-500 p-2">{name}</th>
                ))
              )}
            </tr>
          </thead>
          <tbody>
            {orders?.length > 0 ? (
              Children.toArray(
                orders?.map((item) => (
                  <tr>
                    <td className="border border-gray-500 p-2">
                      {Children.toArray(
                        item?.orderItems?.map(
                          ({ quantity, product }, index) => (
                            <div
                              className={
                                index === item?.orderItems?.length - 1
                                  ? "flex gap-5 items-center"
                                  : "flex gap-5 items-center mb-4"
                              }
                            >
                              <img
                                src={
                                  product?.images?.length > 0 &&
                                  product?.images[0]?.url
                                }
                                alt={product?.name}
                                className="h-14 w-14 aspect-square"
                                onError={({ currentTarget }) => {
                                  currentTarget.onerror = null;
                                  currentTarget.src =
                                    Images["NoImageAvailable"];
                                }}
                              />
                              <div>
                                <h1 className="line-clamp mb-1">
                                  <Link
                                    to={
                                      RoutesConstant.productDetails +
                                      "/" +
                                      product?._id
                                    }
                                  >
                                    {product?.name}
                                  </Link>
                                </h1>
                                <h1>
                                  {RSCoversion(product?.price)} x {quantity} ={" "}
                                  {RSCoversion(product?.price * quantity)}
                                </h1>
                              </div>
                            </div>
                          )
                        )
                      )}
                    </td>
                    <td className="border border-gray-500 p-2">
                      <p className="text-center">
                        Name: {item?.shippingInformation?.name} <br />
                        Phone: {item?.shippingInformation?.phone} <br />
                        Email: {item?.shippingInformation?.email}
                      </p>
                    </td>
                    <td className="border border-gray-500 p-2">
                      <p className="text-center">
                        {item?.shippingInformation?.address +
                          ", " +
                          item?.shippingInformation?.city +
                          ", " +
                          item?.shippingInformation?.state +
                          ", " +
                          item?.shippingInformation?.pincode}
                      </p>
                    </td>
                    <td className="border border-gray-500 p-2">
                      <p className="text-center">{item?.orderStatus}</p>
                    </td>
                    <td className="border border-gray-500 p-2">
                      <p className="text-center">
                        Created At: {DateSplice(item?.createdAt)} <br />
                        Delivery At: {DateSplice(item?.deliveredAt)}
                      </p>
                    </td>
                  </tr>
                ))
              )
            ) : (
              <tr>
                <td
                  colSpan="100%"
                  className="border border-gray-500 px-5 py-10"
                >
                  <NotAvailable />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
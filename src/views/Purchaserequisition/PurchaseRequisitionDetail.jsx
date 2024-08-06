import React, { useEffect } from "react";
import Card from "../../components/card/Card";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { getPRDetails } from "../../app/features/Purchaserequisition/getPurchaseRequisitionSlice";
import CardItem from "../../components/card/CardItem";
import CardHeader from "../../components/card/CardHeader";
import { FaChevronLeft } from "react-icons/fa";
import { Spinner } from "../../components/theme/Loader";
import logo from "../../assets/item_image.png";

const PurchaseRequisitionDetail = () => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const prId = searchParams.get("pr_id");

    const { prdetail, isLoading, error } = useSelector((state) => state.getPR);

    console.log("prdetail prdetail", prdetail);

    const goBack = () => {
        window.history.back();
    };

    useEffect(() => {
        try {
            dispatch(getPRDetails({ id: prId })).unwrap();
        } catch (error) {
            toast.error(error.message);
        }
    }, [prId]);

    return (
        <div className="py-5 px-10">
            {isLoading ? (
                <Spinner size="lg" />
            ) : (
                <>
                    <div
                        className="flex justify-start items-center gap-2 pb-5 cursor-pointer w-fit"
                        onClick={goBack}
                    >
                        <FaChevronLeft />

                        <h1 className="font-semibold ">Purchase Requisition Details</h1>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Card  >
                            <CardHeader title={"Order Details"} />
                            <CardItem title={"PR Number"} value={prdetail?.pr_number} />
                            <CardItem title={"Status"} value={prdetail?.status} />
                            <CardItem title={"Priority"} value={prdetail?.priority} />
                            <CardItem title={"Requested By"} value={prdetail?.requested_by} />
                            <CardItem title={"Requested Date"} value={prdetail?.requested_date.slice(0, 10)} />
                            <CardItem title={"Required Date"} value={prdetail?.required_date.slice(0, 10)} />
                            <CardItem title={"Shipment Address"} value={prdetail?.delivery_address} />
                            <CardItem title={"PR Detail"} value={prdetail?.pr_detail} />
                        </Card>

                        <Card style={{ height: "100px" }}>
                            <CardHeader title={"Items Details"} />
                            {prdetail == null || undefined || prdetail?.length == 0 ? <></>
                                :
                                <>
                                    {prdetail?.items_detail.map((item, index) => (
                                        <>
                                            <div className="container mx-auto">
                                                <div className="grid grid-cols-12 gap-4 items-center">
                                                    {/* Left Side: Image and Details */}

                                                    <div className="col-span-12 sm:col-span-5 flex md:col-span-6 items-center">
                                                        {item?.item_detail?.image ? (
                                                            <img
                                                                src={item?.item_detail?.image}
                                                                alt="..."
                                                                className="w-24 h-35 mr-4"
                                                            />
                                                        ) : null}
                                                        <div>
                                                            <div className="font-bold text-sm"> {item?.item_detail?.name}</div>
                                                            <div className="font-bold text-sm">{item?.item_detail.type}</div>
                                                            {/* <div className="font-bold text-sm">"{"item?.item_details.category"}"</div> */}
                                                        </div>
                                                    </div>

                                                    {/* Right Side: Additional Information */}
                                                    <div className="col-span-12 sm:col-span-7 md:col-span-6">
                                                        <div className="card-item">
                                                            <div className="font-medium text-base text-sm text-black/60 dark:text-white/60">
                                                                Available Stock
                                                            </div>
                                                            <h1 className="text-sm">{item?.available_stock || "Not Yet"}</h1>
                                                        </div>

                                                        <div className="card-item">
                                                            <div className="font-medium text-base text-sm text-black/60 dark:text-white/60">
                                                                Required Quantity
                                                            </div>
                                                            <h1 className="text-sm">{item?.required_quantity || "Not Yet"}</h1>
                                                        </div>

                                                        {/* Preferred Vendors */}

                                                        <div className="font-medium text-base text-sm text-black/60 dark:text-white/60">
                                                            Preferred Vendors
                                                        </div>

                                                        {item?.preffered_vendor == null || undefined ? "-"
                                                            :
                                                            <>
                                                                {item?.preffered_vendor?.map((v, idx) => (
                                                                    <div key={idx} className="card-item">
                                                                        <h1 className="text-sm">{`${v?.vendor_display_name == null || undefined ? "-" : v?.vendor_display_name}`}</h1>
                                                                    </div>
                                                                ))}
                                                            </>
                                                        }
                                                    </div>
                                                </div>
                                            </div>

                                            <hr class="my-5" />
                                        </>
                                    ))}
                                </>
                            }
                        </Card>

                    </div>
                </>
            )}
        </div>
    );
};

export default PurchaseRequisitionDetail;

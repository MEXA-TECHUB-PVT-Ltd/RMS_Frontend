import React, { useCallback, useEffect, useState } from "react";
import Button from "../../components/form/Button";
import AppInput from "../../components/form/AppInput";
import { Formik, Form, FieldArray } from 'formik';
import * as Yup from "yup";
import { currency, paymentTerm } from "../../utils/vendor";
import { useDispatch, useSelector } from "react-redux";
import { getCurrencies } from "../../app/features/currency/getCurrencySlice";
import { getPaymentTerms } from "../../app/features/paymentTerms/getPaymentTermSlice";
import AppSelect from "../../components/form/AppSelect";
import { useDropzone } from "react-dropzone";
import { FaCloudUploadAlt, FaPlus, FaProductHunt } from "react-icons/fa";
import { addVendor } from "../../app/features/Vendor/addVendorSlice";
import toast from "react-hot-toast";
import { Spinner } from "../../components/theme/Loader";
import { useNavigate } from "react-router-dom";
import { format, parseISO } from 'date-fns';
import { getItems } from "../../app/features/Item/getItemSlice";
import ErrorMessage from "../../components/form/ErrorMessage";

const API_URL = import.meta.env.VITE_API_URL;

const AddPurchaseRequistion = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [cnic_back_img, setCnic_back_img] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const onCnicBackDrop = useCallback((acceptedFile) => {
        setCnic_back_img(
            Object.assign(acceptedFile[0], {
                preview: URL.createObjectURL(acceptedFile[0]),
            })
        );
    }, []);

    const onDocumentDrop = useCallback((acceptedFile) => {
        setDocument(
            Object.assign(acceptedFile[0], {
                preview: URL.createObjectURL(acceptedFile[0]),
            })
        );
    }, []);

    const onCnicDrop = useCallback((acceptedFile) => {
        setCnic_front_img(
            Object.assign(acceptedFile[0], {
                preview: URL.createObjectURL(acceptedFile[0]),
            })
        );
    }, []);

    const priorityOptions = [
        { value: "HIGH", label: "HIGH" },
        { value: "MEDIUM", label: "MEDIUM" },
        { value: "LOW", label: "LOW" }
    ];

    useEffect(() => {
        fetchCategories();
        fetchVendors();
        fetchItems();
    }, []);

    const [itemOptions, setItemOptions] = useState([]);
    const fetchItems = async () => {

        try {
            const response = await fetch(`${API_URL}/item/get/list`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log(data);
            const formattedVendors = data.result.items.map((item) => ({
                value: item.id,
                label: item.name
            }));
            setItemOptions(formattedVendors);
        } catch (error) {
            console.log(error.message);
        }
    };

    const [vendorOptions, setVendorOptions] = useState([]);
    const fetchVendors = async () => {

        try {
            const response = await fetch(`${API_URL}/vendor`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log(data);
            const formattedVendors = data.result.vendors.map((vendor) => ({
                value: vendor.id,
                label: `${vendor.first_name} ${vendor.last_name}`
            }));
            setVendorOptions(formattedVendors);
        } catch (error) {
            console.log(error.message);
        }
    };

    const [categoryOptions, setCategoryOptions] = useState([]);
    const fetchCategories = async () => {

        try {
            const response = await fetch(`${API_URL}/product/category/get/all`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log(data);
            const formattedCategories = data.result.categories.map((category) => ({
                value: category.id,
                label: category.name,
            }));
            setCategoryOptions(formattedCategories);
        } catch (error) {
            console.log(error.message);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: onCnicBackDrop,
        multiple: false,
    });

    const image = () => {
        console.log(cnic_back_img)
    }

    const [newitem, setNewitem] = useState("");

    const handleAddPR = async (data, { resetForm }) => {
        console.log(data);

        const formData = new FormData();

        const formatDateToISO = (dateString) => {
            const date = new Date(dateString);
            return date.toISOString();  // Converts to 'YYYY-MM-DDTHH:mm:ss.sssZ'
        };

        setIsLoading(true);
        setTimeout(() => {
            const InsertAPIURL = `${API_URL}/purchase-requisition/create`;

            formData.append("pr_number", data.pr_no);
            formData.append("status", "DRAFT");
            formData.append("pr_detail", data.pr_detail);
            formData.append("priority", data.priority);
            formData.append("requested_by", data.requested_by);
            formData.append("requested_date", formatDateToISO(data.requested_date));
            formData.append("required_date", formatDateToISO(data.required_date));
            formData.append("shipment_preferences", data.shipment_pre);
            formData.append("delivery_address", data.shipment_address);

            formData.append("items", JSON.stringify(newitem));

            formData.append("total_amount", "30");

            fetch(InsertAPIURL, {
                method: 'POST',
                body: formData,
            })
                .then(response => response.json())
                .then(response => {
                    console.log(response);
                    setIsLoading(false);

                    if (response.success) {
                        setIsLoading(false);
                        toast.success(response.message);
                        navigate("/puchase-requisition");
                        // setItems([{
                        //     item_id: "",
                        //     available_stock: "",
                        //     required_quantity: "",
                        //     price: "",
                        //     preffered_vendor_ids: []
                        // }]);
                        // resetForm();
                    } else {
                        setIsLoading(false);
                        toast.error(response.error.message);
                    }
                })
                .catch(error => {
                    setIsLoading(false);
                    toast.error(error.message, {
                        position: toast.POSITION.BOTTOM_CENTER
                    });
                });
        }, 3000);

    };

    const [items, setItems] = useState([{
        item_id: "",
        available_stock: "",
        required_quantity: "",
        price: "",
        preffered_vendor_ids: []
    }]);

    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        if (field === 'preffered_vendor_ids') {
            // Ensure it's an array
            newItems[index][field] = Array.isArray(value) ? value : [value];
        } else {
            newItems[index][field] = value;
        }
        setItems(newItems);
        // console.log('Updated Items:', newItems);
        setNewitem(newItems);
    };

    const addItem = () => {
        setItems([...items, { item_id: "", available_stock: "", required_quantity: "", price: "", preffered_vendor_ids: [] }]);
    };

    const removeItem = (index) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
        console.log(newItems);
    };

    const validationSchemaProduct = Yup.object({
        pr_no: Yup.string().required('PR Number is required'),
        pr_detail: Yup.string().required('PR Detail is required'),
        priority: Yup.string().required('Priority is required'),
        requested_by: Yup.string().required('Requested By is required'),
        requested_date: Yup.date().required('Requested Date is required'),
        required_date: Yup.date().required('Required Date is required'),
        shipment_pre: Yup.string().required('Shipment Preference is required'),
        shipment_address: Yup.string().required('Shipment Address is required'),
        // items: Yup.array().of(
        //     Yup.object().shape({
        //         item: Yup.string().required('Item is required'),
        //         available_stock: Yup.string().required('Stock in hand is required'),
        //         required_quantity: Yup.string().required('Required quantity is required'),
        //         price: Yup.string().required('Price is required'),
        //         vendor: Yup.string().required('Preferred Vendor is required')
        //     })
        // ).min(1, 'At least one item is required')
    });


    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const paddingLeftRight = windowWidth < 800 ? 0 : 300;

    //////////////////// 

    return (
        <>
            <h1 className="modal-item-heading">Add Purchase Requisition</h1>

            <Formik
                initialValues={{
                    pr_no: "",
                    pr_detail: "",
                    priority: "",
                    requested_by: "",
                    requested_date: "",
                    required_date: "",
                    shipment_pre: "",
                    shipment_address: ""
                }}
                validationSchema={validationSchemaProduct}
                onSubmit={handleAddPR}
            >
                {({ values, handleChange, handleSubmit }) => (
                    <Form>
                        <div className="modal-item-container">
                            <div>
                                <AppInput
                                    type="text"
                                    label="PR Number"
                                    name="pr_no"
                                    value={values.pr_no}
                                    onChange={handleChange}
                                />
                                <ErrorMessage name="pr_no" component="div" style={{ color: "red", fontSize: "13px" }} />
                            </div>
                            <div>
                                <AppInput
                                    type="text"
                                    label="PR Detail"
                                    name="pr_detail"
                                    value={values.pr_detail}
                                    onChange={handleChange}
                                />
                                <ErrorMessage name="pr_detail" component="div" style={{ color: "red", fontSize: "13px" }} />
                            </div>
                            <div>
                                <AppSelect
                                    label="Priority"
                                    name="priority"
                                    value={values.priority}
                                    options={priorityOptions}
                                    onChange={handleChange("priority")}
                                />
                                <ErrorMessage name="priority" />
                            </div>
                            <div>
                                <AppInput
                                    type="text"
                                    label="Requested By"
                                    name="requested_by"
                                    value={values.requested_by}
                                    onChange={handleChange}
                                />
                                <ErrorMessage name="requested_by" component="div" style={{ color: "red", fontSize: "13px" }} />
                            </div>
                            <div>
                                <AppInput
                                    type="date"
                                    label="Requested Date"
                                    name="requested_date"
                                    value={values.requested_date}
                                    onChange={handleChange}
                                />
                                <ErrorMessage name="requested_date" component="div" style={{ color: "red", fontSize: "13px" }} />
                            </div>
                            <div>
                                <AppInput
                                    type="date"
                                    label="Required Date"
                                    name="required_date"
                                    value={values.required_date}
                                    onChange={handleChange}
                                />
                                <ErrorMessage name="required_date" component="div" style={{ color: "red", fontSize: "13px" }} />
                            </div>
                            <div>
                                <AppInput
                                    type="text"
                                    label="Shipment Preference"
                                    name="shipment_pre"
                                    value={values.shipment_pre}
                                    onChange={handleChange}
                                />
                                <ErrorMessage name="shipment_pre" component="div" style={{ color: "red", fontSize: "13px" }} />
                            </div>
                            <div>
                                <AppInput
                                    type="text"
                                    label="Shipment Address"
                                    name="shipment_address"
                                    value={values.shipment_address}
                                    onChange={handleChange}
                                />
                                <ErrorMessage name="shipment_address" component="div" style={{ color: "red", fontSize: "13px" }} />
                            </div>
                        </div>
                        {items.map((item, index) => (
                            <div key={index} className="modal-item-container">
                                <div>
                                    <AppSelect
                                        label="Item"
                                        value={item.item_id}
                                        options={itemOptions}
                                        onChange={(e) => handleItemChange(index, 'item_id', e.target.value)}
                                    />
                                    {!item.item_id && <div style={{ color: "red", fontSize: "13px" }}>Item is required</div>}
                                </div>
                                <div>
                                    <AppInput
                                        type="number"
                                        label="Stock in hand"
                                        value={item.available_stock}
                                        onChange={(e) => handleItemChange(index, 'available_stock', e.target.value)}
                                    />
                                    {!item.available_stock && <div style={{ color: "red", fontSize: "13px" }}>Stock in hand is required</div>}
                                </div>
                                <div>
                                    <AppInput
                                        type="number"
                                        label="Required quantity"
                                        value={item.required_quantity}
                                        onChange={(e) => handleItemChange(index, 'required_quantity', e.target.value)}
                                    />
                                    {!item.required_quantity && <div style={{ color: "red", fontSize: "13px" }}>Required quantity is required</div>}
                                </div>
                                <div>
                                    <AppInput
                                        type="number"
                                        label="Price"
                                        value={item.price}
                                        onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                                    />
                                    {!item.price && <div style={{ color: "red", fontSize: "13px" }}>Price is required</div>}
                                </div>
                                <div>
                                    <AppSelect
                                        label="Preferred Vendor"
                                        value={item.preffered_vendor_ids}
                                        options={vendorOptions}
                                        onChange={(e) => handleItemChange(index, 'preffered_vendor_ids', Array.from(e.target.selectedOptions, option => option.value))}
                                        multiple
                                    />
                                    {!item.preffered_vendor_ids.length && <div style={{ color: "red", fontSize: "13px" }}>Preferred Vendor is required</div>}
                                </div>

                                {index === items.length - 1 && (
                                    <div style={{ display: "flex", justifyContent: "center", alignContent: "center", gap: "15px" }}>
                                        {/* <button type="button" onClick={() => removeItem(index)}>
                                             Remove Item
                                         </button> */}

                                        {/* <Button type="button" onClick={addItem}>
                                              <FaPlus size={21}/>
                                         </Button> */}

                                        <button type="button" onClick={addItem}>
                                            Add Item
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                        <div className="flex-center">
                            <div className="my-5 w-52">
                                <Button
                                    onClick={handleSubmit}
                                    title="Submit"
                                    width={true}
                                    spinner={isLoading ? <Spinner size="sm" /> : null}
                                />
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>

        </>
    );
};

export default AddPurchaseRequistion;

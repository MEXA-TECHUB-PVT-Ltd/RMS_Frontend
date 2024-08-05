import React, { useCallback, useEffect, useState } from "react";
import Button from "../../components/form/Button";
import AppInput from "../../components/form/AppInput";
import { Formik, Form } from 'formik';
import * as Yup from "yup";
import { currency, paymentTerm } from "../../utils/vendor";
import { useDispatch, useSelector } from "react-redux";
import { getCurrencies } from "../../app/features/currency/getCurrencySlice";
import { getPaymentTerms } from "../../app/features/paymentTerms/getPaymentTermSlice";
import AppSelect from "../../components/form/AppSelect";
import { useDropzone } from "react-dropzone";
import { FaCloudUploadAlt } from "react-icons/fa";
import { addVendor } from "../../app/features/Vendor/addVendorSlice";
import toast from "react-hot-toast";
import { Spinner } from "../../components/theme/Loader";
import { useNavigate } from "react-router-dom";

import { getItems } from "../../app/features/Item/getItemSlice";
import ErrorMessage from "../../components/form/ErrorMessage";

const API_URL = import.meta.env.VITE_API_URL;

const AddItem = () => {
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




    const itemOptions = [
        { value: "PRODUCT", label: "PRODUCT" },
        { value: "SERVICE", label: "SERVICE" },
    ];

    useEffect(() => {
        fetchCategories();
        fetchVendors();
        fetchUnits();
    }, []);

    const [unitOptions, setUnitOptions] = useState([]);
    const fetchUnits = async () => {

        try {
            const response = await fetch(`${API_URL}/units/list`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log(data);
            const formattedVendors = data.result.units.map((vendor) => ({
                value: vendor.id,
                label: vendor.unit
            }));
            setUnitOptions(formattedVendors);
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

    const catalogOptions = [
        { value: "CONSUMER", label: "CONSUMER" },
        { value: "ASSETS", label: "ASSETS" },
    ];

    const {
        getRootProps: documentRootProps,
        getInputProps: documentInputProps,
        isDragActive: isDocumentDrag,
    } = useDropzone({
        onDrop: onDocumentDrop,
        multiple: false,
        accept: {
            "application/pdf": [".pdf"],
        },
    });

    const {
        getRootProps: cnicFrontRootProps,
        getInputProps: cnicInputProps,
        isDragActive: isCnicDrag,
    } = useDropzone({
        onDrop: onCnicDrop,
        multiple: false,
    });

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: onCnicBackDrop,
        multiple: false,
    });

    const image = () => {
        console.log(cnic_back_img)
    }

    const handleAddItem = async (data, { resetForm }) => {
        console.log(data);
        console.log(cnic_back_img)

        if (cnic_back_img == null) {
            setIsLoading(true);
            setTimeout(() => {
                const InsertAPIURL = `${API_URL}/item/create`;
                const headers = {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                };

                const transformToNull = (value) => (value.length === 0 ? null : value);

                let Data = {};

                if (data.item_type === "SERVICE") {
                    Data = {
                        type: data.item_type,
                        name: data.name,
                        vendor_id: data.vendor,
                        description: data.service_description,
                    };
                } else {
                    Data = {
                        type: data.item_type,
                        name: data.name,
                        product_category: data.category,
                        product_units: data.units,
                        usage_unit: data.usage_unit,
                        product_catalog: data.catalog,
                        vendor_id: data.vendor,
                        // image: "image.png",
                        stock_in_hand: transformToNull(data.opening_stock),
                        opening_stock_rate: transformToNull(data.rate_per_unit),
                        reorder_unit: transformToNull(data.re_order_level),
                        inventory_description: transformToNull(data.description),
                    };
                }

                fetch(InsertAPIURL, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(Data),
                })
                    .then(response => response.json())
                    .then(response => {
                        console.log(response);
                        setIsLoading(false);
                        if (response.success) {
                            setIsLoading(false);
                            toast.success(response.message);
                            navigate("/items");
                            resetForm();
                        } else {
                            setIsLoading(false);
                            toast.error(response.error.message);
                        }
                    })
                    .catch(error => {
                        setIsLoading(false);
                        toast.error(error, {
                            position: toast.POSITION.BOTTOM_CENTER
                        });
                    });
            }, 3000);
        } else {
            setIsLoading(true);
            setTimeout(() => {

                const formData = new FormData();

                formData.append("image", cnic_back_img);

                const InsertAPIURL = `${API_URL}/file/upload`;
                // const headers = {
                //     'Accept': 'application/json',
                //     'Content-Type': 'multipart/form-data',
                // };

                fetch(InsertAPIURL, {
                    method: 'POST',
                    // headers: headers,
                    body: formData,
                })
                    .then(response => response.json())
                    .then(response => {
                        console.log(response);
                        setIsLoading(false);
                        if (response.success) {

                            const InsertAPIURL = `${API_URL}/item/create`;
                            const headers = {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                            };

                            const transformToNull = (value) => (value.length === 0 ? null : value);

                            let Data = {};

                            if (data.item_type === "SERVICE") {
                                Data = {
                                    type: data.item_type,
                                    name: data.name,
                                    vendor_id: data.vendor,
                                    description: data.service_description,
                                };
                            } else {
                                Data = {
                                    type: data.item_type,
                                    name: data.name,
                                    product_category: data.category,
                                    product_units: data.units,
                                    usage_unit: data.usage_unit,
                                    product_catalog: data.catalog,
                                    vendor_id: data.vendor,
                                    image: response.data.url,
                                    stock_in_hand: transformToNull(data.opening_stock),
                                    opening_stock_rate: transformToNull(data.rate_per_unit),
                                    reorder_unit: transformToNull(data.re_order_level),
                                    inventory_description: transformToNull(data.description),
                                };
                            }

                            fetch(InsertAPIURL, {
                                method: 'POST',
                                headers: headers,
                                body: JSON.stringify(Data),
                            })
                                .then(response => response.json())
                                .then(response => {
                                    console.log(response);
                                    setIsLoading(false);
                                    if (response.success) {
                                        setIsLoading(false);
                                        toast.success(response.message);
                                        navigate("/items");
                                        resetForm();
                                    } else {
                                        setIsLoading(false);
                                        toast.error(response.error.message);
                                    }
                                })
                                .catch(error => {
                                    setIsLoading(false);
                                    toast.error(error, {
                                        position: toast.POSITION.BOTTOM_CENTER
                                    });
                                });

                        }
                    })
                    .catch(error => {
                        setIsLoading(false);
                        toast.error(error, {
                            position: toast.POSITION.BOTTOM_CENTER
                        });
                    });
            }, 3000);
        }
    };

    const validationSchemaService = Yup.object().shape({
        item_type: Yup.string().required("Item type is required"),
        name: Yup.string().required("Name is required"),
        vendor: Yup.string().required("Vendor is required"),
        service_description: Yup.string().required("Description is required")
    });

    const validationSchemaProduct = Yup.object().shape({
        item_type: Yup.string().required("Item type is required"),
        category: Yup.string().required("Category is required"),
        name: Yup.string().required("Name is required"),
        units: Yup.string().required("Unit is required"),
        usage_unit: Yup.string().required("Usage unit is required"),
        catalog: Yup.string().required("Catalog is required"),
        vendor: Yup.string().required("Vendor is required"),
        opening_stock: Yup.string().nullable(),
        rate_per_unit: Yup.string().nullable(),
        re_order_level: Yup.string().nullable(),
        description: Yup.string().nullable()
    });

    const getValidationSchema = (itemType) => {
        return itemType === 'SERVICE' ? validationSchemaService : validationSchemaProduct;
    };

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
            <Formik
                initialValues={{
                    item_type: "",
                    category: "",
                    name: "",
                    units: "",
                    usage_unit: "",
                    catalog: "",
                    vendor: "",
                    opening_stock: "",
                    rate_per_unit: "",
                    re_order_level: "",
                    description: "",
                    service_description: ""
                }}
                validationSchema={Yup.lazy(values => getValidationSchema(values.item_type))}
                onSubmit={handleAddItem}
            >
                {({ values, handleChange, handleSubmit }) => (
                    <Form>
                        <h1 className="modal-item-heading">{values.item_type === "SERVICE" ? "Service Details" : "Product Details"}</h1>

                        {values.item_type !== "SERVICE" && (
                            <div style={{ paddingBottom: 15, paddingLeft: paddingLeftRight, paddingRight: paddingLeftRight }}>
                                <div {...getRootProps()} className="drag-drop-container">
                                    <input {...getInputProps()} />
                                    {isDragActive ? (
                                        <div className="drag-drop-subContainer">Upload image here</div>
                                    ) : (
                                        <div>
                                            {cnic_back_img ? (
                                                <img
                                                    src={cnic_back_img.preview}
                                                    onLoad={() => {
                                                        URL.revokeObjectURL(cnic_back_img.preview);
                                                    }}
                                                    alt=""
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="text-center">
                                                    <p className="flex-center">
                                                        <FaCloudUploadAlt size={50} className="text-gray-700 dark:text-dark_text_1" />
                                                    </p>
                                                    <p className="font-medium text-sm mb-2">Select or Drop your item image here</p>
                                                    <p className="text-sm text-gray-400">Accepted formats: JPG, PNG, JPEG</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {values.item_type === "SERVICE" ?
                            <div className="modal-item-container">
                                <div>
                                    <AppSelect
                                        label="Item Type"
                                        name="item_type"
                                        value={values.item_type}
                                        options={itemOptions}
                                        onChange={handleChange("item_type")}
                                    />
                                    <ErrorMessage name="item_type" />
                                </div>

                                <div>
                                    <AppInput
                                        type="text"
                                        label="Name"
                                        name="name"
                                        value={values.name}
                                        onChange={handleChange("name")}
                                    />
                                    <ErrorMessage name="name" />
                                </div>

                                <div>
                                    <AppSelect
                                        label="Preferred Vendor"
                                        name="vendor"
                                        value={values.vendor}
                                        options={vendorOptions}
                                        onChange={handleChange("vendor")}
                                    />
                                    <ErrorMessage name="vendor" />
                                </div>

                                <div>
                                    <AppInput
                                        type="text"
                                        label="Description"
                                        name="service_description"
                                        value={values.service_description}
                                        onChange={handleChange("service_description")}
                                    />
                                    <ErrorMessage name="service_description" />
                                </div>
                            </div>
                            :
                            <div>
                                <div className="modal-item-container">
                                    <div>
                                        <AppSelect
                                            label="Item Type"
                                            name="item_type"
                                            value={values.item_type}
                                            options={itemOptions}
                                            onChange={handleChange("item_type")}
                                        />
                                        <ErrorMessage name="item_type" />
                                    </div>

                                    <div>
                                        <AppInput
                                            type="text"
                                            label="Name"
                                            name="name"
                                            value={values.name}
                                            onChange={handleChange("name")}
                                        />
                                        <ErrorMessage name="name" />
                                    </div>

                                    <div>
                                        <AppSelect
                                            label="Category"
                                            name="category"
                                            value={values.category}
                                            options={categoryOptions}
                                            onChange={handleChange("category")}
                                        />
                                        <ErrorMessage name="category" />
                                    </div>

                                    <div>
                                        <AppSelect
                                            label="Units"
                                            name="units"
                                            value={values.units}
                                            options={unitOptions}
                                            onChange={handleChange("units")}
                                        />
                                        <ErrorMessage name="units" />
                                    </div>

                                    <div>
                                        <AppSelect
                                            label="Usage Units"
                                            name="usage_unit"
                                            value={values.usage_unit}
                                            options={unitOptions}
                                            onChange={handleChange("usage_unit")}
                                        />
                                        <ErrorMessage name="usage_unit" />
                                    </div>

                                    <div>
                                        <AppSelect
                                            label="Product Catalog"
                                            name="catalog"
                                            value={values.catalog}
                                            options={catalogOptions}
                                            onChange={handleChange("catalog")}
                                        />
                                        <ErrorMessage name="catalog" />
                                    </div>

                                    <div>
                                        <AppSelect
                                            label="Preferred Vendor"
                                            name="vendor"
                                            value={values.vendor}
                                            options={vendorOptions}
                                            onChange={handleChange("vendor")}
                                        />
                                        <ErrorMessage name="vendor" />
                                    </div>
                                </div>

                                <h1 className="modal-item-heading">Inventory Tracking</h1>

                                <div className="modal-item-container">
                                    <div>
                                        <AppInput
                                            type="text"
                                            label="Opening stock"
                                            name="opening_stock"
                                            value={values.opening_stock}
                                            onChange={handleChange("opening_stock")}
                                        />
                                        {/* <ErrorMessage name="opening_stock" /> */}
                                    </div>

                                    <div>
                                        <AppInput
                                            type="text"
                                            label="Opening stock rate per unit"
                                            name="rate_per_unit"
                                            value={values.rate_per_unit}
                                            onChange={handleChange("rate_per_unit")}
                                        />
                                        {/* <ErrorMessage name="rate_per_unit" /> */}
                                    </div>

                                    <div>
                                        <AppInput
                                            type="text"
                                            label="Re-order Level"
                                            name="re_order_level"
                                            value={values.re_order_level}
                                            onChange={handleChange("re_order_level")}
                                        />
                                        {/* <ErrorMessage name="re_order_level" /> */}
                                    </div>

                                    <div>
                                        <AppInput
                                            type="text"
                                            label="Description"
                                            name="description"
                                            value={values.description}
                                            onChange={handleChange("description")}
                                        />
                                        {/* <ErrorMessage name="description" /> */}
                                    </div>
                                </div>
                            </div>
                        }

                        <div className="flex-center">
                            <div className="my-5 w-52">
                                <Button
                                    onClick={isLoading ? "" : handleSubmit}
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

export default AddItem;

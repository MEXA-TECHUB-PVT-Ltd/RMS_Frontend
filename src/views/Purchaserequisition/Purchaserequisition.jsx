import React, { useCallback, useEffect, useState } from "react";
import DataTable from "../../components/table/DataTable";
import { FaEdit, FaEye, FaTrash, FaPlus } from "react-icons/fa";
import Card from "../../components/card/Card";
import { useDispatch, useSelector } from "react-redux";
import { getPRs } from "../../app/features/Purchaserequisition/getPurchaseRequisitionSlice";
import CardItem from "../../components/card/CardItem";

const API_URL = import.meta.env.VITE_API_URL;

import {
    handleChangePage,
    handleChangeRowsPerPage,
    handleDelete,
    handleSearch,
} from "../../utils/vendor";
import Header from "../../components/header";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/modal/Modal";
import Button from "../../components/form/Button";
import { Spinner } from "../../components/theme/Loader";
import toast from "react-hot-toast";

const Purchaserequisition = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [viewType, setViewType] = useState("");
    const [currentId, setCurrentId] = useState(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingApproval, setLoadingApproval] = useState({});

    const { textColor } = useSelector((state) => state.theme);
    // const { isLoading } = useSelector((state) => state.deleteVendor); 

    const rows = [
        { pr_number: "e3r5gf6yg", requested_by: "John Doe", requested_date: "29-07-2024", piriority: "Low", status: "ACCEPTED" },
        { pr_number: "e3r5gf6yg", requested_by: "John Doe", requested_date: "29-07-2024", piriority: "Low", status: "PENDING" },
        { pr_number: "e3r5gf6yg", requested_by: "John Doe", requested_date: "29-07-2024", piriority: "Low", status: "REJECTED" },
        { pr_number: "e3r5gf6yg", requested_by: "John Doe", requested_date: "29-07-2024", piriority: "Low", status: "DRAFT" },
    ]

    const prColumns = [
        {
            name: "PR Nnumber",
            selector: (row) => row.pr_number == null || undefined ? "-" : row.pr_number,
            sortable: true,
            style: {
                width: '100px',
            },
        },
        {
            name: "Requested By",
            selector: (row) => row.requested_by == null || undefined ? "-" : row.requested_by,
            sortable: true,
            style: {
                width: '100px',
            },
        },
        {
            name: "Requested Date",
            selector: (row) => row.requested_date == null ? "-" : row.requested_date.slice(0, 10),
            sortable: true,
            style: {
                width: '100px',
            },
        },
        {
            name: "Priority",
            selector: (row) => row.priority == null ? "-" : row.priority,
            sortable: true,
        },
        {
            name: "Status",
            selector: (row) => (
                <div style={{
                    fontWeight: "bold",
                    borderRadius: "50px",
                    backgroundColor: row.status === "DRAFT" ? 'darkblue' :
                        row.status === "PENDING" ? 'orange' :
                            row.status === "ACCEPTED" ? 'green' :
                                row.status === "REJECTED" ? 'red' :
                                    'yellow',
                    padding: 8,
                    color: "white",
                    // color: row.status === "DRAFT" ? 'darkblue' :
                    //     row.status === "PENDING" ? 'orange' :
                    //         row.status === "ACCEPTED" ? 'green' :
                    //             row.status === "REJECTED" ? 'red' :
                    //                 'yellow',
                    width: '100px',

                }}>
                    <div style={{ textAlign: "center" }}>
                        {row.status == null ? "-" : row.status}
                    </div>
                </div>
            ),
            sortable: true,
            style: {
                width: '100px', // Set the width you want
            },
        },
        {
            name: "Action",
            selector: (row) => (
                <div className="flex-center gap-2 cursor-pointer">
                    <FaEye
                        size={15}
                        className="text-eye_black dark:text-eye_white flex-none"
                        onClick={() => navigate(`/purchase-requisition-details?pr_id=${row.id}`)}
                    />

                    <FaEdit
                        size={20}
                        className={`${textColor}`}
                        onClick={() => navigate(`/edit-puchase-requisition?pr_id=${row.id}`)}
                    />

                    <FaTrash
                        size={15}
                        className="text-red-600 flex-none"
                    onClick={() => {
                        setCurrentId(row.id);
                        setDeleteModal(true);
                    }}
                    />
                </div >
            ),
            style: {
                width: '350px',
            },
        },
        {
            selector: (row) => (
                <div>
                    <div key={row.id} className="flex-center gap-2 cursor-pointer">
                        <button
                            onClick={() => sendtovendor(row)}
                            style={{
                                backgroundColor: row.status === "ACCEPTED" ? 'lightgray' : 'orange',
                                color: row.status === "ACCEPTED" ? 'gray' : '#ffffff',
                                fontWeight: "bold",
                                padding: 8,
                                borderRadius: "10px",
                            }}
                            disabled={row.status !== "DRAFT"}
                        >
                            {loadingApproval[row.id] ? (
                                <>
                                    <Spinner size="sm" />
                                    Send for approval
                                </>
                            ) : (
                                "Send for approval"
                            )}
                        </button>
                    </div>
                </div>
            ),
        },
    ];

    const sendtovendor = async (row) => {
        setLoadingApproval(prev => ({ ...prev, [row.id]: true }));
        setTimeout(() => {
            const InsertAPIURL = `${API_URL}/purchase-requisition/${row.id}`;

            const formData = new FormData();

            formData.append("status", "ACCEPTED");

            fetch(InsertAPIURL, {
                method: 'PUT',
                body: formData,
            })
                .then(response => response.json())
                .then(response => {
                    console.log(response);
                    setLoadingApproval(false);

                    if (response.success) {
                        setLoadingApproval(prev => ({ ...prev, [row.id]: false }));
                        toast.success("PR send for approval");
                        dispatch(
                            getPRs({
                                page,
                                limit: rowsPerPage,
                                search: searchQuery,
                            })
                        );
                    } else {
                        setLoadingApproval(prev => ({ ...prev, [row.id]: false }));
                        toast.error(response.error.message);
                    }
                })
                .catch(error => {
                    setLoadingApproval(prev => ({ ...prev, [row.id]: false }));
                    toast.error(error.message, {
                        position: toast.POSITION.BOTTOM_CENTER
                    });
                });
        }, 3000);
    }

    const onDelete = () => {

        setLoading(true);
        setTimeout(() => {
            const InsertAPIURL = `${API_URL}/purchase-requisition/${currentId}`;
            const headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            };

            fetch(InsertAPIURL, {
                method: 'DELETE',
                headers: headers,
                body: JSON.stringify(),
            })
                .then(response => response.json())
                .then(response => {
                    console.log(response);
                    setLoading(false);
                    if (response.success) {
                        setDeleteModal
                        setLoading(false);
                        toast.success(response.message);
                        setDeleteModal(false);
                        dispatch(
                            getPRs({
                                page,
                                limit: rowsPerPage,
                                search: searchQuery, // Include searchQuery in the request
                            })
                        );
                    } else {
                        setLoading(false);
                        toast.error(response.message);
                        setDeleteModal(false);
                    }
                })
                .catch(error => {
                    setLoading(false);
                    toast.error(error.message);
                });
        }, 3000);

    }

    //* Hooks */

    // const {isLoading, items, pagination, error} = useSelector((state) => state.getItem || { });

    const { isLoading, pr, pagination, error } = useSelector((state) => state.getPR);

    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');

    const handleChangePage = (newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (newRowsPerPage) => {
        setRowsPerPage(newRowsPerPage);
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        setPage(1); // Reset to first page on search
    };

    useEffect(() => {
        dispatch(getPRs({ page, limit: rowsPerPage }));
    }, [dispatch, page, rowsPerPage]);

    return (
        <div className="my-5">
            <Header
                title="Purchase Requisition"
                buttonTitle="Add"
                buttonIcon={FaPlus}
                viewType={viewType}
                onViewType={setViewType}
                onSearch={handleSearch}
                onAddButtonClick={() => navigate("/add-puchase-requisition")}
            />

            {/* <div className="py-5 px-10"> */}
            {isLoading ? (
                <Spinner size="lg" />
            ) : (
                <>
                    {viewType !== "GRID" ? (
                        <DataTable
                            data={pr}
                            columns={prColumns}
                            pagination
                            paginationServer
                            paginationTotalRows={pagination.totalItems}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                            onChangePage={handleChangePage}
                        />
                    ) : (
                        <div className="card-view">
                            {pr.map((item) => {
                                return (
                                    <Card key={item?.id}>
                                        <CardItem title={"PR Number"} value={item?.pr_number == null || undefined ? "-" : item?.pr_number} />
                                        <CardItem title={"Requested By"} value={item?.requested_by} />
                                        <CardItem
                                            title={"Requested Date"}
                                            value={item?.requested_date.slice(0, 10)}
                                        />
                                        <CardItem
                                            title={"Priority"}
                                            value={item?.priority}
                                        />
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </>
            )}

            <Modal
                title={"Delete Purchase Requisition"}
                size="sm"
                isOpen={deleteModal}
                onClose={() => setDeleteModal(false)}
            >
                <h1 className="flex-start text-base font-semibold">
                    Are you sure want to delete this PR?{" "}
                </h1>

                <div className="flex-end gap-3 mt-5">
                    <Button
                        title={"Cancel"}
                        onClick={() => setDeleteModal(false)}
                        color={"bg-red-500"}
                    />
                    <Button
                        title={"Delete"}
                        onClick={loading ? "" : () => onDelete(currentId)}
                        spinner={loading ? <Spinner size="sm" /> : null}
                    />
                </div>
            </Modal>
        </div>
    );
};

export default Purchaserequisition;

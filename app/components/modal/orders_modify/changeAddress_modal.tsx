import { Phone, X } from "lucide-react";
import React, { useRef, useState } from "react";

interface ChangeAddressModalProps {
    onClose: () => void;
    onAddressChange?: (newAddress: any) => void;
    name: string;
    phone: string;
    address: string;
}

const ChangeAddressModal: React.FC<ChangeAddressModalProps> = ({
    onClose,
    onAddressChange,
    name,
    phone,
    address,
}) => {
    const [highlighted, setHighlighted] = useState<
        "address" | "addAddress" | null
    >("address");
    const formRef = useRef<HTMLFormElement>(null);

    const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    const handleAddAddressClick = () => {
        setHighlighted("addAddress");
    };

    const handleAddressClick = () => {
        setHighlighted("address");
    };

    const handleAddressChange = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (formRef.current) {
            const formData = new FormData(formRef.current);
            const updatedAddress = {
                street: formData.get("streetAddress"),
                barangay: formData.get("barangay"),
                city: formData.get("city"),
                zipcode: formData.get("zipCode"),
            };
            if (onAddressChange) {
                onAddressChange(updatedAddress);
            }
            onClose();
        }
    };

    return (
        <>
            <div
                className="fixed inset-0 flex items-center justify-center bg-black/50 z-40"
                onClick={handleOverlayClick}
            >
                <div
                    className="relative bg-white rounded-2xl p-5 h-full w-full md:h-fit md:w-fit overflow-scroll md:overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        className="absolute flex cursor-pointer items-center justify-center top-4 right-4 w-10 h-10"
                        onClick={onClose}
                    >
                        <X className="text-[#240C03] font-bold" />
                    </button>
                    <div className="flex w-full border-b-3 pb-2 border-[#E19517] justify-center ">
                        <span className="font-semibold text-xl items-center">
                            Change Address
                        </span>
                    </div>
                    {/* Items Start Here */}
                    <div
                        className={`flex flex-col mt-5 w-130 border-1 rounded-lg px-5 py-2 cursor-pointer ${
                            highlighted === "address"
                                ? "bg-[#E19517] text-amber-50"
                                : "bg-amber-50 text-black"
                        }`}
                        onClick={handleAddressClick}
                    >
                        <div className="">
                            <span className="font-semibold text-xl">
                                {name} | {phone}
                            </span>
                        </div>
                        <div className="">
                            {address}
                        </div>
                    </div>
                    <button
                        className={`border-2 border-[#E19517] rounded-lg h-fit py-2 px-5 hover:bg-[#E19517] hover:text-amber-50 cursor-pointer text-sm font-medium ease-in-out duration-200 mt-5 ${
                            highlighted === "addAddress"
                                ? "bg-[#E19517] text-amber-50"
                                : "text-[#E19517]"
                        }`}
                        onClick={handleAddAddressClick}
                    >
                        Add Address
                    </button>
                    <div
                        className={`mx-5 ${
                            highlighted === "addAddress" ? "block" : "hidden"
                        }`}
                    >
                        <form
                            ref={formRef}
                            className="space-y-2 mt-5 w-full"
                            onSubmit={handleAddressChange}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 gap-x-10 w-full">
                                <div className="w-full">
                                    <label
                                        htmlFor="street-address"
                                        className="block text-sm font-medium text-[#240C03]"
                                    >
                                        Street Address
                                    </label>
                                    <input
                                        type="text"
                                        id="street-address"
                                        name="streetAddress"
                                        defaultValue={""}
                                        className="w-full px-4 py-2 mt-1 border border-gray-400 rounded-md focus:outline-none"
                                    />
                                </div>
                                <div className="w-full">
                                    <label
                                        htmlFor="barangay"
                                        className="block text-sm font-medium text-[#240C03]"
                                    >
                                        Barangay
                                    </label>
                                    <input
                                        type="text"
                                        id="barangay"
                                        name="barangay"
                                        defaultValue={""}
                                        className="w-full px-4 py-2 mt-1 border border-gray-400 rounded-md focus:outline-none"
                                    />
                                </div>
                                <div className="w-full">
                                    <label
                                        htmlFor="city"
                                        className="block text-sm font-medium text-[#240C03]"
                                    >
                                        City
                                    </label>
                                    <input
                                        type="text"
                                        id="city"
                                        name="city"
                                        value={"Davao"}
                                        readOnly
                                        className="w-full px-4 py-2 mt-1 border border-gray-400 rounded-md focus:outline-none text-gray-600"
                                    />
                                </div>
                                <div className="w-full">
                                    <label
                                        htmlFor="zip-code"
                                        className="block text-sm font-medium text-[#240C03]"
                                    >
                                        Zip Code
                                    </label>
                                    <input
                                        type="text"
                                        id="zip-code"
                                        name="zipCode"
                                        defaultValue={""}
                                        className="w-full px-4 py-2 mt-1 border border-gray-400 rounded-md focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div className="flex mt-5 justify-end gap-x-2">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="border-2 border-[#E19517] rounded-lg py-1 px-4 cursor-pointer text-[#E19517] font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="border-2 border-[#E19517] bg-[#E19517] rounded-lg py-1 px-4 cursor-pointer text-amber-50 font-medium"
                                >
                                    Update
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ChangeAddressModal;

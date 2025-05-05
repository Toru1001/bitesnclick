import { X } from 'lucide-react';
import React, { useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import ConfirmationModal from '../confirmation_modal';

interface PaymentModalProps {
    onClose: () => void;
    onImageUpload: (imageUrl: string) => void; // Callback to return the image URL to the parent page
}

const PaymentModal: React.FC<PaymentModalProps> = ({ onClose, onImageUpload }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [confirmationModal, setConfirmationModal] = useState(false);

    const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSubmit = async () => {
        if (!selectedFile) {
            alert('Please select a file to upload.');
            return;
        }

        setIsUploading(true);

        try {
            const fileName = `${Date.now()}_${selectedFile.name}`;
            const { error } = await supabase.storage
                .from('gcash-payment')
                .upload(`receipts/${fileName}`, selectedFile);

            if (error) {
                console.error('Error uploading file:', error.message);
                alert('Failed to upload the file. Please try again.');
                return;
            }

            const { data } = supabase.storage
                .from('gcash-payment')
                .getPublicUrl(`receipts/${fileName}`);

            const publicUrl = data?.publicUrl;

            if (publicUrl) {
                onImageUpload(publicUrl);
                onClose();
            }
        } catch (error) {
            console.error('Unexpected error:', error);
            alert('An unexpected error occurred. Please try again.');
        } finally {
            setIsUploading(false);
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
                    <div className="flex w-full justify-center border-b-3 pb-2 border-[#E19517]">
                        <span className="font-semibold text-xl">GCASH Payment</span>
                    </div>
                    {/* Items Start Here */}
                    <div className="flex flex-col w-100 border-1 border-gray-400 p-4 mt-4">
                        <span>
                            Method: <span className="text-gray-600 font-semibold">Gcash</span>
                        </span>
                        <div className="flex text-sm text-justify">
                            <span className="w-15">Step 1:</span>
                            <span>On your GCash homepage, tap Send</span>
                        </div>
                        <div className="flex text-sm text-justify">
                            <span className="w-15">Step 2:</span>
                            <span>Select Express Send</span>
                        </div>
                        <div className="flex text-sm">
                            <span className="w-20">Step 3:</span>
                            <span className="w-fit">
                                Input the GCash account via mobile number, type 09934569497. Then input total payment amount. Tap Next.
                            </span>
                        </div>
                        <div className="flex text-sm">
                            <span className="w-20">Step 4:</span>
                            <span className="w-fit">
                                Check the box to confirm that the details are correct. Seller Gcash Account Name: J**n**l M****u****s.
                                Tap Send.
                            </span>
                        </div>
                        <div className="flex text-sm text-justify">
                            <span className="w-20">Step 5:</span>
                            <span className="w-fit">
                                Once successfully sent, you will see the receipt of your transaction. Download your receipt. Confirmed
                                transactions will not be refunded. You may also view the confirmation in your GCash app inbox or
                                Transaction History.
                            </span>
                        </div>
                        <div className="flex text-sm text-justify">
                            <span className="w-20">Step 6:</span>
                            <span className="w-fit">
                                Submit downloaded receipt below for payment processing and confirmation.
                            </span>
                        </div>
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full p-2 border rounded mt-3 cursor-pointer"
                    />
                    <div className="flex justify-end gap-x-2 mt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="border-2 border-[#E19517] rounded-lg py-1 px-4 cursor-pointer text-[#E19517] font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={() => setConfirmationModal(true)}
                            disabled={isUploading}
                            className={`border-2 border-[#E19517] ${
                                isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#E19517]'
                            } rounded-lg py-1 px-4 text-amber-50 font-medium`}
                        >
                            {isUploading ? 'Uploading...' : 'Apply'}
                        </button>
                    </div>
                </div>
            </div>
            {confirmationModal && (
                <ConfirmationModal onClose={() => setConfirmationModal(false)}
                buttonText='Confirm'
                title='Payment Confirmation'
                description='Please confirm that you have sent the payment and uploaded the receipt.'
                onConfirm={handleSubmit}
                />
            )}
        </>
    );
};

export default PaymentModal;
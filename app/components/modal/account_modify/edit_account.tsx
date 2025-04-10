import { supabase } from '@/app/lib/supabase';
import { Eye, EyeOff, X } from 'lucide-react';
import router, { useRouter } from 'next/navigation';
import React, { useState, useEffect, useRef } from 'react';
import ConfirmationModal from '../confirmation_modal';

interface EditAccountModalProps {
  onClose: () => void;
}

const EditAccountModal: React.FC<EditAccountModalProps> = ({ onClose }) => {
  const [customerDetails, setCustomerDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setReShowPassword] = useState(false);
  const [showEditPassword, setEditPassword] = useState(false);
  const [showOldPassword, setOldPassword] = useState(false);
  const router = useRouter();
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from('customers')
          .select('*')
          .eq('customerid', user.id)
          .single();

        if (error) {
          setError(error.message);
        } else {
          setCustomerDetails(data);
        }
      } else {
        router.replace('/');
        setError('User not logged in.');
      }
    };

    fetchCustomerDetails();
  }, []);

  const handleEditAccount = async () => {
    if (!formRef.current) return;
    const form = formRef.current;
    const firstName = form.firstName.value;
    const lastName = form.lastName.value;
    const displayName = `${firstName} ${lastName}`;
    const mobileNumber = form.mobileNumber.value;
    const streetAddress = form.streetAddress.value;
    const city = form.city.value;
    const barangay = form.barangay.value;
    const zipCode = form.zipCode.value;

    const oldPassword = form.oldPassword?.value;
    const newPassword = form.newPassword?.value;
    const confirmPassword = form.rePassword?.value;

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (!user) {
      setError('User not found.');
      return;
    }

    try {
      const { error: updateError } = await supabase
        .from('customers')
        .update({
          first_name: firstName,
          last_name: lastName,
          mobile_num: mobileNumber,
          street_address: streetAddress,
          city,
          barangay,
          zipcode: zipCode,
        })
        .eq('customerid', user.id);

      if (updateError) throw new Error(updateError.message);

      const { error: authError } = await supabase.auth.updateUser({
        data: { display_name: displayName },
      });

      if (authError) throw new Error(authError.message);

      if (showEditPassword) {
        if (!oldPassword || !newPassword || !confirmPassword) {
          throw new Error('Please fill in all password fields.');
        }

        if (newPassword !== confirmPassword) {
          throw new Error('New password and confirmation do not match.');
        }

        if (newPassword.length < 6) {
          throw new Error('Password must be at least 6 characters.');
        }

        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: customerDetails.email,
          password: oldPassword,
        });

        if (signInError) throw new Error('Old password is incorrect.');

        const { error: passError } = await supabase.auth.updateUser({
          password: newPassword,
        });

        if (passError) throw new Error(passError.message);
      }

      console.log('Account updated successfully.');
      window.location.reload();
      onClose();
    } catch (err: any) {
      console.error('Error updating account:', err.message);
      setError(err.message);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (!user) {
        setError('User not found.');
        return;
      }
  
      const response = await fetch('/lib/delete-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
  
      const responseData = await response.json();
  
      if (!response.ok) {
        setError(responseData.error || 'Failed to delete account');
        return;
      }
  
      if (responseData.success) {
        localStorage.clear();
        router.replace('/');
        window.location.reload();
        onClose();
      } else {
        setError('An error occurred while deleting the account.');
      }
    } catch (err) {
      console.error('Error deleting account:', err);
      // setError(err.message);
    }
  };
  
  
  

  return (

    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-30" onClick={handleOverlayClick}>
      <div className="relative flex flex-col bg-white rounded-lg overflow-auto shadow-lg w-full md:w-fit h-full md:h-fit p-10" onClick={(e) => e.stopPropagation()}>
        <button
          className="absolute flex cursor-pointer items-center justify-center top-5 right-5 w-10 h-10"
          onClick={onClose}
        >
          <X className="text-[#240C03] font-bold" />
        </button>
        <div className="flex w-full justify-center border-b-3 pb-2 border-[#E19517]">
          <span className="font-semibold text-xl">Edit Profile</span>
        </div>
        <div className="mx-5">
    <form ref={formRef} className="space-y-2 mt-5 w-full" onSubmit={(e) => {
              e.preventDefault();
              setShowConfirmationModal(true);
            }}>
              {error && <p className="text-red-500 ">{error}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 gap-x-10 w-full">
              <div className="w-full">
                <label htmlFor="first-name" className="block text-sm font-medium text-[#240C03]">
                  First Name
                </label>
                <input
                  type="text"
                  id="first-name"
                  name="firstName"
                  defaultValue={customerDetails?.first_name || ''}
                  className="w-full px-4 py-2 mt-1 border border-gray-400 rounded-md focus:outline-none"
                />
              </div>
              <div className="w-full">
                <label htmlFor="last-name" className="block text-sm font-medium text-[#240C03]">
                  Last Name
                </label>
                <input
                  type="text"
                  id="last-name"
                  name="lastName"
                  defaultValue={customerDetails?.last_name || ''}
                  className="w-full px-4 py-2 mt-1 border border-gray-400 rounded-md focus:outline-none"
                />
              </div>
              <div className="w-full">
                <label htmlFor="email" className="block text-sm font-medium text-[#240C03]">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder={customerDetails?.email || ''}
                  readOnly
                  className="w-full px-4 py-2 mt-1 border border-gray-400 rounded-md focus:outline-none"
                />
              </div>
              <div className="w-full">
                <label htmlFor="mobile-number" className="block text-sm font-medium text-[#240C03]">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  id="mobile-number"
                  name="mobileNumber"
                  defaultValue={customerDetails?.mobile_num || ''}
                  className="w-full px-4 py-2 mt-1 border border-gray-400 rounded-md focus:outline-none"
                />
              </div>
              <div className="w-full">
                <label htmlFor="street-address" className="block text-sm font-medium text-[#240C03]">
                  Street Address
                </label>
                <input
                  type="text"
                  id="street-address"
                  name="streetAddress"
                  defaultValue={customerDetails?.street_address || ''}
                  className="w-full px-4 py-2 mt-1 border border-gray-400 rounded-md focus:outline-none"
                />
              </div>
              <div className="w-full">
                <label htmlFor="city" className="block text-sm font-medium text-[#240C03]">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  defaultValue={customerDetails?.city || ''}
                  className="w-full px-4 py-2 mt-1 border border-gray-400 rounded-md focus:outline-none"
                />
              </div>
              <div className="w-full">
                <label htmlFor="barangay" className="block text-sm font-medium text-[#240C03]">
                  Barangay
                </label>
                <input
                  type="text"
                  id="barangay"
                  name="barangay"
                  defaultValue={customerDetails?.barangay || ''}
                  className="w-full px-4 py-2 mt-1 border border-gray-400 rounded-md focus:outline-none"
                />
              </div>
              <div className="w-full">
                <label htmlFor="zip-code" className="block text-sm font-medium text-[#240C03]">
                  Zip Code
                </label>
                <input
                  type="text"
                  id="zip-code"
                  name="zipCode"
                  defaultValue={customerDetails?.zipcode || ''}
                  className="w-full px-4 py-2 mt-1 border border-gray-400 rounded-md focus:outline-none"
                />
              </div>
              <div className="flex items-center mt-3">
  <input
    type="checkbox"
    id="editPassword"
    checked={showEditPassword}
    onChange={() => setEditPassword(!showEditPassword)}
    className="mr-2 accent-[#E19517] scale-120"
  />
  <label htmlFor="editPassword" className="text-sm text-[#240C03]">
    Edit Password
  </label>
</div>

{showEditPassword && (
  <>
    <div className=""></div>
    <div className="w-full relative">
      <label
        htmlFor="password"
        className="block text-sm font-medium text-[#240C03]"
      >
       Old Password
      </label>
      <input
        type={showOldPassword ? "text" : "password"}
        id="oldPassword"
        name="oldPassword"
        className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#E19517]"
      />
      <span
        onClick={() => setOldPassword(!showOldPassword)}
        className="absolute right-3 top-9 cursor-pointer text-[#E19517]"
      >
        {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </span>
    </div>
    <div className="w-full relative">
      <label
        htmlFor="password"
        className="block text-sm font-medium text-[#240C03]"
      >
        New Password
      </label>
      <input
        type={showPassword ? "text" : "password"}
        id="newPassword"
        name="newPassword"
        className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#E19517]"
      />
      <span
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-9 cursor-pointer text-[#E19517]"
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </span>
    </div>

    <div className="w-full relative">
      <label
        htmlFor="repassword"
        className="block text-sm font-medium text-[#240C03]"
      >
        Confirm New Password
      </label>
      <input
        type={showRePassword ? "text" : "password"}
        id="rePassword"
        name="rePassword"
        className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#E19517]"
      />
      <span
        onClick={() => setReShowPassword(!showRePassword)}
        className="absolute right-3 top-9 cursor-pointer text-[#E19517]"
      >
        {showRePassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </span>
    </div>
  </>
    )}

            </div>
            <div className="flex justify-between items-center pt-6">
              <a onClick={() => setShowDeleteConfirmationModal(true)} className="font-light text-sm text-gray-400 underline cursor-pointer">
                Delete Account
              </a>
              <div className="flex gap-x-2">
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
            </div>
          </form>
        </div>
      </div>
      {showConfirmationModal && (
        <ConfirmationModal
          onClose={() => setShowConfirmationModal(false)}
          onConfirm={handleEditAccount}
          buttonText="Update"
          title="Confirm Changes"
          description="Are you sure you want to update your account?"
        />
      )}
      {showDeleteConfirmationModal && (
  <ConfirmationModal
    onClose={() => setShowDeleteConfirmationModal(false)}
    onConfirm={handleDeleteAccount}
    buttonText="Delete"
    title="Delete Account"
    description= "Are you sure you want to permanently delete your account?"
  />
)}
    </div>
  );
};

export default EditAccountModal;

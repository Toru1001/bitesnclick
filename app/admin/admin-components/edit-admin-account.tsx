import ConfirmationModal from "@/app/components/modal/confirmation_modal";
import { supabase } from "@/app/lib/supabase";
import { Eye, EyeOff, X } from "lucide-react";
import router, { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import bcrypt from 'bcryptjs';

interface EditAdminAccountModalProps {
  onClose: () => void;
}

const EditAdminAccountModal: React.FC<EditAdminAccountModalProps> = ({
  onClose,
}) => {
  const [adminDetails, setAdminDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setReShowPassword] = useState(false);
  const [showEditPassword, setEditPassword] = useState(false);
  const [showOldPassword, setOldPassword] = useState(false);
  const router = useRouter();
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

    useEffect(() => {
      setLoading(true);
      const fetchAdminDetails = async () => {

        
          const { data, error } = await supabase
            .from('admin')
            .select('*')
            .single();

          if (error) {
            setError(error.message);
          } else {
            setAdminDetails(data);
          }
        setLoading(false);
      };

      fetchAdminDetails();
    }, []);

    const handleEditAccount = async () => {
      if (!formRef.current) return;
      const form = formRef.current;
      const name = form.name.valueOf;
      const username = form.username.value.trim();
      const oldPassword = form.oldPassword?.value;
      const newPassword = form.newPassword?.value;
      const confirmPassword = form.rePassword?.value;
    
      Array.from(form.elements).forEach((el) => {
        if (el instanceof HTMLInputElement) {
          el.classList.remove('border-red-500');
        }
      });
    
      const requiredFields = [
        { name: 'name', value: name },
        { name: 'username', value: username },
      ];
      let hasError = false;
      requiredFields.forEach(({ name, value }) => {
        const input = form[name];
        if (!value) {
          input.classList.add('border-red-500');
          hasError = true;
        }
      });
      if (hasError) {
        setError('Please fill in all required fields.');
        alert('Please fill in all required fields.');
        return;
      }
    
      if (showEditPassword) {
        if (!oldPassword || !newPassword || !confirmPassword) {
          if (!oldPassword) form.oldPassword.classList.add('border-red-500');
          if (!newPassword) form.newPassword.classList.add('border-red-500');
          if (!confirmPassword) form.rePassword.classList.add('border-red-500');
          setError('Please fill in all password fields.');
          alert('Please fill in all password fields.');
          return;
        }
        if (newPassword !== confirmPassword) {
          form.newPassword.classList.add('border-red-500');
          form.rePassword.classList.add('border-red-500');
          setError('New password and confirmation do not match.');
          alert('New password and confirmation do not match.');
          return;
        }
        if (newPassword.length < 6) {
          form.newPassword.classList.add('border-red-500');
          setError('Password must be at least 6 characters.');
          alert('Password must be at least 6 characters.');
          return;
        }
    
        // Compare old password
        const passwordMatch = await bcrypt.compare(oldPassword, adminDetails?.password);
        if (!passwordMatch) {
          setError('Old password is incorrect.');
          alert('Old password is incorrect.');
          form.oldPassword.classList.add('border-red-500');
          return;
        }
    
        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 12);
    
        try {
          const { error: updateError } = await supabase
            .from('admin')
            .update({
              name: name,
              username: username,
              password: hashedPassword,
            })
            .eq('username', adminDetails?.username);
    
          if (updateError) throw new Error(updateError.message);
    
          console.log('Account updated successfully.');
          window.location.reload();
          onClose();
        } catch (err: any) {
          console.error('Error updating account:', err.message);
          setError(err.message);
          alert(err.message);
        }
      } else {
        try {
          const { error: updateError } = await supabase
            .from('admin')
            .update({
              name: name,
              username: username,
            })
            .eq('username', adminDetails?.username);
    
          if (updateError) throw new Error(updateError.message);
    
          console.log('Account updated successfully.');
          window.location.reload();
          onClose();
        } catch (err: any) {
          console.error('Error updating account:', err.message);
          setError(err.message);
          alert(err.message);
        }
      }
    };
    

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-30"
      onClick={handleOverlayClick}
    >
      <div
        className="relative flex flex-col bg-white rounded-lg shadow-lg w-full md:w-fit my-10 p-10 overflow-scroll [&::-webkit-scrollbar]:hidden scrollbar-thin scrollbar-none"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute flex cursor-pointer items-center justify-center top-5 right-5 w-10 h-10"
          onClick={onClose}
        >
          <X className="text-[#240C03] font-bold" />
        </button>
        <div className="flex w-full justify-center border-b-3 pb-2 border-[#E19517]">
          <span className="font-semibold text-xl">Edit Profile</span>
        </div>

        {loading && (
          <div className="inset-0 z-40 bg-white/60 w-138 h-100 flex items-center justify-center rounded-lg">
            <ClipLoader color="#E19517" size={50} />
          </div>
        )}

        {!loading && (
          <div className="mx-5">
            <form
              ref={formRef}
              className="space-y-2 mt-5 w-full"
              onSubmit={(e) => {
                e.preventDefault();
                setShowConfirmationModal(true);
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 gap-x-10 w-full">
                <div className="w-full">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-[#240C03]"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    defaultValue={adminDetails?.name || ""}
                    className="w-full px-4 py-2 mt-1 border border-gray-400 rounded-md focus:outline-none"
                  />
                </div>
                <div className="w-full">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-[#240C03]"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    defaultValue={adminDetails?.username || ""}
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
                  <label
                    htmlFor="editPassword"
                    className="text-sm text-[#240C03]"
                  >
                    Change Password
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
                        className="w-full px-4 py-2 mt-1 border rounded-md border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E19517]"
                      />
                      <span
                        onClick={() => setOldPassword(!showOldPassword)}
                        className="absolute right-3 top-9 cursor-pointer text-[#E19517]"
                      >
                        {showOldPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
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
                        className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none border-gray-400 focus:ring-2 focus:ring-[#E19517]"
                      />
                      <span
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-9 cursor-pointer text-[#E19517]"
                      >
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
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
                        className="w-full px-4 py-2 mt-1 border rounded-md border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E19517]"
                      />
                      <span
                        onClick={() => setReShowPassword(!showRePassword)}
                        className="absolute right-3 top-9 cursor-pointer text-[#E19517]"
                      >
                        {showRePassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </span>
                    </div>
                  </>
                )}
              </div>
              <div className="flex justify-end w-full items-center pt-6">
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
        )}
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
    </div>
  );
};

export default EditAdminAccountModal;

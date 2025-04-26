import { toast } from 'react-hot-toast';

export const showConfirmToast = (onConfirm) => {
  toast.custom((t) => (
    <div className="bg-white shadow-md rounded-lg p-4 w-72 text-sm flex flex-col gap-3">
      <span>Are you sure you want to proceed?</span>
      <div className="flex justify-end gap-2">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="text-gray-600 px-3 rounded py-1 bg-slate-200 cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            onConfirm();
            toast.dismiss(t.id);
          }}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 cursor-pointer"
        >
          Confirm
        </button>
      </div>
    </div>
  ));
};

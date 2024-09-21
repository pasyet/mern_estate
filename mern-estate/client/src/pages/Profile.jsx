import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from '../firebase';
import { 
    updateUserFailure, 
    updateUserStart, 
    updateUserSuccess, 
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
    signOutUserStart,
    signOutUserSuccess
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";


export default function Profile() {
    const fileRef = useRef(null);
    const { currentUser, loading, error } = useSelector((state) => state.user);
    const [file, setFile] = useState(undefined);
    const [filePerc, setFilePerc] = useState(0);
    const [fileUploadError, setFileUploadError] = useState(false);
    const [formData, setFormData] = useState({});
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const dispatch = useDispatch();
    console.log(formData);
    // console.log(filePerc);
    // console.log(fileUploadError);

    // firebasae storage 
    // allow read;
    // allow write: if
    // request.resource.size < 2 * 1024 * 1024 &&
    // request.resource.contentType.matches('image/.*')

    useEffect(() => {
        if (file) {
            handleFileUpload(file);
        }
    }, [file]);

    const handleFileUpload = (file) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        // Attach observer for the upload process
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                // Progress of the upload
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setFilePerc(Math.round(progress));
            },
            (error) => {
                // Handle unsuccessful uploads
                console.error("Upload failed:", error);
                setFileUploadError(true);
            },
            () => {
                // Handle successful uploads on complete
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    // Update the form data with the download URL of the uploaded file
                    setFormData({ ...formData, avatar: downloadURL });
                });
            }
        );
    };
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            dispatch(updateUserStart());
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success === false) {
                dispatch(updateUserFailure(data.message));
                return;
            }

            dispatch(updateUserSuccess(data));
            setUpdateSuccess(true);
        } catch (error) {
            dispatch(updateUserFailure(error.message));
        }
    };

const handleDeleteUser = async () => {
    try {
        dispatch(deleteUserStart());
        const res = await fetch(`/api/user/delete/${currentUser._id}`, {
            method: 'DELETE',
        });
        const data = await res.json();
        if (data.success === false) {
            dispatch(deleteUserFailure());
            return;
        }
        dispatch(deleteUserSuccess(data));
    } catch (error) {
        dispatch(deleteUserFailure(error.message));
    }
};

const handleSignOut = async () => {
    try {
        dispatch(signOutUserStart());
        const res = await fetch ('/api/auth/signout');
        const data = await res.json();
        if (data.success === false) {
            dispatch(deleteUserFailure(data.message));
            return;
        }
        dispatch(signOutUserSuccess(data));
    } catch (error) {
        dispatch(deleteUserFailure(error.message));
    }
}


    return (
        <div className='p-3 max-w-lg mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <input
                    onChange={(e) => setFile(e.target.files[0])}
                    type='file'
                    ref={fileRef}
                    hidden
                    accept='image/*' />
                <img onClick={() => fileRef.current.click()}
                    src={formData.avatar || currentUser.avatar}
                    alt='profile'
                    className='rounded-full h-24 w-24 object-cover 
                cursor-pointer self-center mt-2' />
                <p className='text-sm self-center'>
                    {fileUploadError ? (
                        <span className='text-red-700'>
                            Error Image upload (image must be less than 2 mb)
                        </span>
                    ) : filePerc > 0 && filePerc < 100 ? (
                        <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
                    ) : filePerc === 100 ? (
                        <span className='text-green-700'>Image successfully uploaded!</span>
                    ) : (
                        ''
                    )}
                </p>
                <input type='text'
                    placeholder='username'
                    defaultValue={currentUser.username}
                    id="username"
                    className='border p-3 rounded-lg'
                    onChange={handleChange} />
                <input type='email'
                    placeholder='email'
                    defaultValue={currentUser.email}
                    id="email"
                    className='border p-3 rounded-lg'
                    onChange={handleChange} />
                <input type='password'
                    placeholder='password'
                    defaultValue={currentUser.password}
                    id="password"
                    className='border p-3 rounded-lg'
                    onChange={handleChange} />
                <button
                    disabled={loading}
                    className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>
                    {loading ? 'Loading...' : 'Update'}
                </button>
            </form>
            <div className='flex justify-between mt-5'>
                <span onClick= {handleDeleteUser} className='text-red-700 cursor-pointer'>
                    Delete account
                </span>
                <span onClick= {handleSignOut} className='text-red-700 cursor-pointer'>
                    Sign out
                </span>
            </div>
            <p className='text-red-700 mt-5'>{error ? error : ''}</p>
            <p className='text-green-700 mt-5'>
                {updateSuccess ? 'User is updated successfully!' : ''}
            </p>
        </div>
    )
}

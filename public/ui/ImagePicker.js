import { useRef, useState } from 'react';

const ImagePicker = ({ onFile }) => {
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewURL, setPreviewURL] = useState(null);

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            const previewURL = reader.result;
            setPreviewURL(previewURL);
            onFile({ file, previewURL }); // Callback to parent component
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    return (
        <div>
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
            <button onClick={handleButtonClick} className='w-11/12 flex justify-end' style={{ position: 'relative', top: -30 }}>
                <img src='/assets/camera.png' alt='cam' style={{ height: '24px', width: '24px', resize: 'cover' }} />
            </button>
            {/*selectedFile ? (
                <div className='w-full flex mt-3 items-center justify-center'>
                    <button onClick={handleButtonClick}>
                        <img src={previewURL} alt="Preview" style={{ height: '131px', width: '131px', resize: 'cover', borderRadius: '50%' }} />
                        <div className='w-11/12 flex justify-end' style={{ position: 'relative', top: -30 }}>
                            <img src='/assets/camera.png' alt='cam' style={{ height: '24px', width: '24px', resize: 'cover' }} />
                        </div>
                    </button>
                </div>
            ) : (
                <div className='w-full flex mt-3 items-center justify-center'>
                    <button onClick={handleButtonClick}>
                        <img src='/assets/profile1.png' alt='profile' style={{ height: '131px', width: '131px', resize: 'cover' }} />
                        <div className='w-11/12 flex justify-end' style={{ position: 'relative', top: -30 }}>
                            <img src='/assets/camera.png' alt='cam' style={{ height: '24px', width: '24px', resize: 'cover' }} />
                        </div>
                    </button>
                </div>
            )*/}
        </div>
    );
};

export default ImagePicker;

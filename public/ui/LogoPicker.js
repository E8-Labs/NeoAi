// components/LogoPicker.js

import { Button } from '@mui/material';
import { useRef, useState } from 'react';

const LogoPicker = ({ onFileSelect }) => {
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewURL, setPreviewURL] = useState(null);
    // console.log('Image for logo is :', previewURL);

    const handleLogoClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewURL(reader.result);
            const previewURL = reader.result;
            onFileSelect({ file, previewURL }); // Callback to parent component
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
            <Button onClick={handleLogoClick} style={{ color: 'grey', fontWeight: '400', fontSize: 12, fontFamily: 'inter', marginTop: 15 }}>
                <u>
                    Change App Logo
                </u>
            </Button>
            {/*selectedFile ? (
                <div className='w-full flex mt-3 items-center justify-center'>
                    <div>
                        <img src={previewURL} alt="Preview" style={{ height: '124px', width: '129px', borderRadius: 5, resize: 'cover', objectFit: 'cover' }} />
                        <Button onClick={handleLogoClick} style={{ color: '#2548FD', fontWeight: '400', fontSize: 12, fontFamily: 'inter', marginTop: 15 }}>
                            <u>
                                Change App Logo
                            </u>
                        </Button>
                    </div>
                </div>
            ) :
                <div className='w-full flex mt-3 items-center justify-center'>
                    <div>
                        <img src='/assets/appLogo.png' alt='profile' style={{ height: '124px', width: '129px', borderRadius: 5, resize: 'cover' }} />
                        <Button onClick={handleLogoClick} style={{ color: '#2548FD', fontWeight: '400', fontSize: 12, fontFamily: 'inter', marginTop: 15 }}>
                            <u>
                                Change App Logo
                            </u>
                        </Button>
                    </div>
                </div>
        */}
        </div>
    );
};

export default LogoPicker;

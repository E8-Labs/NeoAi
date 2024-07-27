import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js'
import { CardCvcElement, CardExpiryElement, CardNumberElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js'
import { Alert, Button, CircularProgress, Slide, Snackbar } from '@mui/material'
import { toast } from 'react-toastify'
import axios from 'axios'

const AddCardDetails = ({ handleClose }) => {

    const handleClose4 = (e) => {
        e.preventDefault();
        handleClose();
    }

    const [addCardLoader, setAddCardLoader] = useState(false);
    const [addNumberErr, setAddNumberErr] = useState(false);
    const [addDateErr, setAddDateErr] = useState(false);
    const [cvcErr, setCvcErr] = useState(false);
    const [credentialsErr, setCredentialsErr] = useState(false);

    const elementOptions = {
        style: {
            base: {
                backgroundColor: '#f0f0f010',
                color: '#ffffff',
                fontSize: '18px',
                lineHeight: '40px',
                '::placeholder': {
                    color: 'gray',
                },
            },
            invalid: {
                color: 'red',
            },
        },
    };

    //code for adding card api

    const stripeReact = useStripe();
    const elements = useElements();

    const handleAddCard = async (e) => {
        // Check if the event object is provided and prevent the default behavior
        if (e && e.preventDefault) {
            e.preventDefault();
        }
    
        // Close the modal
        // handleClose4(e);
        // return
        if (!stripeReact || !elements) {
            return
        }

        const cardNumberElement = elements.getElement(CardNumberElement);

        stripeReact.createToken(cardNumberElement).then(async function (tok) {
            if (tok.error) {
                setCredentialsErr(true);
                toast.error(tok.error.code, {
                    position: "bottom-right",
                    pauseOnHover: true,
                    autoClose: 8000,
                    theme: "dark"
                });
            } else if (tok.token.id) {
                setAddCardLoader(true);
                console.log("Token generating for card number :", tok.token.id)
                const tokenId = tok.token.id;
                let api = process.env.NEXT_PUBLIC_REACT_APP_ENVIRONMENT === "Development2" ? "https://bf59-119-156-82-235.ngrok-free.app" : "https://plurawlapp.com/plurawl";
                const ApiPath = "http://localhost:8005/api/user/add_card";
                const AddCardData = {
                    source: tokenId
                }
                try {
                    const LocalData = localStorage.getItem('User');
                    const D = JSON.parse(LocalData);
                    const AuthToken = D.data.token;
                    console.log('Data sending in api is :', AddCardData);
                    const response = await axios.post(ApiPath, AddCardData, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + AuthToken
                        }
                    });
                    if (response) {
                        console.log("Response of add card api is", response);
                    }
                    if (response.status === 200) {
                        handleClose4(e);
                    }
                } catch (error) {
                    console.error("Error occured in adding user card api is :", error);
                } finally {
                    setAddCardLoader(false);
                }
            }
        })

    }

    return (
        <div style={{ width: '100%' }}>
            <div>
                <CardNumberElement
                    options={elementOptions}
                    style={{
                        width: '100%', padding: '8px', backgroundColor: 'black',
                        color: 'white', fontSize: '22px', border: '1px solid blue', borderRadius: '4px'
                    }} />
            </div>
            <div className='flex flex-row gap-3 w-full'>
                <div className='mt-2 w-6/12'>
                    <CardExpiryElement
                        options={elementOptions}
                        style={{
                            width: '100%', padding: '8px',
                            color: 'white', fontSize: '22px', border: '1px solid blue', borderRadius: '4px'
                        }} />
                </div>
                <div className='mt-2 w-6/12'>
                    <CardCvcElement
                        options={elementOptions}
                        style={{
                            width: '100%', padding: '8px',
                            color: 'white', fontSize: '22px', border: '1px solid blue', borderRadius: '4px'
                        }} />
                </div>
            </div>
            <div className='w-full mt-6 flex justify-center'>
                {
                    addCardLoader ?
                        <div>
                            <CircularProgress size={30} />
                        </div> :
                        <Button
                            onClick={handleAddCard}
                            className='w-full py-3'
                            style={{
                                backgroundColor: '#2548FD', color: 'white'
                            }}>
                            Add Card
                        </Button>
                }
            </div>
            <div>
                <Snackbar
                    open={credentialsErr}
                    autoHideDuration={3000}
                    onClose={() => {
                        setCredentialsErr(false)
                    }}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right'
                    }}
                    TransitionComponent={Slide}
                    TransitionProps={{
                        direction: 'left'
                    }}
                >
                    <Alert
                        onClose={() => {
                            setCredentialsErr(false)
                        }} severity="error"
                        sx={{ width: 'auto', fontWeight: '700', fontFamily: 'inter', fontSize: '22' }}>
                        Enter all Credientials.
                    </Alert>
                </Snackbar>
            </div>
        </div>
    )
}

export default AddCardDetails
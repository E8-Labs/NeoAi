'use client'
import { useState } from 'react';
import {
    CardElement, useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement
} from '@stripe/react-stripe-js';
import Stripe from 'stripe';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';

//stripe code required
let stripePublickKey = process.env.NEXT_PUBLIC_REACT_APP_ENVIRONMENT === "Production" ? process.env.NEXT_PUBLIC_REACT_APP_STRIPE_PUBLISHABLE_KEY_LIVE : process.env.NEXT_PUBLIC_REACT_APP_STRIPE_PUBLISHABLE_KEY;

let stripeKey = process.env.REACT_APP_ENVIRONMENT === "Production" ? process.env.REACT_APP_STRIPE_SECRET_KEY_LIVE : process.env.REACT_APP_STRIPE_SECRET_KEY;
let envr = process.env.REACT_APP_ENVIRONMENT;

//useful code
function Addnewcard2({ props, close }) {

    const [Loading, setLoading] = useState(false)

    const elementOptions = {
        style: {
            base: {
                backgroundColor: '#f0f0f0',
                color: 'black',
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

    const stripeReact = useStripe();
    const elements = useElements();

    const [values, setValues] = useState({
        cardnumber: "",
        cardholdername: "",
        cvv: "",
        expirydate: "",
    });

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        if (!stripeReact || !elements) {
            return;
        }

        const cardNumberElement = elements.getElement(CardNumberElement);

        stripeReact.createToken(cardNumberElement).then(async function (tok) {
            console.log("Token ", tok)
            if (tok.error) {
                setLoading(false);
                toast.error(tok.error.message, {
                    position: "bottom-right",
                    pauseOnHover: true,
                    autoClose: 8000,
                    theme: "dark"
                });
            } else if (tok.token.id) {
                const d = localStorage.getItem("user");
                const user = JSON.parse(d);
                if (user === null) {
                    console.log('User is null');
                }

                let api = process.env.NEXT_PUBLIC_REACT_APP_ENVIRONMENT === "Development2" ? "https://bf59-119-156-82-235.ngrok-free.app" : "https://plurawlapp.com/plurawl";
                const apiUrl = api + '/api/users/add_card';
                const userDetails = localStorage.getItem('user');
                const i = JSON.parse(userDetails);
                let config = {
                    method: 'post',
                    url: apiUrl,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + i.token
                    },
                    data: JSON.stringify({ source: tok.token.id })
                };

                const data = await axios.request(config);
                console.log("Api response")
                console.log(data.data)
                if (data.data.status === true) {
                    setLoading(false);
                    const d = localStorage.getItem('user');
                    let user = JSON.parse(d);
                    user.user.payment_source_added = true;
                    localStorage.setItem('user', JSON.stringify(user));
                    // router.push('/home/cards');
                    close();
                    window.location.reload();
                } else {
                    setLoading(false);
                    toast.error(data.data.message, {
                        position: "bottom-right",
                        pauseOnHover: true,
                        autoClose: 8000,
                        theme: "dark"
                    });
                }
            }
        });
    };

    const handleChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    };

    const router = useRouter();
    const handleBackclick = () => {
        router.back('');
    };


    return (
        <div style={{ width: '100%', overflow: 'hidden', backgroundColor: '#00000000', display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: '1024px', backgroundColor: '#00000000', padding: 10 }}>
                {/*
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '30px' }}>
                    <div style={{ width: '16.66%', display: 'flex', alignItems: 'center' }}>
                        <button onClick={handleBackclick} style={{ display: 'flex', alignItems: 'center' }}>
                            <img src='/assets/backicon2.png' style={{ height: '25px', width: '30px' }} alt='backicon' />
                        </button>
                    </div>
                    <div style={{ width: '66.66%', display: 'flex', justifyContent: 'center', gap: '8px', fontSize: '24px' }}>
                        Add New Card
                    </div>
                    <div style={{ width: '16.66%' }}></div>
                </div>
            */}
                {/* <div className='font-semibold text-2xl' style={{ marginTop: '30px' }}>
                    Add card details
                </div> */}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
                    <div style={{ width: '100%', padding: '16px', backgroundColor: '#333', color: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ width: '100%' }}>
                                <div style={{ paddingBottom: 10 }}>
                                    Card No:
                                </div>
                                <CardNumberElement options={elementOptions} style={{ width: '100%', padding: '8px', backgroundColor: 'black', color: 'white', fontSize: '22px', border: '1px solid blue', borderRadius: '4px' }} />
                            </div>
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ paddingBottom: 10 }}>
                                        Expiry Date:
                                    </div>
                                    <CardExpiryElement options={elementOptions} style={{ width: '100%', padding: '8px', backgroundColor: 'black', color: 'white', fontSize: '22px', border: '1px solid blue', borderRadius: '4px' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ paddingBottom: 10 }}>
                                        CVC:
                                    </div>
                                    <CardCvcElement options={elementOptions} style={{ width: '100%', padding: '8px', backgroundColor: 'black', color: 'white', fontSize: '22px', border: '1px solid blue', borderRadius: '4px' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px', width: '100%' }}>
                        {Loading ? <CircularProgress color='inherit' sx={{ height: '30px' }} /> :
                            <button type='submit' style={{ width: '100%',  padding: '12px', backgroundColor: '#D44740', borderRadius: '8px', color: 'white', fontWeight: 'bold', fontSize: '20px' }}>Save Card</button>
                        }
                    </div>
                </form>
                <ToastContainer />
            </div>
        </div>
    );
}

export default Addnewcard2;
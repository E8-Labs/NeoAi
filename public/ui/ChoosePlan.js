import { Box, Button, CircularProgress, Modal, TextField } from '@mui/material'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import style from 'react-syntax-highlighter/dist/esm/styles/hljs/a11y-dark';
import Apis from '../Apis/Apis';
import AddCard from '../addcard/AddCard';

const ChoosePlan = () => {

    const [MonthlyPkgPlan, setMonthlyPkgPlan] = useState(null);
    const [YearlyPkgPlan, setYearlyPkgPlan] = useState(null);
    const [selCard, setSelCard] = useState(false)
    const [monthlyPlan, setMonthlyPlan] = useState(true);
    const [yearlyPlan, setYearlyPlan] = useState(false);
    const [addCard, setAddCard] = useState(false);
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [CVV, setCVV] = useState('');
    const [loader, setLoader] = useState(false);
    const [error, setError] = useState(false);
    const [monthlyPlanId, setMonthlyPlanId] = useState("");
    const [yearlyPlanId, setYearlyPlanId] = useState("");
    const [getCardsLoader, setGetCardsLoader] = useState(false);
    const [makePaymentLoader, setMakePaymentLoader] = useState(false);
    const [sendApiData, setsendApiData] = useState("");
    const [currentPlanCheck, setCurrentPlanCheck] = useState(false);
    const [yearlyPlanCheck, setYearlyPlanCheck] = useState(false);
    const [updatedResponse, setUpdatedResponse] = useState('');
    const [bankCards, setBankCards] = useState([]);

    const openAddCardModal = () => {
        setAddCard(true);
    }

    const handleClose = () => {
        setAddCard(false);
        getCards();
    };

    //code for get profile
    // const getProfile = async () => {
    //     const ApiPath = Apis.GetProfile;
    //     const L = localStorage.getItem('User');
    //     const U = JSON.parse(L);
    //     const AuthToken = U.data.token;
    //     // console.log('Auth token is', U);
    //     const response = await axios.get(ApiPath, {
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': 'Bearer ' + AuthToken
    //         }
    //     });
    //     if (response) {
    //         // console.log('Response of getprofile api is', response.data.data);
    //     }
    //     if (response.status === !null) {
    //         const Result = response.data.data;
    //         const Plan = Result.plan.subscriptionType;
    //         if (Plan === "monthly") {
    //             setCurrentPlanCheck(true);
    //         } else {
    //             setCurrentPlanCheck(false);
    //         }
    //     }
    // }

    // useEffect(() => {
    //     getProfile()
    // }, [])

    const radioInActive = '/assets/Radio.png';
    const radioActive = '/assets/activeRadio.png';

    const handlePlanSel = (itemId) => {
        setSelCard(itemId === selCard ? null : itemId);
    };

    const handleMonthlyPlanClick = (itemId) => {
        setMonthlyPkgPlan(itemId === MonthlyPkgPlan ? null : itemId);
        setMonthlyPlanId(itemId === MonthlyPkgPlan ? null : itemId);
    };

    const handleYearlyPlanClick = (itemId) => {
        setYearlyPkgPlan(itemId === YearlyPkgPlan ? null : itemId);
        setYearlyPlanId(itemId === YearlyPkgPlan ? null : itemId);
    };

    const monthlyPlanClick = () => {
        setYearlyPlan(false);
        setMonthlyPlan(true);
    }

    const yearlyPlanclick = () => {
        setMonthlyPlan(false);
        setYearlyPlan(true);
    }

    const paymentHistory = [
        {
            id: 1,
            inv: 'INV-1990',
            date: '21 May 2024',
            AED: 'AED 3200',
            pdf: 'PDF'
        },
        {
            id: 2,
            inv: 'INV-1990',
            date: '21 May 2024',
            AED: 'AED 3200',
            pdf: 'PDF'
        },
        {
            id: 3,
            inv: 'INV-1990',
            date: '21 May 2024',
            AED: 'AED 3200',
            pdf: 'PDF'
        },
        {
            id: 4,
            inv: 'INV-1990',
            date: '21 May 2024',
            AED: 'AED 3200',
            pdf: 'PDF'
        }
    ]

    //cards array

    const [monthlyPlans, setMonthlyPlans] = useState([
        {
            id: 1,
            title: 'Task Runner',
            description: 'Lorem ipsum dolor sit amet consectetur. Et interdum duis lectus',
            amount: '19.99'
        },
    ])

    const [yearlyPlans, setYearlyPlans] = useState([
        {
            id: 2,
            title: 'Task Runner for year',
            description: 'Lorem ipsum dolor sit amet consectetur. Et interdum duis lectus',
            amount: '179.99'
        },
    ])


    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 350,
        // height: 400,
        bgcolor: 'background.paper',
        // border: '2px solid #000',
        boxShadow: 24,
        p: 3,
        borderRadius: 2,
        backgroundColor: '#0F0C2D',
        color: '#ffffff'
    };


    //code for getting card api call

    const getCards = async () => {
        const ApiPath = Apis.GetCards;
        // const ApiPath = "http://localhost:8005/api/user/list_cards";
        const LocalData = localStorage.getItem('User');
        const D = JSON.parse(LocalData);
        const AuthToken = D.data.token;
        // console.log("Authtoken for get cards is :", AuthToken);
        try {
            setGetCardsLoader(true)
            const response = await axios.get(ApiPath, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + AuthToken
                }
            });
            if (response) {
                console.log("Response for gat cards api is :", response.data);
            }
            if (response.status === 200) {
                const data = response.data;
                if (data === null) {
                    console.log('Cards response is null');
                } else {
                    setBankCards(response.data.data);
                }
            }
        } catch (error) {
            console.log("Error occured in api is", error);
        } finally {
            setGetCardsLoader(false);
        }
    }

    useEffect(() => {
        getCards();
    }, []);

    //subscription api call
    const handleMakePayment = async () => {
        setMakePaymentLoader(true);
        let valueToSend = null;

        if (yearlyPlanId) {
            valueToSend = yearlyPlanId;
        } else if (monthlyPlanId) {
            valueToSend = monthlyPlanId;
        }
        // return
        try {
            const ApiPath = Apis.SubscribePlan;

            // return
            const LD = localStorage.getItem('User');
            const LocalData = JSON.parse(LD);
            console.log('Testdataresieved', LocalData);
            const AuthToken = LocalData.data.token;
            // return
            const response = await axios.post(ApiPath, { sub_type: valueToSend }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + AuthToken
                }
            });
            if (response) {
                console.log("Response of subscription api is :", response);
            }
            if (response.status === 200) {
                // console.log('dta test', response.data);
                const newUser = response.data.data;
                console.log('changing data', newUser);
                if (LocalData) {
                    LocalData.data.user = newUser;
                    // console.log('Testing', LocalData.data.data);
                    localStorage.setItem('User', JSON.stringify(LocalData));
                }
                setMakePaymentLoader(false);
                // getProfile();
            }
        } catch (error) {
            console.error("Error occured in api is :", error);
        } finally {
            const LocalDataUpdated = localStorage.getItem('User');
            const result = await JSON.parse(LocalDataUpdated);
            setUpdatedResponse(result);
        }
    }

    useEffect(() => {
        const S = localStorage.getItem('User');
        // setCurrentPlanCheck(true)
        const response = JSON.parse(S);
        if (response) {
            console.log('response of local is', response);
            if (response.data.user.plan === null) {
                console.log('plan is null');
            } else {
                if (response.data.user.plan.subscriptionType === "monthly") {
                    console.log('Test 1 clear');
                    setYearlyPlanCheck(false);
                    setCurrentPlanCheck(true);
                } else {
                    setCurrentPlanCheck(false);
                    setYearlyPlanCheck(true);
                }
            }
        }
    }, [updatedResponse])

    return (
        <div className='w-full flex flex-col items-center'>
            <div className='w-11/12 flex flex-row gap-12 mt-8'>
                <div className='w-6/12'>
                    <div className='flex flex-row justify-between w-full'>
                        <div style={{ fontSize: 20, fontWeight: '500', fontFamily: 'inter' }}>
                            Choose Plan
                        </div>
                        <div className='flex flex-row gap-2'>
                            <Button
                                onClick={monthlyPlanClick}
                                className='px-4 py-3'
                                style={{
                                    color: '#ffffff', fontWeight: '400', fontSize: 13, fontFamily: 'inter',
                                    backgroundColor: monthlyPlan ? '#2548FD' : '#ffffff10'
                                }}>
                                Monthly
                            </Button>
                            <Button
                                onClick={yearlyPlanclick}
                                className='px-4 py-3'
                                style={{
                                    color: '#ffffff', fontWeight: '400', fontSize: 13, fontFamily: 'inter',
                                    backgroundColor: yearlyPlan ? '#2548FD' : '#ffffff10'
                                }}>
                                Yearly
                            </Button>
                        </div>
                    </div>

                    <div className='w-full'>
                        {
                            yearlyPlan &&
                            <div className='w-full mt-4' style={{ overflow: 'auto', height: '53vh', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                                {
                                    yearlyPlans.map((item) => (
                                        <div key={item.id} className='w-full flex flex-row mt-4 mb-6 justify-between' style={{ backgroundColor: '#ffffff15', padding: '20px' }}>
                                            <div className='flex flex-row gap-2'>
                                                <div>
                                                    {
                                                        monthlyPlanId ?
                                                            <button disabled>
                                                                <img src={YearlyPkgPlan === item.id ? radioActive : radioInActive} alt='radio' style={{ height: '26px', width: '26px', resize: 'cover', objectFit: 'contain' }} />
                                                            </button> :
                                                            <button onClick={() => handleYearlyPlanClick(item.id)}>
                                                                <img src={YearlyPkgPlan === item.id ? radioActive : radioInActive} alt='radio' style={{ height: '26px', width: '26px', resize: 'cover', objectFit: 'contain' }} />
                                                            </button>
                                                    }
                                                </div>
                                                <div style={{ width: '80%' }}>
                                                    <div style={{ fontSize: 15, fontWeight: '400', fontFamily: 'inter' }}>
                                                        {item.title}
                                                    </div>
                                                    <div className='w-9/12 mt-2'
                                                        style={{ fontSize: 13, fontWeight: '400', fontFamily: 'inter', color: '#ffffff' }}
                                                    >
                                                        {item.description}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='flex flex-col items-end'>
                                                <div style={{ fontWeight: '600', fontSize: 24, fontFamily: 'inter', textAlign: 'end' }}>
                                                    ${item.amount}
                                                </div>
                                                {
                                                    yearlyPlanCheck &&
                                                    <div className='flex items-center justify-center mt-3'
                                                        style={{
                                                            height: '35px', width: '96px', borderRadius: 1,
                                                            backgroundColor: '#00EE7C10', color: '#00EE7C', fontWeight: '500', fontFamily: 'inter', fontSize: 12
                                                        }}>
                                                        Current Plan
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        }
                    </div>

                    <div className='w-full'>
                        {
                            monthlyPlan &&
                            <div className='w-full mt-8' style={{ overflow: 'auto', height: '53vh', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                                <div className="hide-scrollbar">
                                    {
                                        monthlyPlans.map((item) => (
                                            <div key={item.id} className='w-full flex flex-row justify-between mt-4' style={{ backgroundColor: '#ffffff15', padding: '20px' }}>
                                                <div className='flex flex-row gap-2'>
                                                    <div>
                                                        {
                                                            yearlyPlanId ?
                                                                <button disabled>
                                                                    <img src={MonthlyPkgPlan === item.id ? radioActive : radioInActive} alt='radio' style={{ height: '26px', width: '26px', resize: 'cover', objectFit: 'contain' }} />
                                                                </button> :
                                                                <button onClick={() => handleMonthlyPlanClick(item.id)}>
                                                                    <img src={MonthlyPkgPlan === item.id ? radioActive : radioInActive} alt='radio' style={{ height: '26px', width: '26px', resize: 'cover', objectFit: 'contain' }} />
                                                                </button>
                                                        }
                                                    </div>
                                                    <div style={{ width: '80%' }}>
                                                        <div style={{ fontSize: 15, fontWeight: '400', fontFamily: 'inter' }}>
                                                            {item.title}
                                                        </div>
                                                        <div className='w-9/12 mt-2'
                                                            style={{ fontSize: 13, fontWeight: '400', fontFamily: 'inter', color: '#ffffff' }}>
                                                            {item.description}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='flex flex-col items-end'>
                                                    <div style={{ fontWeight: '600', fontSize: 24, fontFamily: 'inter', textAlign: 'end' }}>
                                                        ${item.amount}
                                                    </div>
                                                    {
                                                        currentPlanCheck &&
                                                        <div className='flex items-center justify-center mt-3'
                                                            style={{
                                                                height: '35px', width: '96px', borderRadius: 1,
                                                                backgroundColor: '#00EE7C10', color: '#00EE7C', fontWeight: '500', fontFamily: 'inter', fontSize: 12
                                                            }}>
                                                            Current Plan
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        }
                    </div>

                </div>
                <div className='w-6/12 flex flex-col'>
                    <div className='flex w-10/12 flex-row justify-between'>
                        <div style={{ fontWeight: '500', fontFamily: 'inter', fontSize: 20 }}>
                            Make Payment
                        </div>
                        <button onClick={openAddCardModal} style={{ fontWeight: '500', fontSize: 15, color: '#2548FD' }}>
                            <u>
                                Add Card
                            </u>
                        </button>
                    </div>
                    <div>
                        {
                            getCardsLoader ?
                                <div className='w-full mt-12 flex justify-center'>
                                    <CircularProgress />
                                </div> :
                                <div>
                                    {
                                        bankCards.length === 0 ?
                                            <div className='w-full mt-12 py-3 rounded flex items-center justify-center'>
                                                No payment source
                                            </div> :
                                            <div className='w-full mt-12 pb-4' style={{ overflow: 'auto', maxHeight: '42vh', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                                                {
                                                    bankCards.map((item) => (
                                                        <div key={item.id} className='w-10/12 flex flex-row justify-between mt-4' style={{ backgroundColor: '#ffffff15', padding: '20px' }}>
                                                            <div className='flex flex-row gap-2'>
                                                                <div>
                                                                    <button onClick={() => handlePlanSel(item.id)}>
                                                                        <img src={selCard == item.id ? radioActive : radioInActive} alt='radio' style={{ height: '26px', width: '26px', resize: 'cover', objectFit: 'contain' }} />
                                                                    </button>
                                                                </div>
                                                                <div>
                                                                    <div style={{ fontSize: 15, fontWeight: '400', fontFamily: 'inter' }}>
                                                                        ****2323
                                                                    </div>
                                                                    <div className='mt-2'
                                                                        style={{ fontSize: 13, fontWeight: '400', fontFamily: 'inter', color: '#ffffff60' }}
                                                                    >
                                                                        {item.brand} <button><u>Edit</u></button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <img src='/assets/cardIcon.png' alt='roudicon' style={{ height: '26px', width: '26px', resize: 'cover', objectFit: 'contain' }} />
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                    }
                                </div>
                        }
                    </div>
                    {
                        bankCards.length === 0 ?
                            "" :
                            <div>
                                <div className='w-full'>
                                    {
                                        selCard ?

                                            <div>
                                                {
                                                    makePaymentLoader ?
                                                        <div className='w-10/12 flex items-center justify-center mt-6'>
                                                            <CircularProgress size={30} />
                                                        </div> :
                                                        <Button onClick={handleMakePayment} className='w-10/12 flex items-center justify-center mt-6'
                                                            style={{
                                                                height: '56px', backgroundColor: '#2548FD', color: 'white',
                                                                fontSize: 15, fontWeight: '500', fontFamily: 'inter'
                                                            }}>
                                                            Make Payment
                                                        </Button>
                                                }
                                            </div>

                                            :
                                            <Button variant='disabled' className='w-10/12 flex items-center justify-center mt-6'
                                                style={{
                                                    height: '56px', backgroundColor: '#2548FD50', color: 'white',
                                                    fontSize: 15, fontWeight: '500', fontFamily: 'inter'
                                                }}>
                                                Make Payment
                                            </Button>
                                    }
                                </div>
                            </div>
                    }
                </div>
            </div>
            <div className='text-white w-full'>
                <div className='w-full' style={{ height: '1px', backgroundColor: '#ffffff60', marginTop: 100 }}></div>
            </div>
            <div className='w-11/12 flex flex-col mt-8'>
                <div style={{ fontWeight: '500', fontSize: 20, fontFamily: 'inter' }}>
                    Payment History
                </div>
                {
                    paymentHistory.map((item) => (
                        <div key={item.id} className='mt-4' style={{ width: '33%' }}>
                            <div className='flex flex-row justify-between'>
                                <div style={{ fontWeight: '500', fontSize: 13, fontFamily: 'inter' }}>
                                    {item.inv}
                                </div>
                                <div className='flex flex-row gap-12'
                                    style={{ fontWeight: '500', fontSize: 13, fontFamily: 'inter' }}>
                                    <div>
                                        {item.AED}
                                    </div>
                                    <button>
                                        <u style={{ color: '#2548FD' }}>
                                            {item.pdf}
                                        </u>
                                    </button>
                                </div>
                            </div>
                            <div style={{ fontWeight: '500', fontSize: 10, fontFamily: 'inter' }}>
                                {item.date}
                            </div>
                        </div>
                    ))
                }
            </div>
            {/*Modals*/}
            <Modal
                open={addCard}
                onClose={handleClose}
            >
                <Box sx={style}>

                    <div>
                        <AddCard onClose={handleClose} />
                    </div>
                </Box>
            </Modal>
        </div>
    )
}

export default ChoosePlan

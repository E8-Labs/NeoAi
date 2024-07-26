'use client'
import React from 'react';
import Addnewcard2 from '@/public/ui/addnewcard2';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from '@/public/ui/PaymentForm';

const Page = () => {
  let stripePublickKey = process.env.NEXT_PUBLIC_REACT_APP_ENVIRONMENT === "Production" ? process.env.NEXT_PUBLIC_REACT_APP_STRIPE_PUBLISHABLE_KEY_LIVE : process.env.NEXT_PUBLIC_REACT_APP_STRIPE_PUBLISHABLE_KEY;
  const stripePromise = loadStripe(stripePublickKey);
  
  const options = {
    clientSecret: 'SecretClientBraver0349',
  };

  return (
    <Elements stripe={stripePromise}>
      <Addnewcard2 />
      {/* <PaymentForm /> */}
    </Elements>
  );
}

export default Page;
// utils/auth.js

import jwt from 'jsonwebtoken';
export const requireAuth = async (context) => {
    const { req } = context;
    const accessToken = req.cookies['AccessToken'];
  
    // If no access token, redirect to login page
    if (!accessToken) {
      return {
        redirect: {
          destination: '/auth/login',
          permanent: false, // Temporary redirect
        },
      };
    }
    const user = jwt.decode(accessToken);
    // If the access token is valid, return the props to proceed
    return {
      props: {
        user,
      }, // You can add other props here as needed
    };
  };
  
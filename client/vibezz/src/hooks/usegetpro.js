import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useShowToast } from './useShowToast'
import  { useEffect } from "react";
const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

export const usegetpro = () => {
  const[user,setUser]=useState(null)
  const[loading,setLoading]=useState(true)
  const showToast=useShowToast()
  const{username}=useParams()
  useEffect(() => {
    const getUser = async () => {
        try {
           
            const res = await fetch(`${apiBaseUrl}/users/profile/${username}`);
            const data = await res.json();
            if (data.error) {
                showToast("Error", data.error, "error");
                return;
            }
            
            setUser(data);
        } catch (error) { 
            showToast("Error", error.message, "error");
        } finally {
            setLoading(false);
        }
    };
    getUser();

}, [username]);
return {loading,user}
}

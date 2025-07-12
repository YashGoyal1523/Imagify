import { createContext } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext()

const AppContextProvider=(props)=>{

    const [user,setUser]=useState(null)

    const [showLogin,setShowLogin]=useState(false)

    const [token,setToken]=useState(localStorage.getItem('token'))

    const [credit,setCredit]=useState(false)


    const backendUrl=import.meta.env.VITE_BACKEND_URL

    const navigate=useNavigate()


    //func to fetch credits
    const localCreditsData=async()=>{
        try{
            const {data} = await axios.get(backendUrl+'/api/user/credits',{headers:{token:token}})

            if(data.success){
                setCredit(data.credits)
                setUser(data.user)
            }
            else{
                toast.error(data.message)
            }
        }
        catch(e){
            console.log(e)
            toast.error(e.message)
        }
    }

    //execute fetch credit func
    useEffect(()=>{
        if(token){
            localCreditsData()
        }
    },[token])

    //logout fn
    const logout=()=>{
        localStorage.removeItem('token')
        setToken('')
        setUser(null)
        navigate('/')
    }

    //generate image
    const generateImage=async(prompt)=>{
        try{
            const {data}=await axios.post(backendUrl+'/api/image/generate-image',{prompt},{headers:{token:token}})
            if(data.success){
                localCreditsData()
                return data.resultImage
            }
            else{
                toast.error(data.message)
                if(data.creditBalance===0){
                    navigate('/buy')
                }
            }
        }
        catch(e){
            toast.error(e.message)
        }
    }


    const value={
        user,setUser,
        showLogin,setShowLogin,
        backendUrl,
        token,setToken,
        credit,setCredit,
        localCreditsData,
        logout,
        generateImage,
        
    }


    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider
import {  createContext,useState } from "react";
export const  CreateContext = createContext();
export const CardProviderd= ({children})=>{
    const [cart ,setcart]=useState([]);

const addtocart = (item)=>{
    const exist = cart.find(i=>i._id===item._id);
    if(exist){
        setcart(cart.map(i=>i._id===item._id ? {...i,quantity: i.quantity+1}:i)

        );
    } else{
        setcart([...cart,{...item,quantity:1}])
    }
}
const incearsqty=(id)=>{
    setcart(cart.map(item=>item._id===id ? {...item,quantity:item.quantity+1}:item));
}
const decreaseQty=(id)=>{
    setcart(cart.map(item=>item._id===id ? {...item,quantity:item.quantity-1}:item));
}
const removeitem =(id)=>{ setcart(cart.filter(item=>item._id!==id))
}
const clearCart = () => {
    setcart([]);
}
return(
    <CreateContext.Provider value={{
        cart,
        addtocart,
        incearsqty,
        decreaseQty,
        removeitem,
        clearCart
    }}>{children}</CreateContext.Provider>
)

}
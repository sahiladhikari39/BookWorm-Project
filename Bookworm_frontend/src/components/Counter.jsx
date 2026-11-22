import { useState } from "react";
import { useEffect } from "react";

function Counter(){
    const [count, setCount] = useState(0)

    useEffect(()=>{
        console.log("Current Count: ", count)
    }, [count])
    return (
        <div>
            <h2>Counter: {count}</h2>
            <button onClick={()=>{setCount(count+1)}}>+</button>
            <button onClick={()=>{setCount(count-1)}}>-</button>
        </div>
    )

}
export default Counter;
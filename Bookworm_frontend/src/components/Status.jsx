import { useState } from "react";

function Status(){
    const [status, setStatus] = useState("Incomplete")

    return (
        <div>
            <h2>{ status }</h2>
            <button onClick={()=>{setStatus("Completed")}}>mark</button>
        </div>
    );
}
export default Status;
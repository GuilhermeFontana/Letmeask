import toast, { Toaster } from 'react-hot-toast'

export function Toast() {    
    return (
        <div>
            <Toaster 
                position="bottom-right"
                reverseOrder={false}
            />
        </div>
    )
}

export function message(){
    toast.error("aaaaaaaaa", {duration: 3000})
}
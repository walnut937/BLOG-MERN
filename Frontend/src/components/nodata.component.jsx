const NoDataMessage = ({ message }) => {
return (
    <div className="text-center font-medium w-full p-4 rounded-full bg-grey/40 mt-4">
        <p className="text-2xl">{message}</p>
    </div>
)
}

export default NoDataMessage;
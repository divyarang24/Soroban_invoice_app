import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import leftArrow from '../assets/icon-arrow-left.svg'
import { AnimatePresence, motion } from 'framer-motion'
import PaidStatus from './PaidStatus'
import { useDispatch, useSelector } from 'react-redux'
import invoiceSlice from '../redux/invoiceSlice'
import formatDate from '../functions/formatDate'
import DeleteModal from './DeleteModal'
import CreateInvoice from './CreateInvoice'
import { get_invoice } from '../functions/getInvoice'


function InvoiceInfo({ onDelete }) {
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()


    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [invoicesList, setInvoicesList] = useState([]); // Use useState for invoicesList
    console.log("🚀 ~ InvoiceInfo ~ invoicesList:", invoicesList[0]?.name)



    const invoiceId = location.search.substring(1)
    const onMakePaidClick = () => {
        dispatch(invoiceSlice.actions.updateInvoiceStatus({ id: invoiceId, status: 'paid' }))
        dispatch(invoiceSlice.actions.getInvoiceById({ id: invoiceId }))
    }

    useEffect(() => {
        dispatch(invoiceSlice.actions.getInvoiceById({ id: invoiceId }))

    }, [invoiceId, onMakePaidClick])



    const onDeleteButtonClick = () => {
        navigate('/')
        setIsDeleteModalOpen(false)
        onDelete(invoiceId)
    }
    const getInvoiceData = async () => {
        let dataList = [];
        
            let data = await get_invoice(invoiceId);
            dataList.push(data);
            console.log("🚀 ~ getInvoiceData ~ dataList:", data)

        
        setInvoicesList(dataList); // Update state with new data list
    };

  


    useEffect(() => {
    
        // Cleanup function
        return () => {
          console.log('cleanup......');
          getInvoiceData()
        };
      }, []);


    const invoice = useSelector((state) => state.invoices.invoiceById)


    return (
        <div>
            {invoicesList ? <motion.div
                key='invoice-info'
                initial={{ x: 0 }}
                animate={{ x: 0 }}
                exit={{ x: '200%' }}
                transition={{ duration: 0.5 }}
                className='dark:bg-[#141625] mx-auto duration-300 min-h-screen bg-[#f8f8fb] py-[34px] px-2 md:px-8 lg:px-12 max-w-3xl lg:py-[72px] '>
                <div className=''>
                    <button onClick={() => navigate(-1)} className=' flex items-center space-x-4  group  dark:text-white font-thin '>
                        <img className='' src={leftArrow} />
                        <p className=' group-hover:opacity-80'>
                            Go back
                        </p>
                    </button>

                   


                    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center p-6">
            
        <div className="bg-white shadow-lg rounded-lg max-w-lg w-full p-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Invoice Details</h1>
            <p className="text-gray-600">Review the details of your invoice below</p>
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Client Information</h2>
            <div className="mt-2">
              <p className="text-gray-700"><span className="font-medium">Name:</span> {invoicesList[0]?.client_name}</p>
              <p className="text-gray-700"><span className="font-medium">Email:</span> {invoicesList[0]?.email}</p>
              <p className="text-gray-700"><span className="font-medium">Date:</span> {invoicesList[0]?.date}</p>
            </div>
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Invoice Details</h2>
            <div className="mt-2">
              <p className="text-gray-700"><span className="font-medium">Invoice ID:</span> {invoicesList[0]?.id}</p>
              <div className="mt-2">
                <h3 className="text-lg font-semibold text-gray-800">Items</h3>
                {invoicesList[0]?.name.map((name, index) => (
                  <div key={index} className="flex justify-between mt-2">
                    <span className="text-gray-700">{name}</span>
                    <span className="text-gray-700">${invoicesList[0]?.price[index]} x {invoicesList[0]?.quantity[index]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-800">Total</h2>
              <p className="text-2xl font-semibold text-gray-800">${invoicesList[0]?.total}</p>
            </div>
          </div>
        </div>
      </div>
                </div>

            </motion.div>
                :
                <>loading</>

            }

            {isDeleteModalOpen && <DeleteModal onDeleteButtonClick={onDeleteButtonClick} setIsDeleteModalOpen={setIsDeleteModalOpen} invoiceId={invoice.id} />}
            <AnimatePresence>
                {isEditOpen && <CreateInvoice invoice={invoice} type='edit' setOpenCreateInvoice={setIsEditOpen} />}
            </AnimatePresence>
        </div>
        
    )
}

export default InvoiceInfo
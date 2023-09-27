"use client"
import LineTextEditor from "./LineTextEditor";
import {useRef, useState} from "react";
import Image from 'next/image'

export default function DisperseForm(){
  const editorRef = useRef(null)
  const buttonRef = useRef(null)
  const [errors, setErrors] = useState([])
  const [duplicates, setDuplicates] = useState({}) // We can also use ref here as we do not need this value for rendering

  const splitAddress = (address, delimiter) => {
    const addressArray = address.split(delimiter)
    return {
      address: addressArray[0],
      amount: addressArray[1],
      delimiter
    }
  }

  const getAmountAndAddress = (address) => {
    if(address.includes('=')) {
      return splitAddress(address, "=")
    }

    if (address.includes(',')){
      return splitAddress(address, ",")
    }

    if (address.includes(' ')){
      return splitAddress(address, " ")
    }

    return {}
  }

  const onSubmit = () => {
    const errors = []
    let duplicates = {}
    if(!Boolean(editorRef.current.getValue())) return;
    const addresses = editorRef.current.getValue().split("\n");

    addresses.map((address, index) => {
      const lineNumber = index + 1;
      const refinedAddress = address.trim();

      if(!Boolean(refinedAddress)) return refinedAddress;

      const {amount, address: addressWithoutAmount} = getAmountAndAddress(refinedAddress);

      if(addressWithoutAmount.length !== 42) {
        errors.push(`Incorrect address length on line number ${lineNumber}`)
      }

      if(!addressWithoutAmount.startsWith('0x')){
        errors.push(`Incorrect address on line number ${lineNumber} missing 0x`)
      }

      if(!amount || amount != parseInt(amount, 10)) {
        errors.push(`Invalid amount on line number ${lineNumber}`)
      }

      if(duplicates[refinedAddress]) {
        duplicates[refinedAddress].push(lineNumber)
      } else {
        duplicates[refinedAddress] = [lineNumber]
      }

      return refinedAddress
    })

    Object.keys(duplicates).map((key)=> {
      if(duplicates[key].length > 1) {
        errors.push(`${key} duplicate in line ${duplicates[key].join(',')}`)
      }
    })

    if(errors.length > 0) {
      buttonRef.current.disabled = true
    }
    setErrors(errors)
    setDuplicates(duplicates)
  }

  const keepFirstOne = () => {
    const finalAddresses = Object.keys(duplicates).map((address)=> {
      return address
    })
    setDuplicates({})
    setErrors([])
    editorRef.current.setValue(finalAddresses.join('\n'));
  }

  const mergeBalances = (amount, count) => {
    let newAmount = parseInt(amount, 10)
    for (let i=1; i < count; i++) {
      newAmount += parseInt(amount, 10)
    }
    return newAmount;
  }

  const combineBalance = () => {
    const finalAddresses = Object.keys(duplicates).map((key, index)=> {
      if(duplicates[key].length > 1) {
        const {amount, address, delimiter} = getAmountAndAddress(key);
        console.log(amount)
        const newAmount = mergeBalances(amount, duplicates[key].length)
        return `${address}${delimiter}${newAmount}`;
      }
      return key
    })

    setDuplicates({})
    setErrors([])
    editorRef.current.setValue(finalAddresses.join('\n'));
  }

  const hashDuplicates = Object.values(duplicates).find((item)=> item.length > 1)

  return <>
    <div className="p-4 parent-container w-full">
      <div className="flex flex-row justify-between mb-2">
        <h3 className="text-white text-xs">Address With Amount</h3>
        <span className="text-white text-xs">Uplaod file</span>
      </div>
      <LineTextEditor ref={editorRef} buttonRef={buttonRef}/>
      <div className="flex flex-row justify-between my-2">
        <h3 className="text-white text-xs">Seperated By &apos;=&apos; or &apos;,&apos; or &apos; &apos; </h3>
        <span className="text-slate-500 text-sm">Show Example</span>
      </div>
      {hashDuplicates && <div className="flex flex-row justify-between my-2">
        <h3 className="text-white text-xs">Duplicates</h3>
        <div>
          <button className="text-sm text-rose-600" onClick={keepFirstOne}>Keep the first one</button>
          <span className="text-sm text-rose-600 mx-2">|</span>
          <button className="text-sm text-rose-600" onClick={combineBalance}>Combine Balances</button>
        </div>
      </div>}
      <div>
        {errors.map((error, index)=> <div className="flex flex-row gap-1 p-2 mb-2 rounded-md border border-rose-600 text-rose-600" key={index}>
          <Image
              src="/error-circle-svgrepo-com.svg"
              width={25}
              height={25}
              alt="error icon"
          /> {error}
        </div>)}
      </div>
      <div>
        <button ref={buttonRef} className="w-full rounded-full btn-primary" onClick={onSubmit}>Next</button>
      </div>
    </div>
  </>
}
"use client"
import React, {forwardRef, useImperativeHandle, useRef, useState} from "react";

export default forwardRef(function LineTextEditor(props, ref) {
  const {buttonRef} = props
  const inputRef = useRef(null)
  const [numbers, setNumbers] = useState([])

  useImperativeHandle(ref, () => {
    return {
      getValue: () => inputRef.current.value,
      setValue: (value) => {
        inputRef.current.value = value;
        const num = value.split("\n");
        setNumbers(num || [])
        if(buttonRef.current) {
          buttonRef.current.disabled = false
        }
      }
    };
  }, []);

  const onkeyup = (event) => {
    const num = event.target.value.split("\n");
    setNumbers(num || [])
    if(buttonRef.current) {
      buttonRef.current.disabled = false
    }
  }

  const onkeydown = (event)=> {
    if(buttonRef.current) {
      buttonRef.current.disabled = false
    }
    const textarea = event.target
    if (event.key === "Tab") {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      textarea.value = textarea.value.substring(0, start) + "\t" + textarea.value.substring(end);
      event.preventDefault();
    }
  }

  return (
      <div className="editor">
        <div className="numbers">
          {numbers.map((num, index)=> <span key={index}></span>)}
        </div>
        <textarea cols="30" rows="10" ref={inputRef} onKeyUp={onkeyup} onKeyDown={onkeydown}></textarea>
      </div>
  )
})
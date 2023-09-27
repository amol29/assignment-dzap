"use client"
import React, {useRef} from "react";

export function LineTextEditor() {
  const numbersRef = useRef(null)
  const onkeyup = (event)=> {
    const numbers = numbersRef.current;
    const num = event.target.value.split("\n").length;
    numbers.innerHTML = Array(num).fill("<span></span>").join("");
  }

  const onkeydown = (event)=> {
    const textarea = event.target
    if (event.key === "Tab") {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      textarea.value =
          textarea.value.substring(0, start) +
          "\t" +
          textarea.value.substring(end);

      event.preventDefault();
    }

  }
  return (
      <div className="editor">
        <div className="numbers" ref={numbersRef}>
          <span></span>
        </div>
        <textarea cols="30" rows="10" onKeyUp={onkeyup} onKeyDown={onkeydown}></textarea>
      </div>
  )
}
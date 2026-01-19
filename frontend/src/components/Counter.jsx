import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment } from '../redux/slices/counter'

export default function Counter() {
    const count = useSelector((state) => state.counter)
    const dispatch = useDispatch()

    return (
        <div className='counter-container'>
            <div className='counter-subcontainer'>
                <button onClick={() => dispatch(increment())}>Increment</button>
                <span>{count}</span>
                <button onClick={() => dispatch(decrement())}>Decrement</button>
            </div>
        </div>
    )
}
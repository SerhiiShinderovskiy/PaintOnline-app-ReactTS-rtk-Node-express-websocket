import React, { FC } from 'react';
import "../styles/toolbar.scss";
import { useAppDispatch } from '../hooks/redux';
import {setLineWidth, setStrokeColor} from '../store/reducers/toolSlice';

const SettingBar: FC = () => {
    const dispatch = useAppDispatch()

    return (
        <div className='setting-bar'>
            <label htmlFor="line-width">Line thickness</label>
            <input
                onChange={e => dispatch(setLineWidth(Number(e.target.value)))}
                className='line-numbers' 
                id="line-width" 
                type="number" 
                defaultValue={1} min={1} max={50}
            />
            <label htmlFor="stroke-color">Stroke color</label>
            <input onChange={e => dispatch(setStrokeColor(e.target.value))} id='stroke-color' type="color" />
        </div>
    );
};

export default SettingBar;